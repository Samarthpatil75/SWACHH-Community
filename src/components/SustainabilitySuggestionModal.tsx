import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Droplets, 
  Trees, 
  Zap, 
  Users, 
  Building2, 
  Send, 
  Copy, 
  Check, 
  Leaf, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SustainabilitySuggestion, SuggestionCategory, CampusZone } from '../types';
import { INITIAL_ZONES } from '../data/mockData';

interface SustainabilitySuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestionSubmitted?: (suggestion: SustainabilitySuggestion) => void;
}

const CATEGORY_OPTIONS: {
  key: SuggestionCategory;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    key: 'waste_recycling',
    label: 'Waste & Recycling',
    icon: <Trash2 className="w-4 h-4 text-emerald-600" />,
    desc: 'Litter segregation, compost, e-waste, bottle recycling bins',
  },
  {
    key: 'water_conservation',
    label: 'Water Conservation',
    icon: <Droplets className="w-4 h-4 text-blue-600" />,
    desc: 'Tap aerators, rainwater harvesting, drip irrigation, leak prevention',
  },
  {
    key: 'energy_solar',
    label: 'Energy & Solar',
    icon: <Zap className="w-4 h-4 text-amber-600" />,
    desc: 'Sensory lighting, solar charging benches, natural ventilation',
  },
  {
    key: 'greenery_biodiversity',
    label: 'Greenery & Biodiversity',
    icon: <Trees className="w-4 h-4 text-emerald-700" />,
    desc: 'Native flora, vertical gardens, bird feeders, herbal patches',
  },
  {
    key: 'hygiene_sanitation',
    label: 'Hygiene & Sanitation',
    icon: <Sparkles className="w-4 h-4 text-teal-600" />,
    desc: 'Handwash dispensers, touchless fixtures, odor management',
  },
  {
    key: 'campus_awareness',
    label: 'Civic & Awareness',
    icon: <Users className="w-4 h-4 text-purple-600" />,
    desc: 'Student green pledges, audit workshops, clean-up drives',
  },
];

