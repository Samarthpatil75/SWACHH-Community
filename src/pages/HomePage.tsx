import React from 'react';
import { 
  Leaf, 
  ArrowRight, 
  Trash2, 
  Droplets, 
  CupSoda, 
  Database, 
  Wrench, 
  Trees, 
  CheckCircle2, 
  ScanLine, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FacilityCategoryKey } from '../types';

interface HomePageProps {
  onSelectTab: (tab: string, categoryFilter?: FacilityCategoryKey) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab, onOpenSearch }) => {
  const { kpiStats, facilities } = useApp();

  const categoriesConfig: {
    key: FacilityCategoryKey;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: 'waste_management',
      title: 'Waste Management & Dustbins',
      desc: 'Segregated waste stations, overflow prevention, and timely collection monitoring.',
      icon: <Trash2 className="w-5 h-5 text-emerald-600" />,
      color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200',
    },
    {
      key: 'toilets_sanitation',
      title: 'Toilets & Sanitation',
      desc: 'Restroom hygiene inspection logs, plumbing defect reporting, and supply refills.',
      icon: <Droplets className="w-5 h-5 text-teal-600" />,
      color: 'from-teal-500/10 to-teal-500/5 border-teal-200',
    },
    {
      key: 'drinking_water',
      title: 'Drinking Water Coolers',
      desc: 'Filter replacement schedules, cooler chilling health, and sanitary nozzle checks.',
      icon: <CupSoda className="w-5 h-5 text-blue-600" />,
      color: 'from-blue-500/10 to-blue-500/5 border-blue-200',
    },
    {
      key: 'water_tanks',
      title: 'Water Tank Maintenance',
      desc: 'Campus storage tanks, scheduled desludging dates, and maintenance audit trails.',
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      color: 'from-indigo-500/10 to-indigo-500/5 border-indigo-200',
    },
    {
      key: 'general_facilities',
      title: 'General Facility Maintenance',
      desc: 'Corridor lighting, fixtures, labs, and essential educational infrastructure.',
      icon: <Wrench className="w-5 h-5 text-amber-600" />,
      color: 'from-amber-500/10 to-amber-500/5 border-amber-200',
    },
    {
      key: 'green_areas',
      title: 'Campus Green Areas & Lawns',
      desc: 'Central lawns, biodiversity gardens, and outdoor litter hotspot monitoring.',
      icon: <Trees className="w-5 h-5 text-green-600" />,
      color: 'from-green-500/10 to-green-500/5 border-green-200',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-emerald-100 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>An Initiative by The Green Club, ICEM</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-700 font-medium">Limited Campus Pilot</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              A Cleaner Campus Starts With{' '}
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Better Monitoring.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              SWACHH Community is a digital campus monitoring platform designed to help track cleanliness, facility conditions, maintenance needs, and sustainability activities through one centralized system.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onSelectTab('report')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Report an Issue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectTab('dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Campus Dashboard
              </button>

              <button
                onClick={onOpenSearch}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Search facility by ID"
              >
                <Search className="w-4 h-4 text-slate-500" />
                Find Facility
              </button>
            </div>

            {/* Live Pilot Stats Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                <span className="block text-2xl font-black text-emerald-900">{kpiStats.totalFacilities}</span>
                <span className="text-[11px] font-semibold text-slate-500">Monitored Facilities</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                <span className="block text-2xl font-black text-blue-900">{kpiStats.issuesReported}</span>
                <span className="text-[11px] font-semibold text-slate-500">Documented Issues</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                <span className="block text-2xl font-black text-purple-900">{kpiStats.resolvedIssues}</span>
                <span className="text-[11px] font-semibold text-slate-500">Resolved & Verified</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                <span className="block text-2xl font-black text-amber-900">{facilities.filter(f => f.qrEnabled).length}</span>
                <span className="text-[11px] font-semibold text-slate-500">QR Enabled Points</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Pilot Focus Areas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Comprehensive Facility Monitoring
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every facility in the pilot possesses an individual identification code, condition status, and maintenance record.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoriesConfig.map(cat => {
            const count = facilities.filter(f => f.categoryKey === cat.key).length;
            return (
              <div
                key={cat.key}
                onClick={() => onSelectTab('facilities', cat.key)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} border hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-100">
                      {cat.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {count} {count === 1 ? 'Unit' : 'Units'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>View Facilities</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works: 4-Step Structured Workflow */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              Operational Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How SWACHH Community Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A transparent, documented 4-step process from initial observation to verified maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                1
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-emerald-400" /> 1. Identify
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Locate a selected campus facility or scan its dedicated QR code sticker to open its digital record directly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
                2
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400" /> 2. Report or Inspect
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students report facility problems in ~1 minute, or Green Club members record structured checklist inspections.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                3
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" /> 3. Take Action
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authorized staff review, set status to In Progress, execute required maintenance, and document work notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm border border-purple-500/30">
                4
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> 4. Track & Verify
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work is verified by monitors before closure, building an authentic maintenance history for administrative review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Governance Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800 px-3 py-1 rounded-full border border-emerald-700">
              Campus Transparency
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Moving From Informal Complaints to Verifiable Maintenance
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Instead of untracked verbal complaints, SWACHH Community creates an auditable record of every facility's cleaning cycle, reported problems, technician assignments, and verified outcomes.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-emerald-800/80 px-3.5 py-2 rounded-xl border border-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Unique Facility Identifiers
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/80 px-3.5 py-2 rounded-xl border border-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Documented Action Logs
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/80 px-3.5 py-2 rounded-xl border border-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Administrative Reporting
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onSelectTab('about')}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer"
              >
                Review Campus Pilot Scope & Requirements
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
