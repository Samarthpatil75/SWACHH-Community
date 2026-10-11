import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Layers, 
  Building2, 
  Compass, 
  Sparkles, 
  MapPin, 
  Download,
  Info,
  CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { CAMPUS_QR_TARGETS } from '../data/mockData';
import { CampusQRTarget } from '../types';
import { RoleLoginModal } from '../components/RoleLoginModal';

interface CampusQRCodesPageProps {
  onNavigateToReport: (zoneId: string, floor?: string) => void;
}

export const CampusQRCodesPage: React.FC<CampusQRCodesPageProps> = ({ onNavigateToReport }) => {
  const { currentRole, switchRole } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'block-a' | 'block-b' | 'amenities'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePrintTarget, setActivePrintTarget] = useState<CampusQRTarget | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Authorization check: Only Green Club Members (and Admin for testing/management)
  const isAuthorized = currentRole === 'green_club' || currentRole === 'admin';

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Authorized Personnel Only
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Green Club Member Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Campus floor and zone physical QR code generation and sticker print sheets are restricted to authorized Green Club Members for physical campus placement and monitoring.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign In with Green Club Credentials
          </button>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 max-w-md mx-auto">
          Tip: You can also use the role switcher in the top navigation bar to enter authorized credentials for any department.
        </div>

        <RoleLoginModal
          isOpen={isLoginOpen}
          targetRole="green_club"
          onClose={() => setIsLoginOpen(false)}
          onSuccess={role => switchRole(role)}
        />
      </div>
    );
  }

  // Filter targets
  const filteredTargets = CAMPUS_QR_TARGETS.filter(t => {
    if (selectedFilter === 'block-a') return t.zoneId === 'zone-avirat-a';
    if (selectedFilter === 'block-b') return t.zoneId === 'zone-avirat-b';
    if (selectedFilter === 'amenities') return t.zoneId !== 'zone-avirat-a' && t.zoneId !== 'zone-avirat-b';
    return true;
  });

  const generateTargetUrl = (target: CampusQRTarget) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set('zoneId', target.zoneId);
    if (target.floor) {
      params.set('floor', target.floor);
    }
    return `${base}#report?${params.toString()}`;
  };

  const handleCopyUrl = (target: CampusQRTarget) => {
    const url = generateTargetUrl(target);
    navigator.clipboard.writeText(url);
    setCopiedId(target.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Non-print Header & Toolbar */}
      <div className="no-print space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              The Green Club, ICEM • Physical Placement Directory
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Campus Floor & Zone QR Code Print Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              11 distinct weatherproof QR stickers for physical campus placement. When students or faculty scan any sticker, they are automatically directed to the issue report flow with that exact campus zone & floor pre-selected.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrintAll}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" /> Print All 11 Campus Stickers
            </button>
          </div>
        </div>

        {/* Filter Tabs & Guide Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All QR Codes (11)
            </button>
            <button
              onClick={() => setSelectedFilter('block-a')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'block-a'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Avirat Block A (4 Floors)
            </button>
            <button
              onClick={() => setSelectedFilter('block-b')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'block-b'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Avirat Block B (4 Floors)
            </button>
            <button
              onClick={() => setSelectedFilter('amenities')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === 'amenities'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Amenities & Grounds (3 Zones)
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 shrink-0 px-2">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Showing {filteredTargets.length} QR Stickers</span>
          </div>
        </div>
      </div>

      {/* Grid of 11 QR Sticker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTargets.map(target => {
          const scanUrl = generateTargetUrl(target);
          const isCopied = copiedId === target.id;

          return (
            <div
              key={target.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between space-y-4 group sticker-page-break"
            >
              {/* Sticker Graphic Container */}
              <div className="border-2 border-dashed border-emerald-400/80 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center text-center relative space-y-3">
                {/* Header Tag */}
                <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                    SWACHH Community
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-600">
                    {target.code}
                  </span>
                </div>

                {/* QR Code SVG */}
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 inline-block">
                  <QRCodeSVG
                    value={scanUrl}
                    size={150}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* Sticker Typography */}
                <div className="space-y-1 w-full">
                  <h3 className="text-sm font-black text-slate-900">
                    {target.title}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    The Green Club, ICEM • Digital Monitoring
                  </p>
                  <p className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 py-1 px-2 rounded-md border border-emerald-200/60">
                    📲 Scan to Report Issue on this {target.floor ? 'Floor' : 'Zone'}
                  </p>
                </div>
              </div>

              {/* Physical Placement & Details */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Physical Placement Guidance</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    {target.recommendedPlacement}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed px-1">
                  {target.description}
                </p>
              </div>

              {/* Interactive Actions for Green Club Monitor */}
              <div className="no-print pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToReport(target.zoneId, target.floor)}
                    className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Simulate scanning this QR code in browser"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Test Scan in Flow
                  </button>
                  <button
                    onClick={() => handleCopyUrl(target)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    title="Copy direct scanner link"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate px-1" title={scanUrl}>
                  {scanUrl}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Placement Guidelines Footer Notice */}
      <div className="no-print bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Green Club Field Deployment Guidelines</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-white block">1. Laminated Adhesive Placards</span>
            <p className="text-[11px] text-slate-400">
              Print onto heavy cardstock or matte vinyl adhesive sticker sheets. Laminate to resist humidity and cleaning chemicals.
            </p>
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-white block">2. Standardized Eye-Level Height</span>
            <p className="text-[11px] text-slate-400">
              Mount placards at 1.4m - 1.6m eye-level next to floor notice boards, stair landings, and corridor entrance doors.
            </p>
          </div>
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-white block">3. Zero-Friction Reporting</span>
            <p className="text-[11px] text-slate-400">
              Scanning directs students to the pre-filled floor without login barriers, validated on-ground by Green Club monitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
