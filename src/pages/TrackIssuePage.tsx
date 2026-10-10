import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  AlertCircle, 
  Star, 
  Send,
  ArrowRight,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge, getPriorityBadge, formatDate } from '../utils/helpers';
import { IssueStatus } from '../types';

interface TrackIssuePageProps {
  initialReference?: string;
  onNavigateToReport: () => void;
}

export const TrackIssuePage: React.FC<TrackIssuePageProps> = ({
  initialReference,
  onNavigateToReport,
}) => {
  const { issues } = useApp();
  const [refInput, setRefInput] = useState(initialReference || '');
  const [searchedRef, setSearchedRef] = useState(initialReference || '');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const matchedIssue = issues.find(
    i => i.referenceNumber.toLowerCase() === searchedRef.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedRef(refInput.trim());
  };

  const steps: { key: IssueStatus; label: string; desc: string }[] = [
    { key: 'submitted', label: '1. Received', desc: 'Logged into campus database' },
    { key: 'under_review', label: '2. Under Review', desc: 'Assigned to duty department' },
    { key: 'in_progress', label: '3. In Progress', desc: 'Technicians executing maintenance' },
    { key: 'resolved_awaiting_verification', label: '4. Resolved', desc: 'Physical repair completed' },
    { key: 'verified_closed', label: '5. Verified Closed', desc: 'Green Club inspection confirmed' },
  ];

  const getStepState = (stepKey: IssueStatus) => {
    if (!matchedIssue) return 'pending';
    const statusOrder: IssueStatus[] = [
      'submitted',
      'under_review',
      'open',
      'in_progress',
      'resolved_awaiting_verification',
      'verified_closed',
    ];
    const currentIndex = statusOrder.indexOf(matchedIssue.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentIndex >= stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          Public Status Verification
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Campus Issue Reference ID
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Enter your reference ID (e.g. <code>SW-2026-1001</code>) to view the live maintenance status and verification trail.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={refInput}
            onChange={e => setRefInput(e.target.value)}
            placeholder="Enter reference ID (e.g. SW-2026-1001)"
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          Look Up
        </button>
      </form>

      {/* Result Card */}
      {searchedRef && (
        <>
          {!matchedIssue ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">
                No record found matching reference "{searchedRef}".
              </p>
              <p className="text-[11px] text-slate-400">
                Please verify the ID format (e.g. <code>SW-2026-1001</code>) or submit a new report.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                    {matchedIssue.referenceNumber}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    {matchedIssue.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getStatusBadge(matchedIssue.status).bg}`}>
                    {getStatusBadge(matchedIssue.status).label}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityBadge(matchedIssue.priority).bg}`}>
                    {getPriorityBadge(matchedIssue.priority).label} Priority
                  </span>
                </div>
              </div>

              {/* Facility & Location Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    {matchedIssue.facilityName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {matchedIssue.facilityCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Zone: {matchedIssue.zoneName}
                </p>
                <p className="text-slate-600 italic pt-1">
                  "{matchedIssue.description}"
                </p>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Lifecycle Tracking
                </h3>
                <div className="space-y-4">
                  {steps.map((st, i) => {
                    const state = getStepState(st.key);
                    return (
                      <div key={st.key} className="flex items-start gap-3 text-xs">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              state === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {state === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`w-0.5 h-8 my-1 ${
                                state === 'completed' ? 'bg-emerald-600' : 'bg-slate-200'
                              }`}
                            />
                          )}
                        </div>
                        <div className="pt-0.5">
                          <div className={`font-semibold ${state === 'completed' ? 'text-slate-900' : 'text-slate-400'}`}>
                            {st.label}
                          </div>
                          <div className="text-[11px] text-slate-500">{st.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Taken Display */}
              {matchedIssue.actionTaken && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Documented Action Taken by Staff
                  </span>
                  <p className="text-purple-950 font-medium">{matchedIssue.actionTaken}</p>
                </div>
              )}

              {/* Feedback Survey if resolved/verified */}
              {(matchedIssue.status === 'resolved_awaiting_verification' || matchedIssue.status === 'verified_closed') && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                  <span className="text-xs font-bold text-emerald-950 block">
                    Campus Member Feedback
                  </span>
                  {feedbackSent ? (
                    <p className="text-emerald-700 text-xs font-semibold">
                      ✓ Thank you! Your feedback has been recorded for the ICEM facilities team.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-emerald-800">
                        Are you satisfied with how this facility issue was addressed?
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= feedbackRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setFeedbackSent(true)}
                        className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors"
                      >
                        Submit Satisfaction Feedback
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <p className="text-xs text-slate-500">
          Have an issue with another location?
        </p>
        <button
          onClick={onNavigateToReport}
          className="mt-2 text-xs text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          Submit a new campus report <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
