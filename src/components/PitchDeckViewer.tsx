import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Presentation, 
  Sparkles, 
  Flame, 
  Activity, 
  Zap, 
  Stethoscope, 
  Radio, 
  BrainCircuit, 
  BellRing, 
  AlertTriangle,
  Building2,
  Cpu
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';

export const PitchDeckViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = PRESENTATION_SLIDES.length;
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto' : ''}`}>
      {/* Slide Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>MachineMind Pitch Deck</span>
              <span className="text-xs text-slate-500 font-mono">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aryan Panwar · 1st year B.Tech (AI / DS) · MITRC, Alwar · Session 2026-27
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-800 dark:text-white transition flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className="p-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white transition flex items-center gap-1 text-xs font-semibold shadow-xs"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Toggle fullscreen presentation"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Stage (16:9 Presentation Frame) */}
      <div className="relative aspect-[16/9] min-h-[460px] w-full bg-gradient-to-br from-slate-950 via-[#0d1522] to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Background Subtle Waveform Grid */}
        <div className="absolute inset-0 bg-grid-industrial opacity-60 pointer-events-none" />

        {/* Dynamic Slide Content by Slide Index (1 to 11) */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">

          {/* SLIDE 1: Cover Slide */}
          {currentSlideIndex === 0 && (
            <div className="text-center max-w-4xl mx-auto my-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 to-sky-400 p-0.5 shadow-2xl shadow-cyan-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none" stroke="currentColor">
                      <path d="M26 12l2 2 3-1 2 3-2 3 1 3 3 1-1 3-3 1-1 3-3-1-2 2-3-2-2 2v-4" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M4 22h6l3-8 4 14 3-9 3 5 4-2h3" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight font-mono">
                Machine<span className="text-cyan-400">Mind</span>
              </h1>
              
              <div className="my-6 max-w-xl mx-auto">
                {/* Heartbeat Wave to Gear Motif (Slide 1) */}
                <svg viewBox="0 0 500 80" className="w-full h-16">
                  <path
                    d="M10 40 H160 L180 15 L195 65 L210 25 L225 55 L240 35 L255 45 H330"
                    stroke="#22d3ee"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Gear Silhouette */}
                  <circle cx="380" cy="40" r="28" fill="#38bdf8" opacity="0.8" />
                  <circle cx="380" cy="40" r="14" fill="#0b111b" />
                </svg>
              </div>

              <p className="text-xl sm:text-2xl font-bold text-slate-200 mt-2">
                Don't repair after failure, Predict before it happens
              </p>

              <div className="mt-8 inline-block p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono shadow-xl text-left">
                <p><span className="text-cyan-400 font-semibold">Name:</span> Aryan Panwar</p>
                <p><span className="text-cyan-400 font-semibold">Course & Branch:</span> 1st year B.Tech (AI / DS)</p>
                <p><span className="text-cyan-400 font-semibold">College & Session:</span> MITRC, Alwar | Session 2026-27</p>
              </div>
            </div>
          )}

          {/* SLIDE 2: ₹12 Lakh Crore Downtime Problem */}
          {currentSlideIndex === 1 && (
            <div className="text-center max-w-3xl mx-auto my-auto animate-in fade-in duration-300">
              <span className="text-xs uppercase tracking-widest font-black text-rose-400 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/80 mb-4 inline-block">
                The Problem (Step-1)
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-white mt-3">
                Unplanned downtime results in massive financial hemorrhage
              </h2>

              <div className="my-8 p-8 rounded-3xl bg-rose-950/40 border border-rose-500/50 shadow-2xl backdrop-blur-md">
                <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-300 to-white font-mono">
                  ₹12 Lakh Crore
                </span>
                <p className="text-rose-200 text-sm sm:text-lg font-medium mt-4">
                  Lost annually in Indian manufacturing industries due to reactive repair models.
                </p>
                <div className="mt-4 pt-4 border-t border-rose-900/60 flex items-center justify-center gap-2 text-xs sm:text-sm text-rose-300">
                  <span>Production stops.</span>
                  <span>➔</span>
                  <span>Emergency maintenance is required.</span>
                  <span>➔</span>
                  <span className="font-bold text-white">Revenue vanishes.</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Symptoms Dashboard */}
          {currentSlideIndex === 2 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Machines exhibit clear symptoms before a catastrophic breakdown
                </h2>
                <p className="text-xs text-cyan-400 font-mono mt-1">Symptoms Dashboard</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3 text-orange-400">
                    <Flame className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Abnormal Temperature / Heat Increase</h4>
                  <p className="text-xs text-slate-400 mt-2">Thermal signatures from friction & lubrication breakdown</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 text-cyan-400">
                    <Activity className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Unusual Vibration Patterns</h4>
                  <p className="text-xs text-slate-400 mt-2">Bearing spalling, shaft misalignment, harmonic resonance</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sudden Power-Consumption Spikes</h4>
                  <p className="text-xs text-slate-400 mt-2">Mechanical resistance forcing motor coils to draw excess current</p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                <span className="text-rose-400 font-bold">The root cause:</span> Machines give early warning signs, but humans miss them until it is too late.
              </div>
            </div>
          )}

          {/* SLIDE 4: Dedicated Physician Metaphor */}
          {currentSlideIndex === 3 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest font-black text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 mb-3 inline-block">
                  The Solution (Step-2)
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  MachineMind acts as a dedicated physician for your industrial equipment
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Human Physician</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Checks temperature, pulse, and vital signs to identify illness before hospitalization is needed.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 flex items-start gap-4 shadow-xl">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 shrink-0">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-300 text-base">MachineMind AI Physician</h3>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      Continuous real-time tracking of temperature, vibration, and power to detect anomalies before critical failure occurs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center font-bold text-cyan-300 text-sm sm:text-base">
                MachineMind = Sensors + AI + Early Warning + Preventive Maintenance
              </div>
            </div>
          )}

          {/* SLIDE 5: Continuous Loop (Sense - Think - Act) */}
          {currentSlideIndex === 4 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest font-black text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 mb-3 inline-block">
                  How It Works (Step-3)
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  A continuous loop of monitoring, analysis, and prevention
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 text-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center mb-3">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="font-black text-lg text-white">SENSE</h3>
                  <span className="text-xs text-cyan-400 block mb-2 font-mono">The IoT Layer</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sensors continuously measure physical machine conditions (vibration, heat, power) and stream real-time data to the system.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-sky-400/50 text-center">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 mx-auto flex items-center justify-center mb-3">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-white">THINK</h3>
                  <span className="text-xs text-sky-400 block mb-2 font-mono">The AI Core</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The AI model instantly compares current behavior against learned normal patterns to generate an ongoing Risk Score.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/50 text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center mb-3">
                    <BellRing className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="font-black text-lg text-white">ACT</h3>
                  <span className="text-xs text-amber-400 block mb-2 font-mono">The Output</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Predefined thresholds trigger instant alerts, allowing maintenance teams to inspect and resolve issues before failure.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: AI Defines Normal & Anomaly Spikes */}
          {currentSlideIndex === 5 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  The AI defines normal and instantly flags significant deviations
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Powered by time-series feature engineering and anomaly-detection models (Isolation Forests / LSTM autoencoders).
                </p>
              </div>

              {/* Graphic Representation matching Slide 6 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
                <svg viewBox="0 0 700 200" className="w-full h-44">
                  {/* Grid */}
                  <line x1="0" y1="50" x2="700" y2="50" stroke="#1e293b" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#1e293b" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="#1e293b" />
                  
                  {/* Baseline envelope (Dotted) */}
                  <path d="M0 80 Q 200 70 350 78 T 700 80" stroke="#94a3b8" strokeDasharray="4,4" fill="none" strokeWidth="1.5" />
                  <path d="M0 130 Q 200 120 350 128 T 700 130" stroke="#94a3b8" strokeDasharray="4,4" fill="none" strokeWidth="1.5" />
                  <text x="180" y="65" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">AI-Learned Baseline (Expected Pattern)</text>

                  {/* Signal line with Spike */}
                  <path
                    d="M 0 105 Q 80 95 160 108 T 320 102 T 420 106 L 470 105 L 485 20 L 500 105 T 600 102 T 700 105"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {/* Highlight anomaly peak in Red */}
                  <path d="M 470 105 L 485 20 L 500 105" stroke="#ef4444" strokeWidth="4" fill="none" />
                  <circle cx="485" cy="20" r="4" fill="#ef4444" />
                  <text x="510" y="30" fill="#f87171" fontSize="12" fontWeight="bold">Deviation Detected (Anomaly)</text>
                </svg>
              </div>
            </div>
          )}

          {/* SLIDE 7: Operational Directives */}
          {currentSlideIndex === 6 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Complex anomaly scores translate into clear operational directives
                </h2>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-cyan-500 text-slate-950">Normal</span>
                    <span className="text-xs sm:text-sm text-slate-200">Machine behavior is within expected patterns.</span>
                  </div>
                  <span className="text-xs text-cyan-300 font-semibold">Action: Continue automated monitoring</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-amber-500 text-slate-950">Warning</span>
                    <span className="text-xs sm:text-sm text-slate-200">Abnormal behavior detected; failure not yet confirmed.</span>
                  </div>
                  <span className="text-xs text-amber-300 font-semibold">Action: Inspect trend and schedule planned maintenance</span>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-rose-500 text-white">Critical</span>
                    <span className="text-xs sm:text-sm text-slate-200">Strong, persistent anomaly indicating high risk of immediate failure.</span>
                  </div>
                  <span className="text-xs text-rose-300 font-bold">Trigger Alert: High Risk Detected Maintenance Required Immediately</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: Scalability Across Industries */}
          {currentSlideIndex === 7 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Highly scalable across continuous-production industrial environments
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">Target Industries</h4>
                  <ul className="text-xs text-slate-300 space-y-2 font-medium">
                    <li>• Auto</li>
                    <li>• Steel</li>
                    <li>• Textile</li>
                    <li>• Pharmaceutical</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2">Factory Machines</h4>
                  <p className="text-xs text-slate-400">Motors, Pumps, Compressors</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2">Production Lines</h4>
                  <p className="text-xs text-slate-400">Robotics, Conveyor Belts</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2">Power Systems</h4>
                  <p className="text-xs text-slate-400">Generators, Turbines</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 9: Reactive Repair vs Predictive Care */}
          {currentSlideIndex === 8 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  The financial and operational difference is fundamental
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3">
                  <h4 className="text-base font-bold text-rose-400 border-b border-rose-900/60 pb-2">Reactive Repair</h4>
                  <div><span className="font-bold text-slate-400 block">The Trigger:</span> Catastrophic mechanical failure. Production stops.</div>
                  <div><span className="font-bold text-slate-400 block">The Action:</span> Emergency troubleshooting and rushed repairs.</div>
                  <div><span className="font-bold text-slate-400 block">The Cost:</span> Massive unplanned expenses and ruined components.</div>
                  <div><span className="font-bold text-rose-300 block">The Outcome:</span> Unpredictable Downtime.</div>
                </div>

                <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/50 space-y-3">
                  <h4 className="text-base font-bold text-cyan-300 border-b border-cyan-900/60 pb-2">Predictive Care</h4>
                  <div><span className="font-bold text-slate-400 block">The Trigger:</span> Early anomaly detected in data. Production continues.</div>
                  <div><span className="font-bold text-slate-400 block">The Action:</span> Scheduled, precise inspection based on AI data.</div>
                  <div><span className="font-bold text-slate-400 block">The Cost:</span> Controlled, minimal maintenance budget.</div>
                  <div><span className="font-bold text-emerald-400 block">The Outcome:</span> Optimized Uptime and extended machine lifespan.</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 10: SaaS + IoT Subscription Model */}
          {currentSlideIndex === 9 && (
            <div className="max-w-4xl mx-auto my-auto w-full animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest font-black text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 mb-3 inline-block">
                  Business Model $ (Step-4)
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Delivered as a highly scalable SaaS + IoT subscription model
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <h4 className="font-bold text-white text-base">Starter</h4>
                  <p className="text-xs text-slate-400 mt-2">Baseline continuous monitoring.</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/60 text-center">
                  <h4 className="font-bold text-cyan-300 text-base">Professional</h4>
                  <p className="text-xs text-slate-300 mt-2">AI detection + risk engine alerts.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <h4 className="font-bold text-white text-base">Enterprise</h4>
                  <p className="text-xs text-slate-400 mt-2">Plant-wide deployment and integration.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-400 block text-base">Up to 90%</span>
                  <span className="text-slate-400">Reduction in sudden machine breakdowns</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400 block text-base">Saves Millions</span>
                  <span className="text-slate-400">In unplanned emergency maintenance costs</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-sky-400 block text-base">Extends</span>
                  <span className="text-slate-400">Machine lifespan and optimizes production</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 11: Final Vision */}
          {currentSlideIndex === 10 && (
            <div className="text-center max-w-3xl mx-auto my-auto animate-in fade-in duration-300">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Human teams cannot watch thousands of data points without fatigue. AI can.
              </h2>

              <div className="my-8 p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/40">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center mb-3">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="font-bold text-white text-lg block mb-2 font-mono">MachineMind Core</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  By combining the ubiquity of IoT sensors with the pattern-recognition power of MachineMind AI, we eliminate the blind spots on the factory floor. We achieve zero unplanned downtime. We achieve zero surprise losses.
                </p>
              </div>

              <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">
                "From Reactive Repair to Predictive Care."
              </span>
            </div>
          )}

        </div>

        {/* Slide Bottom Bar with Tag & Index */}
        <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">{currentSlide.tag}</span>
            <span>•</span>
            <span className="truncate max-w-[260px] sm:max-w-md">{currentSlide.title}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs">
            <span>{currentSlideIndex + 1} / {totalSlides}</span>
          </div>
        </div>

      </div>

      {/* Slide Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none">
        {PRESENTATION_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`shrink-0 w-28 sm:w-32 p-2.5 rounded-xl border text-left transition ${
              currentSlideIndex === idx
                ? 'bg-sky-50 dark:bg-cyan-950/60 border-sky-400 dark:border-cyan-500 text-sky-900 dark:text-white font-semibold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-mono block text-sky-600 dark:text-cyan-400 font-bold">
              Slide {slide.id}
            </span>
            <span className="text-[11px] block truncate mt-0.5">
              {slide.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
