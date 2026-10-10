import React, { useState } from 'react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Wrench, GraduationCap, Globe, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole } = useApp();
  const [open, setOpen] = useState(false);

  const rolesConfig: { role: UserRole; label: string; badge: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'admin',
      label: 'College Administration / Lead Admin',
      badge: 'Full Operational Control',
      desc: 'Facility config, assignment, schedules, user permissions & verification',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
    {
      role: 'green_club',
      label: 'Green Club Member / Monitor',
      badge: 'Inspections & Audits',
      desc: 'Physical checklists, facility condition ratings & resolution verification',
      icon: <UserCheck className="w-4 h-4 text-teal-600" />,
    },
    {
      role: 'staff',
      label: 'Housekeeping / Maintenance Staff',
      badge: 'Task Execution',
      desc: 'View assigned issues, update work progress, record completion & notes',
      icon: <Wrench className="w-4 h-4 text-amber-600" />,
    },
    {
      role: 'student',
      label: 'Student / Campus Reporter',
      badge: 'Reporter Access',
      desc: 'Scan QR codes, report facility problems & track reference IDs',
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
    },
    {
      role: 'public',
      label: 'Public Visitor',
      badge: 'Read-Only & Public Report',
      desc: 'Public cleanliness dashboard and facility view',
      icon: <Globe className="w-4 h-4 text-slate-600" />,
    },
  ];

  const currentConfig = rolesConfig.find(r => r.role === currentRole) || rolesConfig[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 transition-colors text-xs sm:text-sm font-medium shadow-xs"
        aria-expanded={open}
        aria-haspopup="true"
        title="Switch user perspective to test role-based permissions"
      >
        <span className="p-1 rounded-md bg-white shadow-2xs">{currentConfig.icon}</span>
        <div className="text-left hidden md:block">
          <div className="text-xs font-semibold leading-none text-emerald-950 flex items-center gap-1.5">
            {currentConfig.label}
          </div>
          <div className="text-[10px] text-emerald-700 font-normal mt-0.5">
            Role: {currentRole.toUpperCase()}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-emerald-700 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3.5 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-800">Demonstration Role Switcher</p>
              <p className="text-[11px] text-slate-500">
                Switch perspective to verify backend-enforced permissions and UI controls for each user role.
              </p>
            </div>

            <div className="py-1">
              {rolesConfig.map(r => {
                const isSelected = r.role === currentRole;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-emerald-50/80 text-emerald-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded bg-white shadow-2xs border border-slate-100 shrink-0">
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded mt-0.5">
                        {r.badge}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
              Role permissions are strictly validated in operations, not merely hidden in the interface.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
