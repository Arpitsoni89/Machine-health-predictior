import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Calculator,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoiCalculatorView: React.FC = () => {
  // Calculator inputs
  const [machineCount, setMachineCount] = useState<number>(45);
  const [hourlyDowntimeCostINR, setHourlyDowntimeCostINR] = useState<number>(150000); // 1.5 Lakh/hr
  const [breakdownHoursPerYear, setBreakdownHoursPerYear] = useState<number>(120);

  // Calculations
  const currentAnnualLoss = hourlyDowntimeCostINR * breakdownHoursPerYear;
  const projectedSavingsRate = 0.88; // up to 90% reduction
  const annualSavingsINR = Math.round(currentAnnualLoss * projectedSavingsRate);
  const netUptimeGainHours = Math.round(breakdownHoursPerYear * projectedSavingsRate);

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleCelebrateRoi = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8">
      {/* Macro Problem Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-950 border border-rose-200 dark:border-rose-900/40 p-6 sm:p-8 shadow-xs overflow-hidden transition-colors">
        <div className="relative z-10 max-w-4xl">
          <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-2">
            The Macroeconomic Industrial Challenge
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Unplanned downtime results in massive financial hemorrhage
          </h2>

          <div className="my-6 p-6 rounded-2xl bg-white/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 shadow-xs flex flex-col md:flex-row items-baseline md:items-center justify-between gap-4">
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight font-mono tabular-nums">
                ₹12 Lakh Crore
              </span>
              <p className="text-slate-600 dark:text-rose-200 text-sm sm:text-base font-medium mt-2">
                Lost annually in Indian manufacturing industries due to reactive repair models.
              </p>
            </div>

            <div className="shrink-0 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">The Reactive Breakdown Cycle:</span>
              <span>Production halts · Emergency repairs needed · Revenue vanishes.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Plant ROI Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-cyan-950/60 text-sky-600 dark:text-cyan-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Plant-Specific Predictive Care ROI Calculator
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Estimate how early vibration and thermal preemption saves your plant millions in emergency downtime costs.
            </p>
          </div>

          <button
            onClick={handleCelebrateRoi}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-xs shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Plant Savings</span>
          </button>
        </div>

        {/* Sliders and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Monitored Critical Assets:</span>
                <span className="text-sky-600 dark:text-cyan-400 font-mono font-bold text-sm tabular-nums">{machineCount} Units</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={machineCount}
                onChange={(e) => setMachineCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Unplanned Downtime Hourly Cost:</span>
                <span className="text-sky-600 dark:text-cyan-400 font-mono font-bold text-sm tabular-nums">{formatINR(hourlyDowntimeCostINR)} / hr</span>
              </div>
              <input
                type="range"
                min="25000"
                max="1000000"
                step="25000"
                value={hourlyDowntimeCostINR}
                onChange={(e) => setHourlyDowntimeCostINR(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Includes idle manpower, damaged workpieces, and late shipment costs.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Historic Sudden Breakdown Hours per Year:</span>
                <span className="text-sky-600 dark:text-cyan-400 font-mono font-bold text-sm tabular-nums">{breakdownHoursPerYear} Hours/Year</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={breakdownHoursPerYear}
                onChange={(e) => setBreakdownHoursPerYear(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Current Annual Downtime Loss:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">{formatINR(currentAnnualLoss)} / yr</span>
              </div>

              <div className="mt-5 text-center sm:text-left">
                <span className="text-xs uppercase font-semibold text-sky-600 dark:text-cyan-400 tracking-wider">
                  Projected Net Annual Savings
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
                  {formatINR(annualSavingsINR)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Based on machine learning preemption of up to <span className="font-semibold text-emerald-600 dark:text-emerald-400">90%</span> of catastrophic breakdowns.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Uptime Recovered</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">+{netUptimeGainHours} hrs/yr</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Equipment Lifespan</span>
                  <span className="text-base font-bold text-sky-600 dark:text-cyan-400 font-mono">+25% to +40%</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Targeting 90% breakdown reduction</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Estimated Payback &lt; 90 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Matrix: Reactive Repair vs Predictive Care */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors">
        <div className="mb-6">
          <div className="text-xs text-sky-600 dark:text-cyan-400 font-semibold mb-1">
            Comparative Operational Matrix
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reactive Repair vs. Predictive Care
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contrasting reactive firefighting against machine-intelligent continuous care.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 uppercase tracking-wider font-semibold">Dimension</th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 rounded-t-xl">
                  Reactive Repair (Status Quo)
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-sky-700 dark:text-cyan-300 bg-sky-50/50 dark:bg-cyan-950/20 rounded-t-xl">
                  Predictive Care (MachineMind)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">The Trigger</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-rose-50/30 dark:bg-rose-950/10">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block">Catastrophic mechanical failure.</span>
                  Production stops completely.
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-sky-50/30 dark:bg-cyan-950/10">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Early anomaly detected in data.</span>
                  Production continues smoothly.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">The Action</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-rose-50/30 dark:bg-rose-950/10">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block">Emergency troubleshooting & rushed repairs.</span>
                  Maintenance teams called in at odd hours.
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-sky-50/30 dark:bg-cyan-950/10">
                  <span className="font-semibold text-sky-700 dark:text-cyan-300 block">Scheduled, precise inspection based on AI data.</span>
                  Planned during shift changeover or scheduled downtime.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">The Cost</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-rose-50/30 dark:bg-rose-950/10">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block">Massive unplanned expenses.</span>
                  Ruined components, secondary collateral mechanical damage.
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-sky-50/30 dark:bg-cyan-950/10">
                  <span className="font-semibold text-sky-700 dark:text-cyan-300 block">Controlled, minimal maintenance budget.</span>
                  Simple part swap (e.g. bearing lubrication/replacement).
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">The Outcome</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-rose-50/30 dark:bg-rose-950/10">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block">Unpredictable Downtime.</span>
                  Delayed customer shipments, factory losses.
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 bg-sky-50/30 dark:bg-cyan-950/10">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Optimized Uptime & Machine Life.</span>
                  High overall equipment effectiveness (OEE).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SaaS + IoT Subscription Model */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="text-xs text-sky-600 dark:text-cyan-400 font-semibold mb-1">
            Predictable SaaS + IoT Subscription
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Flexible Deployment Plans
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tailored for single manufacturing lines or multi-plant enterprise integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Starter</h4>
                <span className="text-xs text-slate-500 font-medium">Pilot Phase</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Ideal for single production cells and essential utility motors.
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Continuous monitoring on up to 10 machines</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>3-vital tracking (Heat, Vibration, Current)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Daily shift digest reports</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition">
              Explore Starter
            </button>
          </div>

          {/* Professional */}
          <div className="rounded-2xl bg-sky-50/60 dark:bg-cyan-950/30 border border-sky-300 dark:border-cyan-500/60 p-6 flex flex-col justify-between shadow-xs relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Professional</h4>
                <span className="text-xs text-sky-700 dark:text-cyan-300 font-semibold">Full AI Core</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Predictive intelligence and automatic alerts for main factory lines.
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-sky-200 dark:border-cyan-900/60 pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>AI detection and risk engine alerts</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>Real-time Isolation Forest scoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>SMS and email crew dispatching</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>Google Identity authentication for all engineers</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition shadow-xs">
              Deploy Professional
            </button>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Enterprise</h4>
                <span className="text-xs text-slate-500 font-medium">Multi-Plant</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Full-scale industrial deployment across multi-facility operations.
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Plant-wide deployment and ERP integration (SAP/Oracle)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom reliability AI models trained on your history</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Edge gateway hardware with on-premise failover</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition">
              Contact Enterprise
            </button>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-2xl font-bold text-sky-600 dark:text-cyan-400 font-mono block">Up to 90%</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">Reduction in sudden machine breakdowns</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono block">Saves Millions</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">In unplanned emergency maintenance costs</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono block">Extends Lifespan</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">Protects equipment investment and maximizes OEE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
