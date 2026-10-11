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
  Compass,
  Layers,
  Building2
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
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Campus Zone Geospatial Directory</h3>
              <p className="text-xs text-slate-400">Authentic GPS coordinates & floor architecture across active monitoring sectors</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded-full w-fit">
            5 Active Campus Zones
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Physical campus mapping utilizes authentic GPS coordinates verified for ICEM campus pilot zones. Both Avirat Block A and Avirat Block B are configured with 4 dedicated floors (1st to 4th Floor) for granular facility tracking, while Cafe Dil Se & Maggie Point, Garden & Lawns, and Library & Admin Cell operate as non-floor designated zones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 text-xs">
          {zones.map(z => {
            const zoneFacilities = facilities.filter(f => f.zoneId === z.id);
            const isFourFloors = z.floors && z.floors.length === 4;

            return (
              <div 
                key={z.id} 
                className="p-4 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-sm">{z.name}</span>
                    {isFourFloors ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0">
                        4 Floors (1st - 4th)
                      </span>
                    ) : z.floor ? (
                      <span className="text-[10px] font-medium bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full shrink-0">
                        {z.floor}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{z.locationDescription}</p>

                  {/* Floor Breakdown for Block A & B */}
                  {z.floors && z.floors.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mb-1.5">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>Floor Breakdown ({z.floors.length} Levels):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {z.floors.map(fl => (
                          <span 
                            key={fl} 
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900/90 text-emerald-200 border border-emerald-800/40"
                          >
                            {fl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  {z.latitude && z.longitude ? (
                    <div className="text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{z.latitude.toFixed(4)}° N, {z.longitude.toFixed(4)}° E</span>
                    </div>
                  ) : <span />}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {zoneFacilities.length} {zoneFacilities.length === 1 ? 'Asset' : 'Assets'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
