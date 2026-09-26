import React from 'react';
import { 
  CheckCircle2, 
  Send, 
  Radio, 
  Download, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Cpu, 
  Building2, 
  Smartphone, 
  Mail, 
  Check, 
  Wrench,
  Clock,
  UserCheck,
  FileCheck
} from 'lucide-react';
import { OwnerWorkDoneNotification } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FactoryOwnerNotificationModalProps {
  notification: OwnerWorkDoneNotification | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FactoryOwnerNotificationModal: React.FC<FactoryOwnerNotificationModalProps> = ({
  notification,
  isOpen,
  onClose,
}) => {
  const { themeConfig } = useTheme();

  if (!isOpen || !notification) return null;

  const handleDownloadCertificate = () => {
    const certPayload = {
      documentType: 'AUTOMATED_POST_REPAIR_SENSOR_VERIFICATION_CERTIFICATE',
      notificationId: notification.id,
      timestamp: notification.timestamp,
      facility: notification.facility,
      machine: {
        id: notification.machineId,
        name: notification.machineName,
        tag: notification.machineTag,
      },
      servicingTechnician: {
        name: notification.technicianName,
        badge: notification.technicianBadge,
        workSummary: notification.repairSummary,
      },
      sensorTelemetryVerification: notification.sensorVerification,
      factoryOwnerRecipient: notification.recipientOwner,
      deliveryChannels: notification.channelsDispatched,
      verificationStatus: 'PASSED_ISO_10816_ZONE_A',
    };

    const blob = new Blob([JSON.stringify(certPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sensor-Work-Done-Notice-${notification.machineTag}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Automated Edge Sensor Telemetry Broadcast</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            Sensor Notified Factory Owner: Work Completed
          </h3>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Machine sensors performed a live 10-second acoustic & thermal verification cycle, confirmed normal baseline, and dispatched completion notifications to the factory owner.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Machine & Technician Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Serviced Asset</span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {notification.machineName} ({notification.machineTag})
              </span>
              <span className="text-[11px] text-slate-500">{notification.facility}</span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Serviced By</span>
              <span className="font-bold text-slate-800 flex items-center sm:justify-end gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{notification.technicianName}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">{notification.technicianBadge}</span>
            </div>
          </div>

          {/* Sensor Live Verification Grid */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Edge Sensor Acoustic & Health Audit</span>
              </span>
              <span className="text-[10px] font-bold font-mono bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-md">
                {notification.sensorVerification.sensorSerial}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Vibration (RMS)</span>
                <span className="text-sm font-extrabold text-emerald-700 font-mono mt-0.5 block">
                  {notification.sensorVerification.vibrationRMS}
                </span>
                <span className="text-[9px] font-bold text-emerald-600">Zone A (Excellent)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Temperature</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {notification.sensorVerification.temperatureC}
                </span>
                <span className="text-[9px] font-bold text-slate-500">Nominal Baseline</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Power</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {notification.sensorVerification.powerKW}
                </span>
                <span className="text-[9px] font-bold text-slate-500">Balanced Load</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800/90 leading-relaxed font-sans">
              ✓ <strong>Sensor Verdict:</strong> {notification.repairSummary}
            </p>
          </div>

          {/* Delivery Channels Dispatched to Factory Owner */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Multi-Channel Dispatch Receipts to Factory Owner
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* WhatsApp Notification */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>WhatsApp Alert</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Delivered to {notification.recipientOwner.phone}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Status: Delivered & Read
                  </div>
                </div>
              </div>

              {/* SMS Dispatch */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800 shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>SMS Emergency IoT</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Twilio Edge Gateway ID: #SMS-8841
                  </div>
                  <div className="text-[10px] text-sky-700 font-semibold mt-0.5">
                    Status: Sent to Factory Owner
                  </div>
                </div>
              </div>

              {/* Email Audit */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>Executive Email</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {notification.recipientOwner.email}
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                    Status: Delivered with Audit PDF
                  </div>
                </div>
              </div>

              {/* In-App Audit Trail */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-violet-100 text-violet-800 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>In-App Audit Log</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Logged at {notification.timestamp}
                  </div>
                  <div className="text-[10px] text-violet-700 font-semibold mt-0.5">
                    Status: Archived in CMMS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Factory Owner Verified · Production Line Operating Normally</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCertificate}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Notice (.json)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
