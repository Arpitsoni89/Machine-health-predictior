import React, { useState } from 'react';
import { MaintenanceAlert, IndustrialMachine, TechnicianInfo } from '../types';
import { 
  X, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send,
  Bell,
  UserCheck,
  Radio,
  Phone,
  Wrench,
  Award,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { getRecommendedTechnician } from '../data/mockTechnicians';

interface AlertsSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MaintenanceAlert[];
  machines: IndustrialMachine[];
  onAcknowledge: (id: string) => void;
  onSelectMachine: (machineId: string) => void;
  onAssignTechnician: (machineId: string, alertId?: string, technician?: TechnicianInfo) => void;
  onMarkMachineRepaired: (machineId: string, repairNotes?: string) => void;
}

export const AlertsSlideOver: React.FC<AlertsSlideOverProps> = ({
  isOpen,
  onClose,
  alerts,
  machines,
  onAcknowledge,
  onSelectMachine,
  onAssignTechnician,
  onMarkMachineRepaired,
}) => {
  const { themeConfig } = useTheme();
  if (!isOpen) return null;

  const handleDispatch = (alert: MaintenanceAlert) => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: [themeConfig.dotColor, '#38bdf8', '#34d399', '#f59e0b'],
    });

    const tech = getRecommendedTechnician(alert.category);
    onAssignTechnician(alert.machineId, alert.id, tech);
  };

  const handleCompleteRepair = (machineId: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#10b981', '#38bdf8', '#fbbf24'],
    });
    onMarkMachineRepaired(machineId, 'Mechanical checkup completed. Vitals verified within ISO Zone A normal parameters.');
  };

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const resolvedAlerts = alerts.filter((a) => a.acknowledged);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white border-l border-slate-200 h-full p-4 sm:p-6 pb-safe flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Plant Care & Dispatch Center</h3>
              <p className="text-xs text-slate-500">
                {unacknowledgedAlerts.length} Active · {resolvedAlerts.length} Handled / Repaired
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer active:scale-95"
            aria-label="Close alerts drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 py-4 space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50 mb-2" />
              <p className="text-sm font-semibold text-slate-700">All Equipment Healthy</p>
              <p className="text-xs">No active alerts. All machines are operating within baseline parameters.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isCritical = alert.severity === 'critical';
              const machine = machines.find((m) => m.id === alert.machineId);
              const technician = alert.technician || machine?.assignedTechnician;

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-3xl border transition-all ${
                    alert.isRepaired
                      ? 'bg-emerald-50/60 border-emerald-200/90 shadow-2xs'
                      : alert.acknowledged
                      ? 'bg-slate-50/80 border-slate-200/80 shadow-2xs'
                      : isCritical
                      ? 'bg-rose-50/80 border-rose-300 shadow-xs ring-1 ring-rose-400/20'
                      : 'bg-amber-50/80 border-amber-300 shadow-xs ring-1 ring-amber-400/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[11px] font-bold flex items-center gap-1 ${
                      alert.isRepaired
                        ? 'text-emerald-700'
                        : isCritical 
                        ? 'text-rose-600' 
                        : 'text-amber-700'
                    }`}>
                      {alert.isRepaired ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Repaired & Restored to Normal</span>
                        </>
                      ) : isCritical ? (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Immediate Attention Required</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Scheduled Inspection Check</span>
                        </>
                      )}
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
                    className={`font-bold text-sm text-slate-900 hover:${themeConfig.textClass} cursor-pointer transition`}
                  >
                    {alert.machineName}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-2.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Telemetry Reading:</span>
                      <span className="text-slate-900 font-mono font-bold">{alert.value}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <span className={`font-semibold ${themeConfig.textClass}`}>Recommended Action:</span> {alert.recommendedAction}
                    </div>
                  </div>

                  {/* Technician Info Card when Assigned */}
                  {technician && (
                    <div className="mt-3 p-3 rounded-2xl bg-sky-50 border border-sky-200/90 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={technician.avatar}
                            alt={technician.name}
                            className="w-8 h-8 rounded-full object-cover border border-sky-300"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{technician.name}</span>
                              <span className="font-mono text-[10px] text-sky-800 bg-sky-200/70 px-1.5 py-0.2 rounded font-semibold">
                                {technician.badgeId}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 leading-tight">
                              {technician.role}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>ETA: {technician.etaMinutes}m</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-1.5 border-t border-sky-200/60">
                        <div className="flex items-center gap-1 font-mono">
                          <Radio className="w-3 h-3 text-sky-600" />
                          <span>{technician.radioChannel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span className="truncate">{technician.certification}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {alert.isRepaired ? (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Machine Operating Normally</span>
                      </span>
                    ) : technician ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-sky-800 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                          <span>Technician Assigned</span>
                        </span>

                        <button
                          onClick={() => handleCompleteRepair(alert.machineId)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Repaired & Reset</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                        >
                          Acknowledge
                        </button>

                        <button
                          onClick={() => handleDispatch(alert)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Assign Technician</span>
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
            MachineMind Continuous Edge Dispatcher · Automated Technician Assignment
          </p>
        </div>
      </div>
    </div>
  );
};
