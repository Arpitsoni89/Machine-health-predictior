export interface SlideItem {
  id: number;
  title: string;
  subtitle?: string;
  tag: string;
  category: 'intro' | 'problem' | 'solution' | 'technology' | 'market' | 'business';
  summary: string;
}

export const PRESENTATION_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'MachineMind',
    subtitle: "Don't repair after failure, Predict before it happens",
    tag: 'Cover',
    category: 'intro',
    summary: 'Executive pitch by Aryan Panwar, Arpit Soni, Mehul Saini (1st year B.Tech AI / DS, MITRC, Alwar - Session 2026-27).',
  },
  {
    id: 2,
    title: 'Unplanned downtime results in massive financial hemorrhage',
    subtitle: '₹12 Lakh Crore Lost Annually',
    tag: 'The Problem',
    category: 'problem',
    summary: 'Indian manufacturing industries suffer catastrophic revenue loss through reactive, fire-fighting repair models.',
  },
  {
    id: 3,
    title: 'Machines exhibit clear symptoms before a catastrophic breakdown',
    subtitle: 'Heat • Vibration • Power Spikes',
    tag: 'Symptom Dashboard',
    category: 'problem',
    summary: 'The failure root cause is not lack of warning signs—it is human inability to interpret subtle micro-signals 24/7.',
  },
  {
    id: 4,
    title: 'MachineMind acts as a dedicated physician for your industrial equipment',
    subtitle: 'Sensors + AI + Early Warning + Preventive Care',
    tag: 'The Solution',
    category: 'solution',
    summary: 'Translating biological vitals monitoring into industrial IoT diagnostics to preempt hospitalization/failure.',
  },
  {
    id: 5,
    title: 'A continuous loop of monitoring, analysis, and prevention',
    subtitle: 'SENSE ➔ THINK ➔ ACT',
    tag: 'Core Architecture',
    category: 'technology',
    summary: 'Edge IoT sensor telemetry streams into AI anomaly scoring, dispatching preemptive field directives.',
  },
  {
    id: 6,
    title: 'The AI defines normal and instantly flags significant deviations',
    subtitle: 'Isolation Forests & LSTM Autoencoders',
    tag: 'AI Anomaly Engine',
    category: 'technology',
    summary: 'Time-series feature engineering establishes baseline boundaries and highlights real-time anomalous excursions.',
  },
  {
    id: 7,
    title: 'Complex anomaly scores translate into clear operational directives',
    subtitle: 'Normal ➔ Warning ➔ Critical',
    tag: 'Operational Directives',
    category: 'technology',
    summary: 'Three clear deterministic states guiding automated logging, scheduled inspections, or instant triage.',
  },
  {
    id: 8,
    title: 'Highly scalable across continuous-production industrial environments',
    subtitle: 'Auto • Steel • Textile • Pharma',
    tag: 'Target Industries & Assets',
    category: 'market',
    summary: 'Plug-and-play across Factory Machines, Production Line Robotics & Conveyors, and Critical Power Turbines.',
  },
  {
    id: 9,
    title: 'The financial and operational difference is fundamental',
    subtitle: 'Reactive Repair vs. Predictive Care',
    tag: 'Comparative Matrix',
    category: 'business',
    summary: 'Transforming catastrophic downtime into controlled, predictable, low-cost maintenance windows.',
  },
  {
    id: 10,
    title: 'Delivered as a highly scalable SaaS + IoT subscription model',
    subtitle: 'Starter • Professional • Enterprise',
    tag: 'Business Model',
    category: 'business',
    summary: 'Targeting up to 90% reduction in breakdowns while slashing millions in emergency parts procurement.',
  },
  {
    id: 11,
    title: 'Human teams cannot watch thousands of data points without fatigue. AI can.',
    subtitle: 'From Reactive Repair to Predictive Care',
    tag: 'Vision & Impact',
    category: 'intro',
    summary: 'Eliminating factory blind spots with persistent machine intelligence for zero unplanned downtime.',
  },
  {
    id: 12,
    title: 'Thank You!',
    subtitle: 'From Reactive Repair to Predictive Care',
    tag: 'Thank You',
    category: 'intro',
    summary: 'Team MachineMind: Aryan Panwar, Arpit Soni, Mehul Saini · 1st year B.Tech (AI / DS), MITRC, Alwar (Session 2026-27).',
  },
];
