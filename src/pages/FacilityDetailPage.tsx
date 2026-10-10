import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  QrCode, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  ClipboardCheck, 
  Layers, 
  Printer, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  getConditionBadge, 
  getOperationalBadge, 
  getStatusBadge, 
  getPriorityBadge, 
  formatDate, 
  formatRelativeTime 
} from '../utils/helpers';
import { QRCodeSVG } from 'qrcode.react';

interface FacilityDetailPageProps {
  facilityId: string;
  onBack: () => void;
  onSelectIssue: (issueId: string) => void;
  onReportForFacility: (facilityId: string) => void;
  onInspectFacility: (facilityId: string) => void;
  onOpenScheduleModal: (facilityId: string) => void;
  onOpenQR: (facility: any) => void;
}

export const FacilityDetailPage: React.FC<FacilityDetailPageProps> = ({
  facilityId,
  onBack,
  onSelectIssue,
  onReportForFacility,
  onInspectFacility,
  onOpenScheduleModal,
  onOpenQR,
}) => {
  const { 
    facilities, 
    issues, 
    inspections, 
    schedules, 
    maintenanceRecords, 
    canInspect, 
    canManageSchedules 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'inspections' | 'maintenance'>('overview');

  const facility = facilities.find(f => f.id === facilityId);

  if (!facility) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 text-sm">Facility record not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const facilityIssues = issues.filter(i => i.facilityId === facility.id);
  const facilityInspections = inspections.filter(i => i.facilityId === facility.id);
  const facilitySchedules = schedules.filter(s => s.facilityId === facility.id);
  const facilityRecords = maintenanceRecords.filter(r => r.facilityId === facility.id);

  const conditionBadge = getConditionBadge(facility.currentCondition);
  const opBadge = getOperationalBadge(facility.operationalStatus);

  const openIssues = facilityIssues.filter(
    i => i.status !== 'verified_closed' && i.status !== 'rejected'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Facility Directory
        </button>

        <div className="flex items-center gap-2">
          {canInspect && (
            <button
              onClick={() => onInspectFacility(facility.id)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-700" /> Record Inspection
            </button>
          )}

          {canManageSchedules && (
            <button
              onClick={() => onOpenScheduleModal(facility.id)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-700" /> Add Schedule Task
            </button>
          )}

          <button
            onClick={() => onReportForFacility(facility.id)}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" /> Report Issue Here
          </button>
        </div>
      </div>

      {/* Main Facility Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                {facility.facilityCode}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${conditionBadge.bg}`}>
                Condition: {conditionBadge.label}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${opBadge.color}`}>
                Status: {opBadge.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Dept: <strong>{facility.assignedDepartment}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {facility.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {facility.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {facility.building} • {facility.floor || 'Ground'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Zone: {facility.zoneName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 italic">{facility.locationDescription}</span>
            </div>
          </div>

          {/* QR Code Quick Card */}
          {facility.qrEnabled && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center shrink-0 w-44">
              <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200 mb-2">
                <QRCodeSVG
                  value={`https://swachh.icem.ac.in/#report?facilityId=${facility.id}`}
                  size={96}
                  level="M"
                />
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-700">
                {facility.facilityCode}
              </span>
              <button
                onClick={() => onOpenQR(facility)}
                className="mt-2 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Printable Label
              </button>
            </div>
          )}
        </div>

        {/* Operational Schedule Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Last Inspected</span>
            <div className="font-semibold text-slate-800">
              {facility.lastInspectedAt ? formatDate(facility.lastInspectedAt) : 'Not yet inspected'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Last Cleaning</span>
            <div className="font-semibold text-slate-800">
              {facility.lastCleanedAt ? formatDate(facility.lastCleanedAt) : 'Not recorded'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Next Cleaning Due</span>
            <div className="font-semibold text-slate-800">
              {facility.nextCleaningDueAt ? formatDate(facility.nextCleaningDueAt) : 'Per daily routine'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Next Maintenance Due</span>
            <div className="font-semibold text-slate-800">
              {facility.nextMaintenanceDueAt ? formatDate(facility.nextMaintenanceDueAt) : 'As required'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Maintenance Schedules ({facilitySchedules.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'issues'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Reported Issues ({facilityIssues.length})
          {openIssues.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              {openIssues.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('inspections')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'inspections'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inspection History ({facilityInspections.length})
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'maintenance'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Work Records ({facilityRecords.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Schedules Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Configured Maintenance Tasks</h3>
                <p className="text-[11px] text-slate-500">
                  Recurring cleaning, inspection, and servicing schedules
                </p>
              </div>
              {canManageSchedules && (
                <button
                  onClick={() => onOpenScheduleModal(facility.id)}
                  className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Task
                </button>
              )}
            </div>

            {facilitySchedules.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No schedules configured for this facility.</p>
            ) : (
              <div className="space-y-3">
                {facilitySchedules.map(sch => {
                  const isOverdue = new Date(sch.nextDueAt).getTime() < new Date().getTime();
                  return (
                    <div
                      key={sch.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{sch.taskDescription}</span>
                          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {sch.frequency}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Team: {sch.responsibleDepartment}</span>
                          {sch.assignedTo && <span>• Staff: {sch.assignedTo}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Next Due:</span>
                          <span className={`font-semibold ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
                            {formatDate(sch.nextDueAt)} {isOverdue && '(OVERDUE)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Reported Issues for {facility.facilityCode}
            </h3>
            <button
              onClick={() => onReportForFacility(facility.id)}
              className="text-xs text-emerald-800 font-semibold hover:underline"
            >
              + File Report
            </button>
          </div>

          {facilityIssues.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No issues have been reported for this facility.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {facilityIssues.map(i => {
                const statusBadge = getStatusBadge(i.status);
                const priorityBadge = getPriorityBadge(i.priority);
                return (
                  <div
                    key={i.id}
                    onClick={() => onSelectIssue(i.id)}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-800">
                          {i.referenceNumber}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityBadge.bg}`}>
                          {priorityBadge.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 truncate">{i.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{i.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 block">
                        {formatRelativeTime(i.submittedAt)}
                      </span>
                      <span className="text-emerald-700 font-semibold text-[11px] hover:underline">
                        Review →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'inspections' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Physical Inspection Logs ({facilityInspections.length})
            </h3>
            {canInspect && (
              <button
                onClick={() => onInspectFacility(facility.id)}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                + Record Inspection
              </button>
            )}
          </div>

          {facilityInspections.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No physical inspections logged yet for this facility.
            </div>
          ) : (
            <div className="space-y-3">
              {facilityInspections.map(insp => {
                const cond = getConditionBadge(insp.conditionRating);
                return (
                  <div key={insp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{insp.inspectorName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cond.bg}`}>
                          {cond.label}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{formatDate(insp.inspectedAt)}</span>
                    </div>
                    <p className="text-slate-600 text-xs italic bg-white p-2.5 rounded-lg border border-slate-100">
                      "{insp.observationNotes}"
                    </p>
                    {insp.checklistItems && (
                      <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                        {insp.checklistItems.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                            {c.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                            <span className={c.passed ? '' : 'line-through text-slate-400'}>{c.item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Completed Maintenance Records ({facilityRecords.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Historical evidence and work notes submitted by authorized staff
            </p>
          </div>

          {facilityRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No completed maintenance records logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {facilityRecords.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rec.taskDescription}</span>
                    <span className="text-slate-400 text-[11px]">{formatDate(rec.completedAt)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Performed by: <strong>{rec.performedBy}</strong> • Verification:{' '}
                    <span className="font-medium text-emerald-700 capitalize">{rec.verificationStatus}</span>
                  </div>
                  <p className="text-slate-700 text-xs bg-white p-2.5 rounded-lg border border-slate-100 mt-1">
                    {rec.workNotes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
