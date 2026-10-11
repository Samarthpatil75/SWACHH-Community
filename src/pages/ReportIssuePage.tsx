import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  MapPin, 
  Clock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCcw,
  Camera,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FacilityCategoryKey, IssuePriority } from '../types';

interface ReportIssuePageProps {
  preselectedFacilityId?: string;
  onNavigateToTrack: (refNumber: string) => void;
  onNavigateToDashboard: () => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  preselectedFacilityId,
  onNavigateToTrack,
  onNavigateToDashboard,
}) => {
  const { facilities, categories, addIssueReport, issues } = useApp();

  // Wizard Step: 1 = Facility, 2 = Category, 3 = Details, 4 = Confirmation
  const [step, setStep] = useState(preselectedFacilityId ? 2 : 1);

  // Form Fields
  const [facilityId, setFacilityId] = useState(preselectedFacilityId || (facilities[0]?.id || ''));
  const [categoryKey, setCategoryKey] = useState<FacilityCategoryKey>('waste_management');
  const [issueType, setIssueType] = useState('Dustbin full & overflow');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [observedAt, setObservedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // If preselectedFacilityId changed, sync it
  useEffect(() => {
    if (preselectedFacilityId) {
      setFacilityId(preselectedFacilityId);
      const target = facilities.find(f => f.id === preselectedFacilityId);
      if (target) {
        setCategoryKey(target.categoryKey);
      }
      setStep(2);
    }
  }, [preselectedFacilityId, facilities]);

  // Sub-issue types mapping
  const issueTypesMap: Record<FacilityCategoryKey, string[]> = {
    waste_management: [
      'Dustbin full & overflow',
      'Waste not collected / delayed clearance',
      'Litter scattered on floor',
      'Waste segregation mixing issue',
      'Unclean waste station odor',
    ],
    toilets_sanitation: [
      'Toilet requires cleaning & scrub',
      'Washbasin is dirty / stained',
      'Water supply unavailable',
      'Plumbing or tap leakage',
      'Soap / handwash dispenser empty',
      'Damaged latch or restroom fixture',
    ],
    drinking_water: [
      'Water cooler requires cleaning / rinse',
      'Cooler compressor not chilling',
      'Water supply unavailable at tap',
      'Continuous drainage leak / puddle',
      'Suspected water quality / taste concern',
    ],
    water_tanks: [
      'Scheduled tank cleaning due',
      'Visible overflow or pipe leakage',
      'Inspection hatch open / unsealed',
      'Maintenance check required',
    ],
    general_facilities: [
      'Electrical / lighting malfunction',
      'Broken furniture or lab fixture',
      'Damaged window pane or ceiling tile',
      'Plumbing / drainage block',
      'General corridor cleanliness',
    ],
    green_areas: [
      'Litter in garden / lawn area',
      'Waste accumulation behind hedges',
      'Damaged shrubs or lawn patches',
      'Overflowing outdoor park bin',
    ],
  };

  const selectedFacility = facilities.find(f => f.id === facilityId);

  // Check for duplicate issues on this facility
  const existingOpenIssues = issues.filter(
    i => i.facilityId === facilityId && i.status !== 'verified_closed' && i.status !== 'rejected'
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) {
      alert('Please select a facility.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('Please provide a short title and description.');
      return;
    }

    const newIssue = addIssueReport({
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      facilityCode: selectedFacility.facilityCode,
      zoneName: selectedFacility.zoneName,
      categoryKey,
      reporterName: reporterName.trim() || undefined,
      reporterEmail: reporterEmail.trim() || undefined,
      issueType,
      title: title.trim(),
      description: description.trim(),
      priority,
      observedAt: new Date(observedAt).toISOString(),
      submittedAt: new Date().toISOString(),
      photoUrl: photoPreview || undefined,
    });

    setSubmittedRef(newIssue.referenceNumber);
    setStep(4);
  };

  const handleCopyRef = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(submittedRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setPhotoPreview(null);
    setSubmittedRef(null);
    setStep(1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          Rapid Campus Issue Reporting
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report a Facility Cleanliness or Maintenance Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          No sign-in required. Submissions are reviewed and verified on-ground by Green Club members before maintenance assignment, ensuring false reports are filtered out.
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="flex items-center justify-between max-w-md mx-auto pt-2">
        {[
          { num: 1, label: 'Facility' },
          { num: 2, label: 'Category' },
          { num: 3, label: 'Details' },
          { num: 4, label: 'Confirmed' },
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[10px] font-medium text-slate-500 mt-1">{s.label}</span>
            </div>
            {idx < 3 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all ${
                  step > idx + 1 ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Card Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Step 1: Select Facility */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 1: Select the Monitored Campus Facility</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the location or facility where the problem was observed.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Campus Facilities ({facilities.length})
              </label>
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {facilities.map(f => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setFacilityId(f.id);
                      setCategoryKey(f.categoryKey);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      facilityId === f.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-950 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                          {f.facilityCode}
                        </span>
                        <span className="font-bold text-slate-900 truncate">{f.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {f.building} • {f.floor || 'Ground'} — {f.locationDescription}
                      </p>
                    </div>
                    {facilityId === f.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Proceed to Category <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Category & Specific Issue Type */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 2: Issue Type & Classification</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Facility selected: <strong>{selectedFacility?.name}</strong> ({selectedFacility?.facilityCode})
              </p>
            </div>

            {/* Duplicate warning if existing open issue on facility */}
            {existingOpenIssues.length > 0 && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Notice: Ongoing reports exist for this facility</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    There {existingOpenIssues.length === 1 ? 'is already 1 active report' : `are already ${existingOpenIssues.length} active reports`} on this facility (e.g. {existingOpenIssues[0]?.referenceNumber}: "{existingOpenIssues[0]?.title}"). Your submission will be linked to prevent duplicate effort.
                  </p>
                </div>
              </div>
            )}

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Facility Area Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map(c => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setCategoryKey(c.key);
                      setIssueType(issueTypesMap[c.key][0]);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      categoryKey === c.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Problem Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Specific Issue Nature
              </label>
              <div className="space-y-2">
                {issueTypesMap[categoryKey].map(t => (
                  <div
                    key={t}
                    onClick={() => {
                      setIssueType(t);
                      if (!title) setTitle(t);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      issueType === t
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{t}</span>
                    {issueType === t && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!title) setTitle(issueType);
                  setStep(3);
                }}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter Details & Photos */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 3: Observation Details & Priority</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide clear observations to help maintenance staff respond effectively.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Short Title / Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Overflowing paper bin near classroom 102"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description of Issue *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what you observed (e.g., loose tap handle dripping water, wet bin full of organic waste, lights flickering)..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Priority / Severity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Severity / Urgency Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Low', desc: 'Minor cosmetic / non-urgent' },
                  { id: 'medium', label: 'Medium', desc: 'Standard maintenance needed' },
                  { id: 'high', label: 'High', desc: 'Affects daily usage / leaking' },
                  { id: 'urgent', label: 'Urgent', desc: 'Active pipe burst / hygiene failure' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as IssuePriority)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      priority === p.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs">{p.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Attach Photograph (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                {photoPreview ? (
                  <div className="space-y-2">
                    <img
                      src={photoPreview}
                      alt="Upload preview"
                      className="max-h-44 mx-auto rounded-xl border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-1">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-xs font-semibold text-emerald-800 block">
                      Click to upload photo of facility
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      PNG, JPG up to 5MB. Do not upload faces or personal items.
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Optional Reporter Info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Reporter Identification (Optional)
                </span>
                <span className="text-[11px] text-slate-400">Anonymous by default</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="Your Full Name (optional)"
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={e => setReporterEmail(e.target.value)}
                  placeholder="Your Email for status updates (optional)"
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Contact information is encrypted and visible only to authorized administration. It is never exposed on the public dashboard.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Report to Maintenance
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Submission Confirmation & Reference Number */}
        {step === 4 && submittedRef && (
          <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Report Successfully Filed
              </span>
              <h2 className="text-2xl font-black text-slate-900 pt-2">
                Thank You for Helping Keep ICEM Clean!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your report has been logged in the SWACHH Community centralized database and queued for housekeeping / maintenance review.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="max-w-xs mx-auto p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Issue Reference Number
              </span>
              <div className="font-mono text-xl font-black text-emerald-950 tracking-wider">
                {submittedRef}
              </div>
              <button
                onClick={handleCopyRef}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedRef ? 'Copied to Clipboard' : 'Copy Reference Number'}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Save this reference number to check live inspection and resolution status at any time.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigateToTrack(submittedRef)}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Track This Report Status
              </button>
              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> File Another Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
