import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Copy, Check, ExternalLink, Leaf } from 'lucide-react';
import { Facility } from '../types';

interface QRCodeModalProps {
  facility: Facility | null;
  onClose: () => void;
  onNavigateToReport?: (facilityId: string) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  facility,
  onClose,
  onNavigateToReport,
}) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!facility) return null;

  // The scan URL in a real production deployment
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://swachh.icem.ac.in';
  const targetUrl = `${origin}/#report?facilityId=${facility.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Facility QR Identifier Label</h3>
              <p className="text-[11px] text-emerald-200">The Green Club, ICEM — SWACHH Community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-md hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Printable Label Box */}
          <div
            ref={printRef}
            className="w-full max-w-xs border-2 border-dashed border-emerald-500 rounded-2xl p-5 bg-white text-center shadow-sm relative"
          >
            {/* Tagline / Header */}
            <div className="text-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                SWACHH Community
              </span>
              <p className="text-[9px] text-slate-500 mt-1 font-medium">
                The Green Club, ICEM • Digital Campus Monitoring
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 inline-block mb-3">
              <QRCodeSVG
                value={targetUrl}
                size={160}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Facility Identification Details */}
            <div className="space-y-1">
              <span className="font-mono text-sm font-extrabold text-emerald-950 bg-emerald-100/70 px-2.5 py-1 rounded inline-block tracking-wider">
                {facility.facilityCode}
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                {facility.name}
              </h4>
              <p className="text-[11px] text-slate-600">
                {facility.building} • {facility.floor || 'Ground Floor'}
              </p>
              <p className="text-[9px] text-slate-400 italic">
                {facility.locationDescription}
              </p>
            </div>

            {/* Scan prompt banner */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-semibold text-emerald-800">
              📲 Scan with mobile camera to view status or report an issue
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-6 grid grid-cols-2 gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Label
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied' : 'Copy Direct Link'}
            </button>
          </div>

          {onNavigateToReport && (
            <button
              onClick={() => {
                onNavigateToReport(facility.id);
                onClose();
              }}
              className="mt-3 text-xs text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Issue Reporting Form for this facility
            </button>
          )}

          <div className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
            * Physical placement of QR stickers on campus fixtures is subject to formal administrative sanction from ICEM authorities.
          </div>
        </div>
      </div>
    </div>
  );
};
