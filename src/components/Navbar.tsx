import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  useTheme, 
  BRIGHT_THEMES, 
  BRIGHT_BACKGROUNDS, 
  BrightColor, 
  BrightBackgroundStyle 
} from '../context/ThemeContext';
import { 
  Activity, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Layers, 
  TrendingUp, 
  Presentation, 
  Sliders, 
  HelpCircle, 
  CreditCard,
  Sparkles,
  Palette,
  Sun
} from 'lucide-react';
import { MaintenanceAlert } from '../types';

interface NavbarProps {
  activeTab: 'telemetry' | 'fleet' | 'loop' | 'roi' | 'subscription' | 'pitch';
  setActiveTab: (tab: 'telemetry' | 'fleet' | 'loop' | 'roi' | 'subscription' | 'pitch') => void;
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
  const { 
    brightColor, 
    setBrightColor, 
    bgStyle, 
    setBgStyle, 
    themeConfig, 
    bgConfig 
  } = useTheme();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isNewHighPriorityAlert, setIsNewHighPriorityAlert] = useState(false);

  const prevAlertsRef = useRef<MaintenanceAlert[]>(alerts);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => !a.acknowledged && a.severity === 'critical').length;

  // Detect when a new high-priority maintenance alert is added to the alerts list
  useEffect(() => {
    const prevAlerts = prevAlertsRef.current;
    
    // Check if new alerts were added to the list
    if (alerts.length > prevAlerts.length) {
      const prevIds = new Set(prevAlerts.map((a) => a.id));
      const newlyAdded = alerts.filter((a) => !prevIds.has(a.id));
      const hasNewHighPriority = newlyAdded.some(
        (a) => a.severity === 'critical' && !a.acknowledged
      );

      if (hasNewHighPriority) {
        setIsNewHighPriorityAlert(true);
        // Subtle pulse stays active for 8 seconds or until operator views alerts
        const timer = setTimeout(() => {
          setIsNewHighPriorityAlert(false);
        }, 8000);
        return () => clearTimeout(timer);
      }
    }

    prevAlertsRef.current = alerts;
  }, [alerts]);

  const shouldPulseAlertIcon = isNewHighPriorityAlert || criticalCount > 0;

  const brightColorsList: BrightColor[] = ['cyan', 'emerald', 'amber', 'violet', 'coral'];
  const bgStylesList: BrightBackgroundStyle[] = ['pure-white', 'electric-sky', 'warm-solar', 'fresh-mint', 'soft-silver'];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo / Brand with Dynamic Bright Gradient */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0" 
            onClick={() => setActiveTab('telemetry')}
          >
            <div 
              className={`w-9 h-9 rounded-xl p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center bg-gradient-to-tr ${themeConfig.gradient}`}
            >
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                  <path 
                    d="M4 16h5l2.5-6 3.5 12 3-8 2.5 4 2-2h4.5" 
                    stroke={themeConfig.primaryHex}
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Machine<span className={themeConfig.textClass}>Mind</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Predictive Care
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'telemetry'
                  ? `bg-white ${themeConfig.textClass} shadow-xs font-semibold`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'fleet'
                  ? `bg-white ${themeConfig.textClass} shadow-xs font-semibold`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Plant Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('loop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'loop'
                  ? `bg-white ${themeConfig.textClass} shadow-xs font-semibold`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sense-Think-Act</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'roi'
                  ? `bg-white ${themeConfig.textClass} shadow-xs font-semibold`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Value & ROI</span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'subscription'
                  ? `bg-white ${themeConfig.textClass} shadow-xs font-semibold`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Plans & Billing</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'pitch'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-amber-500" />
              <span>Pitch Deck</span>
            </button>
          </nav>

          {/* Right Actions Cluster */}
          <div className="flex items-center gap-2">
            
            {/* Bright Theme & Background Customizer Picker */}
            <div className="relative">
              <button
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition"
                title="Customize Bright Background and Accents"
              >
                <div className="flex items-center -space-x-1">
                  <span 
                    className="w-3 h-3 rounded-full border border-white shadow-xs shrink-0" 
                    style={{ backgroundColor: themeConfig.dotColor }}
                  />
                  <span className="w-3 h-3 rounded-full border border-slate-300 bg-sky-200 shadow-xs shrink-0" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 hidden sm:inline">Bright Themes</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Theme Customizer Dropdown */}
              {isThemePickerOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsThemePickerOpen(false)}
                >
                  {/* Section A: Bright Background Canvases */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Bright Background Canvas</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {bgStylesList.map((key) => {
                        const item = BRIGHT_BACKGROUNDS[key];
                        const isSelected = bgStyle === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setBgStyle(key)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left ${
                              isSelected
                                ? 'bg-sky-50 border border-sky-300 font-semibold text-slate-900 shadow-2xs'
                                : 'hover:bg-slate-50 border border-transparent text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-4 h-4 rounded-full border shadow-2xs ${item.previewBg}`} />
                              <div>
                                <div className="font-bold text-[11px] text-slate-900">{item.label}</div>
                                <div className="text-[10px] text-slate-500">{item.subtitle}</div>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-md">
                                Active
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section B: Bright Accent Colors */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-sky-500" />
                        <span>Vibrant Accent Color</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {brightColorsList.map((key) => {
                        const cfg = BRIGHT_THEMES[key];
                        const isSelected = brightColor === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setBrightColor(key)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition ${
                              isSelected
                                ? `${cfg.bgLightClass} ${cfg.textClass} font-semibold border ${cfg.borderClass}`
                                : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                            }`}
                          >
                            <span 
                              className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                              style={{ backgroundColor: cfg.dotColor }}
                            />
                            <span className="text-[11px] truncate">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Friendly Guide Button */}
            <button
              onClick={onOpenGuide}
              className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition"
              title="How MachineMind Works"
              aria-label="Open friendly guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Plant Alerts Trigger with subtle pulse animation on high-priority alerts */}
            <button
              onClick={() => {
                setIsNewHighPriorityAlert(false);
                onOpenAlerts();
              }}
              className={`relative p-2 rounded-xl transition-all duration-300 border cursor-pointer ${
                shouldPulseAlertIcon
                  ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs ring-2 ring-rose-400/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
              }`}
              title={shouldPulseAlertIcon ? "High-Priority Maintenance Alert Active" : "View Plant Alerts"}
              aria-label="View alerts"
            >
              {/* Subtle expanding ping aura when a new high-priority alert is added */}
              {shouldPulseAlertIcon && (
                <span className="absolute inset-0 rounded-xl bg-rose-400/25 animate-ping pointer-events-none" />
              )}

              {/* Alert Bell icon with subtle pulse animation */}
              <Bell 
                className={`w-4 h-4 transition-all duration-300 ${
                  shouldPulseAlertIcon 
                    ? 'text-rose-600 animate-subtle-pulse' 
                    : 'text-slate-600'
                }`} 
              />

              {unacknowledgedCount > 0 && (
                <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white shadow-2xs transition-transform ${
                  criticalCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                }`}>
                  {unacknowledgedCount}
                </span>
              )}
            </button>

            {/* User Profile / Google Sign-in */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition text-left shadow-2xs"
                >
                  <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {user.name}
                    </span>
                    <span className={`text-[10px] ${themeConfig.textClass} font-medium truncate max-w-[130px]`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200"
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

                {isProfileMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Facility:</span>
                        <span className="font-semibold text-slate-700">{user.facility}</span>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                        Role Switcher
                      </span>
                      <button
                        onClick={() => {
                          switchRole('Chief Reliability Engineer');
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          user.role === 'Chief Reliability Engineer'
                            ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold`
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Chief Reliability Engineer
                      </button>
                      <button
                        onClick={() => {
                          switchRole('Plant Operations Manager');
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          user.role === 'Plant Operations Manager'
                            ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold`
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Plant Operations Manager
                      </button>
                      <button
                        onClick={() => {
                          switchRole('Executive VP Operations');
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          user.role === 'Executive VP Operations'
                            ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold`
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Executive VP Operations
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs rounded-xl transition shadow-xs"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.39 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"/>
                </svg>
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'telemetry' ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold` : 'text-slate-600'}`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'fleet' ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold` : 'text-slate-600'}`}
          >
            Plant Fleet
          </button>
          <button
            onClick={() => setActiveTab('loop')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'loop' ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold` : 'text-slate-600'}`}
          >
            Sense-Think-Act
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'roi' ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold` : 'text-slate-600'}`}
          >
            Value & ROI
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'subscription' ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-semibold` : 'text-slate-600'}`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'pitch' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-600'}`}
          >
            Pitch Deck
          </button>
        </div>
      </div>
    </header>
  );
};
