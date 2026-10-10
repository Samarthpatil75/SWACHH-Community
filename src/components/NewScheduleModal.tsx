import React, { useState } from 'react';
import { X, CalendarClock, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScheduleTaskType, FrequencyType, DepartmentType } from '../types';

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFacilityId?: string;
}

export const NewScheduleModal: React.FC<NewScheduleModalProps> = ({
  isOpen,
  onClose,
  preselectedFacilityId,
}) => {
  const { facilities, addSchedule } = useApp();

  const [facilityId, setFacilityId] = useState(preselectedFacilityId || facilities[0]?.id || '');
  const [taskType, setTaskType] = useState<ScheduleTaskType>('routine_cleaning');
  const [taskDescription, setTaskDescription] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [nextDueAt, setNextDueAt] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [responsibleDepartment, setResponsibleDepartment] = useState<DepartmentType>('Housekeeping');
  const [assignedTo, setAssignedTo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) {
      alert('Please select a valid facility.');
      return;
    }

    addSchedule({
      facilityId: facility.id,
      facilityName: facility.name,
      facilityCode: facility.facilityCode,
      taskType,
      taskDescription: taskDescription.trim() || `${taskType.replace(/_/g, ' ')} for ${facility.name}`,
      frequency,
      nextDueAt: new Date(nextDueAt).toISOString(),
      responsibleDepartment,
      assignedTo: assignedTo.trim() || undefined,
      isActive: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Schedule Maintenance / Cleaning Task</h3>
              <p className="text-[11px] text-emerald-200">
                Establish automated cleaning or maintenance cycles
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Campus Facility *
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Task Type *
              </label>
              <select
                value={taskType}
                onChange={e => setTaskType(e.target.value as ScheduleTaskType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="routine_cleaning">Routine Cleaning</option>
                <option value="facility_inspection">Facility Inspection</option>
                <option value="water_cooler_cleaning">Water Cooler Cleaning & Flush</option>
                <option value="water_tank_cleaning">Water Tank Desludging</option>
                <option value="plumbing_maintenance">Plumbing Maintenance</option>
                <option value="equipment_maintenance">Equipment Servicing</option>
                <option value="green_area_inspection">Green Area Trimming / Sweep</option>
                <option value="waste_collection">Waste Clearance</option>
                <option value="other">Other Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Frequency *
              </label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as FrequencyType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="one_time">One-time Task</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Task Description *
            </label>
            <input
              type="text"
              required
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="e.g. Deep scrub and sanitization of washroom fixtures"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Next Due Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={nextDueAt}
                onChange={e => setNextDueAt(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Responsible Department *
              </label>
              <select
                value={responsibleDepartment}
                onChange={e => setResponsibleDepartment(e.target.value as DepartmentType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Housekeeping">Housekeeping</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Water Facility">Water Facility</option>
                <option value="Gardening">Gardening</option>
                <option value="Electrical">Electrical</option>
                <option value="General Maintenance">General Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Assigned Staff / Duty Team (Optional)
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              placeholder="e.g. Ramesh Jadhav / Duty Crew A"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
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
              <PlusCircle className="w-4 h-4" /> Save Schedule Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
