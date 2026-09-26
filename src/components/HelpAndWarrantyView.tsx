import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Download, 
  Wrench, 
  Clock, 
  Cpu, 
  Flame, 
  Activity, 
  Truck, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  X,
  MessageSquare,
  BookOpen,
  Check,
  Building2,
  ShieldAlert,
  Info,
  Phone,
  PhoneCall,
  Radio,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SENSOR_WARRANTIES } from '../data/mockSensors';
import { SensorWarrantyItem, IndustrialMachine, TechnicianInfo } from '../types';
import { CallTechnicianSection } from './CallTechnicianSection';
import { CallTechnicianModal } from './CallTechnicianModal';
import { MOCK_TECHNICIANS } from '../data/mockTechnicians';

interface HelpAndWarrantyViewProps {
  onOpenGuide: () => void;
  onOpenSubscription?: () => void;
  machines?: IndustrialMachine[];
  onAssignTechnician?: (machineId: string, alertId?: string, technician?: TechnicianInfo) => void;
}

interface AssistantMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  actionLinks?: { label: string; action: () => void }[];
}

const FAQ_KNOWLEDGE_BASE: Record<string, string> = {
  warranty: `**MachineMind Industrial Sensor Hardware Warranty Overview:**
• **Starter Pilot**: Includes 1-Year standard hardware replacement warranty covering piezoelectric crystal degradation, thermal RTD drift, and daily automated edge self-tests.
• **Plant Pro**: Includes 3-Year extended hardware warranty with **Instant Overnight Hot-Swap Dispatch**. Covers IP67 coolant/oil immersion, thermal shock up to 350°C, and severe mechanical vibration fatigue (<50g shock).
• **Enterprise Fleet**: Includes **Lifetime Unlimited Hardware Replacements** with zero deductibles, plus annual on-site ISO 17025 precision recalibration and certification.

*Need to file a claim?* Use the Sensor Warranty Lookup tab to find your sensor's serial ID and click **Claim Warranty Replacement** to generate an instant RMA slip.`,

  claim: `**How to Claim a Replacement Sensor (RMA Procedure):**
1. Navigate to the **Sensor Hardware Warranty** tab.
2. Select your sensor from the list or type its serial number (e.g., SENS-ACC-9021).
3. Click the **Claim Warranty Replacement (RMA)** button.
4. Select the failure symptom (Thermal drift, cable fatigue, or physical shock).
5. A prepaid overnight hot-swap shipment will be queued with tracking details and an RMA authorization slip.
6. The damaged sensor can be placed into the provided return mailer with zero freight cost.`,

  mounting: `**Triaxial Accelerometer Mounting & Installation Standard (ISO 13373):**
1. **Location**: Mount the sensor as close to the load zone of the bearing housing as possible, directly on solid structural metal.
2. **Surface Prep**: Clean the mounting spot down to bare metal (flatness within 0.025 mm, surface finish Ra < 1.6 μm).
3. **Attachment**: Use 1/4-28 or M6 threaded studs with a torque wrench set to **3.5–4.0 Nm**.
4. **Coupling**: Apply a thin layer of high-temperature silicone grease or mounting wax to optimize acoustic transfer above 5 kHz.
5. **Cabling**: Secure the braided cable within 75 mm of the sensor to prevent cable strain noise.`,

  iso: `**ISO 10816-3 Vibration Severity Guidelines (mm/s RMS):**
• **Zone A (<1.8 mm/s)**: Brand new or recently overhauled machines. Perfect balance and alignment.
• **Zone B (1.8 – 4.5 mm/s)**: Safe for long-term continuous operation without restriction.
• **Zone C (4.5 – 7.1 mm/s)**: Unsatisfactory. Permissible for limited period until planned maintenance shutdown. Check harmonic vibration for bearing raceway defects.
• **Zone D (>7.1 mm/s)**: Critical danger of machine damage. Immediate trip or load reduction required to prevent spindle seizure.`,

  cavitation: `**Resolving Hydraulic Pump Cavitation Warnings:**
1. **Verify Inlet Pressure**: Ensure suction head pressure is at least 0.5 bar above fluid vapor pressure.
2. **Inspect Suction Strainer**: Check for partial blockage or sludge accumulation causing net positive suction head (NPSH) deficiency.
3. **Fluid Temperature**: Check if hydraulic oil temperature exceeds 65°C, reducing viscosity and vaporizing dissolved air.
4. **Bypass Circuit**: If vibration exceeds 6.0 mm/s, engage the automated bypass circuit and check for aeration bubbles in the sight glass.`,

  sampling: `**Sub-Second Edge Telemetry & Offline Buffering:**
• The MachineMind Edge Gateway samples accelerometers at 10 kHz and streams processed RMS and peak FFT metrics at 10 Hz over encrypted WebSocket.
• In the event of plant Wi-Fi or Ethernet interruption, the local edge hub buffers up to **72 hours of full-fidelity telemetry** on local solid-state flash memory.
• Once connectivity is restored, buffered telemetry automatically re-synchronizes with the cloud platform without losing a single micro-second of anomaly history.`,
};