export const SustainabilitySuggestionModal: React.FC<SustainabilitySuggestionModalProps> = ({
  isOpen,
  onClose,
  onSuggestionSubmitted,
}) => {
  const { zones = INITIAL_ZONES, currentUser, currentRole } = useApp();

  const [category, setCategory] = useState<SuggestionCategory>('waste_recycling');
  const [zoneId, setZoneId] = useState<string>('campus_wide');
  const [selectedFloor, setSelectedFloor] = useState<string>('All Floors');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [proposerName, setProposerName] = useState(
    currentRole === 'student' ? '' : currentUser.fullName
  );
  const [proposerDepartment, setProposerDepartment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<SustainabilitySuggestion | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeZones = zones && zones.length > 0 ? zones : INITIAL_ZONES;
  const selectedZone = activeZones.find((z: CampusZone) => z.id === zoneId);
  const availableFloors = selectedZone?.floors;

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setSubmittedData(null);
    setTitle('');
    setDescription('');
    setExpectedImpact('');
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) {
      setError('Please provide a descriptive title for your sustainability suggestion.');
      return;
    }

    if (cleanTitle.length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }

    if (!cleanDesc) {
      setError('Please provide the details or proposed implementation for your idea.');
      return;
    }

    setIsSubmitting(true);

    const categoryObj = CATEGORY_OPTIONS.find(c => c.key === category);
    const zoneName = zoneId === 'campus_wide' ? 'Campus-Wide Initiative' : (selectedZone?.name || 'Campus Grounds');
    const floorInfo = availableFloors && selectedFloor !== 'All Floors' ? selectedFloor : undefined;

    const refNum = `SUGG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSuggestion: SustainabilitySuggestion = {
      id: `sugg-${Date.now()}`,
      referenceNumber: refNum,
      title: cleanTitle,
      category,
      categoryLabel: categoryObj?.label || 'Sustainability Initiative',
      zoneName,
      floor: floorInfo,
      description: cleanDesc,
      expectedImpact: expectedImpact.trim() || 'Contributes to a cleaner, greener, and more sustainable campus.',
      submittedBy: proposerName.trim() || 'Anonymous Campus Member',
      submitterRole: currentRole,
      upvotes: 1,
      status: 'under_review',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);

      // Save to localStorage
      try {
        const saved = localStorage.getItem('swachh_sustainability_suggestions');
        const list: SustainabilitySuggestion[] = saved ? JSON.parse(saved) : [];
        const updated = [newSuggestion, ...list];
        localStorage.setItem('swachh_sustainability_suggestions', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to store suggestion in localStorage:', err);
      }

      setSubmittedData(newSuggestion);
      if (onSuggestionSubmitted) {
        onSuggestionSubmitted(newSuggestion);
      }
    }, 300);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        margin: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggestion-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 shadow-xs">
              <Lightbulb className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                  Green Club • Campus Initiative
                </span>
                <span className="text-[10px] text-emerald-200/80 font-mono">
                  PILOT 2026
                </span>
              </div>
              <h3 id="suggestion-modal-title" className="text-base sm:text-lg font-black tracking-tight mt-1 text-white">
                Submit Sustainability Suggestion
              </h3>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {submittedData ? (
            /* Submission Success Screen */
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  Proposal Successfully Recorded
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  Thank You for Your Green Idea!
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your suggestion has been logged into the SWACHH Community repository and routed to the Green Club audit team and college administration for review.
                </p>
              </div>

              {/* Reference Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">Suggestion Reference</span>
                  <button
                    onClick={() => handleCopyRef(submittedData.referenceNumber)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-base font-black text-emerald-900 tracking-wider">
                  {submittedData.referenceNumber}
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  <span className="font-bold">Topic:</span> {submittedData.title}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold">Zone:</span> {submittedData.zoneName}
                  {submittedData.floor && ` • ${submittedData.floor}`}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl max-w-md mx-auto text-left text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Green Club members evaluate verified proposals during monthly audits. High-impact suggestions are presented to the ICEM administration for inclusion in campus pilot upgrades.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Done & View Suggestions
                </button>
              </div>
            </div>
          ) : (
            /* Suggestion Input Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category Picker */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                  1. Focus Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map(c => {
                    const isSelected = category === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setCategory(c.key)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/50 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {c.icon}
                          <span className="font-bold text-xs truncate">{c.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight">
                          {c.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campus Location Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                    2. Target Campus Zone *
                  </label>
                  <div className="relative">
                    <select
                      value={zoneId}
                      onChange={e => {
                        setZoneId(e.target.value);
                        setSelectedFloor('All Floors');
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="campus_wide">🌐 Campus-Wide (All Zones)</option>
                      {activeZones.map((z: CampusZone) => (
                        <option key={z.id} value={z.id}>
                          📍 {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Floor Picker (Shown when Avirat Block A or B is selected) */}
                {availableFloors ? (
                  <div className="space-y-1">
                    <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                      Specific Floor
                    </label>
                    <select
                      value={selectedFloor}
                      onChange={e => setSelectedFloor(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="All Floors">Entire Building (All Floors)</option>
                      {availableFloors.map((fl: string) => (
                        <option key={fl} value={fl}>
                          {fl}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                      Specific Area / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lawn promenade, Food court counter"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Suggestion Title */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                  3. Suggestion Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Install automated drip irrigation timer for Garden & Lawns"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Detailed Idea & Solution */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                  4. Detailed Idea & Proposed Implementation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Describe your suggestion in detail: What is the current issue or opportunity, and how can it be implemented on campus?..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Expected Environmental / Campus Impact */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wide text-[11px]">
                  5. Expected Impact & Benefits (Optional)
                </label>
                <input
                  type="text"
                  value={expectedImpact}
                  onChange={e => setExpectedImpact(e.target.value)}
                  placeholder="e.g. Saves ~400 liters of water per day and prevents sidewalk puddles"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Submitter Name / Role (Frictionless for Students) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-medium text-[11px]">
                    Your Name (Optional / Anonymous if blank)
                  </label>
                  <input
                    type="text"
                    value={proposerName}
                    onChange={e => setProposerName(e.target.value)}
                    placeholder="e.g. Neha Deshmukh (Student)"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-medium text-[11px]">
                    Department / Class / Branch (Optional)
                  </label>
                  <input
                    type="text"
                    value={proposerDepartment}
                    onChange={e => setProposerDepartment(e.target.value)}
                    placeholder="e.g. BE Computer Engineering"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs animate-in fade-in duration-150">
                  {error}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Recording Idea...' : 'Submit Suggestion'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
