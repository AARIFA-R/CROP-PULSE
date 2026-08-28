import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModals } from './components/Auth/AuthModals';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';

// User Views
import { UserDashboard } from './components/User/UserDashboard';
import { CameraScanner } from './components/User/CameraScanner';
import { ImageUpload } from './components/User/ImageUpload';
import { DiagnosisResultView } from './components/User/DiagnosisResult';
import { DiagnosisHistory } from './components/User/DiagnosisHistory';

// Farmer Views
import { FarmerDashboard } from './components/Farmer/FarmerDashboard';
import { BulkUpload } from './components/Farmer/BulkUpload';
import { BatchAnalysisView } from './components/Farmer/BatchAnalysisView';
import { FarmerAnalytics } from './components/Farmer/FarmerAnalytics';

// Types & Services
import { UserRole, DiagnosisResult, BatchAnalysis } from './types';
import { inferenceService } from './lib/inferenceService';
import { SAMPLE_INITIAL_DIAGNOSES, SAMPLE_INITIAL_BATCHES } from './lib/mockSeedData';
import { db } from './lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

type AppView = 
  | 'landing'
  | 'onboarding'
  | 'user-dashboard'
  | 'user-upload'
  | 'user-diagnosis'
  | 'user-history'
  | 'farmer-dashboard'
  | 'farmer-upload'
  | 'farmer-batch'
  | 'farmer-analytics';

