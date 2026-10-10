import React, { useState } from 'react';
import { X, ClipboardCheck, PlusCircle, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConditionRating } from '../types';

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFacilityId?: string;
}

export const NewInspectionModal: React.FC<NewInspectionModalProps> = ({
  isOpen,
  onClose,
  preselectedFacilityId,
}) => {
  const { facilities, addInspection, currentUser } = useApp();

  const [facilityId, setFacilityId] = useState(preselectedFacilityId || facilities[0]?.id || '');
  const [conditionRating, setConditionRating] = useState<ConditionRating>('good');
  const [cleanlinessRating, setCleanlinessRating] = useState<ConditionRating>('good');
  const [maintenanceRequired, setMaintenanceRequired] = useState(false);
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [observationNotes, setObservationNotes] = useState('');

  // Standard checklist items
  const [checklist, setChecklist] = useState([
    { item: 'Physical cleanliness meets campus hygiene standards', passed: true },
    { item: 'No visible leakage, waste accumulation, or obstruction', passed: true },
    { item: 'Identification label & facility fixtures in good order', passed: true },
    { item: 'No immediate safety or structural hazards detected', passed: true },
  ]);

  if (!isOpen) return null;

  const toggleChecklistItem = (index: number) => {
    setChecklist(prev =>
      prev.map((c, i) => (i === index ? { ...c, passed: !c.passed } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) {
      alert('Please select a facility.');
      return;
    }

    addInspection({
      facilityId: facility.id,
      facilityName: facility.name,
      facilityCode: facility.facilityCode,
      inspectorId: currentUser.id,
      inspectorName: currentUser.fullName,
      conditionRating,
      cleanlinessRating,
      maintenanceRequired,
      followUpRequired,
      observationNotes: observationNotes.trim() || 'Routine physical monitoring completed.',
      inspectedAt: new Date().toISOString(),
      checklistItems: checklist,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Record Physical Facility Inspection</h3>
              <p className="text-[11px] text-emerald-200">
                The Green Club Campus Monitoring Checklist
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Select Campus Facility *
            </label>
            <select
              value={facilityId}
              onChange={e => setFacilityId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            >
              {facilities.map(f => (
                <option key={f.id} value={f.id}>
                  {f.facilityCode} — {f.name} ({f.building})
                </option>
              ))}
            </select>
          </div>

          {/* Condition & Cleanliness Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Overall Condition Rating *
              </label>
              <select
                value={conditionRating}
                onChange={e => setConditionRating(e.target.value as ConditionRating)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="good">Good (No issues)</option>
                <option value="satisfactory">Satisfactory (Minor wear)</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="poor">Poor (Defective / Dirty)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Cleanliness Rating *
              </label>
              <select
                value={cleanlinessRating}
                onChange={e => setCleanlinessRating(e.target.value as ConditionRating)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="good">Good (Clean & hygienic)</option>
                <option value="satisfactory">Satisfactory</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="poor">Poor (Requires cleaning)</option>
              </select>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Physical Checklist Verification
            </span>
            <div className="space-y-2">
              {checklist.map((c, i) => (
                <div
                  key={i}
                  onClick={() => toggleChecklistItem(i)}
                  className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none"
                >
                  {c.passed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={c.passed ? 'font-medium' : 'text-slate-500 line-through'}>
                    {c.item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance & Follow-up toggles */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="maintReq"
                checked={maintenanceRequired}
                onChange={e => setMaintenanceRequired(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <label htmlFor="maintReq" className="text-xs text-slate-800 font-medium">
                Maintenance Required?
              </label>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="followUp"
                checked={followUpRequired}
                onChange={e => setFollowUpRequired(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <label htmlFor="followUp" className="text-xs text-slate-800 font-medium">
                Follow-up Audit Required?
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Observation Notes & Recommendations *
            </label>
            <textarea
              rows={3}
              required
              value={observationNotes}
              onChange={e => setObservationNotes(e.target.value)}
              placeholder="Record specific findings (e.g., tap handle loose, soap empty, area swept)..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            * Submitting this inspection will update the facility's latest condition rating and append a verifiable record to the facility's inspection log.
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Save Inspection Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
