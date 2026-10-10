import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  ShieldCheck, 
  FileText,
  Send,
  Building2,
  Calendar
} from 'lucide-react';
import { IssueReport, IssueStatus, DepartmentType } from '../types';
import { useApp } from '../context/AppContext';
import { formatDate, getPriorityBadge, getStatusBadge } from '../utils/helpers';

interface IssueDetailModalProps {
  issue: IssueReport | null;
  onClose: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  const { 
    updateIssueStatus, 
    assignIssue, 
    canAssignIssues, 
    canUpdateWorkStatus, 
    canVerifyResolution,
    currentRole 
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<DepartmentType>('Housekeeping');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [workNotesInput, setWorkNotesInput] = useState('');
  const [actionTakenInput, setActionTakenInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'actions' | 'notes'>('details');

  if (!issue) return null;

  const priorityBadge = getPriorityBadge(issue.priority);
  const statusBadge = getStatusBadge(issue.status);

  const departments: DepartmentType[] = [
    'Housekeeping',
    'Plumbing',
    'Water Facility',
    'Gardening',
    'Electrical',
    'General Maintenance',
  ];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    assignIssue(issue.id, selectedDept, assignedStaff || undefined);
  };

  const handleMarkInProgress = () => {
    updateIssueStatus(
      issue.id, 
      'in_progress', 
      workNotesInput || 'Maintenance technician acknowledged and commenced work.'
    );
    setWorkNotesInput('');
  };

  const handleResolve = () => {
    if (!actionTakenInput.trim()) {
      alert('Please describe the specific action taken to address this issue.');
      return;
    }
    updateIssueStatus(
      issue.id,
      'resolved_awaiting_verification',
      workNotesInput,
      actionTakenInput
    );
    setActionTakenInput('');
    setWorkNotesInput('');
  };

  const handleVerify = () => {
    updateIssueStatus(
      issue.id,
      'verified_closed',
      'Resolution verified by authorized campus monitor.'
    );
  };

  const handleReject = () => {
    if (!rejectionReasonInput.trim()) {
      alert('Please provide a reason for rejecting or archiving this report.');
      return;
    }
    updateIssueStatus(
      issue.id,
      'rejected',
      `Report reviewed and marked rejected: ${rejectionReasonInput}`
    );
    setRejectionReasonInput('');
  };

  const handleReopen = () => {
    updateIssueStatus(
      issue.id,
      'in_progress',
      'Resolution rejected during verification inspection; reopened for further work.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-200 text-slate-800 rounded">
              {issue.referenceNumber}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${priorityBadge.bg}`}>
              {priorityBadge.label} Priority
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Report Details
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'actions'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Workflow Actions
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Log & Notes
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'details' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">{issue.title}</h3>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {issue.description}
                </p>
              </div>

              {/* Facility & Location Details Card */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    {issue.facilityName}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {issue.facilityCode}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Zone: {issue.zoneName}
                  </span>
                  <span>Category: {issue.issueType}</span>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reporter</div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {issue.reporterName || 'Anonymous Student'}
                  </div>
                  {issue.reporterEmail && (
                    <div className="text-[11px] text-slate-400">{issue.reporterEmail}</div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Timestamps</div>
                  <div className="text-[11px] flex items-center gap-1 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Observed: {formatDate(issue.observedAt)}
                  </div>
                  <div className="text-[11px] flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Logged: {formatDate(issue.submittedAt)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Team</div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    {issue.assignedDepartment || 'Pending Assignment'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Staff: {issue.assignedTo || 'Unassigned'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Resolution Status</div>
                  <div className="font-semibold text-slate-800">
                    {issue.resolvedAt ? `Resolved: ${formatDate(issue.resolvedAt)}` : 'Not yet resolved'}
                  </div>
                  {issue.verifiedAt && (
                    <div className="text-[11px] text-emerald-600 font-medium">
                      Verified: {formatDate(issue.verifiedAt)}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Taken if resolved */}
              {issue.actionTaken && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Documented Action Taken
                  </span>
                  <p className="text-purple-950 font-medium">{issue.actionTaken}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                You are currently interacting as: <strong>{currentRole.toUpperCase()}</strong>.
                Available lifecycle transitions depend on your role authority.
              </div>

              {/* Step A: Assignment (Admin Only) */}
              {canAssignIssues && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-600" /> Department Assignment
                  </h4>
                  <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Select Department
                      </label>
                      <select
                        value={selectedDept}
                        onChange={e => setSelectedDept(e.target.value as DepartmentType)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      >
                        {departments.map(d => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Assigned Personnel Name
                      </label>
                      <input
                        type="text"
                        value={assignedStaff}
                        onChange={e => setAssignedStaff(e.target.value)}
                        placeholder="e.g. Ramesh Jadhav / Duty Staff"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 text-right">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
                      >
                        Update Assignment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step B: In Progress Transition (Staff / Admin) */}
              {canUpdateWorkStatus && issue.status !== 'verified_closed' && issue.status !== 'rejected' && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" /> Update Work Progress
                  </h4>
                  {issue.status !== 'in_progress' && (
                    <button
                      onClick={handleMarkInProgress}
                      className="px-3.5 py-1.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Set Status to: In Progress
                    </button>
                  )}

                  <div className="pt-2 space-y-2">
                    <label className="block font-medium text-slate-700">
                      Record Maintenance Completion / Resolution:
                    </label>
                    <textarea
                      rows={2}
                      value={actionTakenInput}
                      onChange={e => setActionTakenInput(e.target.value)}
                      placeholder="Specify the physical action completed (e.g., cleared debris, replaced washer, sanitized fixture)..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                    />
                    <div className="text-right">
                      <button
                        onClick={handleResolve}
                        className="px-4 py-2 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
                      >
                        Mark Resolved (Awaiting Verification)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step C: Verification (Green Club / Admin) */}
              {canVerifyResolution && issue.status === 'resolved_awaiting_verification' && (
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-3">
                  <h4 className="font-bold text-purple-950 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" /> Resolution Verification Audit
                  </h4>
                  <p className="text-purple-900 text-xs leading-relaxed">
                    Housekeeping/maintenance reported this issue as resolved. As an authorized monitor, inspect the facility and verify that the problem has been completely rectified.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleVerify}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirm & Close Issue
                    </button>
                    <button
                      onClick={handleReopen}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" /> Reject Resolution & Reopen
                    </button>
                  </div>
                </div>
              )}

              {/* Step D: Reject or Archive (Admin Only) */}
              {canAssignIssues && issue.status !== 'verified_closed' && (
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2">
                  <h4 className="font-bold text-rose-900">Administrative Rejection / Duplicate</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rejectionReasonInput}
                      onChange={e => setRejectionReasonInput(e.target.value)}
                      placeholder="Reason for rejecting (e.g., duplicate report, invalid location)..."
                      className="flex-1 p-2 border border-rose-200 rounded-lg text-xs"
                    />
                    <button
                      onClick={handleReject}
                      className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-semibold hover:bg-rose-800 text-xs"
                    >
                      Reject Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" /> Add Work Observation
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workNotesInput}
                    onChange={e => setWorkNotesInput(e.target.value)}
                    placeholder="Add an internal observation or update note..."
                    className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => {
                      if (!workNotesInput.trim()) return;
                      updateIssueStatus(issue.id, issue.status, workNotesInput);
                      setWorkNotesInput('');
                    }}
                    className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>

              {issue.workNotes && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Latest Note</span>
                  <p className="text-slate-700">{issue.workNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Current Status: <strong>{issue.status.replace('_', ' ').toUpperCase()}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
