import React, { useState } from 'react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, GraduationCap, ChevronDown, Check, Lock } from 'lucide-react';
import { RoleLoginModal } from './RoleLoginModal';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole } = useApp();
  const [open, setOpen] = useState(false);
  const [loginModalTarget, setLoginModalTarget] = useState<'green_club' | 'admin' | null>(null);

  const rolesConfig: { 
    role: UserRole; 
    label: string; 
    badge: string; 
    desc: string; 
    icon: React.ReactNode;
    requiresAuth: boolean;
  }[] = [
    {
      role: 'student',
      label: 'Student / Campus Reporter',
      badge: 'Public • No Login Required',
      desc: 'Scan QR codes & report issues instantly without sign-in barriers. Reports are verified on-site by Green Club.',
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
      requiresAuth: false,
    },
    {
      role: 'green_club',
      label: 'Green Club Member / Monitor',
      badge: 'Credentials Required',
      desc: 'Conduct physical checklists, facility condition ratings, and print campus QR code placards.',
      icon: <UserCheck className="w-4 h-4 text-teal-600" />,
      requiresAuth: true,
    },
    {
      role: 'admin',
      label: 'College Administration / Lead Admin',
      badge: 'Credentials Required',
      desc: 'Facility config, work assignment, schedules, user permissions, and final verification.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      requiresAuth: true,
    },
  ];

  const currentConfig = rolesConfig.find(r => r.role === currentRole) || rolesConfig[0];

  const handleSelectRole = (role: UserRole) => {
    setOpen(false);
    if (role === 'student') {
      switchRole('student');
      return;
    }

    if (currentRole === role) {
      return;
    }

    // Prompt for Name and Password login info
    setLoginModalTarget(role as 'green_club' | 'admin');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 transition-colors text-xs sm:text-sm font-medium shadow-xs cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
        title="Switch user perspective (Credentials required for Green Club and administration)"
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
          <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3.5 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-800">Switch User Perspective</p>
              <p className="text-[11px] text-slate-500">
                Students report issues freely without login. Green Club & administration roles require authorization credentials.
              </p>
            </div>

            <div className="py-1">
              {rolesConfig.map(r => {
                const isSelected = r.role === currentRole;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleSelectRole(r.role)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/80 text-emerald-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded bg-white shadow-2xs border border-slate-100 shrink-0">
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{r.label}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : r.requiresAuth ? (
                          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        ) : null}
                      </div>
                      <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded mt-0.5 ${
                        r.requiresAuth 
                          ? 'text-slate-600 bg-slate-100' 
                          : 'text-emerald-700 bg-emerald-100/70'
                      }`}>
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

            <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500">
              Institutional security: Green Club and administrative accounts require verified Name and Password.
            </div>
          </div>
        </>
      )}

      {/* Role Credentials Login Dialog */}
      <RoleLoginModal
        isOpen={loginModalTarget !== null}
        targetRole={loginModalTarget}
        onClose={() => setLoginModalTarget(null)}
        onSuccess={role => {
          switchRole(role);
        }}
      />
    </div>
  );
};

