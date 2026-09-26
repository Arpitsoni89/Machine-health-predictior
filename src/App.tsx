import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { FriendlyGuideModal } from './components/FriendlyGuideModal';
import { LiveTelemetryDashboard } from './components/LiveTelemetryDashboard';
import { MachineFleetView } from './components/MachineFleetView';
import { SenseThinkActView } from './components/SenseThinkActView';
import { RoiCalculatorView } from './components/RoiCalculatorView';
import { PitchDeckViewer } from './components/PitchDeckViewer';
import { AlertsSlideOver } from './components/AlertsSlideOver';
import { INITIAL_MACHINES, INITIAL_ALERTS } from './data/mockMachines';
import { IndustrialMachine, MaintenanceAlert } from './types';
import { ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';

function MachineMindApp() {
  const { user, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'fleet' | 'loop' | 'roi' | 'pitch'>('telemetry');
  const [machines, setMachines] = useState<IndustrialMachine[]>(INITIAL_MACHINES);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(INITIAL_MACHINES[0].id);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(INITIAL_ALERTS);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white transition-colors duration-200">
      {/* Friendly Demo Notice for Visitors */}
      {!user && (
        <div className="bg-sky-50 dark:bg-slate-900 border-b border-sky-100 dark:border-slate-800 px-4 py-2 text-center text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
          <span>👋 Previewing MachineMind in interactive demo mode.</span>
          <button
            onClick={openLoginModal}
            className="font-semibold text-sky-600 dark:text-cyan-400 hover:underline"
          >
            Sign in with Google to enable shift dispatches →
          </button>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'telemetry' && (
          <LiveTelemetryDashboard
            machines={machines}
            selectedMachineId={selectedMachineId}
            onSelectMachine={(id) => setSelectedMachineId(id)}
            onAddAlert={handleAddAlert}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenFleet={() => setActiveTab('fleet')}
            onOpenAlerts={() => setIsAlertsOpen(true)}
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

        {activeTab === 'pitch' && <PitchDeckViewer />}
      </main>

      {/* Slide-over Plant Alerts Drawer */}
      <AlertsSlideOver
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onAcknowledge={handleAcknowledgeAlert}
        onSelectMachine={(id) => {
          setSelectedMachineId(id);
          setActiveTab('telemetry');
        }}
      />

      {/* Friendly Guide Walkthrough Modal */}
      <FriendlyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onExploreDemo={() => setActiveTab('telemetry')}
      />

      {/* Google Login / Account Switcher Modal */}
      <GoogleLoginModal />

      {/* Friendly Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              MachineMind
            </span>
            <span aria-hidden="true">·</span>
            <span>Predictive industrial care before failure happens</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span>Aryan Panwar (1st year B.Tech AI / DS)</span>
            <span aria-hidden="true">·</span>
            <span>MITRC, Alwar (Session 2026-27)</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Identity Verified</span>
            </div>
          </div>
        </div>
      </footer>
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
