import React from 'react';
import { 
  Sparkles, 
  Trash2, 
  Droplets, 
  Trees, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SustainabilityPageProps {
  onNavigateToReport: () => void;
  onNavigateToDashboard: () => void;
}

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({
  onNavigateToReport,
  onNavigateToDashboard,
}) => {
  const { kpiStats } = useApp();

  const proposedGoals = [
    {
      title: 'Zero Unaddressed Waste Overflow within 2 Hours',
      desc: 'Ensure reported full dustbins in Avirat Blocks A & B are cleared within 120 minutes during pilot operational hours.',
      progress: 85,
      target: '85% Target Met',
    },
    {
      title: '100% Scheduled Water Cooler Filter Servicing',
      desc: 'All campus drinking water coolers serviced on schedule with verified nozzle sanitation records.',
      progress: 75,
      target: '3 of 4 Units On Track',
    },
    {
      title: 'Active Green Club Weekly Physical Audits',
      desc: 'Conduct verified weekly checklist walks across Avirat Blocks A & B (4 floors each), Cafe Dil Se & Maggie Point, and Garden & Lawns.',
      progress: 90,
      target: '4 of 4 Audits Conducted',
    },
    {
      title: 'Promote Responsible Student Reporting Culture',
      desc: 'Transition from verbal complaints to documented digital tickets with reference IDs and photo verification.',
      progress: 80,
      target: 'Pilot Target Met',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          The Green Club, ICEM • Sustainability Framework
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Smarter Monitoring for a Greener Campus
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
          How centralized digital monitoring empowers students, maintenance staff, and administration to maintain an organized, hygienic, and sustainable campus environment.
        </p>
      </div>

      {/* 6 Sustainability Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* Pillar 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Waste Management & Segregation</h3>
          <p className="text-slate-600 leading-relaxed">
            Monitoring dustbin fullness, segregation integrity (dry recyclables vs food waste), and outdoor accumulation hotspots helps housekeeping teams deploy collection bags before litter spills into corridors.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Water Facility Maintenance Visibility</h3>
          <p className="text-slate-600 leading-relaxed">
            Documenting drinking water cooler filter replacement dates, drip tray sanitization, and overhead water tank desludging intervals ensures preventative care rather than reactive breakdowns.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Sanitation, Hygiene & Dignity</h3>
          <p className="text-slate-600 leading-relaxed">
            Restrooms are essential infrastructure. Structured reporting of plumbing drips, low water pressure, and consumable shortages enables dignified, sanitary facilities for students and faculty.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center">
            <Trees className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Green Spaces & Tree Preservation</h3>
          <p className="text-slate-600 leading-relaxed">
            Regular inspections of the central lawn, amphitheatre perimeter, and herbal garden detect disposable cup litter and ensure campus flora remains healthy and well-irrigated.
          </p>
        </div>

        {/* Pillar 5 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Community Civic Responsibility</h3>
          <p className="text-slate-600 leading-relaxed">
            Empowering students to take constructive ownership of their campus. By providing a 1-minute ticket system with tracking, students become active partners in college cleanliness.
          </p>
        </div>

        {/* Pillar 6 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Data-Driven Administration</h3>
          <p className="text-slate-600 leading-relaxed">
            Historical logs provide the college administration with authentic recurring trends — which floors experience repeated plumbing failures, peak cleaning hours, and housekeeping workload balancing.
          </p>
        </div>
      </div>

      {/* Our Campus Sustainability Goals (Section 12) */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Our Campus Sustainability Goals
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              * Proposed pilot operational benchmarks presented for Green Club and ICEM administrative review.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start">
            Pilot Target Cycle: 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposedGoals.map((g, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm">{g.title}</h4>
                <span className="font-bold text-emerald-700 shrink-0 text-xs">{g.target}</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{g.desc}</p>
              <div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
          <span>
            Have an idea for campus conservation or a green initiative?
          </span>
          <button
            onClick={onNavigateToReport}
            className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl text-xs hover:bg-emerald-900 transition-colors"
          >
            Submit Suggestion
          </button>
        </div>
      </section>
    </div>
  );
};
