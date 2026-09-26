import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { IndustrialMachine } from '../types';
import { 
  TrendingUp, 
  Flame, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HistoricalTrendChartProps {
  machine: IndustrialMachine;
  isAnomalyActive?: boolean;
  liveTemp?: number;
  liveVib?: number;
}

export const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({
  machine,
  isAnomalyActive = false,
  liveTemp,
  liveVib,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [viewMetric, setViewMetric] = useState<'both' | 'temperature' | 'vibration'>('both');
  const [showThresholds, setShowThresholds] = useState(true);

  // Prepare 24-hour data points, patching the latest point with live values if provided
  const chartData = useMemo(() => {
    const rawHistory = [...machine.history];
    if (rawHistory.length === 0) return [];

    const data = rawHistory.map((item, index) => {
      const isLatest = index === rawHistory.length - 1;
      return {
        ...item,
        temperature: isLatest && liveTemp !== undefined ? liveTemp : item.temperature,
        vibration: isLatest && liveVib !== undefined ? liveVib : item.vibration,
        isAnomaly: isLatest ? (isAnomalyActive || item.isAnomaly) : item.isAnomaly,
      };
    });

    return data;
  }, [machine.history, liveTemp, liveVib, isAnomalyActive]);

  // Compute 24h summary statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return { maxTemp: 0, avgTemp: 0, maxVib: 0, avgVib: 0, anomalies: 0 };
    
    let sumTemp = 0;
    let maxTemp = -Infinity;
    let sumVib = 0;
    let maxVib = -Infinity;
    let anomalies = 0;

    chartData.forEach((d) => {
      sumTemp += d.temperature;
      if (d.temperature > maxTemp) maxTemp = d.temperature;
      sumVib += d.vibration;
      if (d.vibration > maxVib) maxVib = d.vibration;
      if (d.isAnomaly || d.temperature >= machine.tempThreshold || d.vibration >= machine.vibThreshold) {
        anomalies++;
      }
    });

    return {
      maxTemp: Number(maxTemp.toFixed(1)),
      avgTemp: Number((sumTemp / chartData.length).toFixed(1)),
      maxVib: Number(maxVib.toFixed(2)),
      avgVib: Number((sumVib / chartData.length).toFixed(2)),
      anomalies,
    };
  }, [chartData, machine.tempThreshold, machine.vibThreshold]);

  // Friendly Adaptive Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isExceedingTemp = dataPoint.temperature >= machine.tempThreshold;
      const isExceedingVib = dataPoint.vibration >= machine.vibThreshold;

      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-2 font-sans min-w-[210px] z-50">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <span className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-500 dark:text-cyan-400" />
              {label}
            </span>
            {dataPoint.isAnomaly ? (
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                Deviation
              </span>
            ) : (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Nominal
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-orange-300 font-medium">
                <Flame className="w-3.5 h-3.5" />
                Temperature:
              </span>
              <span className={`font-mono font-bold ${isExceedingTemp ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-900 dark:text-white'}`}>
                {dataPoint.temperature}°C
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-cyan-300 font-medium">
                <Activity className="w-3.5 h-3.5" />
                Vibration RMS:
              </span>
              <span className={`font-mono font-bold ${isExceedingVib ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-900 dark:text-white'}`}>
                {dataPoint.vibration} mm/s
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Risk Score:</span>
              <span className={`font-mono font-bold ${dataPoint.riskScore > 65 ? 'text-rose-600 dark:text-rose-400' : 'text-sky-600 dark:text-cyan-400'}`}>
                {dataPoint.riskScore}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-cyan-950/60 text-sky-600 dark:text-cyan-400 border border-sky-200 dark:border-cyan-800/60">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              24-Hour Telemetry Historical Trend
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking heat accumulation and vibration patterns over the last 24 hours for <span className="text-sky-600 dark:text-cyan-300 font-medium">{machine.name}</span>.
          </p>
        </div>

        {/* View Switches */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMetric('both')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMetric === 'both'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dual Trend
            </button>
            <button
              onClick={() => setViewMetric('temperature')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                viewMetric === 'temperature'
                  ? 'bg-orange-500 text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-orange-600'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Temp (°C)</span>
            </button>
            <button
              onClick={() => setViewMetric('vibration')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                viewMetric === 'vibration'
                  ? 'bg-sky-500 text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-sky-600'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Vib (mm/s)</span>
            </button>
          </div>

          {/* Threshold Toggle */}
          <button
            onClick={() => setShowThresholds(!showThresholds)}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
              showThresholds
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sky-700 dark:text-cyan-300 font-semibold'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Thresholds</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Peak Temp (24h)</span>
            <span className="text-base font-bold font-mono text-orange-600 dark:text-orange-400 tabular-nums">{stats.maxTemp}°C</span>
          </div>
          <Flame className="w-4 h-4 text-orange-500/60" />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Avg Temp (24h)</span>
            <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums">{stats.avgTemp}°C</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Base: {machine.tempBaseline}°C</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Peak Vibration</span>
            <span className="text-base font-bold font-mono text-sky-600 dark:text-cyan-400 tabular-nums">{stats.maxVib} mm/s</span>
          </div>
          <Activity className="w-4 h-4 text-sky-500/60" />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Anomalies Detected</span>
            <span className={`text-base font-bold font-mono tabular-nums ${stats.anomalies > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {stats.anomalies} Events
            </span>
          </div>
          {stats.anomalies > 0 ? (
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="w-full h-72 sm:h-80 bg-slate-50/50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-2 sm:p-3 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="tempGradientFriendly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="vibGradientFriendly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              stroke={isDark ? '#1e293b' : '#e2e8f0'} 
              strokeDasharray="3 3" 
              vertical={false} 
            />

            <XAxis
              dataKey="timestamp"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
            />

            {(viewMetric === 'both' || viewMetric === 'temperature') && (
              <YAxis
                yAxisId="left"
                stroke="#f97316"
                fontSize={11}
                domain={['auto', 'auto']}
                unit="°C"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                width={45}
              />
            )}

            {(viewMetric === 'both' || viewMetric === 'vibration') && (
              <YAxis
                yAxisId="right"
                orientation={viewMetric === 'vibration' ? 'left' : 'right'}
                stroke="#0ea5e9"
                fontSize={11}
                domain={[0, (dataMax: number) => Math.ceil(Math.max(dataMax, machine.vibThreshold * 1.25))]}
                unit=" mm/s"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                width={48}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={32}
              formatter={(value) => (
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium px-1">
                  {value}
                </span>
              )}
            />

            {showThresholds && (viewMetric === 'both' || viewMetric === 'temperature') && (
              <ReferenceLine
                yAxisId="left"
                y={machine.tempThreshold}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Limit (${machine.tempThreshold}°C)`,
                  fill: '#ef4444',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
            )}

            {showThresholds && (viewMetric === 'both' || viewMetric === 'vibration') && (
              <ReferenceLine
                yAxisId={viewMetric === 'vibration' ? 'left' : 'right'}
                y={machine.vibThreshold}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Limit (${machine.vibThreshold} mm/s)`,
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {(viewMetric === 'both' || viewMetric === 'temperature') && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#tempGradientFriendly)"
                dot={false}
                activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              />
            )}

            {(viewMetric === 'both' || viewMetric === 'vibration') && (
              <Line
                yAxisId={viewMetric === 'vibration' ? 'left' : 'right'}
                type="monotone"
                dataKey="vibration"
                name="Vibration (mm/s)"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Interpretation Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 shrink-0" />
          <span>
            Vibration spikes naturally appear before temperature rises, giving your maintenance crew time to plan.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <span>Heat Baseline: {machine.tempBaseline}°C</span>
          <span>·</span>
          <span>Vib Baseline: {machine.vibBaseline} mm/s</span>
        </div>
      </div>
    </div>
  );
};
