import React, { useState } from 'react';
import { Leaf, Shield, HeartHandshake, ExternalLink, X } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                SWACHH<span className="text-emerald-400 font-extrabold ml-1">Community</span>
              </span>
            </div>
            <p className="text-emerald-400 font-medium text-xs">
              Smarter Monitoring. Cleaner Campus. Greener Future.
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              An initiative by <strong>The Green Club, ICEM</strong> to transition from informal campus observations to centralized digital monitoring and verifiable facility maintenance.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-semibold text-emerald-300 border border-slate-700">
                <Shield className="w-3 h-3 text-emerald-400" /> Pilot Stage: Block A & B
              </span>
            </div>
          </div>

          {/* Core Monitoring Pillars */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Pilot Monitoring Modules
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• Dustbin Segregation & Waste Hubs</li>
              <li>• Toilet Cleanliness & Sanitation</li>
              <li>• RO Water Coolers & Dispensers</li>
              <li>• Water Tank Maintenance Logs</li>
              <li>• Corridors & General Facilities</li>
              <li>• Central Lawns & Green Spaces</li>
            </ul>
          </div>

          {/* Quick Platform Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Platform Links
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Central Campus Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('facilities')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Facility Directory & QR Codes
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('report')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Report Campus Issue
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('schedules')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Maintenance Schedules
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Campus Pilot Scope & Requirements
                </button>
              </li>
            </ul>
          </div>

          {/* Pilot Transparency & Policies */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Guidance & Governance
            </h4>
            <div className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
              <p>
                Digital monitoring records complement physical checks and do not replace official administrative procedures.
              </p>
              <div className="pt-1 flex flex-col gap-1.5">
                <button
                  onClick={() => setGuidelinesModalOpen(true)}
                  className="text-left text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5" /> Reporting Guidelines
                </button>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="text-left text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Privacy & Data Policy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SWACHH Community — The Green Club, ICEM. All rights reserved.
          </div>
          <div className="text-center sm:text-right text-slate-400">
            Initial Limited Pilot. Sample demonstration data until authentic records are formally supplied.
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Privacy & Reporting Policy</h3>
              <button onClick={() => setPrivacyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                <strong>1. Reporter Privacy:</strong> Issue reporting supports optional anonymity. When name or contact details are supplied, they are stored securely and not exposed to the public dashboard.
              </p>
              <p>
                <strong>2. Photographs:</strong> Photographs submitted with reports must depict facility conditions only. Photographs containing personal identifiable information (faces, private documents) should not be uploaded.
              </p>
              <p>
                <strong>3. Auditability:</strong> Maintenance and inspection updates are logged with timestamps and responsible roles to maintain campus accountability.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reporting Guidelines Modal */}
      {guidelinesModalOpen && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Campus Issue Reporting Guidelines</h3>
              <button onClick={() => setGuidelinesModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                • <strong>Verify Location:</strong> Confirm the exact facility code or location (e.g. ICEM-WM-101 or Block A 1st Floor) to help maintenance staff respond promptly.
              </p>
              <p>
                • <strong>Accurate Severity:</strong> Reserve "Urgent" for active pipe bursts, electrical hazards, or severe sanitation failures requiring rapid intervention.
              </p>
              <p>
                • <strong>Constructive Observations:</strong> Provide clear descriptions rather than subjective grievances to enable actionable work orders.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setGuidelinesModalOpen(false)}
                className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
