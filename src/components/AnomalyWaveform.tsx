import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface AnomalyWaveformProps {
  anomalyTriggered: boolean;
  onToggleAnomaly: () => void;
  machineName: string;
}

export const AnomalyWaveform: React.FC<AnomalyWaveformProps> = ({
  anomalyTriggered,
  onToggleAnomaly,
  machineName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [anomalyStats, setAnomalyStats] = useState({
    sigma: 1.1,
    anomalyConfidence: 12,
    model: 'LSTM Autoencoder + Isolation Forest v2.4',
  });

  const frameIdRef = useRef<number | null>(null);
  const timeOffsetRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 240);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 240;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (isRunning) {
        timeOffsetRef.current += 0.045;
      }

      const t = timeOffsetRef.current;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid Lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;

      // Horizontal grid
      const ySteps = 6;
      for (let i = 0; i <= ySteps; i++) {
        const y = (height / ySteps) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical grid
      const xSteps = 14;
      for (let i = 0; i <= xSteps; i++) {
        const x = (width / xSteps) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const centerY = height * 0.58;
      const baselineAmplitude = 24;

      // 2. Draw AI-Learned Baseline Upper & Lower Envelopes (Dashed White/Slate Lines)
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)'; // dashed light slate
      ctx.lineWidth = 1.5;

      // Upper baseline envelope
      ctx.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const xFrac = x / width;
        // subtle learned drift
        const envelope = 38 + Math.sin(xFrac * 4 + 1) * 8;
        const y = centerY - envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Lower baseline envelope
      ctx.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const xFrac = x / width;
        const envelope = 38 + Math.sin(xFrac * 4 + 1) * 8;
        const y = centerY + envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]); // reset line dash

      // 3. Draw Real-time Sensor Waveform (Teal normally, Spikes Red on Anomaly)
      const points: { x: number; y: number; isSpike: boolean }[] = [];
      const numPoints = Math.floor(width / 2);

      let peakAnomalyX = -1;
      let peakAnomalyY = -1;

      for (let i = 0; i < numPoints; i++) {
        const x = (i / numPoints) * width;
        const relX = x / width; // 0 to 1

        // Normal multi-frequency sine wave simulating motor vibration / current
        const baseNoise =
          Math.sin(relX * 22 + t * 4) * 12 +
          Math.sin(relX * 45 + t * 8) * 6 +
          Math.sin(relX * 12 + t * 2) * 5;

        let anomalyOffset = 0;
        let isSpike = false;

        if (anomalyTriggered) {
          // Sharp abnormal spike around the center 65%-75% of screen matching Slide 6
          const anomalyCenter = 0.68;
          const dist = Math.abs(relX - anomalyCenter);
          if (dist < 0.09) {
            // Gaussian bell spike shooting above upper baseline
            const spikeMag = Math.exp(-Math.pow(dist / 0.025, 2)) * 115;
            anomalyOffset = -spikeMag; // negative is upwards in canvas
            isSpike = true;

            if (relX >= 0.67 && relX <= 0.69) {
              peakAnomalyX = x;
              peakAnomalyY = centerY + anomalyOffset;
            }
          }
        }

        const y = centerY + baseNoise + anomalyOffset;
        points.push({ x, y, isSpike });
      }

      // Draw segments
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (p1.isSpike || p2.isSpike) {
          ctx.strokeStyle = '#ef4444'; // Red Anomaly
          ctx.lineWidth = 3;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = '#22d3ee'; // Cyan Normal
          ctx.lineWidth = 2;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 4;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0; // reset shadow

      // 4. Draw Callouts & Labels on Canvas
      // Baseline annotation
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText('AI-Learned Baseline (Expected Pattern)', width * 0.28, centerY - 52);

      // Small arrow pointing to baseline
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.27, centerY - 54);
      ctx.lineTo(width * 0.22, centerY - 40);
      ctx.stroke();

      // Anomaly callout if triggered
      if (anomalyTriggered && peakAnomalyX > 0) {
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 12px system-ui, sans-serif';
        const labelText = 'Deviation Detected (Anomaly)';
        const labelX = Math.min(width - 200, peakAnomalyX + 15);
        const labelY = Math.max(30, peakAnomalyY - 15);

        ctx.fillText(labelText, labelX, labelY);

        // Arrow pointing from label to peak
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(labelX - 4, labelY - 4);
        ctx.lineTo(peakAnomalyX, peakAnomalyY);
        ctx.stroke();

        // Pulsing glow ring on peak
        ctx.beginPath();
        ctx.arc(peakAnomalyX, peakAnomalyY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }

      frameIdRef.current = requestAnimationFrame(render);
    };

    frameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [isRunning, anomalyTriggered]);

  // Update stats based on anomaly trigger
  useEffect(() => {
    if (anomalyTriggered) {
      setAnomalyStats({
        sigma: 3.84,
        anomalyConfidence: 97.4,
        model: 'Isolation Forest + LSTM Autoencoder',
      });
    } else {
      setAnomalyStats({
        sigma: 0.82,
        anomalyConfidence: 4.2,
        model: 'Isolation Forest + LSTM Autoencoder',
      });
    }
  }, [anomalyTriggered]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden transition-colors">
      {/* Top Bar with Anomaly controls and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400 animate-ping" />
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              AI Continuous Anomaly Detection Waveform
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Streaming real-time telemetry for <span className="text-sky-600 dark:text-cyan-300 font-semibold">{machineName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Play */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isRunning ? 'Freeze' : 'Resume'}</span>
          </button>

          {/* Inject / Clear Anomaly Button */}
          <button
            onClick={onToggleAnomaly}
            className={`py-2 px-3.5 rounded-xl border text-xs font-semibold transition flex items-center gap-2 shadow-xs ${
              anomalyTriggered
                ? 'bg-rose-600 hover:bg-rose-500 border-rose-500 text-white shadow-rose-900/30 animate-pulse'
                : 'bg-sky-600 hover:bg-sky-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 border-sky-500 text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{anomalyTriggered ? 'Clear Anomaly Spike' : 'Test Anomaly Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[240px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Real-time Indicator Overlay Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] font-mono">
          <span className="text-slate-400">Deviation:</span>
          <span className={`font-bold ${anomalyTriggered ? 'text-rose-400 font-black' : 'text-cyan-400'}`}>
            {anomalyTriggered ? `+${anomalyStats.sigma}σ ABNORMAL` : `+${anomalyStats.sigma}σ NORMAL`}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Confidence:</span>
          <span className={`font-bold ${anomalyTriggered ? 'text-rose-400' : 'text-emerald-400'}`}>
            {anomalyStats.anomalyConfidence}%
          </span>
        </div>
      </div>

      {/* Technical Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 shrink-0" />
          <span>Self-learning baseline model compares live micro-patterns without human fatigue.</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-sky-600 dark:text-cyan-400/90 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Edge Telemetry: 1,000 Hz</span>
        </div>
      </div>
    </div>
  );
};
