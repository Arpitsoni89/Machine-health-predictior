import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Layers, 
  TrendingUp, 
  Presentation, 
  Sliders, 
  Sun,
  Moon,
  HelpCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { MaintenanceAlert } from '../types';

interface NavbarProps {
  activeTab: 'telemetry' | 'fleet' | 'loop' | 'roi' | 'pitch';
  setActiveTab: (tab: 'telemetry' | 'fleet' | 'loop' | 'roi' | 'pitch') => void;
  alerts: MaintenanceAlert[];
  onOpenAlerts: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  onOpenAlerts,
  onOpenGuide,
}) => {
  const { user, logout, openLoginModal, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => !a.acknowledged && a.severity === 'critical').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Single text element wordmark with friendly icon */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0" 
            onClick={() => setActiveTab('telemetry')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 dark:from-sky-600 dark:to-cyan-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                  <path 
                    d="M4 16h5l2.5-6 3.5 12 3-8 2.5 4 2-2h4.5" 
                    stroke="#0284c7" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="dark:stroke-cyan-400"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Machine<span className="text-sky-600 dark:text-cyan-400">Mind</span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean Segmented / Button Style) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'telemetry'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-cyan-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'fleet'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-cyan-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Plant Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('loop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'loop'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-cyan-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sense-Think-Act</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'roi'
                  ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-cyan-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Value & ROI</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'pitch'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-amber-500" />
              <span>Pitch Deck</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2">
            {/* Friendly Quick Guide Button */}
            <button
              onClick={onOpenGuide}
              className="p-2 rounded-xl text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              title="How MachineMind Works"
              aria-label="Open friendly guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              title={theme === 'dark' ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Plant Alerts Trigger */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition"
              title="View Plant Alerts"
              aria-label="View alerts"
            >
              <Bell className="w-4 h-4" />
              {unacknowledgedCount > 0 && (
                <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                  criticalCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                }`}>
                  {unacknowledgedCount}
                </span>
              )}
            </button>

            {/* Google Authentication Control */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition text-left"
                >
                  <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-sky-600 dark:text-cyan-400 font-medium truncate max-w-[130px]">
                      {user.role}
                    </span>
                  </div>

                  {/* Google Profile Avatar */}
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-cyan-500/40"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.39 7.35 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"/>
                      </svg>
                    </div>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Google Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                      <p className="text-[11px] text-sky-600 dark:text-cyan-400 mt-1">{user.facility}</p>
                    </div>

                    <div className="py-2 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block px-2">
                        Operational Role
                      </span>
                      {[
                        'Plant Operations Manager',
                        'Chief Reliability Engineer',
                        'Predictive Maintenance Specialist',
                        'Executive VP Operations',
                      ].map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r as any);
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                            user.role === r
                              ? 'bg-sky-50 dark:bg-cyan-950/60 text-sky-700 dark:text-cyan-300 font-semibold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{r}</span>
                          {user.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          openLoginModal();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Switch Google Account
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs rounded-xl transition shadow-xs"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.39 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 dark:border-slate-800 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'telemetry' ? 'bg-sky-50 dark:bg-cyan-950 text-sky-700 dark:text-cyan-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'fleet' ? 'bg-sky-50 dark:bg-cyan-950 text-sky-700 dark:text-cyan-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Plant Fleet
          </button>
          <button
            onClick={() => setActiveTab('loop')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'loop' ? 'bg-sky-50 dark:bg-cyan-950 text-sky-700 dark:text-cyan-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Sense-Think-Act
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'roi' ? 'bg-sky-50 dark:bg-cyan-950 text-sky-700 dark:text-cyan-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Value & ROI
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'pitch' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Pitch Deck
          </button>
        </div>
      </div>
    </header>
  );
};