export const HelpAndWarrantyView: React.FC<HelpAndWarrantyViewProps> = ({
  onOpenGuide,
  onOpenSubscription,
  machines = [],
  onAssignTechnician,
}) => {
  const { themeConfig } = useTheme();

  const [activeTab, setActiveTab] = useState<'warranty' | 'technician' | 'assistant'>('warranty');
  const [sensors, setSensors] = useState<SensorWarrantyItem[]>(INITIAL_SENSOR_WARRANTIES);
  const [selectedSensorId, setSelectedSensorId] = useState<string>(INITIAL_SENSOR_WARRANTIES[0].id);
  const [searchSensorQuery, setSearchSensorQuery] = useState('');
  const [callingTech, setCallingTech] = useState<TechnicianInfo | null>(null);
  
  // Claim modal state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimReason, setClaimReason] = useState('Signal cable wear or fatigue');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimToast, setClaimToast] = useState<string | null>(null);

  // Assistant Chat State
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `👋 **Welcome to MachineMind Industrial Support & Reliability Assistant!**

I am your 24/7 technical copilot for factory maintenance, sensor warranty claims, and ISO condition monitoring.

**What would you like assistance with today?**
• Check warranty terms or request a hot-swap replacement sensor
• Review ISO 10816-3 vibration limits & severity standards
• Sensor mounting torque & placement guidelines
• Troubleshooting active anomaly alarms (bearing, thermal, cavitation)`,
      timestamp: 'Just now',
    },
  ]);

  const selectedSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  const filteredSensors = sensors.filter((s) => {
    if (!searchSensorQuery.trim()) return true;
    const q = searchSensorQuery.toLowerCase();
    return (
      s.serialNumber.toLowerCase().includes(q) ||
      s.model.toLowerCase().includes(q) ||
      s.machineName.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q)
    );
  });

  const handleAskQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Formulate response
    const qLower = questionText.toLowerCase();
    let replyText = '';

    if (qLower.includes('call') || qLower.includes('technician') || qLower.includes('phone') || qLower.includes('speak') || qLower.includes('mechanic')) {
      replyText = `**Direct Certified Technician Calling & Dispatch Available:**
You can call our on-duty reliability specialists immediately:
• **Vikram "Vik" Rathore** (#TECH-IND-4091): Vibration & Mechanical Lead (Phone: +91 98201 44102 · UHF Ch 4)
• **Pooja Sharma** (#TECH-IND-3208): Electrical Drives & VFD Specialist (Phone: +91 97110 33819 · UHF Ch 2)
• **Arjun Deshmukh** (#TECH-IND-5114): Fluid Power & Hydraulics (Phone: +91 94520 88231 · UHF Ch 6)

👉 Switch to the **"Call a Technician"** tab above to launch an instant encrypted voice call or dispatch a specialist directly to any machine bay!`;
    } else if (qLower.includes('warranty') || qLower.includes('guarantee') || qLower.includes('coverage') || qLower.includes('3-year') || qLower.includes('lifetime')) {
      replyText = FAQ_KNOWLEDGE_BASE.warranty;
    } else if (qLower.includes('claim') || qLower.includes('replace') || qLower.includes('broken') || qLower.includes('rma') || qLower.includes('hot-swap')) {
      replyText = FAQ_KNOWLEDGE_BASE.claim;
    } else if (qLower.includes('mount') || qLower.includes('install') || qLower.includes('torque') || qLower.includes('accelerometer') || qLower.includes('stud')) {
      replyText = FAQ_KNOWLEDGE_BASE.mounting;
    } else if (qLower.includes('iso') || qLower.includes('10816') || qLower.includes('severity') || qLower.includes('velocity') || qLower.includes('threshold') || qLower.includes('limit')) {
      replyText = FAQ_KNOWLEDGE_BASE.iso;
    } else if (qLower.includes('cavitation') || qLower.includes('pump') || qLower.includes('hydraulic') || qLower.includes('impeller')) {
      replyText = FAQ_KNOWLEDGE_BASE.cavitation;
    } else if (qLower.includes('sampling') || qLower.includes('offline') || qLower.includes('internet') || qLower.includes('buffer') || qLower.includes('edge')) {
      replyText = FAQ_KNOWLEDGE_BASE.sampling;
    } else {
      replyText = `**Technical Diagnostic Summary:**
Regarding your inquiry: *"I understand you are evaluating machine conditions or sensor parameters."*

**Recommended Plant Action Protocol:**
1. **Verify Baseline**: Confirm whether telemetry is running in Zone A/B (<4.5 mm/s RMS) under standard motor load.
2. **Sensor Inspection**: Check accelerometer mounting torque (4.0 Nm) and verify lead wire shield continuity.
3. **Warranty Replacement**: If sensor reading shows abnormal clipping or non-physical harmonic spikes, file an **Advance Replacement Claim** via the Warranty tab.
4. **Maintenance Guidance**: Cross-reference the machine's 24-hour FFT spectrum against bearing ball pass frequency (BPFO/BPFI).

For specific guidelines, you can also ask: *"What does the 3-Year Sensor Warranty cover?"* or *"How to mount accelerometers?"*`;
    }

    setTimeout(() => {
      const assistantMsg: AssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  };

  const handleDispatchClaim = () => {
    const rmaCode = `RMA-${new Date().getFullYear()}-SENS-${Math.floor(1000 + Math.random() * 9000)}`;

    setSensors((prev) =>
      prev.map((s) =>
        s.id === selectedSensor.id
          ? {
              ...s,
              replacementCount: s.replacementCount + 1,
              status: 'active',
            }
          : s
      )
    );

    setIsClaimModalOpen(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setClaimToast(`🚀 Advance Replacement RMA (${rmaCode}) approved! Courier dispatched to ${selectedSensor.machineName} bay with priority tracking.`);
    setTimeout(() => setClaimToast(null), 8000);
  };

  const handleDownloadCalibrationCert = () => {
    const now = new Date();
    const certPayload = {
      certificateTitle: 'CERTIFICATE OF CALIBRATION & SENSOR ACCREDITATION',
      certificateNumber: `CAL-ISO17025-${selectedSensor.serialNumber}`,
      issuedDate: now.toISOString(),
      standardsTraceability: 'NIST & ISO 17025 Certified Reference Standard Accelerometer Calibration',
      sensorDetails: {
        model: selectedSensor.model,
        serialNumber: selectedSensor.serialNumber,
        transducerType: selectedSensor.type,
        assignedMachine: selectedSensor.machineName,
        assignedMachineId: selectedSensor.machineId,
      },
      warrantyTerms: {
        tier: selectedSensor.warrantyTier,
        validUntil: selectedSensor.warrantyExpiryDate,
        guaranteeStatus: selectedSensor.status === 'active' ? 'FULLY_COVERED' : 'CALIBRATION_REQUIRED',
      },
      calibrationParameters: {
        referenceFrequency: '159.2 Hz (1000 rad/sec)',
        referenceAcceleration: '10.0 m/s² RMS (1.02 g)',
        sensitivityOutput: '100.2 mV/g (Deviation +0.2%)',
        frequencyResponse: '0.5 Hz to 12,000 Hz (+/- 3dB)',
        transverseSensitivity: '< 3.2%',
        operatingTemperatureLimit: '-50°C to +150°C',
        calibrationTechnician: 'Dr. Vikramaditya K. (Senior Metrology Specialist)',
        labAccreditationNumber: 'MET-NABL-9821-ISO17025',
      },
    };

    const blob = new Blob([JSON.stringify(certPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Calibration-Certificate-${selectedSensor.serialNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setClaimToast(`📄 Calibration Certificate for ${selectedSensor.serialNumber} downloaded!`);
    setTimeout(() => setClaimToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {claimToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">{claimToast}</div>
          <button 
            onClick={() => setClaimToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className={`text-xs font-semibold mb-1 ${themeConfig.textClass}`}>
              Industrial Reliability & Hardware Protection
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Sensor Warranty Center & AI Support Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Inspect active hardware warranties for vibration and thermal sensors, request overnight hot-swap replacements, and get instant technical troubleshooting from our reliability copilot.
            </p>
          </div>

          {/* Section Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'warranty'
                  ? `bg-white ${themeConfig.textClass} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sensor Warranty</span>
            </button>
            <button
              onClick={() => setActiveTab('technician')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'technician'
                  ? `bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-300`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Call a Technician</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'assistant'
                  ? `bg-white ${themeConfig.textClass} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Help Assistant</span>
            </button>
          </div>
        </div>

        {/* 3 Warranty Tiers Overview Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Standard 1-Year (Starter)</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full crystal replacement for signal drift + automated daily edge self-test ping.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">3-Year Hot-Swap (Plant Pro)</div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Overnight courier dispatch for damaged probes, IP67 ingress & thermal shock protection.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">Lifetime Unlimited (Enterprise)</div>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                Zero-cost lifetime replacements + annual on-site ISO 17025 precision calibration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'warranty' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sensor Inventory & Search */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Installed Plant Sensors</h3>
                <p className="text-xs text-slate-500">Pick any transducer to inspect warranty</p>
              </div>
              <span className="text-[11px] font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                {filteredSensors.length} Monitored
              </span>
            </div>

            {/* Quick Search Sensor Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search serial (e.g. SENS-ACC-9021)..."
                value={searchSensorQuery}
                onChange={(e) => setSearchSensorQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            {/* Sensor List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredSensors.map((sensor) => {
                const isSelected = sensor.id === selectedSensor.id;
                return (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensorId(sensor.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? `${themeConfig.bgLightClass} ${themeConfig.borderClass} shadow-2xs`
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className={`font-bold ${isSelected ? themeConfig.textClass : 'text-slate-900'}`}>
                          {sensor.serialNumber}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 text-[10px]">{sensor.type}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                        {sensor.model}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{sensor.machineName}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sensor.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sensor.status === 'active' ? 'Active & Covered' : 'Calibration Due'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono">
                        Exp: {sensor.warrantyExpiryDate}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Sensor Warranty Details & Actions */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                    {selectedSensor.serialNumber}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {selectedSensor.warrantyTier}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedSensor.model}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mounted on: <strong className="text-slate-700">{selectedSensor.machineName}</strong> ({selectedSensor.machineId})
                </p>
              </div>

              {/* Warranty Status Pill */}
              <div className="flex items-center gap-2">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[130px]">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Warranty Status
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                    Covered 100%
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Installed</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">{selectedSensor.installationDate}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Warranty Expiry</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">{selectedSensor.warrantyExpiryDate}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Calibrated</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">{selectedSensor.lastCalibrated}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hot-Swaps Used</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">{selectedSensor.replacementCount} of Unlimited</span>
              </div>
            </div>

            {/* Coverage Terms Checklist */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Guaranteed Hardware Protection Scope</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSensor.coverageTerms.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Claim Replacement & Download Calibration Certificate */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Sensor Anomaly or Signal Drift?
                </div>
                <div className="text-[11px] text-slate-500">
                  Advance replacement dispatched overnight with prepaid return label.
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDownloadCalibrationCert}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Download ISO 17025 Calibration Certificate"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Calibration Cert</span>
                </button>

                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${themeConfig.primaryClass} ${themeConfig.primaryHoverClass} text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Claim Warranty (RMA)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'technician' ? (
        <CallTechnicianSection
          machines={machines}
          onDispatchToBay={(tech, bayNotes) => {
            if (onAssignTechnician && machines.length > 0) {
              onAssignTechnician(machines[0].id, undefined, tech);
            }
          }}
        />
      ) : (
        /* Help Assistant Chat & FAQ View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Troubleshooting FAQs */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Quick Diagnostic Topics</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any topic to ask the assistant</p>
            </div>

            <div className="space-y-1.5">
              {[
                { title: '📞 How to call on-duty plant technician', q: 'How do I call a certified plant technician right now?' },
                { title: 'What is covered under the 3-Year Sensor Warranty?', q: 'What is covered under the 3-Year Sensor Warranty?' },
                { title: 'How do I claim a replacement for a broken sensor?', q: 'How do I claim a replacement sensor via RMA?' },
                { title: 'Vibration sensor mounting & torque specs', q: 'What is the correct mounting torque for vibration accelerometers?' },
                { title: 'ISO 10816-3 severity vibration thresholds', q: 'What are the ISO 10816-3 vibration severity limits?' },
                { title: 'Resolving pump cavitation & impeller alarms', q: 'How do I resolve a cavitation warning on hydraulic pumps?' },
                { title: 'Edge telemetry sampling & offline buffering', q: 'How does edge sampling work during internet downtime?' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(item.q)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 transition text-left text-xs font-semibold text-slate-800 hover:text-sky-900 flex items-center justify-between cursor-pointer group"
                >
                  <span>{item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Wrench className="w-3.5 h-3.5 text-amber-700" />
                <span>On-Call Vibration Engineering</span>
              </div>
              <p className="text-[11px] text-amber-800/85 leading-relaxed">
                Need urgent on-site bearing analysis? Pro & Enterprise plant accounts include emergency technician dispatch within 2 hours.
              </p>
              <button
                onClick={() => setActiveTab('technician')}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Plant Floor Technician</span>
              </button>
            </div>
          </div>

          {/* Interactive Chat Console */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col h-[580px] overflow-hidden">
            {/* Assistant Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${themeConfig.primaryClass} flex items-center justify-center text-white shadow-2xs`}>
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>MachineMind Industrial Copilot</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-slate-500">ISO 10816 & 13374 Condition Monitoring Knowledge Base</span>
                </div>
              </div>

              <button
                onClick={() => setMessages([messages[0]])}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Clear History
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                      isAssistant 
                        ? `${themeConfig.bgLightClass} ${themeConfig.textClass} font-bold` 
                        : 'bg-slate-900 text-white font-bold'
                    }`}>
                      {isAssistant ? 'AI' : 'You'}
                    </div>

                    <div className={`p-4 rounded-3xl max-w-xl text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                        : `${themeConfig.primaryClass} text-white shadow-xs`
                    }`}>
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>
                      <div className={`text-[10px] mt-2 font-mono ${isAssistant ? 'text-slate-400' : 'text-white/80'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion(inputQuery);
              }}
              className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white"
            >
              <input
                type="text"
                placeholder="Ask about vibration limits, bearing damage, sensor torque, or warranty terms..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  inputQuery.trim()
                    ? `${themeConfig.primaryClass} hover:opacity-90`
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Claim RMA Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Advance Warranty Replacement (RMA)</h3>
                  <p className="text-[11px] text-slate-500">Overnight Hot-Swap Dispatch Guarantee</p>
                </div>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="font-mono font-bold text-slate-900">{selectedSensor.serialNumber}</div>
              <div className="text-slate-600 mt-0.5">{selectedSensor.model}</div>
              <div className="text-slate-500 text-[11px] mt-1">Installed on: <strong>{selectedSensor.machineName}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Failure or Anomaly Reason
              </label>
              <select
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              >
                <option value="Signal cable wear or fatigue">Signal cable wear or connector fatigue</option>
                <option value="Thermal drift beyond calibration limits">Thermal drift beyond calibration limits</option>
                <option value="High physical vibration shock damage">High physical vibration shock / casing damage</option>
                <option value="IP67 coolant or moisture ingress">IP67 coolant or moisture ingress</option>
                <option value="Non-physical harmonic frequency noise">Non-physical harmonic frequency noise / clipping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Delivery Facility & Bay Address
              </label>
              <input
                type="text"
                defaultValue="Alwar Facility Alpha · Maintenance Bay 2 (Extrusion Line)"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchClaim}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${themeConfig.primaryClass} ${themeConfig.primaryHoverClass} text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Overnight</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
