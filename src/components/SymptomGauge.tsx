import React, { useState } from 'react';
import { Flame, Activity, Zap, Info, X, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface SymptomGaugeProps {
  type: 'temperature' | 'vibration' | 'power';
  value: number;
  baseline: number;
  threshold: number;
  unit: string;
}

export const SymptomGauge: React.FC<SymptomGaugeProps> = ({
  type,
  value,
  baseline,
  threshold,
  unit,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  // Normalize percentage for arc (0 - 100%)
  const maxRange = threshold * 1.3;
  const percentage = Math.min(100, Math.max(0, (value / maxRange) * 100));

  // Determine severity
  const isCritical = value >= threshold;
  const isWarning = value >= baseline * 1.22 && !isCritical;
  const statusLabel = isCritical 
    ? 'Critical Anomaly' 
    : isWarning 
    ? 'Warning Deviation' 
    : 'Normal Baseline';

  // Config per type
  const config = {
    temperature: {
      title: 'Operating Temperature',
      subtitle: 'Thermal friction vitals',
      icon: Flame,
      colorClass: isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-sky-600',
      strokeGradientId: 'temp-grad',
      baselineText: `Baseline: ${baseline}°C · Trip: >${threshold}°C`,
      friendlyAdvice: 'Monitors thermal dissipation. Temperatures above normal baseline suggest bearing lubrication drying up, cooling fan blockage, or high friction in gear mesh.',
      healthyRange: `Healthy: <${(threshold * 0.85).toFixed(0)}°C`,
    },
    vibration: {
      title: 'Vibration Harmonics',
      subtitle: 'Rotor & bearing balance',
      icon: Activity,
      colorClass: isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-sky-600',
      strokeGradientId: 'vib-grad',
      baselineText: `Baseline: ${baseline} mm/s · Limit: >${threshold} mm/s`,
      friendlyAdvice: 'Triaxial accelerometer tracking mechanical oscillation. Vibrations above baseline indicate shaft misalignment, loosened mounting footings, or bearing spall.',
      healthyRange: `Healthy: <${(threshold * 0.85).toFixed(1)} mm/s`,
    },
    power: {
      title: 'Power Draw',
      subtitle: 'Coil & motor load current',
      icon: Zap,
      colorClass: isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-sky-600',
      strokeGradientId: 'pwr-grad',
      baselineText: `Baseline: ${baseline} kW · Surge: >${threshold} kW`,
      friendlyAdvice: 'Real-time electrical load consumption. Sudden power surges reflect sudden mechanical resistance, heavy feed loads, or winding insulation degradation.',
      healthyRange: `Healthy: <${(threshold * 0.85).toFixed(0)} kW`,
    },
  }[type];

  const Icon = config.icon;

  // Semi-circle arc calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius * (240 / 360);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative p-5 rounded-3xl border transition-all duration-200 flex flex-col items-center justify-between ${
      isCritical 
        ? 'bg-rose-50/90 border-rose-300 shadow-sm ring-2 ring-rose-400/20' 
        : isWarning 
        ? 'bg-amber-50/90 border-amber-300 shadow-sm ring-2 ring-amber-400/20' 
        : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
    }`}>
      {/* Top Header & Friendly Info Popover Toggle */}
      <div className="w-full flex items-center justify-between mb-1">
        <div className="flex-1 text-center pl-5">
          <h4 className="text-sm font-bold text-slate-800">
            {config.title}
          </h4>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-center gap-1.5">
            <span>{config.subtitle}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-semibold ${
              isCritical ? 'text-rose-600 font-bold' : isWarning ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          title="Learn what this metric means"
          className="text-slate-400 hover:text-sky-600 p-1 rounded-lg transition"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Friendly Info Popup Drawer when clicked */}
      {showInfo && (
        <div className="absolute inset-x-3 top-3 bottom-3 z-20 bg-white/98 backdrop-blur-md rounded-2xl p-4 border border-sky-200 shadow-xl flex flex-col justify-between text-xs animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-sky-600" />
                <span>About {config.title}</span>
              </span>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 mt-2.5 leading-relaxed">
              {config.friendlyAdvice}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>{config.healthyRange}</span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-sky-600 font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Circular Gauge Graphic */}
      <div className="relative w-40 h-36 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-210" viewBox="0 0 160 160">
          <defs>
            <linearGradient id={config.strokeGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100"
            strokeWidth="10"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Colored Active Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={`url(#${config.strokeGradientId})`}
            strokeWidth="10"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className={`p-2 rounded-xl mb-1 bg-slate-50 border border-slate-200/80 ${config.colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
              {value.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-medium">{unit}</span>
          </div>
        </div>
      </div>

      {/* Friendly Baseline text with status pill */}
      <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>{config.baselineText}</span>
        <span className="flex items-center gap-1">
          {isCritical ? (
            <AlertOctagon className="w-3 h-3 text-rose-500" />
          ) : isWarning ? (
            <AlertTriangle className="w-3 h-3 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          )}
        </span>
      </div>
    </div>
  );
};
