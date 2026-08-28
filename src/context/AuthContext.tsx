import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  signUp: (email: string, pass: string, fullName: string, role: UserRole, phone?: string) => Promise<UserProfile>;
  loginAsDemo: (role: UserRole, fullName?: string, email?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  setCameraPermission: (granted: boolean) => Promise<void>;
  setPhotoPermission: (granted: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('crop_pulse_active_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync auth state with Firebase Auth and Local Persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfile(data);
            localStorage.setItem('crop_pulse_active_profile', JSON.stringify(data));
          } else {
            // Create initial profile if missing
            const initialProfile: UserProfile = {
              uid: fbUser.uid,
              fullName: fbUser.displayName || 'Crop Pulse User',
              email: fbUser.email || '',
              role: 'USER',
              completedOnboarding: false,
              onboardingCompleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, initialProfile);
            } catch (err) {
              console.warn('Could not write user profile to firestore:', err);
            }
            setProfile(initialProfile);
            localStorage.setItem('crop_pulse_active_profile', JSON.stringify(initialProfile));
          }
        } catch (error) {
          console.warn('Error fetching Firestore user profile:', error);
          // Local fallback for offline development
          const localFallback: UserProfile = {
            uid: fbUser.uid,
            fullName: fbUser.displayName || 'Crop Pulse User',
            email: fbUser.email || '',
            role: 'USER',
            completedOnboarding: false,
            onboardingCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setProfile(localFallback);
          localStorage.setItem('crop_pulse_active_profile', JSON.stringify(localFallback));
        }
      } else {
        // Only clear if not in demo/local mode
        const saved = localStorage.getItem('crop_pulse_active_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.uid?.startsWith('demo-') || parsed?.uid?.startsWith('local-')) {
              setProfile(parsed);
              setLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', cred.user.uid);
      let uProfile: UserProfile;
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          uProfile = snap.data() as UserProfile;
        } else {
          uProfile = {
            uid: cred.user.uid,
            fullName: cred.user.displayName || email.split('@')[0] || 'Crop Pulse User',
            email: cred.user.email || email,
            role: 'USER',
            completedOnboarding: false,
            onboardingCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          try {
            await setDoc(userDocRef, uProfile);
          } catch {
            // ignore
          }
        }
      } catch {
        // Fallback to local profile or construct clean profile
        const saved = localStorage.getItem('crop_pulse_active_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.email === email || parsed.uid === cred.user.uid) {
              uProfile = parsed;
            } else {
              uProfile = {
                uid: cred.user.uid,
                fullName: cred.user.displayName || email.split('@')[0] || 'Crop Pulse User',
                email: cred.user.email || email,
                role: 'USER',
                completedOnboarding: false,
                onboardingCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
            }
          } catch {
            uProfile = {
              uid: cred.user.uid,
              fullName: cred.user.displayName || email.split('@')[0] || 'Crop Pulse User',
              email: cred.user.email || email,
              role: 'USER',
              completedOnboarding: false,
              onboardingCompleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
        } else {
          uProfile = {
            uid: cred.user.uid,
            fullName: cred.user.displayName || email.split('@')[0] || 'Crop Pulse User',
            email: cred.user.email || email,
            role: 'USER',
            completedOnboarding: false,
            onboardingCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }
      setProfile(uProfile);
      localStorage.setItem('crop_pulse_active_profile', JSON.stringify(uProfile));
      return uProfile;
    } catch (err: any) {
      throw err;
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ): Promise<UserProfile> => {
    try {
      let uid: string;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        uid = cred.user.uid;
        try {
          await updateProfile(cred.user, { displayName: fullName });
        } catch {
          // ignore display name update failure
        }
      } catch (authErr: any) {
        // If email already exists, gracefully sign the user in instead of failing!
        if (authErr.code === 'auth/email-already-in-use' || authErr.message?.includes('email-already-in-use')) {
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, pass);
            uid = loginCred.user.uid;
          } catch (loginErr: any) {
            // If sign in with the password also fails (e.g. wrong password), throw clear guidance
            if (loginErr.code === 'auth/wrong-password' || loginErr.code === 'auth/invalid-credential') {
              throw new Error('An account with this email already exists. Please verify your password to log in.');
            }
            throw loginErr;
          }
        } else {
          throw authErr;
        }
      }

      // Check for existing profile in Firestore / local cache
      const userDocRef = doc(db, 'users', uid);
      let resolvedProfile: UserProfile;

      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const existing = snap.data() as UserProfile;
          resolvedProfile = {
            ...existing,
            fullName: fullName || existing.fullName,
            role: role || existing.role,
            mobileNumber: phone || existing.mobileNumber || '',
            updatedAt: new Date().toISOString()
          };
        } else {
          resolvedProfile = {
            uid,
            fullName,
            email,
            mobileNumber: phone || '',
            role,
            completedOnboarding: false,
            onboardingCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        await setDoc(userDocRef, resolvedProfile, { merge: true });
      } catch {
        resolvedProfile = {
          uid,
          fullName,
          email,
          mobileNumber: phone || '',
          role,
          completedOnboarding: false,
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      setProfile(resolvedProfile);
      localStorage.setItem('crop_pulse_active_profile', JSON.stringify(resolvedProfile));
      return resolvedProfile;
    } catch (err: any) {
      throw err;
    }
  };

  const loginAsDemo = async (role: UserRole, fullName?: string, email?: string): Promise<UserProfile> => {
    const demoProfile: UserProfile = {
      uid: `local-${role.toLowerCase()}-${Date.now()}`,
      fullName: fullName || (role === 'FARMER' ? 'Agronomist Sarah Jenkins' : 'Organic Grower Alex'),
      email: email || (role === 'FARMER' ? 'sarah.farmer@croppulse.ai' : 'alex.grower@croppulse.ai'),
      mobileNumber: '+1 (555) 438-9201',
      role,
      district: 'Sonoma Agricultural Basin',
      state: 'California',
      country: 'USA',
      completedOnboarding: false,
      onboardingCompleted: false,
      cameraPermissionGranted: true,
      photoPermissionGranted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProfile(demoProfile);
    localStorage.setItem('crop_pulse_active_profile', JSON.stringify(demoProfile));
    return demoProfile;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('crop_pulse_active_profile');
  };

  const signOutUser = logout;

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString()
    };

    setProfile(updated);
    localStorage.setItem('crop_pulse_active_profile', JSON.stringify(updated));

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), updated);
      } catch (e) {
        console.warn('Error updating Firestore profile:', e);
      }
    }
  };

  const markOnboardingComplete = async () => {
    await updateUserProfile({ completedOnboarding: true, onboardingCompleted: true });
  };

  const setCameraPermission = async (granted: boolean) => {
    await updateUserProfile({ cameraPermissionGranted: granted });
  };

  const setPhotoPermission = async (granted: boolean) => {
    await updateUserProfile({ photoPermissionGranted: granted });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signUp,
        loginAsDemo,
        logout,
        signOutUser,
        resetPassword,
        updateUserProfile,
        markOnboardingComplete,
        setCameraPermission,
        setPhotoPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
