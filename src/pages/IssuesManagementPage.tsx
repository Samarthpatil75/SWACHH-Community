import React, { useState } from 'react';
import { 
  ListTodo, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle, 
  User, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStatusBadge, getPriorityBadge, formatDate, formatRelativeTime, exportToCSV } from '../utils/helpers';
import { IssueStatus, IssuePriority, DepartmentType } from '../types';

interface IssuesManagementPageProps {
  onSelectIssue: (issueId: string) => void;
  onNavigateToReport: () => void;
}

export const IssuesManagementPage: React.FC<IssuesManagementPageProps> = ({
  onSelectIssue,
  onNavigateToReport,
}) => {
  const { issues, canExportData, currentRole } = useApp();

  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const filteredIssues = issues.filter(i => {
    if (statusTab !== 'all') {
      if (statusTab === 'open' && !(i.status === 'submitted' || i.status === 'under_review' || i.status === 'open')) {
        return false;
      }
      if (statusTab === 'in_progress' && i.status !== 'in_progress') return false;
      if (statusTab === 'awaiting_verification' && i.status !== 'resolved_awaiting_verification') return false;
      if (statusTab === 'verified' && i.status !== 'verified_closed') return false;
    }
    if (departmentFilter && i.assignedDepartment !== departmentFilter) return false;
    if (priorityFilter && i.priority !== priorityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        i.referenceNumber.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.facilityName.toLowerCase().includes(q) ||
        i.facilityCode.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const exportRows = filteredIssues.map(i => ({
      ReferenceNumber: i.referenceNumber,
      Title: i.title,
      FacilityCode: i.facilityCode,
      FacilityName: i.facilityName,
      Zone: i.zoneName,
      Category: i.categoryKey,
      Priority: i.priority,
      Status: i.status,
      ReportedBy: i.reporterName,
      ReporterDepartment: i.reporterDepartment,
      AssignedDepartment: i.assignedDepartment || 'Unassigned',
      AssignedTo: i.assignedTo || 'Unassigned',
      SubmittedAt: i.submittedAt,
      ResolvedAt: i.resolvedAt || '',
      VerifiedAt: i.verifiedAt || '',
      ActionTaken: i.actionTaken || '',
    }));
    exportToCSV(`SWACHH_Community_Issues_${new Date().toISOString().slice(0, 10)}`, exportRows);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Issue Lifecycle & Maintenance Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Campus Maintenance Work Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review submissions, assign responsible departments, document work progress, and verify closures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canExportData && (
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download issues as CSV report for administration"
            >
              <Download className="w-4 h-4 text-slate-500" /> Export CSV
            </button>
          )}

          <button
            onClick={onNavigateToReport}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Issue Report
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 text-xs">
        {[
          { id: 'all', label: `All Reports (${issues.length})` },
          {
            id: 'open',
            label: `Open / Awaiting Action (${
              issues.filter(i => i.status === 'submitted' || i.status === 'under_review' || i.status === 'open').length
            })`,
          },
          {
            id: 'in_progress',
            label: `In Progress (${issues.filter(i => i.status === 'in_progress').length})`,
          },
          {
            id: 'awaiting_verification',
            label: `Awaiting Verification (${
              issues.filter(i => i.status === 'resolved_awaiting_verification').length
            })`,
          },
          {
            id: 'verified',
            label: `Verified & Closed (${issues.filter(i => i.status === 'verified_closed').length})`,
          },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reference # (SW-2026-1001), title..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="">All Assigned Departments</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Water Facility">Water Facility</option>
            <option value="Gardening">Gardening</option>
            <option value="Electrical">Electrical</option>
            <option value="General Maintenance">General Maintenance</option>
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {filteredIssues.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-xs">
              No issue reports match the selected criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Reference & Title</th>
                  <th className="px-4 py-3">Facility</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned Dept</th>
                  <th className="px-4 py-3">Reported</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map(issue => {
                  const statusBadge = getStatusBadge(issue.status);
                  const prioBadge = getPriorityBadge(issue.priority);
                  return (
                    <tr
                      key={issue.id}
                      onClick={() => onSelectIssue(issue.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-bold text-slate-900 block">
                          {issue.referenceNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900 line-clamp-1 max-w-sm">
                          {issue.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 truncate max-w-[150px]">
                          {issue.facilityName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {issue.facilityCode}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${prioBadge.bg}`}>
                          {prioBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="font-medium">{issue.assignedDepartment || 'Unassigned'}</div>
                        {issue.assignedTo && (
                          <div className="text-[10px] text-slate-400">{issue.assignedTo}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatRelativeTime(issue.submittedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-emerald-700 font-semibold group-hover:underline text-[11px] inline-flex items-center gap-1">
                          Manage <ArrowRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
