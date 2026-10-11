import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Wrench, 
  GraduationCap,
  Lock, 
  User, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound 
} from 'lucide-react';
import { UserRole } from '../types';

export interface RoleCredential {
  role: UserRole;
  roleTitle: string;
  badge: string;
  defaultName: string;
  validNames: string[];
  defaultPassword: string;
  passwords: string[];
  description: string;
  icon: React.ReactNode;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    btn: string;
  };
}

export const ROLE_CREDENTIALS: Record<UserRole, RoleCredential> = {
  student: {
    role: 'student',
    roleTitle: 'Student / Campus Reporter',
    badge: 'Campus Reporting & Tracking',
    defaultName: 'Neha Deshmukh',
    validNames: [
      'neha deshmukh',
      'neha',
      'student',
      'neha.student@icem.demo',
    ],
    defaultPassword: 'student@icem',
    passwords: ['student@icem', 'student123', 'icem2026', 'student'],
    description: 'Allows students to report campus cleanliness issues, track resolution status, and monitor facility health.',
    icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
    themeColor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      btn: 'bg-blue-800 hover:bg-blue-900',
    },
  },
  green_club: {
    role: 'green_club',
    roleTitle: 'Green Club Member / Campus Monitor',
    badge: 'Inspections & Audits',
    defaultName: 'Aarav Sharma',
    validNames: [
      'aarav sharma',
      'aarav sharma (green club lead)',
      'aarav',
      'greenclub',
      'green club',
      'aarav.greenclub@icem.demo',
    ],
    defaultPassword: 'greenclub@icem',
    passwords: ['greenclub@icem', 'greenclub123', 'icem2026'],
    description: 'Requires authorized Green Club credentials to record physical inspections, rate facility conditions, and print campus QR placards.',
    icon: <UserCheck className="w-5 h-5 text-teal-600" />,
    themeColor: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
      btn: 'bg-teal-800 hover:bg-teal-900',
    },
  },
  staff: {
    role: 'staff',
    roleTitle: 'Housekeeping & Maintenance Staff',
    badge: 'Work Order Execution',
    defaultName: 'Ramesh Jadhav',
    validNames: [
      'ramesh jadhav',
      'ramesh jadhav (supervisor)',
      'ramesh',
      'staff',
      'housekeeping',
      'ramesh.maintenance@icem.demo',
    ],
    defaultPassword: 'staff@icem',
    passwords: ['staff@icem', 'staff123', 'icem2026'],
    description: 'Requires housekeeping or maintenance staff credentials to view assigned work, update progress, and log completion evidence.',
    icon: <Wrench className="w-5 h-5 text-amber-600" />,
    themeColor: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      btn: 'bg-amber-800 hover:bg-amber-900',
    },
  },
  admin: {
    role: 'admin',
    roleTitle: 'College Administration / Lead Admin',
    badge: 'Full Operational Authority',
    defaultName: 'Prof. S. R. Kulkarni',
    validNames: [
      'prof. s. r. kulkarni',
      's. r. kulkarni',
      'kulkarni',
      'admin',
      'administrator',
      'admin.swachh@icem.demo',
    ],
    defaultPassword: 'admin@icem',
    passwords: ['admin@icem', 'admin123', 'icem2026'],
    description: 'Requires college administrative clearance to manage campus facilities, configure schedules, verify resolutions, and oversee pilot operations.',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    themeColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      btn: 'bg-emerald-800 hover:bg-emerald-900',
    },
  },
};

interface RoleLoginModalProps {
  isOpen: boolean;
  targetRole: UserRole | null;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  targetRole,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const credConfig = targetRole ? ROLE_CREDENTIALS[targetRole] : null;

  // Reset form whenever target role changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPassword('');
      setErrorMessage(null);
      setShowPassword(false);
    }
  }, [isOpen, targetRole]);

  if (!isOpen || !credConfig) return null;

  const handleAutofill = () => {
    setName(credConfig.defaultName);
    setPassword(credConfig.defaultPassword);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your authorized personnel name.');
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage('Please enter the authorization password.');
      return;
    }

    setIsSubmitting(true);

    // Validate password and name against role configuration
    const isPasswordValid = credConfig.passwords.some(
      p => p.toLowerCase() === trimmedPassword.toLowerCase()
    );

    const isNameValid = 
      credConfig.validNames.some(vn => vn.toLowerCase() === trimmedName.toLowerCase()) ||
      trimmedName.length >= 2;

    setTimeout(() => {
      setIsSubmitting(false);

      if (!isPasswordValid) {
        setErrorMessage(
          `Invalid password for ${credConfig.roleTitle}. Please verify your credentials or click "Autofill".`
        );
        return;
      }

      if (!isNameValid) {
        setErrorMessage(
          `Invalid personnel name for ${credConfig.roleTitle}. Please enter an authorized name.`
        );
        return;
      }

      // Successful login
      onSuccess(credConfig.role);
      onClose();
    }, 250);
  };

  // Render modal into document.body to ensure 100% viewport centering
  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150"
      style={{ margin: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Header Bar with Role Theme */}
        <div className={`p-5 ${credConfig.themeColor.bg} border-b ${credConfig.themeColor.border} flex items-start justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-slate-200/80 shrink-0">
              {credConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                  {credConfig.badge}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  ROLE: {credConfig.role.toUpperCase()}
                </span>
              </div>
              <h3 id="login-modal-title" className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {credConfig.roleTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            {credConfig.description}
          </p>

          {/* Quick Demo Credentials Autofill Chip */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> Authorized Personnel Credentials
              </span>
              <button
                type="button"
                onClick={handleAutofill}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Autofill
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60 font-mono">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-sans">Name</span>
                <span className="font-bold text-slate-800 truncate block">{credConfig.defaultName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-sans">Password</span>
                <span className="font-bold text-slate-800 truncate block">{credConfig.defaultPassword}</span>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personnel Name Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Authorized Personnel Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={`e.g. ${credConfig.defaultName}`}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter authorized password"
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Strict Notice: No Account Creation */}
            <div className="text-[11px] text-slate-400 text-center py-1 border-t border-slate-100">
              Institutional access is managed by college administration. No self-registration is permitted.
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-2/3 py-2.5 px-4 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${credConfig.themeColor.btn} ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
