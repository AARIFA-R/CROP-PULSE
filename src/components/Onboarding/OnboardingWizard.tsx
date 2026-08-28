import React, { useState } from 'react';
import { Camera, Image as ImageIcon, User, Tractor, CheckCircle2, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { profile, updateUserProfile, markOnboardingComplete, setCameraPermission, setPhotoPermission } = useAuth();

  const [step, setStep] = useState<'profile' | 'role' | 'camera' | 'photo'>('profile');
  
  // Profile fields
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [stateName, setStateName] = useState(profile?.state || '');
  const [language, setLanguage] = useState(profile?.preferredLanguage || 'English (US)');
  const [selectedRole, setSelectedRole] = useState<UserRole>(profile?.role || 'USER');

  // Permission states
  const [cameraStatus, setCameraStatus] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoStatus, setPhotoStatus] = useState<'prompt' | 'granted' | 'skipped'>('prompt');

  // 1. Profile Setup Step
  const handleProfileContinue = () => {
    const updatedDetails = {
      fullName: fullName.trim() || profile?.fullName || 'Crop Pulse Grower',
      district: district.trim(),
      state: stateName.trim(),
      preferredLanguage: language
    };

    // 1. Save to localStorage immediately
    try {
      const active = localStorage.getItem('crop_pulse_active_profile');
      const base = active ? JSON.parse(active) : (profile || {});
      const merged = { ...base, ...updatedDetails, updatedAt: new Date().toISOString() };
      localStorage.setItem('crop_pulse_active_profile', JSON.stringify(merged));
    } catch (e) {
      console.warn('Local storage write note:', e);
    }

    // 2. Advance onboarding step immediately so UI never freezes or waits on network
    setStep('role');

    // 3. Isolated background sync to profile and Firestore
    try {
      updateUserProfile(updatedDetails).catch((err) => {
        console.warn('Background profile sync note:', err);
      });
    } catch (err) {
      console.warn('Profile sync fallback:', err);
    }
  };

  // 2. Role Select Step
  const handleRoleContinue = () => {
    try {
      const active = localStorage.getItem('crop_pulse_active_profile');
      const base = active ? JSON.parse(active) : (profile || {});
      const merged = { ...base, role: selectedRole, updatedAt: new Date().toISOString() };
      localStorage.setItem('crop_pulse_active_profile', JSON.stringify(merged));
    } catch (e) {
      console.warn('Local storage role note:', e);
    }

    // Advance step immediately
    setStep('camera');

    try {
      updateUserProfile({ role: selectedRole }).catch((err) => {
        console.warn('Background role sync note:', err);
      });
    } catch (err) {
      console.warn('Role sync fallback:', err);
    }
  };

  // 3. Camera Permission Step
  const handleRequestCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('unavailable');
        setCameraError('Live camera API is not supported on this browser device. You can still analyze leaf photos via image upload.');
        setStep('photo');
        updateUserProfile({ cameraPermissionGranted: false }).catch(() => {});
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      // Stop test stream immediately
      stream.getTracks().forEach(track => track.stop());

      setCameraStatus('granted');
      updateUserProfile({ cameraPermissionGranted: true }).catch(() => {});
      setStep('photo');

    } catch (err: any) {
      console.warn('Camera permission request denied/fallback:', err);
      setCameraStatus('denied');
      setCameraError('Camera access was not granted. The application will seamlessly operate through photo file upload.');
      updateUserProfile({ cameraPermissionGranted: false }).catch(() => {});
      setStep('photo');
    }
  };

  const handleSkipCamera = () => {
    updateUserProfile({ cameraPermissionGranted: false }).catch(() => {});
    setStep('photo');
  };

  // 4. Photo Permission Step
  const handleAllowPhoto = () => {
    setPhotoStatus('granted');
    try {
      const active = localStorage.getItem('crop_pulse_active_profile');
      const base = active ? JSON.parse(active) : (profile || {});
      const merged = { ...base, photoPermissionGranted: true, completedOnboarding: true, onboardingCompleted: true };
      localStorage.setItem('crop_pulse_active_profile', JSON.stringify(merged));
    } catch {}

    updateUserProfile({ photoPermissionGranted: true, completedOnboarding: true, onboardingCompleted: true }).catch(() => {});
    onComplete();
  };

  const handleSkipPhoto = () => {
    setPhotoStatus('skipped');
    try {
      const active = localStorage.getItem('crop_pulse_active_profile');
      const base = active ? JSON.parse(active) : (profile || {});
      const merged = { ...base, photoPermissionGranted: false, completedOnboarding: true, onboardingCompleted: true };
      localStorage.setItem('crop_pulse_active_profile', JSON.stringify(merged));
    } catch {}

    updateUserProfile({ photoPermissionGranted: false, completedOnboarding: true, onboardingCompleted: true }).catch(() => {});
    onComplete();
  };

  return (
    <div id="onboarding-wizard-container" className="min-h-[80vh] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl border border-emerald-200 p-6 sm:p-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
              Setup • Step {step === 'profile' ? '1' : step === 'role' ? '2' : step === 'camera' ? '3' : '4'} of 4
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className={`w-6 h-1.5 rounded-full ${step === 'profile' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            <div className={`w-6 h-1.5 rounded-full ${step === 'role' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            <div className={`w-6 h-1.5 rounded-full ${step === 'camera' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            <div className={`w-6 h-1.5 rounded-full ${step === 'photo' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* STEP 1: PROFILE SETUP */}
        {step === 'profile' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">Confirm Profile Details</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Customize your agricultural details for calibrated diagnostic reports.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                    District / County
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Sonoma"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. California"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                  Preferred Diagnostic Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                  <option value="Portuguese (Português)">Portuguese (Português)</option>
                </select>
              </div>
            </div>

            <button
              id="onboarding-profile-continue-btn"
              onClick={handleProfileContinue}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 mt-4"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: USER TYPE SELECTION */}
        {step === 'role' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">Select App Experience</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Select your operational mode to customize your workspace tools.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Option 1: NORMAL USER */}
              <div
                id="select-user-role-card"
                onClick={() => setSelectedRole('USER')}
                className={`p-4 rounded-3xl border-2 cursor-pointer transition flex items-start gap-4 ${
                  selectedRole === 'USER'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-2xl ${selectedRole === 'USER' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-emerald-950">NORMAL USER</h3>
                    {selectedRole === 'USER' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    Single-image leaf disease detection, foliar coverage severity score, and mitigation plans.
                  </p>
                </div>
              </div>

              {/* Option 2: FARMER */}
              <div
                id="select-farmer-role-card"
                onClick={() => setSelectedRole('FARMER')}
                className={`p-4 rounded-3xl border-2 cursor-pointer transition flex items-start gap-4 ${
                  selectedRole === 'FARMER'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-2xl ${selectedRole === 'FARMER' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Tractor className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-amber-950">FARMER</h3>
                    {selectedRole === 'FARMER' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    Bulk batch image upload, acreage-level infection statistics, outbreak risk alerts, and PDF agronomy reports.
                  </p>
                </div>
              </div>
            </div>

            <button
              id="onboarding-role-continue-btn"
              onClick={handleRoleContinue}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 mt-4"
            >
              Continue to Permissions
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: CAMERA PERMISSION */}
        {step === 'camera' && (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">Allow Camera Access</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
                Camera access allows you to take fresh photos of plant leaves in the field for real-time disease analysis.
              </p>
            </div>

            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{cameraError}</span>
              </div>
            )}

            {cameraStatus === 'granted' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Camera access granted! Proceeding...</span>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                id="allow-camera-btn"
                onClick={handleRequestCamera}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition"
              >
                Allow Camera Access
              </button>
              <button
                id="skip-camera-btn"
                onClick={handleSkipCamera}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition"
              >
                Not Now
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PHOTO / FILE UPLOAD PERMISSION */}
        {step === 'photo' && (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto border border-teal-200 shadow-sm">
              <ImageIcon className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">Allow Photo Upload</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
                Photo access allows you to select plant leaf images from your device gallery for AI analysis. Supports JPG, PNG, and WEBP.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-600 font-medium text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>We only process files you explicitly select via the upload dialog. Your photos remain secure and confidential.</span>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                id="allow-photo-btn"
                onClick={handleAllowPhoto}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition"
              >
                Allow Photo Access
              </button>
              <button
                id="skip-photo-btn"
                onClick={handleSkipPhoto}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition"
              >
                Not Now
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