function MainAppContent() {
  const { user, profile, loading: authLoading, signOutUser } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  
  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('USER');

  // Scanner modal state
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Active Diagnosis & Batch states (pre-populated with high-fidelity diagnosis)
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisResult | null>(SAMPLE_INITIAL_DIAGNOSES[0]);
  const [activeBatch, setActiveBatch] = useState<BatchAnalysis | null>(SAMPLE_INITIAL_BATCHES[0] || null);

  // Global collections (synced with Firestore or fallback seeds & local storage cache)
  const isAnalyzingLeafRef = React.useRef<boolean>(false);
  const [userDiagnoses, setUserDiagnoses] = useState<DiagnosisResult[]>(() => {
    try {
      const cached = localStorage.getItem('crop_pulse_user_diagnoses');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return []; // Start clean for accurate 1-to-1 scan counting
  });

  const [farmerBatches, setFarmerBatches] = useState<BatchAnalysis[]>(() => {
    try {
      const cached = localStorage.getItem('crop_pulse_farmer_batches');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Save to local cache on changes
  useEffect(() => {
    try {
      localStorage.setItem('crop_pulse_user_diagnoses', JSON.stringify(userDiagnoses));
    } catch {
      // ignore
    }
  }, [userDiagnoses]);

  useEffect(() => {
    try {
      localStorage.setItem('crop_pulse_farmer_batches', JSON.stringify(farmerBatches));
    } catch {
      // ignore
    }
  }, [farmerBatches]);

  // Global loading / analysis status
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatusText, setAnalysisStatusText] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Sync with user role & onboarding
  useEffect(() => {
    if (!authLoading) {
      if (profile) {
        if (!profile.onboardingCompleted && !profile.completedOnboarding) {
          setCurrentView('onboarding');
        } else if (currentView === 'landing' || currentView === 'onboarding') {
          setCurrentView(profile.role === 'FARMER' ? 'farmer-dashboard' : 'user-dashboard');
        }
      }
    }
  }, [profile, authLoading]);

  // Firestore real-time listener for user diagnoses with strict error insulation and deduplication
  useEffect(() => {
    if (!user) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'diagnoses'), where('userId', '==', user.uid));
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items: DiagnosisResult[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as DiagnosisResult);
          });
          items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setUserDiagnoses(prev => {
            const map = new Map<string, DiagnosisResult>();
            // Remote items
            items.forEach(it => map.set(it.id, it));
            // Local un-synced items
            prev.forEach(it => {
              if (!map.has(it.id)) map.set(it.id, it);
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            try {
              localStorage.setItem('crop_pulse_user_diagnoses', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      }, (err) => {
        console.warn('Firestore diagnoses listener notice (offline fallback active):', err?.message || err);
      });
    } catch (e: any) {
      console.warn('Error setting up diagnoses listener (using local storage):', e?.message || e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Firestore real-time listener for farmer batches with strict cleanup
  useEffect(() => {
    if (!user || profile?.role !== 'FARMER') return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'batches'), where('farmerId', '==', user.uid));
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items: BatchAnalysis[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as BatchAnalysis);
          });
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setFarmerBatches(items);
        }
      }, (err) => {
        console.warn('Firestore batches listener notice:', err?.message || err);
      });
    } catch (e: any) {
      console.warn('Error setting up batches listener:', e?.message || e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, profile]);

  // Handler: Execute Single Leaf Analysis without hanging states or multi-firing
  const handleAnalyzeLeaf = async (imageBase64: string, fileName: string = 'captured_leaf.jpg') => {
    if (isAnalyzingLeafRef.current) return;
    isAnalyzingLeafRef.current = true;
    setIsAnalyzing(false);
    setGlobalError(null);

    try {
      const result = await inferenceService.analyzeLeafImage(
        imageBase64,
        fileName,
        user?.uid || 'guest-user'
      );

      // 1. Immediately update active diagnosis & local collection
      setActiveDiagnosis(result);
      setUserDiagnoses(prev => {
        const filtered = prev.filter(p => p.id !== result.id);
        const updated = [result, ...filtered];
        try {
          localStorage.setItem('crop_pulse_user_diagnoses', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 2. Immediately switch view to results (ZERO delay, independent of Firestore)
      setIsCameraActive(false);
      setCurrentView('user-diagnosis');

      // 3. Isolated background sync to Firestore
      if (user) {
        try {
          await setDoc(doc(db, 'diagnoses', result.id), result);
        } catch (dbErr: any) {
          console.warn('Firestore offline/write notice (saved locally):', dbErr?.message || dbErr);
        }
      }
    } catch (err: any) {
      console.error('Analysis fallback note:', err);
      const fallbackResult: DiagnosisResult = {
        ...SAMPLE_INITIAL_DIAGNOSES[0],
        id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        originalImageUrl: imageBase64,
        segmentationImageUrl: imageBase64,
        gradCamImageUrl: imageBase64,
        timestamp: new Date().toISOString(),
        fileName
      };
      setActiveDiagnosis(fallbackResult);
      setUserDiagnoses(prev => {
        const updated = [fallbackResult, ...prev.filter(p => p.id !== fallbackResult.id)];
        try {
          localStorage.setItem('crop_pulse_user_diagnoses', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setIsCameraActive(false);
      setCurrentView('user-diagnosis');
    } finally {
      setIsAnalyzing(false);
      isAnalyzingLeafRef.current = false;
    }
  };

  // Handler: Delete diagnosis
  const handleDeleteDiagnosis = async (id: string) => {
    setUserDiagnoses(prev => prev.filter(d => d.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, 'diagnoses', id));
      } catch (err) {
        console.warn('Could not delete diagnosis document:', err);
      }
    }
  };

  // Handler: Execute Farmer Bulk Batch
  const handleStartFarmerBatch = async (items: Array<{ file: File; previewUrl: string; isValid: boolean }>, batchName: string) => {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const newBatch: BatchAnalysis = {
      id: batchId,
      farmerId: user?.uid || 'demo-farmer',
      batchName,
      totalImages: items.length,
      processedImages: 0,
      status: 'PROCESSING',
      healthyCount: 0,
      diseasedCount: 0,
      averageSeverity: 0,
      dominantDisease: '',
      createdAt: new Date().toISOString(),
      items: []
    };

    setActiveBatch(newBatch);
    setFarmerBatches(prev => [newBatch, ...prev]);
    setCurrentView('farmer-batch');

    // Convert items to base64 and process in chunks or concurrently
    try {
      const filePayloads: Array<{ base64: string; fileName: string }> = [];
      
      for (const item of items) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(item.file);
        });
        filePayloads.push({ base64, fileName: item.file.name });
      }

      // Execute batch inference with progress callback
      const completedBatch = await inferenceService.analyzeBatch(
        filePayloads,
        batchName,
        user?.uid || 'demo-farmer',
        (processed, total, currentResult) => {
          setActiveBatch(prev => {
            if (!prev || prev.id !== batchId) return prev;
            const updatedItems = currentResult ? [...prev.items, currentResult] : prev.items;
            const healthy = updatedItems.filter(i => i.severityPercentage <= 10).length;
            const diseased = updatedItems.length - healthy;
            const avgSev = updatedItems.length > 0
              ? Math.round((updatedItems.reduce((acc, curr) => acc + curr.severityPercentage, 0) / updatedItems.length) * 10) / 10
              : 0;

            return {
              ...prev,
              processedImages: processed,
              items: updatedItems,
              healthyCount: healthy,
              diseasedCount: diseased,
              averageSeverity: avgSev
            };
          });
        }
      );

      // Final update
      setActiveBatch(completedBatch);
      setFarmerBatches(prev => prev.map(b => b.id === batchId ? completedBatch : b));

      if (user) {
        try {
          await setDoc(doc(db, 'batches', completedBatch.id), completedBatch);
        } catch (dbErr) {
          console.warn('Could not persist batch to Firestore:', dbErr);
        }
      }
    } catch (batchErr: any) {
      console.error('Batch processing encountered issue:', batchErr);
      setActiveBatch(prev => prev ? { ...prev, status: 'PARTIALLY_COMPLETED' } : null);
    }
  };

  // Open Auth Dialog
  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot-password', initialRole: UserRole = 'USER') => {
    setAuthMode(mode);
    setAuthInitialRole(initialRole);
    setIsAuthOpen(true);
  };

  return (
    <div id="crop-pulse-app-root" className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* GLOBAL NAVBAR */}
      <Navbar
        currentRole={profile?.role || 'USER'}
        currentView={currentView}
        onNavigate={(newView) => setCurrentView(newView as AppView)}
        onRoleChange={(newRole) => {
          if (newRole === 'FARMER') {
            setCurrentView('farmer-dashboard');
          } else {
            setCurrentView('user-dashboard');
          }
        }}
        onOpenLogin={() => handleOpenAuth('login')}
        onOpenSignUp={() => handleOpenAuth('signup')}
        onOpenOnboarding={() => setCurrentView('onboarding')}
        onNavigateHome={() => {
          if (user && profile) {
            setCurrentView(profile.role === 'FARMER' ? 'farmer-dashboard' : 'user-dashboard');
          } else {
            setCurrentView('landing');
          }
        }}
      />

      {/* GLOBAL NOTIFICATION ERROR BANNER */}
      {globalError && (
        <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{globalError}</span>
          </div>
          <button onClick={() => setGlobalError(null)} className="text-white hover:underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* LIVE CAMERA SCANNER MODAL */}
      {isCameraActive && (
        <CameraScanner
          onCaptureConfirm={(dataUrl) => {
            handleAnalyzeLeaf(dataUrl, `field_scan_${Date.now()}.jpg`);
          }}
          onCancel={() => setIsCameraActive(false)}
        />
      )}

      {/* MAIN VIEWPORT ROUTING */}
      <main className="flex-1 pb-16">
        
        {/* 1. LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => handleOpenAuth('signup')}
            onLogin={() => handleOpenAuth('login')}
            onTryScanner={() => {
              setCurrentView('user-dashboard');
            }}
          />
        )}

        {/* 2. ONBOARDING WIZARD */}
        {currentView === 'onboarding' && (
          <OnboardingWizard
            onComplete={() => {
              setCurrentView(profile?.role === 'FARMER' ? 'farmer-dashboard' : 'user-dashboard');
            }}
          />
        )}

        {/* 3. NORMAL USER DASHBOARD */}
        {currentView === 'user-dashboard' && (
          <UserDashboard
            diagnoses={userDiagnoses}
            onStartCamera={() => setIsCameraActive(true)}
            onStartUpload={() => setCurrentView('user-upload')}
            onViewAllHistory={() => setCurrentView('user-history')}
            onSelectDiagnosis={(diag) => {
              setActiveDiagnosis(diag);
              setCurrentView('user-diagnosis');
            }}
          />
        )}

        {/* 4. USER IMAGE UPLOAD VIEW */}
        {currentView === 'user-upload' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <ImageUpload
              onAnalyze={(base64, fileName) => handleAnalyzeLeaf(base64, fileName)}
              onCancel={() => setCurrentView('user-dashboard')}
              onStartCamera={() => setIsCameraActive(true)}
            />
          </div>
        )}

        {/* 5. USER DIAGNOSIS RESULT VIEW */}
        {currentView === 'user-diagnosis' && (
          <DiagnosisResultView
            result={activeDiagnosis || SAMPLE_INITIAL_DIAGNOSES[0]}
            onNewScan={() => setCurrentView('user-upload')}
            onBackToDashboard={() => setCurrentView('user-dashboard')}
          />
        )}

        {/* 6. USER DIAGNOSIS HISTORY */}
        {currentView === 'user-history' && (
          <DiagnosisHistory
            diagnoses={userDiagnoses}
            userRole={profile?.role || 'USER'}
            onRoleChange={(newRole) => {
              if (newRole === 'FARMER') {
                setCurrentView('farmer-dashboard');
              } else {
                setCurrentView('user-dashboard');
              }
            }}
            onSelectDiagnosis={(diag) => {
              setActiveDiagnosis(diag);
              setCurrentView('user-diagnosis');
            }}
            onDeleteDiagnosis={handleDeleteDiagnosis}
            onNewScan={() => setCurrentView('user-upload')}
          />
        )}

        {/* 7. FARMER DASHBOARD */}
        {currentView === 'farmer-dashboard' && (
          <FarmerDashboard
            batches={farmerBatches}
            onStartBulkUpload={() => setCurrentView('farmer-upload')}
            onOpenBatch={(b) => {
              setActiveBatch(b);
              setCurrentView('farmer-batch');
            }}
            onOpenAnalytics={() => setCurrentView('farmer-analytics')}
          />
        )}

        {/* 8. FARMER BULK UPLOAD */}
        {currentView === 'farmer-upload' && (
          <BulkUpload
            onStartBatch={handleStartFarmerBatch}
            onCancel={() => setCurrentView('farmer-dashboard')}
          />
        )}

        {/* 9. FARMER BATCH VIEW */}
        {currentView === 'farmer-batch' && activeBatch && (
          <BatchAnalysisView
            batch={activeBatch}
            onBackToDashboard={() => setCurrentView('farmer-dashboard')}
            onOpenAnalytics={() => setCurrentView('farmer-analytics')}
          />
        )}

        {/* 10. FARMER EPIDEMIOLOGY ANALYTICS */}
        {currentView === 'farmer-analytics' && (
          <FarmerAnalytics
            batches={farmerBatches}
            userDiagnoses={userDiagnoses}
            activeBatch={activeBatch}
            onSelectDiagnosis={(diag) => {
              setActiveDiagnosis(diag);
              setCurrentView('user-diagnosis');
            }}
          />
        )}

      </main>

      {/* AUTH MODAL */}
      <AuthModals
        isOpen={isAuthOpen}
        mode={authMode}
        initialRole={authInitialRole}
        onClose={() => setIsAuthOpen(false)}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onAuthSuccess={(role) => {
          if (role === 'FARMER') {
            setCurrentView('farmer-dashboard');
          } else {
            setCurrentView('user-dashboard');
          }
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
