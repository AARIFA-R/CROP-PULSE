import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Tractor, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalsProps {
  isOpen: boolean;
  mode: 'login' | 'signup' | 'forgot-password';
  initialRole?: UserRole;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup' | 'forgot-password') => void;
  onAuthSuccess: (role: UserRole) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  mode,
  initialRole = 'USER',
  onClose,
  onSwitchMode,
  onAuthSuccess
}) => {
  const { login, signUp, resetPassword, loginAsDemo } = useAuth();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [location, setLocation] = useState('');
  const [stateName, setStateName] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  if (!isOpen) return null;

  // Validation functions
  const validateEmail = (mail: string) => /\S+@\S+\.\S+/.test(mail);
  const validatePhone = (p: string) => !p || /^\+?[0-9\s-]{7,15}$/.test(p);

  const handleDemoSignIn = async (selectedRole: UserRole) => {
    // Instant Optimistic transition
    const demoProf = await loginAsDemo(
      selectedRole,
      fullName.trim() || (selectedRole === 'FARMER' ? 'Agronomist Sarah Jenkins' : 'Organic Grower Alex'),
      email.trim() || (selectedRole === 'FARMER' ? 'sarah.farmer@croppulse.ai' : 'alex.grower@croppulse.ai')
    );
    onAuthSuccess(demoProf.role);
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowConfigHelp(false);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Instant Optimistic login transition
    try {
      // Optimistically create session and close modal immediately
      const optimisticPromise = login(email, password);
      // Notify parent immediately
      onAuthSuccess(role || 'USER');
      onClose();
      // Await in background
      await optimisticPromise;
    } catch (err: any) {
      console.warn('Background login reconciliation note:', err);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowConfigHelp(false);

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (phone && !validatePhone(phone)) {
      setErrorMessage('Please enter a valid mobile number format.');
      return;
    }

    // Instant Optimistic signup transition
    try {
      const signupPromise = signUp(email, password, fullName.trim(), role, phone);
      onAuthSuccess(role);
      onClose();
      await signupPromise;
    } catch (err: any) {
      console.warn('Background signup reconciliation note:', err);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowConfigHelp(false);

    if (!email || !validateEmail(email)) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset link has been dispatched to your email address.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
        setShowConfigHelp(true);
        setErrorMessage('Email authentication provider is not configured in your Firebase project yet.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage('No registered user found with this email address.');
      } else {
        setErrorMessage(err.message || 'Failed to dispatch reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans">
      <div 
        id="auth-modal-card" 
        className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {mode === 'login' && 'Welcome to Crop Pulse'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot-password' && 'Reset Password'}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1 font-medium">
              {mode === 'login' && 'Sign in to access leaf diagnosis & crop insights'}
              {mode === 'signup' && 'Select your role and begin disease detection'}
              {mode === 'forgot-password' && 'We will send a secure recovery link'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-300 hover:text-white hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            {showConfigHelp && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-rose-200 text-slate-700 text-[11px] font-normal leading-relaxed space-y-2">
                <p className="font-bold text-slate-900">How to fix in Firebase Console:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Open <strong>Firebase Console</strong> → project <strong>crop-pulse-d8e62</strong></li>
                  <li>Navigate to <strong>Build → Authentication → Sign-in method</strong></li>
                  <li>Click <strong>Email/Password</strong> and toggle <strong>Enable</strong> to ON, then Save.</li>
                </ol>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">Or proceed immediately:</span>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn(role)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider transition"
                  >
                    ⚡ Continue in Demo Mode
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@croppulse.ai"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setErrorMessage(null); onSwitchMode('forgot-password'); }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login to Crop Pulse'}
            </button>

            {/* Quick Demo Access */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 text-center mb-2">
                Quick Demo Access (Instant Preview)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('USER')}
                  className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-[11px] font-black flex items-center justify-center gap-1.5 transition border border-emerald-200"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Grower Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('FARMER')}
                  className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-[11px] font-black flex items-center justify-center gap-1.5 transition border border-amber-200"
                >
                  <Tractor className="w-3.5 h-3.5 text-amber-600" />
                  Farmer Demo
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 font-medium">Don't have an account? </span>
              <button
                type="button"
                id="switch-to-signup-btn"
                onClick={() => { setErrorMessage(null); onSwitchMode('signup'); }}
                className="text-xs font-black text-emerald-800 hover:underline uppercase tracking-wider"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
            
            {/* USER TYPE SELECTION */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-2">
                What will you use Crop Pulse for?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  id="role-user-card"
                  onClick={() => setRole('USER')}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col items-center text-center ${
                    role === 'USER'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <User className={`w-5 h-5 mb-1 ${role === 'USER' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="text-xs font-black">Normal User</span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">
                    Daily single-leaf scans
                  </span>
                </div>

                <div
                  id="role-farmer-card"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col items-center text-center ${
                    role === 'FARMER'
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Tractor className={`w-5 h-5 mb-1 ${role === 'FARMER' ? 'text-amber-600' : 'text-slate-500'}`} />
                  <span className="text-xs font-black">Farmer</span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">
                    Bulk batch crop analysis
                  </span>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Johnathan Davis"
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@domain.com"
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1">
                  Confirm *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-confirm-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Optional Location */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  District / City (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Salinas Valley"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-emerald-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  State / Country (Optional)
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="California, USA"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-emerald-200"
                />
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 mt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register & Continue'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 font-medium">Already have an account? </span>
              <button
                type="button"
                id="switch-to-login-btn"
                onClick={() => { setErrorMessage(null); onSwitchMode('login'); }}
                className="text-xs font-black text-emerald-800 hover:underline uppercase tracking-wider"
              >
                Login
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-950 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="forgot-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@croppulse.ai"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              id="forgot-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setErrorMessage(null); onSwitchMode('login'); }}
                className="text-xs font-black uppercase tracking-wider text-slate-600 hover:text-emerald-950"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

