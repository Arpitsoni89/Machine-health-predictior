export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Plant Operations Manager' | 'Chief Reliability Engineer' | 'Predictive Maintenance Specialist' | 'Executive VP Operations';
  facility: string;
  provider: 'google';
  loginTime: string;
}

export type MachineStatus = 'normal' | 'warning' | 'critical';

export type MachineCategory = 'factory_machines' | 'production_lines' | 'power_systems';

export type IndustrySector = 'auto' | 'steel' | 'textile' | 'pharma';

export interface MachineMetricHistory {
  timestamp: string;
  temperature: number; // °C
  vibration: number;   // mm/s RMS
  power: number;       // kW
  riskScore: number;   // 0-100%
  isAnomaly: boolean;
}

export interface IndustrialMachine {
  id: string;
  name: string;
  tag: string;
  serialNumber?: string;
  category: MachineCategory;
  categoryLabel: string;
  industry: IndustrySector;
  industryLabel: string;
  location: string;
  status: MachineStatus;
  healthScore: number; // 0 - 100
  temperature: number; // current °C
  tempBaseline: number;
  tempThreshold: number;
  vibration: number;   // current mm/s RMS
  vibBaseline: number;
  vibThreshold: number;
  power: number;       // current kW
  powerBaseline: number;
  powerThreshold: number;
  riskScore: number;   // 0-100
  predictedTimeToFailureHours: number | null;
  lastMaintained: string;
  nextScheduledInspection: string;
  aiDiagnosticNote: string;
  history: MachineMetricHistory[];
}

export interface MaintenanceAlert {
  id: string;
  machineId: string;
  machineName: string;
  category: MachineCategory;
  severity: 'warning' | 'critical';
  metric: 'temperature' | 'vibration' | 'power' | 'compound';
  value: string;
  threshold: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  assignedTo?: string;
  recommendedAction: string;
}

export type PlanTier = 'pilot' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  forAudience: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  machineLimit: number | 'Unlimited';
  highlightBadge?: string;
  isPopular?: boolean;
  features: string[];
  specs: {
    samplingRate: string;
    anomalyModel: string;
    alertChannels: string;
    historyRetention: string;
    uptimeSla: string;
    supportLevel: string;
    hardwareSupport: string;
  };
}

export interface UserSubscription {
  planId: PlanTier;
  status: 'active' | 'trial';
  billingCycle: BillingCycle;
  renewalDate: string;
  activeMachinesCount: number;
  machineQuota: number;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
  invoices: {
    id: string;
    date: string;
    amount: string;
    status: 'paid' | 'pending';
    pdfName: string;
  }[];
}
