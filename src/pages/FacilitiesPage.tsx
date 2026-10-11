import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  QrCode, 
  Plus, 
  MapPin, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  LayoutGrid, 
  List, 
  ArrowRight,
  ClipboardCheck,
  Wrench,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getConditionBadge, getOperationalBadge, formatDate, formatRelativeTime } from '../utils/helpers';
import { Facility, FacilityCategoryKey } from '../types';

interface FacilitiesPageProps {
  onSelectFacility: (id: string) => void;
  onOpenQR: (facility: Facility) => void;
  onOpenNewFacility: () => void;
  onReportForFacility: (facilityId: string) => void;
  onInspectFacility: (facilityId: string) => void;
  initialCategory?: FacilityCategoryKey;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  onSelectFacility,
  onOpenQR,
  onOpenNewFacility,
  onReportForFacility,
  onInspectFacility,
  initialCategory,
}) => {
  const { facilities, categories, zones, issues, canManageFacilities, canInspect } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  const filteredFacilities = facilities.filter(f => {
    if (selectedCategory && f.categoryKey !== selectedCategory) return false;
    if (selectedZone && f.zoneId !== selectedZone) return false;
    if (selectedCondition && f.currentCondition !== selectedCondition) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        f.name.toLowerCase().includes(q) ||
        f.facilityCode.toLowerCase().includes(q) ||
        f.building.toLowerCase().includes(q) ||
        f.zoneName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Pilot Facility Management Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Monitored Campus Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Individual digital records, cleaning schedules, and maintenance histories for all pilot units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageFacilities && (
            <button
              onClick={onOpenNewFacility}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register New Facility
            </button>
          )}

          {/* Grid / Table toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search code (ICEM-WM-101), name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        {/* Category filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="">All Categories (6 Modules)</option>
            {categories.map(c => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Zone filter */}
        <div>
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="">All Campus Zones</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition filter */}
        <div>
          <select
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="">All Conditions</option>
            <option value="good">Good Condition</option>
            <option value="satisfactory">Satisfactory</option>
            <option value="needs_attention">Needs Attention</option>
            <option value="poor">Poor Condition</option>
            <option value="not_inspected">Not Inspected</option>
          </select>
        </div>
      </div>

      {/* Results Count & Badges */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredFacilities.length}</strong> of {facilities.length} monitored facilities
        </span>
        {(selectedCategory || selectedZone || selectedCondition || search) && (
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedZone('');
              setSelectedCondition('');
              setSearch('');
            }}
            className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid Layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFacilities.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
              No facilities match your search criteria.
            </div>
          ) : (
            filteredFacilities.map(f => {
              const cond = getConditionBadge(f.currentCondition);
              const op = getOperationalBadge(f.operationalStatus);
              const openIssueCount = issues.filter(
                i => i.facilityId === f.id && i.status !== 'verified_closed' && i.status !== 'rejected'
              ).length;

              return (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3.5">
                    {/* Top Row: Code, Category & Condition */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                        {f.facilityCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cond.bg}`}>
                          {cond.label}
                        </span>
                        {f.qrEnabled && (
                          <button
                            onClick={() => onOpenQR(f)}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            title="Print / View QR Identifier"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Facility Name & Description */}
                    <div>
                      <h3
                        onClick={() => onSelectFacility(f.id)}
                        className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        {f.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {f.description}
                      </p>
                    </div>

                    {/* Location detail */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{f.building}</span>
                        {f.floor ? <span>• {f.floor}</span> : null}
                      </div>
                      <div className="text-[10px] text-slate-500 italic pl-5 truncate">
                        {f.locationDescription}
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1">
                      <div>
                        <span className="text-slate-400 block">Last Inspected:</span>
                        <span className="font-medium text-slate-700">
                          {f.lastInspectedAt ? formatRelativeTime(f.lastInspectedAt) : 'Not recorded'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Department:</span>
                        <span className="font-medium text-slate-700">{f.assignedDepartment}</span>
                      </div>
                    </div>

                    {/* Open Issues Badge if any */}
                    {openIssueCount > 0 && (
                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          {openIssueCount} Open {openIssueCount === 1 ? 'Report' : 'Reports'}
                        </span>
                        <span className="text-[10px] text-amber-700 font-normal">Active review</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectFacility(f.id)}
                      className="text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {canInspect && (
                        <button
                          onClick={() => onInspectFacility(f.id)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Record physical inspection"
                        >
                          Inspect
                        </button>
                      )}
                      <button
                        onClick={() => onReportForFacility(f.id)}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table Layout */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Code & Name</th>
                  <th className="px-4 py-3">Zone & Location</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Operational</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Last Checked</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFacilities.map(f => {
                  const cond = getConditionBadge(f.currentCondition);
                  const op = getOperationalBadge(f.operationalStatus);
                  return (
                    <tr
                      key={f.id}
                      onClick={() => onSelectFacility(f.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-bold text-slate-900 block">
                          {f.facilityCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900">
                          {f.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{f.building}</div>
                        {f.floor ? <div className="text-[10px] text-slate-400">{f.floor}</div> : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cond.bg}`}>
                          {cond.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${op.color}`}>
                          {op.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {f.assignedDepartment}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {f.lastInspectedAt ? formatRelativeTime(f.lastInspectedAt) : 'Not recorded'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenQR(f)}
                            className="p-1.5 text-slate-400 hover:text-emerald-800 hover:bg-slate-100 rounded-md"
                            title="QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onReportForFacility(f.id)}
                            className="px-2 py-1 bg-emerald-800 text-white rounded text-[11px] font-semibold hover:bg-emerald-900"
                          >
                            Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
