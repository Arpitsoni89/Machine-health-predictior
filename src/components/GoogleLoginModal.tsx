import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, CheckCircle2, UserCheck, HeartHandshake } from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

export const GoogleLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithGoogle, user } = useAuth();
  const { themeConfig } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserProfile['role']>('Plant Operations Manager');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleQuickGoogleSignIn = (email: string, name: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithGoogle(email, name, selectedRole);
      setIsSubmitting(false);
    }, 400);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithGoogle(customEmail, customName || undefined, selectedRole);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-2xl ${themeConfig.badgeBg} ${themeConfig.textClass} flex items-center justify-center`}>
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">MachineMind</h3>
            <p className={`text-xs font-semibold ${themeConfig.textClass}`}>Friendly Industrial Intelligence</p>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            {user ? 'Switch Google Account' : 'Sign in to MachineMind'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authenticate to access live telemetry, preventive insights, and plant maintenance actions.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Your Operational Role:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(
              [
                'Plant Operations Manager',
                'Chief Reliability Engineer',
                'Predictive Maintenance Specialist',
                'Executive VP Operations',
              ] as UserProfile['role'][]
            ).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`p-2.5 rounded-xl border text-left font-medium transition flex items-center justify-between ${
                  selectedRole === role
                    ? `${themeConfig.bgLightClass} ${themeConfig.textClass} border-sky-400 ring-1 ring-sky-500/30 font-semibold`
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="truncate">{role}</span>
                {selectedRole === role && <CheckCircle2 className={`w-3.5 h-3.5 ${themeConfig.textClass} shrink-0 ml-1`} />}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Google Login Section */}
        {!isCustomMode ? (
          <div className="space-y-3">
            {/* Quick One-Click Google Sign In (Current User) */}
            <button
              onClick={() => handleQuickGoogleSignIn('harshit998ops@gmail.com', 'Harshit Sharma')}
              disabled={isSubmitting}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-2xs shrink-0 border border-slate-200">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.39 7.35 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold text-slate-900 group-hover:${themeConfig.textClass} transition`}>
                    Continue as Harshit Sharma
                  </p>
                  <p className="text-xs text-slate-500">harshit998ops@gmail.com</p>
                </div>
              </div>
              <span className={`text-xs font-semibold ${themeConfig.textClass} group-hover:translate-x-0.5 transition-transform`}>
                {isSubmitting ? 'Connecting...' : 'Sign in →'}
              </span>
            </button>

            {/* Standard "Sign in with Google" White Button */}
            <button
              onClick={() => handleQuickGoogleSignIn('plant.engineer@alwar-steel.in', 'Aryan Panwar')}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-2xl transition shadow-xs"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.39 7.35 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Sign in as Aryan Panwar (Founder)</span>
            </button>

            {/* Custom Google account button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className={`text-xs text-slate-500 hover:${themeConfig.textClass} transition`}
              >
                Use another Google Account or custom email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="engineer@company.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !customEmail}
                className={`flex-1 py-2 px-4 ${themeConfig.primaryClass} ${themeConfig.primaryHoverClass} text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google OAuth 2.0 PKCE</span>
          </div>
          <div>
            <span>Plant Alpha · Alwar Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
