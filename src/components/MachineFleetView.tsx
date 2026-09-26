import React, { useState } from 'react';
import { IndustrialMachine, IndustrySector, MachineCategory, MachineStatus } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  Flame, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

interface MachineFleetViewProps {
  machines: IndustrialMachine[];
  onSelectMachine: (id: string) => void;
}

export const MachineFleetView: React.FC<MachineFleetViewProps> = ({
  machines,
  onSelectMachine,
}) => {
  const { themeConfig } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustrySector | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<MachineCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MachineStatus | 'all'>('all');

  const filteredMachines = machines.filter((m) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchTag = m.tag.toLowerCase().includes(q);
      const matchLoc = m.location.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchLoc) return false;
    }
    if (selectedIndustry !== 'all' && m.industry !== selectedIndustry) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Friendly Fleet Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className={`text-xs font-semibold mb-1 ${themeConfig.textClass}`}>
              Industrial Asset Fleet Overview
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Machinery & Production Lines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Real-time health index across Factory Machines, Production Lines, and Power Systems in Automotive, Steel, Textile, and Pharmaceutical facilities.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, tag, or line..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100">
          {/* Status Quick Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-600 mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Equipment' },
              { id: 'normal', label: 'Smooth' },
              { id: 'warning', label: 'Check Needed' },
              { id: 'critical', label: 'Immediate Care' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id as any)}
                className={`px-3 py-1 rounded-xl text-xs transition font-medium cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Industry Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-600 mr-1">Sector:</span>
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'auto', label: 'Auto' },
              { id: 'steel', label: 'Steel' },
              { id: 'textile', label: 'Textile' },
              { id: 'pharma', label: 'Pharma' },
            ].map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id as any)}
                className={`px-2.5 py-1 rounded-xl text-xs transition font-medium cursor-pointer ${
                  selectedIndustry === ind.id
                    ? `${themeConfig.primaryClass} font-semibold shadow-xs text-white`
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Machinery */}
      {filteredMachines.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-xs">
          <Filter className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">No equipment matches your filter</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('all');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className={`mt-3 text-xs font-semibold underline underline-offset-4 ${themeConfig.textClass} cursor-pointer`}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMachines.map((machine) => {
            const isCritical = machine.status === 'critical';
            const isWarning = machine.status === 'warning';

            return (
              <div
                key={machine.id}
                className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-150 hover:shadow-md ${
                  isCritical
                    ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300/40'
                    : isWarning
                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  {/* Unboxed Metadata Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono mb-1">
                        <span className={`font-semibold ${themeConfig.textClass}`}>{machine.tag}</span>
                        <span aria-hidden="true">·</span>
                        <span>{machine.industry.toUpperCase()}</span>
                      </div>
                      <h3 className="font-semibold text-base text-slate-900 tracking-tight">
                        {machine.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{machine.location}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-1">
                      {isCritical && <AlertOctagon className="w-4 h-4 text-rose-600" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {!isCritical && !isWarning && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      <span className={`text-xs font-semibold ${
                        isCritical ? 'text-rose-600' : isWarning ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {isCritical ? 'Immediate Care' : isWarning ? 'Check Needed' : 'Smooth'}
                      </span>
                    </div>
                  </div>

                  {/* Health Score Meter */}
                  <div className="my-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">Machine Health</span>
                      <span className={`font-mono font-bold ${
                        machine.healthScore < 50 ? 'text-rose-600' : machine.healthScore < 75 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {machine.healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          machine.healthScore < 50
                            ? 'bg-rose-500'
                            : machine.healthScore < 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${machine.healthScore}%` }}
                      />
                    </div>
                  </div>

                  {/* 3 Vital Readings */}
                  <div className="grid grid-cols-3 gap-2 py-1 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-0.5">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>Heat</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 font-mono">{machine.temperature}°C</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-0.5">
                        <Activity className="w-3 h-3 text-sky-500" />
                        <span>Vib</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 font-mono">{machine.vibration}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] mb-0.5">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Power</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 font-mono">{machine.power}kW</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {machine.aiDiagnosticNote}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {machine.categoryLabel}
                  </span>

                  <button
                    onClick={() => onSelectMachine(machine.id)}
                    className={`px-3 py-1.5 rounded-xl ${themeConfig.bgLightClass} hover:opacity-90 ${themeConfig.textClass} border ${themeConfig.borderClass} text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs`}
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
