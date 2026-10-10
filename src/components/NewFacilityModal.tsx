import React, { useState } from 'react';
import { X, Building2, PlusCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DepartmentType, FacilityCategoryKey, OperationalStatus, ConditionRating } from '../types';

interface NewFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (facilityId: string) => void;
}

export const NewFacilityModal: React.FC<NewFacilityModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { zones, categories, addFacility, currentUser } = useApp();

  const [name, setName] = useState('');
  const [categoryKey, setCategoryKey] = useState<FacilityCategoryKey>('waste_management');
  const [zoneId, setZoneId] = useState(zones[0]?.id || '');
  const [facilityCode, setFacilityCode] = useState('');
  const [floor, setFloor] = useState('Ground Floor');
  const [locationDescription, setLocationDescription] = useState('');
  const [description, setDescription] = useState('');
  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus>('operational');
  const [currentCondition, setCurrentCondition] = useState<ConditionRating>('good');
  const [assignedDepartment, setAssignedDepartment] = useState<DepartmentType>('Housekeeping');
  const [qrEnabled, setQrEnabled] = useState(true);

  if (!isOpen) return null;

  // Auto-generate code if empty when category changes
  const handleCategoryChange = (newKey: FacilityCategoryKey) => {
    setCategoryKey(newKey);
    const prefixMap: Record<FacilityCategoryKey, string> = {
      waste_management: 'WM',
      toilets_sanitation: 'TS',
      drinking_water: 'DW',
      water_tanks: 'WT',
      general_facilities: 'GF',
      green_areas: 'GA',
    };
    const prefix = prefixMap[newKey] || 'FAC';
    const randNum = Math.floor(100 + Math.random() * 900);
    setFacilityCode(`ICEM-${prefix}-${randNum}`);

    // Adjust default department accordingly
    if (newKey === 'drinking_water' || newKey === 'water_tanks') {
      setAssignedDepartment('Water Facility');
    } else if (newKey === 'green_areas') {
      setAssignedDepartment('Gardening');
    } else if (newKey === 'toilets_sanitation') {
      setAssignedDepartment('Housekeeping');
    } else if (newKey === 'general_facilities') {
      setAssignedDepartment('General Maintenance');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a facility name.');
      return;
    }

    const selectedZone = zones.find(z => z.id === zoneId) || zones[0];
    const selectedCategory = categories.find(c => c.key === categoryKey) || categories[0];

    const finalCode = facilityCode.trim() || `ICEM-FAC-${Math.floor(100 + Math.random() * 900)}`;

    const newFacility = addFacility({
      facilityCode: finalCode,
      name: name.trim(),
      categoryId: selectedCategory.id,
      categoryKey,
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      building: selectedZone.building,
      floor,
      locationDescription: locationDescription.trim() || `${selectedZone.name}, ${floor}`,
      description: description.trim() || 'Monitored campus asset in SWACHH Community pilot.',
      operationalStatus,
      currentCondition,
      assignedDepartment,
      qrEnabled,
      createdBy: currentUser.id,
    });

    if (onCreated) {
      onCreated(newFacility.id);
    }
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
            <Building2 className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Register Campus Facility</h3>
              <p className="text-[11px] text-emerald-200">
                Create new asset record for pilot campus monitoring
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Facility Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Facility Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Segregated Waste Station - Block B Lobby"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={categoryKey}
                onChange={e => handleCategoryChange(e.target.value as FacilityCategoryKey)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                {categories.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Facility Identifier Code *
              </label>
              <input
                type="text"
                required
                value={facilityCode}
                onChange={e => setFacilityCode(e.target.value)}
                placeholder="e.g. ICEM-WM-104"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-900 bg-slate-50"
              />
            </div>
          </div>

          {/* Location & Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Campus Zone / Building *
              </label>
              <select
                value={zoneId}
                onChange={e => setZoneId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.building})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Floor / Level
              </label>
              <input
                type="text"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                placeholder="e.g. Ground Floor, 2nd Floor"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Specific Location Description
              </label>
              <input
                type="text"
                value={locationDescription}
                onChange={e => setLocationDescription(e.target.value)}
                placeholder="e.g. Near West Stairwell, adjacent to Room 204"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Operational & Condition Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Operational Status
              </label>
              <select
                value={operationalStatus}
                onChange={e => setOperationalStatus(e.target.value as OperationalStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="operational">Operational</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="temporarily_closed">Temporarily Closed</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Initial Condition
              </label>
              <select
                value={currentCondition}
                onChange={e => setCurrentCondition(e.target.value as ConditionRating)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="good">Good</option>
                <option value="satisfactory">Satisfactory</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="poor">Poor</option>
                <option value="not_inspected">Not Inspected</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Assigned Team
              </label>
              <select
                value={assignedDepartment}
                onChange={e => setAssignedDepartment(e.target.value as DepartmentType)}
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

          {/* Additional details */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Facility Description & Specifications
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Stainless steel dual-pedal bin set with bio and recyclable markings..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="qrCheck"
              checked={qrEnabled}
              onChange={e => setQrEnabled(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="qrCheck" className="text-xs text-slate-700 font-medium">
              Enable QR Identifier Code for this facility
            </label>
          </div>

          {/* Submit Actions */}
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
              <PlusCircle className="w-4 h-4" /> Save Facility Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
