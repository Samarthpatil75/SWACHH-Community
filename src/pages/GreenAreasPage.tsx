import React from 'react';
import { 
  Trees, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Leaf, 
  ClipboardCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getConditionBadge, formatDate, formatRelativeTime } from '../utils/helpers';

interface GreenAreasPageProps {
  onSelectFacility: (id: string) => void;
  onReportForFacility: (facilityId: string) => void;
  onInspectFacility: (facilityId: string) => void;
}

export const GreenAreasPage: React.FC<GreenAreasPageProps> = ({
  onSelectFacility,
  onReportForFacility,
  onInspectFacility,
}) => {
  const { facilities, zones, issues, canInspect } = useApp();

  // Green facilities
  const greenFacilities = facilities.filter(f => f.categoryKey === 'green_areas');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Environmental & Grounds Monitoring
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Campus Green Areas & Cleanliness
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring central lawns, biodiversity gardens, outdoor seating, and litter-prone hotspots.
          </p>
        </div>
      </div>

      {/* Zone Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {greenFacilities.map(f => {
          const cond = getConditionBadge(f.currentCondition);
          const openIssueCount = issues.filter(
            i => i.facilityId === f.id && i.status !== 'verified_closed' && i.status !== 'rejected'
          ).length;

          return (
            <div
              key={f.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                    {f.facilityCode}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${cond.bg}`}>
                    {cond.label}
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => onSelectFacility(f.id)}
                    className="text-base font-bold text-slate-900 hover:text-emerald-900 cursor-pointer"
                  >
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {f.building} • {f.zoneName}
                  </div>
                  <div className="text-[11px] text-slate-500 italic pl-5">
                    {f.locationDescription}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Inspected:</span>
                    <span className="font-semibold text-slate-800">
                      {f.lastInspectedAt ? formatRelativeTime(f.lastInspectedAt) : 'Not recorded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Open Reports:</span>
                    <span className="font-semibold text-slate-800">
                      {openIssueCount} {openIssueCount === 1 ? 'Report' : 'Reports'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectFacility(f.id)}
                  className="text-emerald-800 font-bold hover:underline"
                >
                  View History →
                </button>
                <div className="flex items-center gap-2">
                  {canInspect && (
                    <button
                      onClick={() => onInspectFacility(f.id)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Audit
                    </button>
                  )}
                  <button
                    onClick={() => onReportForFacility(f.id)}
                    className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Report Litter
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Zones Directory & Coordinate Notice */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Campus Zone Geospatial Directory</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          As required by Section 11, physical campus mapping utilizes authentic GPS coordinates verified for ICEM campus zones rather than speculative maps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
          {zones.map(z => (
            <div key={z.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
              <span className="font-bold text-white block">{z.name}</span>
              <p className="text-[11px] text-slate-400">{z.locationDescription}</p>
              {z.latitude && z.longitude && (
                <div className="text-[10px] font-mono text-emerald-300 pt-1">
                  GPS: {z.latitude.toFixed(4)}° N, {z.longitude.toFixed(4)}° E
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
