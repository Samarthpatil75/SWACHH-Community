import React, { useState, useEffect } from 'react';
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
  Target,
  Lightbulb,
  Plus,
  ThumbsUp,
  MapPin,
  Clock,
  Check,
  Zap,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SustainabilitySuggestionModal } from '../components/SustainabilitySuggestionModal';
import { SustainabilitySuggestion, SuggestionCategory } from '../types';

interface SustainabilityPageProps {
  onNavigateToReport: () => void;
  onNavigateToDashboard: () => void;
}

const INITIAL_COMMUNITY_SUGGESTIONS: SustainabilitySuggestion[] = [
  {
    id: 'sugg-01',
    referenceNumber: 'SUGG-2026-1042',
    title: 'Install Automated Drip Irrigation Timer for Central Lawn & Garden',
    category: 'water_conservation',
    categoryLabel: 'Water Conservation',
    zoneName: 'Garden & Lawns',
    description: 'Transition garden watering to automated early morning drip cycles (6:00 AM) to curb sidewalk water runoff and minimize mid-day evaporation losses.',
    expectedImpact: 'Estimated to conserve 450 liters of water daily while maintaining lawn vitality.',
    submittedBy: 'Ananya Kulkarni',
    submitterDepartment: 'Civil Engineering',
    submitterRole: 'student',
    upvotes: 38,
    status: 'approved_for_pilot',
    createdAt: '2026-10-12T09:15:00Z',
  },
  {
    id: 'sugg-02',
    referenceNumber: 'SUGG-2026-1088',
    title: 'Dedicated Crushed Can & Beverage Paper Cup Drop Bins at Cafe Dil Se',
    category: 'waste_recycling',
    categoryLabel: 'Waste & Recycling',
    zoneName: 'Cafe Dil Se & Maggie Point',
    description: 'Introduce circular aperture bins specifically for disposable hot cups and soda cans to prevent coffee dregs from soaking dry recyclable paper and reduce bin overflow.',
    expectedImpact: 'Facilitates 100% clean sorting of over 200 daily beverage containers.',
    submittedBy: 'Rohan Verma',
    submitterDepartment: 'Computer Engineering',
    submitterRole: 'student',
    upvotes: 29,
    status: 'under_review',
    createdAt: '2026-10-14T11:30:00Z',
  },
  {
    id: 'sugg-03',
    referenceNumber: 'SUGG-2026-1120',
    title: 'Install Tap Aerator Nozzles Across Restrooms in Avirat Block A & B',
    category: 'water_conservation',
    categoryLabel: 'Water Conservation',
    zoneName: 'Avirat Block A',
    floor: 'All Floors',
    description: 'Retrofit standard washbasin faucets with inexpensive mist/aerator nozzles to limit splashing and maintain cleansing pressure at 35% lower water flow rate.',
    expectedImpact: 'Estimated 35% reduction in washbasin water wastage during peak class change intervals.',
    submittedBy: 'Aarav Sharma',
    submitterDepartment: 'Green Club / Civil Engineering',
    submitterRole: 'green_club',
    upvotes: 45,
    status: 'in_discussion',
    createdAt: '2026-10-15T14:00:00Z',
  },
];

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({
  onNavigateToReport,
  onNavigateToDashboard,
}) => {
  const { kpiStats } = useApp();
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SustainabilitySuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('swachh_sustainability_suggestions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMUNITY_SUGGESTIONS;
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swachh_sustainability_suggestions', JSON.stringify(suggestions));
    } catch (e) {
      console.error(e);
    }
  }, [suggestions]);

  const handleSuggestionSubmitted = (newSugg: SustainabilitySuggestion) => {
    setSuggestions(prev => [newSugg, ...prev]);
  };

  const handleToggleUpvote = (id: string) => {
    setUpvotedIds(prev => {
      const next = new Set(prev);
      const isUpvoted = next.has(id);
      if (isUpvoted) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    setSuggestions(prev =>
      prev.map(s => {
        if (s.id === id) {
          const hasUpvoted = upvotedIds.has(id);
          return {
            ...s,
            upvotes: hasUpvoted ? Math.max(0, s.upvotes - 1) : s.upvotes + 1,
          };
        }
        return s;
      })
    );
  };

  const filteredSuggestions = suggestions.filter(s => {
    if (activeCategoryFilter === 'all') return true;
    return s.category === activeCategoryFilter;
  });

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
          How centralized digital monitoring empowers students, Green Club members, and administration to maintain an organized, hygienic, and sustainable campus environment.
        </p>

        {/* Quick CTA to Open Suggestion Window */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setIsSuggestionModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Lightbulb className="w-4 h-4 text-emerald-300" />
            <span>Submit a Green Suggestion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
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

      {/* Community Green Suggestions & Proposals Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Community Green Suggestions
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active student and faculty ideas under evaluation by Green Club monitors for future campus pilot rounds.
            </p>
          </div>

          <button
            onClick={() => setIsSuggestionModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Suggestion</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Ideas' },
            { id: 'waste_recycling', label: 'Waste & Recycling' },
            { id: 'water_conservation', label: 'Water Conservation' },
            { id: 'energy_solar', label: 'Energy & Solar' },
            { id: 'greenery_biodiversity', label: 'Greenery' },
            { id: 'hygiene_sanitation', label: 'Hygiene' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategoryFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Suggestions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuggestions.map(s => {
            const isUpvoted = upvotedIds.has(s.id);
            const statusConfig = {
              approved_for_pilot: {
                label: 'Approved for Pilot',
                bg: 'bg-emerald-50',
                text: 'text-emerald-800',
                border: 'border-emerald-200',
              },
              in_discussion: {
                label: 'In Discussion',
                bg: 'bg-amber-50',
                text: 'text-amber-800',
                border: 'border-amber-200',
              },
              under_review: {
                label: 'Under Review',
                bg: 'bg-blue-50',
                text: 'text-blue-800',
                border: 'border-blue-200',
              },
              implemented: {
                label: 'Implemented',
                bg: 'bg-purple-50',
                text: 'text-purple-800',
                border: 'border-purple-200',
              },
            }[s.status] || {
              label: 'Under Review',
              bg: 'bg-slate-50',
              text: 'text-slate-700',
              border: 'border-slate-200',
            };

            return (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 text-xs group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {s.categoryLabel}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-950 transition-colors">
                    {s.title}
                  </h4>

                  {/* Location Tag */}
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-medium truncate">
                      {s.zoneName}
                      {s.floor && ` • ${s.floor}`}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {s.description}
                  </p>

                  {/* Expected Impact Highlight */}
                  {s.expectedImpact && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-700 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                        Target Impact:
                      </span>
                      <p className="leading-normal">{s.expectedImpact}</p>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">
                      {s.submittedBy}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold block truncate">
                      {s.submitterDepartment}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {s.referenceNumber}
                    </span>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleToggleUpvote(s.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-bold ${
                      isUpvoted
                        ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Endorse this sustainability idea"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-emerald-800 text-emerald-800' : ''}`} />
                    <span>{s.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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

        {/* Suggestion CTA Banner (Opens Submit Suggestion Window) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              Have an idea for campus conservation or a green initiative?
            </h4>
            <p className="text-slate-600 text-xs">
              Submit your suggestion to be evaluated by Green Club monitors for practical implementation.
            </p>
          </div>
          <button
            onClick={() => setIsSuggestionModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl text-xs hover:bg-emerald-900 transition-all shadow-md shadow-emerald-900/10 shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-emerald-300" />
            <span>Submit Suggestion</span>
          </button>
        </div>
      </section>

      {/* Dedicated Submit Suggestion Window / Modal */}
      <SustainabilitySuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        onSuggestionSubmitted={handleSuggestionSubmitted}
      />
    </div>
  );
};
