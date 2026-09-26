import React from 'react';
import { 
  Activity, 
  Layers, 
  Sliders, 
  TrendingUp, 
  CreditCard, 
  Bell,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { MaintenanceAlert, NavTab } from '../types';

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  alerts: MaintenanceAlert[];
  onOpenAlerts: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  onOpenAlerts,
}) => {
  const { themeConfig } = useTheme();

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const hasCritical = alerts.some((a) => !a.acknowledged && a.severity === 'critical');

  const navItems = [
    {
      id: 'telemetry' as const,
      label: 'Health',
      icon: Activity,
      badge: 'Live',
    },
    {
      id: 'fleet' as const,
      label: 'Machines',
      icon: Layers,
    },
    {
      id: 'subscription' as const,
      label: 'Plans',
      icon: CreditCard,
    },
    {
      id: 'help' as const,
      label: 'Warranty',
      icon: HelpCircle,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation Bar"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-xl px-2 py-1.5 transition-colors"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-bold shadow-2xs`
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4.5 h-4.5 ${isActive ? themeConfig.textClass : 'text-slate-500'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Alerts Bell Button in Bottom Navigation */}
        <button
          onClick={onOpenAlerts}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
            hasCritical
              ? 'text-rose-600 bg-rose-50 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Open Maintenance Alerts"
        >
          <div className="relative">
            <Bell className={`w-4.5 h-4.5 ${hasCritical ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
            {unacknowledgedCount > 0 && (
              <span className={`absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-extrabold text-white leading-none flex items-center justify-center min-w-[14px] h-[14px] ${
                hasCritical ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
              }`}>
                {unacknowledgedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            Alerts
          </span>
        </button>
      </div>
    </nav>
  );
};
