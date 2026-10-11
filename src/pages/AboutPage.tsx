import React from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Users, 
  Sparkles, 
  Building2, 
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigateToReport: () => void;
  onNavigateToDashboard: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToReport,
  onNavigateToDashboard,
}) => {
  const objectives = [
    'Create a centralized digital record of selected campus facilities.',
    'Make cleanliness and facility monitoring easier for Green Club members.',
    'Allow users to report problems with a specific facility in ~1 minute.',
    'Monitor cleaning, inspection, and maintenance schedules dynamically.',
    'Record maintenance requirements and verified actions taken.',
    'Help administrators identify recurring issues and overdue maintenance.',
    'Improve coordination between Green Club members, housekeeping staff, maintenance teams, and college administration.',
    'Provide visibility into reported issues, current facility status, pending actions, and resolved issues.',
    'Support QR codes or identification labels for selected campus locations, subject to college permission.',
    'Encourage responsible campus participation and sustainability awareness.',
    'Generate authentic reports that help the college assess facility conditions and identify areas requiring attention.',
  ];

  const pilotRequirements = [
    {
      num: 1,
      title: 'Facility Access for Observations',
      desc: 'Access to selected campus facilities across 5 zones (Avirat Block A [4 floors], Avirat Block B [4 floors], Cafe Dil Se & Maggie Point, Garden & Lawns, Library & Admin Cell) for regular physical checklist observation and baseline data collection.',
      status: 'Requested for Pilot',
    },
    {
      num: 2,
      title: 'Coordination with Housekeeping & Maintenance',
      desc: 'Channel of communication with supervisory housekeeping and maintenance personnel to share work tickets and log completion notes.',
      status: 'Requested for Pilot',
    },
    {
      num: 3,
      title: 'QR Code Identification Label Placement',
      desc: 'Formal administrative sanction to place weather-resistant identification stickers on selected pilot fixtures (dustbin stations, water coolers, restrooms).',
      status: 'Pending College Sanction',
    },
    {
      num: 4,
      title: 'Operational Information Access',
      desc: 'Access to basic authentic schedules, such as vendor water tank cleaning frequency, filter replacement logs, and routine cleaning shifts.',
      status: 'Requested for Pilot',
    },
    {
      num: 5,
      title: 'Administrative Alignment',
      desc: 'Periodic coordination with administrative departments to ensure digital logs harmonize with existing institutional reporting procedures.',
      status: 'In Discussion',
    },
    {
      num: 6,
      title: 'Limited Campus Pilot Sanction',
      desc: 'Official green light to conduct a structured, limited demonstration pilot to validate digital monitoring efficacy.',
      status: 'Proposal Stage',
    },
  ];

  const futureRoadmap = [
    'Expansion to remaining ICEM hostel blocks and sports complexes.',
    'Specialized electronic waste (E-Waste) collection campaigns.',
    'Campus solar energy generation and rainwater harvesting sensor feeds.',
    'Student sustainability incentive badges and volunteer recognition.',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-xs">
      {/* Page Title & Badges */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
          <Leaf className="w-3.5 h-3.5 text-emerald-700" />
          The Green Club, ICEM • Institutional Proposal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Digital Campus Monitoring & Sustainability Dashboard
        </h1>
        <p className="text-sm font-semibold text-emerald-800">
          SWACHH Community — Smarter Monitoring. Cleaner Campus. Greener Future.
        </p>
      </div>

      {/* Formal About the Project Statement (Section 15) */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-4 leading-relaxed">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-slate-900">About the Project</h2>
        </div>
        <blockquote className="text-slate-700 text-xs sm:text-sm italic bg-slate-50 p-5 rounded-2xl border-l-4 border-emerald-600 leading-relaxed space-y-3">
          <p>
            “SWACHH Community is a proposed digital campus monitoring initiative designed to support The Green Club, ICEM, in tracking selected campus facilities, cleanliness conditions, maintenance requirements, and sustainability-related observations through a centralized dashboard.
          </p>
          <p>
            The initial pilot focuses on dustbin cleaning and waste management, toilet cleanliness, drinking-water facilities, water tank cleaning schedules, general facility maintenance, and campus cleanliness and green-area monitoring.
          </p>
          <p>
            The platform aims to provide a structured way to record observations, report issues, monitor maintenance schedules, document actions taken, and review the status of reported problems.
          </p>
          <p>
            The system is intended to support coordination between students, authorized Green Club members, housekeeping and maintenance staff, and college administration. It complements existing college processes and does not replace physical inspections or official maintenance procedures.”
          </p>
        </blockquote>
      </section>

      {/* Core Objectives (Section 2) */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-slate-900">Platform Objectives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 leading-relaxed font-medium">{obj}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Pilot Requirements for College Administration (Section 16) */}
      <section className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Campus Pilot Requirements
            </h2>
          </div>
          <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
            * Formal checklist presented for discussion with ICEM college administration. These items represent support requested from the college to facilitate a structured pilot, not permissions already granted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {pilotRequirements.map(req => (
            <div key={req.num} className="p-4 rounded-2xl bg-emerald-800/80 border border-emerald-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  {req.num}. {req.title}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
                  {req.status}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 leading-relaxed">
                {req.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Initial Pilot Scope & Future Roadmap */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Initial Pilot Scope</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The pilot is deliberately bounded to 5 selected campus zones: Avirat Block A (4 floors), Avirat Block B (4 floors), Cafe Dil Se & Maggie Point, Garden & Lawns, and Library & Admin Cell across the 6 approved categories. This ensures manageable data fidelity, authentic response verification, and immediate proof of value.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Future Expansion Roadmap</h3>
          </div>
          <ul className="space-y-2 text-slate-600">
            {futureRoadmap.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom CTA to explore */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateToDashboard}
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          Explore Central Monitoring Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
