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

export const SenseThinkActView: React.FC = () => {
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-sky-600 dark:text-cyan-400 font-semibold mb-1">
              Automated Closed-Loop Pipeline
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Sense · Think · Act
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Eliminate human fatigue by uniting IoT edge telemetry with instant AI pattern evaluation and automated maintenance dispatch.
            </p>
          </div>

          <button
            onClick={runSimulationCycle}
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition shrink-0 active:scale-95 disabled:opacity-60"
          >
            {isSimulating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Simulating Pipeline...' : 'Test Sense-Think-Act Cycle'}</span>
          </button>
        </div>
      </div>

      {/* 3 Step Interactive Process Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Step 1: SENSE */}
        <div
          onClick={() => setActiveStep(1)}
          className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            activeStep === 1
              ? 'bg-sky-50/70 dark:bg-cyan-950/40 border-sky-300 dark:border-cyan-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                01. SENSE
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-cyan-950/80 text-sky-600 dark:text-cyan-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              The IoT Sensor Layer
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Sensors continuously measure physical machine conditions (vibration, heat, power) and stream real-time data to the system 24/7.
            </p>

            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-500" /> Heat Sensor</span>
                <span className="font-mono font-semibold">{sensorValues.temp} °C</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-sky-500" /> Accelerometer</span>
                <span className="font-mono font-semibold">{sensorValues.vib} mm/s</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Current Sensor</span>
                <span className="font-mono font-semibold">{sensorValues.pwr} kW</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-cyan-400">
            <span>Protocol: MQTT / Modbus</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: THINK */}
        <div
          onClick={() => setActiveStep(2)}
          className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            activeStep === 2
              ? 'bg-sky-50/70 dark:bg-cyan-950/40 border-sky-300 dark:border-cyan-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                02. THINK
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-cyan-950/80 text-sky-600 dark:text-cyan-400 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              The AI Core
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              The AI model instantly compares current behavior against learned normal patterns to generate an ongoing Risk Score.
            </p>

            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Model Pipeline:</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">LSTM Autoencoder + IF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Inference Speed:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">&lt; 4.2ms latency</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Dynamic Risk Score:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">78% (Anomaly Trip)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-cyan-400">
            <span>Model: Isolation Forest</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 3: ACT */}
        <div
          onClick={() => setActiveStep(3)}
          className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
            activeStep === 3
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                03. ACT
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              The Output
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Predefined thresholds trigger instant alerts, allowing maintenance teams to inspect and resolve issues before critical failure occurs.
            </p>

            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-medium">
                High Risk Detected · Maintenance Recommended Before Stoppage
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Dispatch Channels:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">SMS, Email, Webhook</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Result: Zero Surprise Downtime</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Reassuring Vision Quote Box */}
      <div className="bg-gradient-to-r from-sky-50/60 via-white to-sky-50/60 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-900 border border-sky-100 dark:border-cyan-900/40 rounded-2xl p-6 text-center">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">
          "Human teams cannot watch thousands of data points without fatigue. AI can."
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          By combining the ubiquity of IoT sensors with the pattern-recognition power of MachineMind AI, we eliminate blind spots on the factory floor for continuous, peaceful operations.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-sky-700 dark:text-cyan-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>From Reactive Repair to Predictive Care</span>
        </div>
      </div>

      {/* Stream Activity Console */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-300">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            MachineMind Telemetry Event Stream
          </span>
          <span>Sampling @ 1 kHz</span>
        </div>
        <div className="space-y-1">
          {simulatedLogs.map((log, idx) => (
            <div key={idx} className="truncate">
              <span className="text-sky-400 font-bold">&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
