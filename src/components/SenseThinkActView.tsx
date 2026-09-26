import React, { useState } from 'react';
import { 
  Radio, 
  BrainCircuit, 
  BellRing, 
  ArrowRight, 
  Activity, 
  Flame, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  RotateCw, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

export const SenseThinkActView: React.FC = () => {
  const { themeConfig } = useTheme();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(2);
  const [sensorValues, setSensorValues] = useState({ temp: 86.4, vib: 8.9, pwr: 112.5 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    'Triaxial Accelerometer streaming 1,000 Hz waveform...',
    'Isolation Forest model evaluates residual deviation against baseline.',
    'Automated notification and preventive work order generated.',
  ]);

  const runSimulationCycle = () => {
    setIsSimulating(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setSensorValues({
        temp: Number((75 + Math.random() * 25).toFixed(1)),
        vib: Number((6 + Math.random() * 6).toFixed(2)),
        pwr: Number((90 + Math.random() * 40).toFixed(1)),
      });
    }, 1000);

    setTimeout(() => {
      setActiveStep(3);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: [themeConfig.dotColor, '#38bdf8', '#34d399', '#f59e0b'],
      });
      setIsSimulating(false);
      setSimulatedLogs((prev) => [
        `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] Sense ➔ Think ➔ Act cycle simulated. Risk preempted before stoppage.`,
        ...prev.slice(0, 4),
      ]);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className={`text-xs font-semibold mb-1 ${themeConfig.textClass}`}>
              Automated Closed-Loop Pipeline
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Sense · Think · Act
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Eliminate human fatigue by uniting IoT edge telemetry with instant AI pattern evaluation and automated maintenance dispatch.
            </p>
          </div>

          <button
            onClick={runSimulationCycle}
            disabled={isSimulating}
            className={`px-5 py-2.5 rounded-xl ${themeConfig.primaryClass} ${themeConfig.primaryHoverClass} font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition shrink-0 active:scale-95 disabled:opacity-60`}
          >
            {isSimulating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Simulating Pipeline...' : 'Test Sense-Think-Act Cycle'}</span>
          </button>
        </div>
      </div>

      {/* 3 Step Interactive Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: SENSE */}
        <div
          onClick={() => setActiveStep(1)}
          className={`cursor-pointer rounded-3xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            activeStep === 1
              ? `${themeConfig.bgLightClass} border-sky-300 shadow-sm ring-2 ring-sky-400/20`
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-mono font-bold ${themeConfig.textClass}`}>
                01. SENSE
              </span>
              <div className={`w-9 h-9 rounded-xl ${themeConfig.badgeBg} ${themeConfig.textClass} flex items-center justify-center`}>
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              The Physical World
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Vibration, temperature, and current sensors continuously collect high-frequency data from industrial machinery without stopping lines.
            </p>

            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                <span className="flex items-center gap-1.5 text-orange-600">
                  <Flame className="w-3.5 h-3.5" /> Temp:
                </span>
                <span className="font-mono font-bold">{sensorValues.temp}°C</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                <span className="flex items-center gap-1.5 text-sky-600">
                  <Activity className="w-3.5 h-3.5" /> Vibration:
                </span>
                <span className="font-mono font-bold">{sensorValues.vib} mm/s</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Zap className="w-3.5 h-3.5" /> Power:
                </span>
                <span className="font-mono font-bold">{sensorValues.pwr} kW</span>
              </div>
            </div>
          </div>

          <div className={`mt-6 flex items-center justify-between text-xs font-semibold ${themeConfig.textClass}`}>
            <span>Continuous IoT Ingestion</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: THINK */}
        <div
          onClick={() => setActiveStep(2)}
          className={`cursor-pointer rounded-3xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            activeStep === 2
              ? `${themeConfig.bgLightClass} border-sky-300 shadow-sm ring-2 ring-sky-400/20`
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-mono font-bold ${themeConfig.textClass}`}>
                02. THINK
              </span>
              <div className={`w-9 h-9 rounded-xl ${themeConfig.badgeBg} ${themeConfig.textClass} flex items-center justify-center`}>
                <BrainCircuit className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              The Intelligence
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Machine learning algorithms compare incoming signals against trained baseline behavior, detecting subtle anomalies that humans miss.
            </p>

            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 mb-1">
                  <span>Deviation from Baseline:</span>
                  <span className="font-mono font-bold text-sky-600">+3.84σ</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${themeConfig.primaryClass} w-3/4`} />
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-between">
                <span>Model Confidence:</span>
                <span className="text-emerald-600 font-bold font-mono">98.4% Nominal</span>
              </div>
            </div>
          </div>

          <div className={`mt-6 flex items-center justify-between text-xs font-semibold ${themeConfig.textClass}`}>
            <span>Model: Isolation Forest + LSTM</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 3: ACT */}
        <div
          onClick={() => setActiveStep(3)}
          className={`cursor-pointer rounded-3xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            activeStep === 3
              ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-amber-600">
                03. ACT
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              The Output
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Predefined thresholds trigger instant alerts, allowing maintenance teams to inspect and resolve issues before critical failure occurs.
            </p>

            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-medium">
                High Risk Detected · Maintenance Recommended Before Stoppage
              </div>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-between">
                <span>Dispatch Channels:</span>
                <span className="text-slate-800 font-medium">SMS, Email, Webhook</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>Result: Zero Surprise Downtime</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Reassuring Vision Quote Box */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 rounded-3xl p-6 sm:p-7 text-center shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
          "Human teams cannot watch thousands of data points without fatigue. AI can."
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          By combining the ubiquity of IoT sensors with the pattern-recognition power of MachineMind AI, we eliminate blind spots on the factory floor for continuous, peaceful operations.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-sky-700 font-semibold bg-white px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>From Reactive Repair to Predictive Care</span>
        </div>
      </div>

      {/* Bright Clean Activity Stream Console */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 font-mono text-xs text-slate-700 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">MachineMind Live Telemetry Event Stream</span>
          </span>
          <span className="text-[11px] text-slate-400">Sampling @ 1 kHz</span>
        </div>
        <div className="space-y-1.5">
          {simulatedLogs.map((log, idx) => (
            <div key={idx} className="truncate flex items-center gap-2">
              <span className={`font-bold ${themeConfig.textClass}`}>&gt;</span> 
              <span className="text-slate-800">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
