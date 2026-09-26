import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, Calendar, Wrench } from 'lucide-react';
import { MachineStatus } from '../types';

interface OperationalDirectivesProps {
  currentStatus: MachineStatus;
  riskScore: number;
  onTriggerInspection?: () => void;
  onDispatchImmediate?: () => void;
}

export const OperationalDirectives: React.FC<OperationalDirectivesProps> = ({
  currentStatus,
  riskScore,
  onTriggerInspection,
  onDispatchImmediate,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Operational Directives
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clear, stress-free action recommendations translated from raw sensor metrics
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
          <span>AI Risk Score:</span>
          <span className={`font-bold tabular-nums ${
            riskScore > 75 ? 'text-rose-600 dark:text-rose-400' : riskScore > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {riskScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Normal Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            currentStatus === 'normal'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/50 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Normal Baseline
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 min-h-[36px] leading-relaxed">
            Machine behavior is within expected patterns. No manual intervention required.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
            <span>Action: Continue automated monitoring</span>
          </div>
        </div>

        {/* Warning Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            currentStatus === 'warning'
              ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/50 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
              Warning Deviation
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 min-h-[36px] leading-relaxed">
            Early vibration or heat deviation detected. Machine is running, but needs checkup.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-amber-800 dark:text-amber-300">
            <span>Action: Schedule planned maintenance</span>
            {onTriggerInspection && (
              <button
                onClick={onTriggerInspection}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-500/20 hover:bg-amber-300 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 transition font-semibold flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                <span>Schedule</span>
              </button>
            )}
          </div>
        </div>

        {/* Critical Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            currentStatus === 'critical'
              ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/50 shadow-xs animate-pulse'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
              Immediate Attention
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 min-h-[36px] leading-relaxed">
            Strong anomaly detected. Immediate inspection advised to avoid sudden stoppage.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-rose-800 dark:text-rose-300">
            <span className="truncate">Action: Dispatch crew</span>
            {onDispatchImmediate && (
              <button
                onClick={onDispatchImmediate}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition shrink-0 ml-1 shadow-xs flex items-center gap-1"
              >
                <Wrench className="w-3 h-3" />
                <span>Dispatch</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
