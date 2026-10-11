import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getConditionBadge, getStatusBadge } from '../utils/helpers';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFacility: (id: string) => void;
  onSelectIssue: (id: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectFacility,
  onSelectIssue,
}) => {
  const { facilities, issues } = useApp();
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingFacilities = trimmed
    ? facilities.filter(
        f =>
          f.facilityCode.toLowerCase().includes(trimmed) ||
          f.name.toLowerCase().includes(trimmed) ||
          f.building.toLowerCase().includes(trimmed) ||
          f.zoneName.toLowerCase().includes(trimmed)
      )
    : facilities.slice(0, 4);

  const matchingIssues = trimmed
    ? issues.filter(
        i =>
          i.referenceNumber.toLowerCase().includes(trimmed) ||
          i.title.toLowerCase().includes(trimmed) ||
          i.facilityName.toLowerCase().includes(trimmed) ||
          i.facilityCode.toLowerCase().includes(trimmed)
      )
    : issues.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-emerald-600 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search facility code (e.g. ICEM-WM-101), reference (e.g. SW-2026-1001), building..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Facilities Section */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Campus Monitored Facilities ({matchingFacilities.length})</span>
            </h4>
            {matchingFacilities.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No facilities matching "{query}"</p>
            ) : (
              <div className="space-y-1.5">
                {matchingFacilities.map(f => {
                  const cond = getConditionBadge(f.currentCondition);
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        onSelectFacility(f.id);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {f.facilityCode.split('-')[1]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-950">
                              {f.name}
                            </span>
                            <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                              {f.facilityCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {f.building}{f.floor ? ` • ${f.floor}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cond.bg}`}>
                          {cond.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Issues Section */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Reported Issues ({matchingIssues.length})</span>
            </h4>
            {matchingIssues.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No issue records matching "{query}"</p>
            ) : (
              <div className="space-y-1.5">
                {matchingIssues.map(i => {
                  const statusBadge = getStatusBadge(i.status);
                  return (
                    <button
                      key={i.id}
                      onClick={() => {
                        onSelectIssue(i.id);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-950">
                              {i.title}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {i.referenceNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {i.facilityName} ({i.facilityCode})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>SWACHH Community Rapid Identifier System</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
