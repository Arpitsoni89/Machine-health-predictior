import React, { useState, useEffect } from 'react';
import { IndustrialMachine, MaintenanceAlert } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SymptomGauge } from './SymptomGauge';
import { AnomalyWaveform } from './AnomalyWaveform';
import { OperationalDirectives } from './OperationalDirectives';
import { HistoricalTrendChart } from './HistoricalTrendChart';
import { 
  Stethoscope, 
  Cpu, 
  Clock, 
  MapPin, 
  Wrench, 
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Bell,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveTelemetryDashboardProps {
  machines: IndustrialMachine[];
  selectedMachineId: string;
  onSelectMachine: (id: string) => void;
  onAddAlert: (alert: MaintenanceAlert) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  onOpenGuide?: () => void;
  onOpenFleet?: () => void;
  onOpenAlerts?: () => void;
  onOpenSubscription?: () => void;
}

export const LiveTelemetryDashboard: React.FC<LiveTelemetryDashboardProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  onAddAlert,
  onOpenGuide,
  onOpenFleet,
  onOpenAlerts,
  onOpenSubscription,
}) => {
  const { user } = useAuth();
  const { themeConfig } = useTheme();
  const currentMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];
  
  // Local dynamic metrics for live feel
  const [liveTemp, setLiveTemp] = useState(currentMachine.temperature);
  const [liveVib, setLiveVib] = useState(currentMachine.vibration);
  const [livePower, setLivePower] = useState(currentMachine.power);
  const [isAnomalyActive, setIsAnomalyActive] = useState(currentMachine.status === 'critical' || currentMachine.status === 'warning');
  const [dispatchNotification, setDispatchNotification] = useState<string | null>(null);

  // Sync when machine selection changes
  useEffect(() => {
    setLiveTemp(currentMachine.temperature);
    setLiveVib(currentMachine.vibration);
    setLivePower(currentMachine.power);
    setIsAnomalyActive(currentMachine.status !== 'normal');
  }, [selectedMachineId, currentMachine]);

  // Subtle real-time jitter to simulate live sensors streaming at 10Hz
  useEffect(() => {
    const interval = setInterval(() => {
      const jitterFactor = isAnomalyActive ? 1.4 : 0.4;
      setLiveTemp((prev) => {
        const delta = (Math.random() - 0.48) * jitterFactor;
        const target = isAnomalyActive ? currentMachine.tempThreshold * 1.05 : currentMachine.tempBaseline;
        return Number((prev * 0.95 + target * 0.05 + delta).toFixed(1));
      });

      setLiveVib((prev) => {
        const delta = (Math.random() - 0.48) * jitterFactor * 0.2;
        const target = isAnomalyActive ? currentMachine.vibThreshold * 1.1 : currentMachine.vibBaseline;
        return Number(Math.max(0.8, prev * 0.95 + target * 0.05 + delta).toFixed(2));
      });

      setLivePower((prev) => {
        const delta = (Math.random() - 0.48) * jitterFactor * 3.5;
        const target = isAnomalyActive ? currentMachine.powerThreshold * 1.08 : currentMachine.powerBaseline;
        return Number((prev * 0.95 + target * 0.05 + delta).toFixed(1));
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isAnomalyActive, currentMachine]);

  const handleToggleAnomaly = () => {
    if (!isAnomalyActive) {
      setIsAnomalyActive(true);
      setLiveTemp(Number((currentMachine.tempThreshold * 1.12).toFixed(1)));
      setLiveVib(Number((currentMachine.vibThreshold * 1.25).toFixed(2)));
      setLivePower(Number((currentMachine.powerThreshold * 1.15).toFixed(1)));

      const newAlert: MaintenanceAlert = {
        id: `alt-${Date.now()}`,
        machineId: currentMachine.id,
        machineName: currentMachine.name,
        category: currentMachine.category,
        severity: 'critical',
        metric: 'vibration',
        value: `${(currentMachine.vibThreshold * 1.25).toFixed(1)} mm/s RMS`,
        threshold: `${currentMachine.vibThreshold} mm/s`,
        message: `High Risk Detected: Injected Anomaly on ${currentMachine.name}. Immediate Maintenance Required!`,
        timestamp: 'Just now',
        acknowledged: false,
        recommendedAction: 'Inspect shaft misalignment, check bearings for spalling, and balance motor rotor.',
      };
      onAddAlert(newAlert);
      setDispatchNotification(`🚨 Alert triggered for ${currentMachine.name}: Maintenance crew notified via SMS & IoT Gateway.`);
      setTimeout(() => setDispatchNotification(null), 5000);
    } else {
      setIsAnomalyActive(false);
      setLiveTemp(currentMachine.tempBaseline);
      setLiveVib(currentMachine.vibBaseline);
      setLivePower(currentMachine.powerBaseline);
      setDispatchNotification(`✅ Anomaly cleared. Sensors stabilizing at baseline operating envelope.`);
      setTimeout(() => setDispatchNotification(null), 4000);
    }
  };

  const handleDispatchCrew = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: [themeConfig.dotColor, '#38bdf8', '#34d399', '#f59e0b'],
    });
    setDispatchNotification(`🚀 Priority Work Order Dispatched to On-Duty Maintenance Crew for ${currentMachine.name}!`);
    setTimeout(() => setDispatchNotification(null), 5000);
  };

  const currentStatus = isAnomalyActive
    ? (liveVib > currentMachine.vibThreshold || liveTemp > currentMachine.tempThreshold ? 'critical' : 'warning')
    : 'normal';

  const riskScore = currentStatus === 'critical' ? 92 : currentStatus === 'warning' ? 68 : 16;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Plant Engineer';
  const healthyCount = machines.filter(m => m.status === 'normal').length;

  return (
    <div className="space-y-6">
      {/* Friendly Welcome & Operational Summary Bar with bright accent */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl ${themeConfig.bgLightClass} border ${themeConfig.borderClass} ${themeConfig.textClass} flex items-center justify-center shrink-0 shadow-2xs`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Good day, {firstName}!</span>
              <span className="text-xs font-normal text-slate-500">· Shift Active</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              <span className="font-semibold text-slate-800">{healthyCount} of {machines.length} production assets</span> are running in optimal baseline envelope.
            </p>
          </div>
        </div>

        {/* Quick Actions Cluster */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenSubscription && (
            <button
              onClick={onOpenSubscription}
              className={`px-3 py-1.5 rounded-xl ${themeConfig.bgLightClass} hover:opacity-95 ${themeConfig.textClass} border ${themeConfig.borderClass} text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer`}
              title="Manage Machine Quota & Subscription"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Plant Pro (6/20 Quota)</span>
            </button>
          )}

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Tour</span>
            </button>
          )}

          {onOpenFleet && (
            <button
              onClick={onOpenFleet}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Fleet</span>
            </button>
          )}

          {onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-rose-500" />
              <span>Alerts</span>
            </button>
          )}
        </div>
      </div>

      {/* Machine Selector & Status Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
        <div>
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className={`font-mono font-semibold ${themeConfig.textClass}`}>{currentMachine.tag}</span>
            <span aria-hidden="true">·</span>
            <span>{currentMachine.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{currentMachine.industryLabel}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {currentMachine.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <div className="flex items-center gap-1.5">
              <MapPin className={`w-3.5 h-3.5 ${themeConfig.textClass}`} />
              <span>{currentMachine.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Maintained: {currentMachine.lastMaintained}</span>
            </div>
            {currentMachine.predictedTimeToFailureHours && isAnomalyActive && (
              <div className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Est. breakdown window: ~{currentMachine.predictedTimeToFailureHours} hours without care</span>
              </div>
            )}
          </div>
        </div>

        {/* Machine Quick Switcher Dropdown & Quick Anomaly Simulation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Machine Health Score Gauge Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Health:</span>
            <span className={`text-xs font-bold font-mono ${
              isAnomalyActive ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {isAnomalyActive ? '38%' : `${currentMachine.healthScore}%`}
            </span>
            <span className={`w-2 h-2 rounded-full ${
              isAnomalyActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
            }`} />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMachineId}
              onChange={(e) => onSelectMachine(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-hidden focus:border-sky-500 transition shadow-2xs"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tag}) — {m.status === 'normal' ? 'Smooth' : m.status === 'warning' ? 'Check Needed' : 'Immediate Care'}
                </option>
              ))}
            </select>

            {/* Header Anomaly Test Toggle */}
            <button
              onClick={handleToggleAnomaly}
              title={isAnomalyActive ? 'Clear simulated anomaly' : 'Inject test anomaly spike'}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer ${
                isAnomalyActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnomalyActive ? 'Restore Normal' : 'Simulate Anomaly'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {dispatchNotification && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-medium flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2.5">
            <Send className={`w-4 h-4 ${themeConfig.textClass} shrink-0`} />
            <span>{dispatchNotification}</span>
          </div>
          <button
            onClick={() => setDispatchNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-2 text-sm p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Friendly Physician Metaphor Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl ${themeConfig.bgLightClass} border ${themeConfig.borderClass} flex items-center justify-center ${themeConfig.textClass} shrink-0 shadow-2xs`}>
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              A dedicated physician for your industrial equipment
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Just like doctors track vital signs to treat illness before emergency surgery, MachineMind tracks vibration, heat, and power to stop catastrophic breakdowns.
            </p>
          </div>
        </div>

        <div className={`text-xs font-semibold ${themeConfig.textClass} shrink-0 flex items-center gap-1.5`}>
          <Sparkles className="w-4 h-4" />
          <span>Sensors · AI Models · Early Interventions</span>
        </div>
      </div>

      {/* 3 Symptom Dials */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Live Symptom Vitals
            </h3>
            <p className="text-xs text-slate-500">
              Continuous high-frequency telemetry tracking physical equipment vitals
            </p>
          </div>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sensors Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SymptomGauge
            type="temperature"
            value={liveTemp}
            baseline={currentMachine.tempBaseline}
            threshold={currentMachine.tempThreshold}
            unit="°C"
          />
          <SymptomGauge
            type="vibration"
            value={liveVib}
            baseline={currentMachine.vibBaseline}
            threshold={currentMachine.vibThreshold}
            unit="mm/s"
          />
          <SymptomGauge
            type="power"
            value={livePower}
            baseline={currentMachine.powerBaseline}
            threshold={currentMachine.powerThreshold}
            unit="kW"
          />
        </div>
      </div>

      {/* 24-Hour Historical Temperature and Vibration Trend Chart */}
      <HistoricalTrendChart
        machine={currentMachine}
        isAnomalyActive={isAnomalyActive}
        liveTemp={liveTemp}
        liveVib={liveVib}
      />

      {/* Live AI Anomaly Waveform Graph */}
      <AnomalyWaveform
        anomalyTriggered={isAnomalyActive}
        onToggleAnomaly={handleToggleAnomaly}
        machineName={currentMachine.name}
      />

      {/* Operational Directives */}
      <OperationalDirectives
        currentStatus={currentStatus}
        riskScore={riskScore}
        onTriggerInspection={() => {
          setDispatchNotification(`📅 Planned checkup scheduled for ${currentMachine.name} in next maintenance shift.`);
        }}
        onDispatchImmediate={handleDispatchCrew}
      />

      {/* AI Diagnostic Diagnostic Card & Work Order Action */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-2xl ${themeConfig.bgLightClass} border ${themeConfig.borderClass} ${themeConfig.textClass} shrink-0`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>AI Diagnostic Summary</span>
              <span className="text-[11px] font-mono text-slate-500">
                Confidence 98.4%
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {currentMachine.aiDiagnosticNote}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDispatchCrew}
            className={`px-4 py-2.5 ${themeConfig.primaryClass} ${themeConfig.primaryHoverClass} font-semibold text-xs rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer text-white`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Generate Work Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
