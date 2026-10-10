import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Building2,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, formatRelativeTime } from '../utils/helpers';
import { MaintenanceSchedule, ScheduleTaskType, FrequencyType } from '../types';

interface SchedulesPageProps {
  onOpenNewScheduleModal: () => void;
  onSelectFacility: (id: string) => void;
}

export const SchedulesPage: React.FC<SchedulesPageProps> = ({
  onOpenNewScheduleModal,
  onSelectFacility,
}) => {
  const { schedules, completeScheduleTask, canManageSchedules, canUpdateWorkStatus } = useApp();

  const [filterType, setFilterType] = useState<string>('all'); // all, overdue, upcoming
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [completeModalSchedule, setCompleteModalSchedule] = useState<MaintenanceSchedule | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const nowTime = new Date().getTime();

  const filteredSchedules = schedules.filter(s => {
    const isOverdue = new Date(s.nextDueAt).getTime() < nowTime;
    if (filterType === 'overdue' && !isOverdue) return false;
    if (filterType === 'upcoming' && isOverdue) return false;
    if (departmentFilter && s.responsibleDepartment !== departmentFilter) return false;
    return true;
  });

  const overdueCount = schedules.filter(
    s => s.isActive && new Date(s.nextDueAt).getTime() < nowTime
  ).length;

  const handleMarkCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeModalSchedule) return;

    completeScheduleTask(
      completeModalSchedule.id,
      completionNotes.trim() || 'Scheduled cleaning / maintenance executed.'
    );
    setCompleteModalSchedule(null);
    setCompletionNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Automated Operations & Maintenance Scheduling
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Cleaning & Maintenance Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Routine daily sanitization, filter flushes, and water tank maintenance intervals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageSchedules && (
            <button
              onClick={onOpenNewScheduleModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Schedule Task
            </button>
          )}
        </div>
      </div>

      {/* Overdue alert banner if any overdue */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">
                {overdueCount} Scheduled {overdueCount === 1 ? 'Task is' : 'Tasks are'} Overdue
              </span>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Tasks requiring attention before standard hygiene intervals lapse.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterType('overdue')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Filter Overdue Tasks
          </button>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          {['all', 'upcoming', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors cursor-pointer ${
                filterType === f
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'overdue' ? `Overdue (${overdueCount})` : f}
            </button>
          ))}
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="">All Responsible Departments</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Water Facility">Water Facility</option>
            <option value="Gardening">Gardening</option>
            <option value="General Maintenance">General Maintenance</option>
          </select>
        </div>
      </div>

      {/* Schedules Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchedules.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No maintenance schedules match the selected filters.
          </div>
        ) : (
          filteredSchedules.map(task => {
            const isOverdue = new Date(task.nextDueAt).getTime() < nowTime;
            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border p-5 space-y-4 shadow-2xs flex flex-col justify-between transition-all ${
                  isOverdue ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                      {task.facilityCode}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {task.frequency}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] uppercase font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded animate-pulse">
                          OVERDUE
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{task.taskDescription}</h3>
                    <button
                      onClick={() => onSelectFacility(task.facilityId)}
                      className="text-xs text-emerald-800 hover:underline font-medium mt-0.5 text-left block"
                    >
                      {task.facilityName}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Department:</span>
                      <span className="font-semibold text-slate-800">{task.responsibleDepartment}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Staff:</span>
                      <span className="font-semibold text-slate-800">{task.assignedTo || 'Duty Team'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Next Due Date:</span>
                      <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                        {formatDate(task.nextDueAt)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Last Completed:</span>
                      <span className="text-slate-600">
                        {task.lastCompletedAt ? formatRelativeTime(task.lastCompletedAt) : 'Initial setup'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Task Type: <strong className="capitalize">{task.taskType.replace(/_/g, ' ')}</strong>
                  </span>
                  {canUpdateWorkStatus && (
                    <button
                      onClick={() => setCompleteModalSchedule(task)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mark Completed Modal */}
      {completeModalSchedule && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">
              Record Maintenance Completion
            </h3>
            <p className="text-slate-600">
              Complete task: <strong>"{completeModalSchedule.taskDescription}"</strong> for{' '}
              <strong>{completeModalSchedule.facilityCode}</strong>.
            </p>
            <form onSubmit={handleMarkCompleteSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Work Notes & Action Completed *
                </label>
                <textarea
                  rows={3}
                  required
                  value={completionNotes}
                  onChange={e => setCompletionNotes(e.target.value)}
                  placeholder="e.g. Completed routine wash down, replaced bin liners, verified drain valve..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                * Next due date will automatically advance based on the task's {completeModalSchedule.frequency} cycle.
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalSchedule(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  Confirm Completion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
