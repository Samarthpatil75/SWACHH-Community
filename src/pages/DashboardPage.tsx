import React, { useState } from 'react';
import { 
  Building2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Filter, 
  RotateCcw, 
  Layers, 
  Calendar, 
  Activity,
  ArrowRight,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KPICard } from '../components/KPICard';
import { 
  getConditionBadge, 
  getStatusBadge, 
  getPriorityBadge, 
  formatDate, 
  formatRelativeTime 
} from '../utils/helpers';
import { ConditionRating, IssueStatus, IssuePriority } from '../types';

interface DashboardPageProps {
  onSelectFacility: (id: string) => void;
  onSelectIssue: (id: string) => void;
  onNavigateToReport: () => void;
  onNavigateToQRCodes?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectFacility,
  onSelectIssue,
  onNavigateToReport,
  onNavigateToQRCodes,
}) => {
  const { 
    facilities, 
    issues, 
    logs, 
    kpiStats, 
    filters, 
    setFilters, 
    resetFilters,
    zones,
    categories,
    currentRole
  } = useApp();

  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // Apply filters to facilities
  const filteredFacilities = facilities.filter(f => {
    if (filters.zoneId && f.zoneId !== filters.zoneId) return false;
    if (filters.categoryKey && f.categoryKey !== filters.categoryKey) return false;
    if (filters.condition && f.currentCondition !== filters.condition) return false;
    if (filters.department && f.assignedDepartment !== filters.department) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        f.name.toLowerCase().includes(q) ||
        f.facilityCode.toLowerCase().includes(q) ||
        f.building.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeKpiFilter === 'attention') {
      return f.currentCondition === 'needs_attention' || f.currentCondition === 'poor';
    }
    return true;
  });

  // Apply filters to issues
  const filteredIssues = issues.filter(i => {
    if (filters.categoryKey && i.categoryKey !== filters.categoryKey) return false;
    if (filters.issueStatus && i.status !== filters.issueStatus) return false;
    if (filters.priority && i.priority !== filters.priority) return false;
    if (filters.department && i.assignedDepartment !== filters.department) return false;
    if (activeKpiFilter === 'open') {
      return i.status === 'submitted' || i.status === 'under_review' || i.status === 'open';
    }
    if (activeKpiFilter === 'in_progress') {
      return i.status === 'in_progress';
    }
    if (activeKpiFilter === 'resolved') {
      return i.status === 'resolved_awaiting_verification' || i.status === 'verified_closed';
    }
    return true;
  });

  // Facility condition breakdown counts
  const conditionCounts = {
    good: facilities.filter(f => f.currentCondition === 'good').length,
    satisfactory: facilities.filter(f => f.currentCondition === 'satisfactory').length,
    needs_attention: facilities.filter(f => f.currentCondition === 'needs_attention').length,
    poor: facilities.filter(f => f.currentCondition === 'poor').length,
    not_inspected: facilities.filter(f => f.currentCondition === 'not_inspected').length,
  };

  // Issue status breakdown counts
  const statusCounts = {
    submitted: issues.filter(i => i.status === 'submitted' || i.status === 'under_review').length,
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved_awaiting_verification').length,
    verified: issues.filter(i => i.status === 'verified_closed').length,
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== 'all') || activeKpiFilter !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Central Monitoring Dashboard
            </span>
            <span className="text-xs text-slate-400">Live pilot records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Campus Facility Condition & Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized monitoring for The Green Club, ICEM. Calculated directly from real database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentRole === 'green_club' || currentRole === 'admin') && onNavigateToQRCodes && (
            <button
              onClick={onNavigateToQRCodes}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" /> Campus Floor QR Codes
            </button>
          )}
          <button
            onClick={onNavigateToReport}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" /> Report New Issue
          </button>
        </div>
      </div>

      {/* 7 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <KPICard
          title="Monitored Facilities"
          value={kpiStats.totalFacilities}
          subtitle="Pilot units"
          icon={<Building2 className="w-4 h-4" />}
          colorScheme="emerald"
          onClick={() => setActiveKpiFilter(null)}
          active={activeKpiFilter === null}
        />
        <KPICard
          title="Issues Reported"
          value={kpiStats.issuesReported}
          subtitle="Total logged"
          icon={<AlertCircle className="w-4 h-4" />}
          colorScheme="slate"
          onClick={() => setActiveKpiFilter(null)}
          active={activeKpiFilter === null}
        />
        <KPICard
          title="Open Issues"
          value={kpiStats.openIssues}
          subtitle="Need review"
          icon={<Clock className="w-4 h-4" />}
          colorScheme="blue"
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'open' ? null : 'open')}
          active={activeKpiFilter === 'open'}
        />
        <KPICard
          title="In Progress"
          value={kpiStats.inProgressIssues}
          subtitle="Active work"
          icon={<Wrench className="w-4 h-4" />}
          colorScheme="orange"
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'in_progress' ? null : 'in_progress')}
          active={activeKpiFilter === 'in_progress'}
        />
        <KPICard
          title="Resolved"
          value={kpiStats.resolvedIssues}
          subtitle="Completed"
          icon={<CheckCircle2 className="w-4 h-4" />}
          colorScheme="purple"
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'resolved' ? null : 'resolved')}
          active={activeKpiFilter === 'resolved'}
        />
        <KPICard
          title="Overdue Tasks"
          value={kpiStats.overdueMaintenance}
          subtitle="Past due"
          icon={<AlertTriangle className="w-4 h-4" />}
          colorScheme="rose"
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'overdue' ? null : 'overdue')}
          active={activeKpiFilter === 'overdue'}
        />
        <KPICard
          title="Needs Attention"
          value={kpiStats.facilitiesRequiringAttention}
          subtitle="Flagged units"
          icon={<AlertTriangle className="w-4 h-4" />}
          colorScheme="amber"
          onClick={() => setActiveKpiFilter(activeKpiFilter === 'attention' ? null : 'attention')}
          active={activeKpiFilter === 'attention'}
        />
      </div>

      {/* Multi-Attribute Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Interactive Database Filters</span>
            {hasActiveFilters && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Filters Applied
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                resetFilters();
                setActiveKpiFilter(null);
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Zone filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Campus Zone</label>
            <select
              value={filters.zoneId}
              onChange={e => setFilters(prev => ({ ...prev, zoneId: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Zones / Blocks</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Facility Category</label>
            <select
              value={filters.categoryKey}
              onChange={e => setFilters(prev => ({ ...prev, categoryKey: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Condition Status</label>
            <select
              value={filters.condition}
              onChange={e => setFilters(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Conditions</option>
              <option value="good">Good</option>
              <option value="satisfactory">Satisfactory</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="poor">Poor Condition</option>
              <option value="not_inspected">Not Inspected</option>
            </select>
          </div>

          {/* Issue Status filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Issue Status</label>
            <select
              value={filters.issueStatus}
              onChange={e => setFilters(prev => ({ ...prev, issueStatus: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Issue Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="open">Open / Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved_awaiting_verification">Awaiting Verification</option>
              <option value="verified_closed">Verified & Closed</option>
            </select>
          </div>

          {/* Department filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Assigned Team</label>
            <select
              value={filters.department}
              onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Departments</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Water Facility">Water Facility</option>
              <option value="Gardening">Gardening</option>
              <option value="General Maintenance">General Maintenance</option>
            </select>
          </div>

          {/* Search text filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Search Keywords</label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="e.g. Block A, Cooler..."
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* Two Column Visual Breakdowns: Facility Condition & Issue Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facility Condition Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Facility Condition Overview</h3>
              <p className="text-[11px] text-slate-500">
                Derived from latest physical monitoring inspections
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {facilities.length} Monitored Total
            </span>
          </div>

          {/* Condition progress bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Good Condition
                </span>
                <span className="font-bold text-slate-700">{conditionCounts.good} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(conditionCounts.good / (facilities.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-teal-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Satisfactory Condition
                </span>
                <span className="font-bold text-slate-700">{conditionCounts.satisfactory} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(conditionCounts.satisfactory / (facilities.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Needs Attention
                </span>
                <span className="font-bold text-slate-700">{conditionCounts.needs_attention} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(conditionCounts.needs_attention / (facilities.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="flex items-center gap-1.5 text-rose-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Poor Condition
                </span>
                <span className="font-bold text-slate-700">{conditionCounts.poor} units</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(conditionCounts.poor / (facilities.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Issue Status Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Issue Lifecycle Pipeline</h3>
              <p className="text-[11px] text-slate-500">
                Current resolution state of all logged campus reports
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {issues.length} Reports Total
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2 text-center">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
              <span className="block text-lg font-black text-blue-900">{statusCounts.submitted}</span>
              <span className="text-[10px] font-semibold text-blue-700 leading-tight block">Submitted</span>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <span className="block text-lg font-black text-amber-900">{statusCounts.open}</span>
              <span className="text-[10px] font-semibold text-amber-700 leading-tight block">Open</span>
            </div>
            <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1">
              <span className="block text-lg font-black text-orange-900">{statusCounts.in_progress}</span>
              <span className="text-[10px] font-semibold text-orange-700 leading-tight block">In Progress</span>
            </div>
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
              <span className="block text-lg font-black text-purple-900">{statusCounts.resolved}</span>
              <span className="text-[10px] font-semibold text-purple-700 leading-tight block">Awaiting Verification</span>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="block text-lg font-black text-emerald-900">{statusCounts.verified}</span>
              <span className="text-[10px] font-semibold text-emerald-700 leading-tight block">Verified Closed</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            * Issues require authorized monitor or administrator verification before official closure to prevent premature dismissals.
          </div>
        </div>
      </div>

      {/* Two Column: Filtered Issues List & Real-Time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Issues Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Campus Issue Reports ({filteredIssues.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Click on any report to review, update workflow, or inspect
              </p>
            </div>
            {activeKpiFilter && (
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                Filtered: {activeKpiFilter.toUpperCase()}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            {filteredIssues.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No issue reports match the selected filters.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Reference & Title</th>
                    <th className="px-4 py-3">Facility</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reported</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIssues.slice(0, 6).map(item => {
                    const statusBadge = getStatusBadge(item.status);
                    const prioBadge = getPriorityBadge(item.priority);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => onSelectIssue(item.id)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3">
                          <div className="font-mono text-[11px] font-bold text-slate-900">
                            {item.referenceNumber}
                          </div>
                          <div className="text-xs font-semibold text-slate-700 truncate max-w-xs group-hover:text-emerald-900">
                            {item.title}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800 truncate max-w-[150px]">
                            {item.facilityName}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {item.facilityCode}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${prioBadge.bg}`}>
                            {prioBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatRelativeTime(item.submittedAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-emerald-700 font-semibold group-hover:underline text-[11px] inline-flex items-center gap-1">
                            Details <ArrowRight className="w-3 h-3" />
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

        {/* Right 1 Col: Real-time Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Live Activity Audit
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Real-time</span>
          </div>

          <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-[11px] leading-relaxed">
                    <strong className="text-slate-900">{log.actorName}</strong> ({log.actorRole}):{' '}
                    {log.description}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formatRelativeTime(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            All updates are permanently logged for administration review.
          </div>
        </div>
      </div>
    </div>
  );
};
