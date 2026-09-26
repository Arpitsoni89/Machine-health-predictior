import React from 'react';
import { MaintenanceAlert } from '../types';
import { 
  X, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

interface AlertsSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MaintenanceAlert[];
  onAcknowledge: (id: string) => void;
  onSelectMachine: (machineId: string) => void;
}

export const AlertsSlideOver: React.FC<AlertsSlideOverProps> = ({
  isOpen,
  onClose,
  alerts,
  onAcknowledge,
  onSelectMachine,
}) => {
  const { themeConfig } = useTheme();
  if (!isOpen) return null;

  const handleDispatch = (alert: MaintenanceAlert) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: [themeConfig.dotColor, '#38bdf8', '#34d399', '#f59e0b'],
    });
    onAcknowledge(alert.id);
  };

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const resolvedAlerts = alerts.filter((a) => a.acknowledged);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/25 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Plant Care Alerts</h3>
              <p className="text-xs text-slate-500">
                {unacknowledgedAlerts.length} Active · {resolvedAlerts.length} Handled
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 py-4 space-y-3.5">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50 mb-2" />
              <p className="text-sm font-semibold text-slate-700">All Equipment Healthy</p>
              <p className="text-xs">No active alerts. All machines are operating within baseline parameters.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isCritical = alert.severity === 'critical';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-50/60 border-slate-200/80 opacity-75'
                      : isCritical
                      ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-400/20'
                      : 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-400/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                      isCritical ? 'text-rose-600' : 'text-amber-700'
                    }`}>
                      {isCritical ? <AlertOctagon className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{isCritical ? 'Immediate Attention' : 'Scheduled Check'}</span>
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>

                  <h4 
                    onClick={() => {
                      onSelectMachine(alert.machineId);
                      onClose();
                    }}
                    className={`font-semibold text-sm text-slate-900 hover:${themeConfig.textClass} cursor-pointer transition`}
                  >
                    {alert.machineName}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Reading:</span>
                      <span className="text-slate-900 font-mono font-semibold">{alert.value}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <span className={`font-semibold ${themeConfig.textClass}`}>Recommended:</span> {alert.recommendedAction}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {alert.acknowledged ? (
                      <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Work Order Assigned</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                        >
                          Acknowledge
                        </button>

                        <button
                          onClick={() => handleDispatch(alert)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch Crew</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            MachineMind Continuous Edge Dispatcher · MQTT / Webhook
          </p>
        </div>
      </div>
    </div>
  );
};
