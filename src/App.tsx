import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { FriendlyGuideModal } from './components/FriendlyGuideModal';
import { LiveTelemetryDashboard } from './components/LiveTelemetryDashboard';
import { MachineFleetView } from './components/MachineFleetView';
import { SenseThinkActView } from './components/SenseThinkActView';
import { RoiCalculatorView } from './components/RoiCalculatorView';
import { SubscriptionPlansView } from './components/SubscriptionPlansView';
import { HelpAndWarrantyView } from './components/HelpAndWarrantyView';
import { PitchDeckViewer } from './components/PitchDeckViewer';
import { AlertsSlideOver } from './components/AlertsSlideOver';
import { FactoryOwnerNotificationModal } from './components/FactoryOwnerNotificationModal';
import { INITIAL_MACHINES, INITIAL_ALERTS } from './data/mockMachines';
import { IndustrialMachine, MaintenanceAlert, NavTab, TechnicianInfo, OwnerWorkDoneNotification } from './types';
import { ShieldCheck, Sparkles, CreditCard, Radio } from 'lucide-react';
import { getRecommendedTechnician } from './data/mockTechnicians';

function MachineMindApp() {
  const { user, openLoginModal } = useAuth();
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('telemetry');
  const [machines, setMachines] = useState<IndustrialMachine[]>(INITIAL_MACHINES);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(INITIAL_MACHINES[0].id);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(INITIAL_ALERTS);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [latestOwnerNotification, setLatestOwnerNotification] = useState<OwnerWorkDoneNotification | null>(null);
  const [isOwnerNoticeModalOpen, setIsOwnerNoticeModalOpen] = useState(false);

  const handleAddAlert = (newAlert: MaintenanceAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    setMachines((prev) =>
      prev.map((m) =>
        m.id === newAlert.machineId
          ? {
              ...m,
              status: 'critical',
              healthScore: Math.min(m.healthScore, 35),
              predictedTimeToFailureHours: 12,
            }
          : m
      )
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAssignTechnician = (machineId: string, alertId?: string, technician?: TechnicianInfo) => {
    const machine = machines.find((m) => m.id === machineId);
    const tech = technician || getRecommendedTechnician(machine?.category || 'factory_machines');

    setMachines((prev) =>
      prev.map((m) =>
        m.id === machineId
          ? {
              ...m,
              assignedTechnician: tech,
            }
          : m
      )
    );

    setAlerts((prev) =>
      prev.map((a) =>
        a.machineId === machineId || (alertId && a.id === alertId)
          ? {
              ...a,
              acknowledged: true,
              assignedTo: tech.name,
              technician: tech,
            }
          : a
      )
    );
  };

  const handleMarkMachineRepaired = (machineId: string, repairNotes?: string) => {
    const targetMachine = machines.find((m) => m.id === machineId);
    let techName = 'Assigned Certified Technician';
    let techBadge = '#TECH-IND-4091';

    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          techName = m.assignedTechnician?.name || 'Vikram "Vik" Rathore';
          techBadge = m.assignedTechnician?.badgeId || '#TECH-IND-4091';
          return {
            ...m,
            status: 'normal',
            healthScore: 98,
            riskScore: 6,
            temperature: m.tempBaseline,
            vibration: m.vibBaseline,
            power: m.powerBaseline,
            predictedTimeToFailureHours: 720,
            lastMaintained: 'Just now (Repaired & Certified)',
            aiDiagnosticNote: `Repair verified by ${techName}. ${repairNotes || 'Vibration & thermal metrics returned to ISO 10816 Zone A normal.'} All mechanical components running smoothly.`,
            assignedTechnician: null,
          };
        }
        return m;
      })
    );

    setAlerts((prev) =>
      prev.map((a) =>
        a.machineId === machineId
          ? {
              ...a,
              acknowledged: true,
              isRepaired: true,
              repairedAt: 'Just now',
            }
          : a
      )
    );

    // Sensor automated post-repair acoustic verification & Factory Owner notification
    if (targetMachine) {
      const sensorNotice: OwnerWorkDoneNotification = {
        id: `notice-${Date.now()}`,
        machineId: targetMachine.id,
        machineName: targetMachine.name,
        machineTag: targetMachine.tag,
        facility: user?.facility || 'Alpha Plant Facility (Alwar)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        technicianName: techName,
        technicianBadge: techBadge,
        repairSummary: repairNotes || 'Mechanical repair verified. Edge vibration sensors executed a 10-second post-repair acoustic self-test: amplitude normalized to ISO 10816 Zone A baseline (1.80 mm/s RMS). Stator temp nominal at 45.0°C.',
        sensorVerification: {
          sensorSerial: targetMachine.category === 'power_systems' ? 'SENS-PWR-1108' : targetMachine.category === 'production_lines' ? 'SENS-HUB-0044' : 'SENS-ACC-9021',
          vibrationRMS: `${targetMachine.vibBaseline.toFixed(2)} mm/s RMS`,
          vibrationStatus: 'ISO 10816 Zone A (Excellent / Normal)',
          temperatureC: `${targetMachine.tempBaseline.toFixed(1)}°C`,
          powerKW: `${targetMachine.powerBaseline.toFixed(1)} kW`,
          acousticQuality: 'Harmonic spectral noise <0.12 mm/s. Zero bearing raceway defect frequencies detected.',
          isoZone: 'Zone A (Like-New Baseline)',
        },
        recipientOwner: {
          name: user?.name || 'Harshit (Factory Owner)',
          role: user?.role || 'Plant Owner & Managing Director',
          email: user?.email || 'harshit998ops@gmail.com',
          phone: '+91 98201 44102',
        },
        channelsDispatched: {
          whatsapp: true,
          sms: true,
          email: true,
          inApp: true,
        },
      };

      setLatestOwnerNotification(sensorNotice);
      setIsOwnerNoticeModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white transition-colors duration-200">
      {/* Friendly Demo Notice for Visitors */}
      {!user && (
        <div className="bg-white/85 backdrop-blur-xs border-b border-slate-200/90 px-4 py-2 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
          <span>👋 Previewing MachineMind in interactive demo mode.</span>
          <button
            onClick={openLoginModal}
            className={`font-semibold ${themeConfig.textClass} hover:underline`}
          >
            Sign in with Google to enable shift dispatches →
          </button>
        </div>
      )}

      {/* Sensor-to-Owner Work Done Notification Banner */}
      {latestOwnerNotification && (
        <div className="bg-emerald-950 text-white border-b border-emerald-800 px-4 py-2.5 shadow-md flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 max-w-4xl truncate">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <span className="font-semibold truncate">
              📡 <strong className="text-emerald-300">Sensor Notification to Factory Owner:</strong> Work completed on {latestOwnerNotification.machineName}. Vitals verified at {latestOwnerNotification.sensorVerification.vibrationRMS} (ISO Zone A Normal).
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              onClick={() => setIsOwnerNoticeModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-2xs cursor-pointer"
            >
              View Dispatch Notice
            </button>
            <button
              onClick={() => setLatestOwnerNotification(null)}
              className="text-emerald-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        machines={machines}
        selectedMachineId={selectedMachineId}
        onSelectMachine={(id) => setSelectedMachineId(id)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
        {activeTab === 'telemetry' && (
          <LiveTelemetryDashboard
            machines={machines}
            selectedMachineId={selectedMachineId}
            onSelectMachine={(id) => setSelectedMachineId(id)}
            onAddAlert={handleAddAlert}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onAssignTechnician={handleAssignTechnician}
            onMarkMachineRepaired={handleMarkMachineRepaired}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenFleet={() => setActiveTab('fleet')}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onOpenSubscription={() => setActiveTab('subscription')}
          />
        )}

        {activeTab === 'fleet' && (
          <MachineFleetView
            machines={machines}
            onSelectMachine={(id) => {
              setSelectedMachineId(id);
              setActiveTab('telemetry');
            }}
          />
        )}

        {activeTab === 'loop' && <SenseThinkActView />}

        {activeTab === 'roi' && <RoiCalculatorView />}

        {activeTab === 'subscription' && (
          <SubscriptionPlansView onNavigateToHelp={() => setActiveTab('help')} />
        )}

        {activeTab === 'help' && (
          <HelpAndWarrantyView
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenSubscription={() => setActiveTab('subscription')}
            machines={machines}
            onAssignTechnician={handleAssignTechnician}
          />
        )}

        {activeTab === 'pitch' && <PitchDeckViewer />}
      </main>

      {/* Slide-over Plant Alerts Drawer */}
      <AlertsSlideOver
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        machines={machines}
        onAcknowledge={handleAcknowledgeAlert}
        onSelectMachine={(id) => {
          setSelectedMachineId(id);
          setActiveTab('telemetry');
        }}
        onAssignTechnician={handleAssignTechnician}
        onMarkMachineRepaired={handleMarkMachineRepaired}
      />

      {/* Friendly Guide Walkthrough Modal */}
      <FriendlyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onExploreDemo={() => setActiveTab('telemetry')}
      />

      {/* Google Login / Account Switcher Modal */}
      <GoogleLoginModal />

      {/* Factory Owner Sensor Work-Done Notification Modal */}
      <FactoryOwnerNotificationModal
        notification={latestOwnerNotification}
        isOpen={isOwnerNoticeModalOpen}
        onClose={() => setIsOwnerNoticeModalOpen(false)}
      />

      {/* Friendly Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              MachineMind
            </span>
            <span aria-hidden="true">·</span>
            <span>Predictive industrial care before failure happens</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => setActiveTab('subscription')}
              className={`font-semibold flex items-center gap-1 ${themeConfig.textClass} hover:underline`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Subscription Plans</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Aryan Panwar · Arpit Soni · Mehul Saini (1st year B.Tech AI / DS)</span>
            <span aria-hidden="true">·</span>
            <span>MITRC, Alwar (Session 2026-27)</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Identity Verified</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MachineMindApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
