import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Search, 
  Calendar,
  Check,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getConditionBadge, formatDate, formatRelativeTime } from '../utils/helpers';

interface InspectionsPageProps {
  onOpenNewInspectionModal: () => void;
  onSelectFacility: (facilityId: string) => void;
}

export const InspectionsPage: React.FC<InspectionsPageProps> = ({
  onOpenNewInspectionModal,
  onSelectFacility,
}) => {
  const { inspections, canInspect } = useApp();
  const [filterRating, setFilterRating] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredInspections = inspections.filter(insp => {
    if (filterRating !== 'all' && insp.conditionRating !== filterRating) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        insp.facilityName.toLowerCase().includes(q) ||
        insp.facilityCode.toLowerCase().includes(q) ||
        insp.inspectorName.toLowerCase().includes(q) ||
        insp.observationNotes.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Green Club Monitoring & Audits
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Physical Campus Facility Inspections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Structured physical observations recorded by authorized monitors and club volunteers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canInspect && (
            <button
              onClick={onOpenNewInspectionModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Record Physical Inspection
            </button>
          )}
        </div>
      </div>

      {/* Disclaimers & Standardized Rating Scale Guide */}
      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Good
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Clean, functional, no defects, passes all hygiene checkpoints.
          </p>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
          <span className="font-bold text-teal-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" /> Satisfactory
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Minor non-urgent wear; operational without immediate intervention.
          </p>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
          <span className="font-bold text-amber-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Needs Attention
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Refill needed, minor drip, or bin nearing capacity.
          </p>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
          <span className="font-bold text-rose-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Poor Condition
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Defective unit, heavy dirt, or requires work order dispatch.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {['all', 'good', 'satisfactory', 'needs_attention', 'poor'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors cursor-pointer ${
                filterRating === r
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inspector, facility..."
            className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Inspections Timeline List */}
      <div className="space-y-4">
        {filteredInspections.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No inspection records match the selected criteria.
          </div>
        ) : (
          filteredInspections.map(insp => {
            const cond = getConditionBadge(insp.conditionRating);
            return (
              <div
                key={insp.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3.5 hover:border-emerald-300 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                      {insp.facilityCode}
                    </span>
                    <button
                      onClick={() => onSelectFacility(insp.facilityId)}
                      className="font-bold text-slate-900 hover:text-emerald-900 text-sm hover:underline"
                    >
                      {insp.facilityName}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cond.bg}`}>
                      Overall: {cond.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(insp.inspectedAt)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Inspector: <strong>{insp.inspectorName}</strong>
                    </span>
                    {insp.maintenanceRequired && (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Maintenance Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-xs italic mt-1">
                    "{insp.observationNotes}"
                  </p>
                </div>

                {/* Checklist Badges */}
                {insp.checklistItems && insp.checklistItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    {insp.checklistItems.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                        {c.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className={c.passed ? 'font-medium' : 'text-slate-400 line-through'}>
                          {c.item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
