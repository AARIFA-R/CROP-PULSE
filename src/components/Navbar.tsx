import React from 'react';
import { Leaf, User, Tractor, LogOut, Camera, UploadCloud, History, BarChart3, Sparkles, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { SupportedLanguage } from '../locales/translations';

interface NavbarProps {
  currentRole?: UserRole;
  currentView?: string;
  onRoleChange?: (role: UserRole) => void;
  onOpenLogin?: () => void;
  onOpenSignUp?: () => void;
  onOpenOnboarding?: () => void;
  onNavigateHome?: () => void;
  onNavigate?: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentView = 'user-dashboard',
  onRoleChange,
  onOpenLogin,
  onOpenSignUp,
  onNavigateHome,
  onNavigate,
  onOpenAuth
}) => {
  const { profile, logout } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const activeRole = currentRole || profile?.role || 'USER';
  const isFarmer = activeRole === 'FARMER';

  const handleHomeClick = () => {
    if (onNavigateHome) onNavigateHome();
    else if (onNavigate) onNavigate(isFarmer ? 'farmer-dashboard' : 'user-dashboard');
  };

  const handleLoginClick = () => {
    if (onOpenLogin) onOpenLogin();
    else if (onOpenAuth) onOpenAuth('login');
  };

  const handleSignUpClick = () => {
    if (onOpenSignUp) onOpenSignUp();
    else if (onOpenAuth) onOpenAuth('signup');
  };

  const handleNav = (view: string) => {
    if (onNavigate) onNavigate(view);
  };

  // Determine active tab key
  const getActiveTab = () => {
    if (isFarmer) {
      if (currentView === 'farmer-upload' || currentView === 'bulk-upload') return 'farmer-upload';
      if (currentView === 'farmer-analytics' || currentView === 'analytics') return 'farmer-analytics';
      return 'farmer-dashboard';
    } else {
      if (currentView === 'user-upload' || currentView === 'scan' || currentView === 'user-diagnosis') return 'user-upload';
      if (currentView === 'user-history' || currentView === 'history') return 'user-history';
      return 'user-dashboard';
    }
  };

  const activeTab = getActiveTab();

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm text-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div 
          onClick={handleHomeClick} 
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          id="brand-logo"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white p-2 shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-emerald-950 leading-none flex items-center gap-1.5">
              CROP PULSE
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                AI
              </span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700/70 mt-0.5">
              PLANT HEALTH & SEVERITY
            </span>
          </div>
        </div>

        {/* Dynamic Center Navigation with Smooth Active Indicator */}
        {profile && (
          <nav className="hidden md:flex items-center gap-1 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-100/80">
            {isFarmer ? (
              // FARMER NAVIGATION
              <>
                <button
                  id="nav-farmer-dashboard-btn"
                  onClick={() => handleNav('farmer-dashboard')}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-10 ${
                    activeTab === 'farmer-dashboard'
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-800/70 hover:text-emerald-950'
                  }`}
                >
                  {activeTab === 'farmer-dashboard' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-emerald-200/60 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  {t('dashboard')}
                </button>
                <button
                  id="nav-bulk-analysis-btn"
                  onClick={() => handleNav('farmer-upload')}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-10 ${
                    activeTab === 'farmer-upload'
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-800/70 hover:text-emerald-950'
                  }`}
                >
                  {activeTab === 'farmer-upload' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-emerald-200/60 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                  {t('bulk_analysis')}
                </button>
                <button
                  id="nav-analytics-btn"
                  onClick={() => handleNav('farmer-analytics')}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-10 ${
                    activeTab === 'farmer-analytics'
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-800/70 hover:text-emerald-950'
                  }`}
                >
                  {activeTab === 'farmer-analytics' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-emerald-200/60 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  {t('analytics')}
                </button>
              </>
            ) : (
              // NORMAL USER NAVIGATION
              <>
                <button
                  id="nav-user-dashboard-btn"
                  onClick={() => handleNav('user-dashboard')}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-10 ${
                    activeTab === 'user-dashboard'
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-800/70 hover:text-emerald-950'
                  }`}
                >
                  {activeTab === 'user-dashboard' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-emerald-200/60 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  {t('dashboard')}
                </button>
                <button
                  id="nav-camera-scan-btn"
                  onClick={() => handleNav('user-upload')}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-10 ${
                    activeTab === 'user-upload'
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-800/70 hover:text-emerald-950'
                  }`}
                >
                  {activeTab === 'user-upload' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-emerald-200/60 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  {t('scan_leaf')}
                </button>
                <button
                  id="nav-user-history-btn"
                  onClick={() => handleNav('user-history')}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors z-10 ${
                    activeTab === 'user-history'
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-800/70 hover:text-emerald-950'
                  }`}
                >
                  {activeTab === 'user-history' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-emerald-200/60 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <History className="w-3.5 h-3.5 text-emerald-600" />
                  {t('history')}
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right Actions: Language Switcher + Roles + Profile / Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Language Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1 bg-emerald-50/90 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-emerald-950 transition shadow-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <select
                id="global-language-switcher"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-black text-emerald-950 cursor-pointer focus:outline-none pr-1"
                aria-label="Select Language"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 bg-white font-medium py-1">
                    {l.flag} {l.nativeName} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {profile ? (
            <div className="flex items-center gap-2">
              {/* Role Indicator & Mode Switch Pill */}
              <button
                id="role-switch-btn"
                onClick={() => {
                  if (onRoleChange) {
                    onRoleChange(isFarmer ? 'USER' : 'FARMER');
                  }
                }}
                title="Click to switch role mode"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition shadow-sm ${
                  isFarmer 
                    ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                {isFarmer ? (
                  <>
                    <Tractor className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('farmer_mode')}</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('grower_mode')}</span>
                  </>
                )}
              </button>

              {/* User Avatar / Name */}
              <div 
                className="flex items-center gap-2 p-1.5 rounded-xl bg-emerald-50 border border-emerald-100"
                title={profile.email}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                  {profile.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left pr-1">
                  <span className="text-xs font-black text-emerald-950 truncate max-w-[110px]">
                    {profile.fullName}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="logout-btn"
                onClick={async () => {
                  await logout();
                  handleHomeClick();
                }}
                title={t('sign_out')}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                id="header-scanner-btn"
                onClick={handleHomeClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Live Demo
              </button>
              <button
                id="header-login-btn"
                onClick={handleLoginClick}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-900 hover:text-emerald-950 hover:bg-emerald-50 transition"
              >
                {t('login')}
              </button>
              <button
                id="header-signup-btn"
                onClick={handleSignUpClick}
                className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/20 transition"
              >
                {t('get_started')}
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

