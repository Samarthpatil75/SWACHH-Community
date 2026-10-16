import React, { useState } from 'react';
import { 
  Leaf, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  QrCode,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { ROLE_CREDENTIALS } from '../components/RoleLoginModal';
import { CAMPUS_QR_TARGETS } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, personnelName?: string) => void;
  scannedZoneId?: string | null;
  scannedFloor?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  scannedZoneId,
  scannedFloor,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCred = ROLE_CREDENTIALS[selectedRole];

  // Matched physical QR code target if arriving via scanned QR
  const scannedTarget = scannedZoneId
    ? CAMPUS_QR_TARGETS.find(
        t => t.zoneId === scannedZoneId && (!scannedFloor || t.floor === scannedFloor)
      )
    : null;

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setName('');
    setPassword('');
  };

  const handleAutofill = () => {
    setName(activeCred.defaultName);
    setPassword(activeCred.defaultPassword);
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
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    const isPasswordValid = activeCred.passwords.some(
      p => p.toLowerCase() === trimmedPassword.toLowerCase()
    );

    const isNameValid = 
      activeCred.validNames.some(vn => vn.toLowerCase() === trimmedName.toLowerCase()) ||
      trimmedName.length >= 2;

    setTimeout(() => {
      setIsSubmitting(false);

      if (!isPasswordValid) {
        setErrorMessage(
          `Invalid password for ${activeCred.roleTitle}. Please verify authorized credentials or click "Autofill".`
        );
        return;
      }

      if (!isNameValid) {
        setErrorMessage(
          `Invalid personnel name for ${activeCred.roleTitle}. Please enter an authorized name.`
        );
        return;
      }

      // Login success
      onLoginSuccess(selectedRole, trimmedName);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-950 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Login Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 my-auto relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-800/30">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                SWACHH<span className="text-emerald-700 font-extrabold ml-1">Community</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                The Green Club, ICEM
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
              Digital Campus Monitoring & Facility Maintenance Management System
            </p>
          </div>
        </div>

        {/* Scanned QR Location Banner (if user scanned a QR placard) */}
        {scannedTarget && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                Scanned QR Code Identified
              </span>
              <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">
                {scannedTarget.title} ({scannedTarget.code})
              </h4>
              <p className="text-[11px] text-slate-600">
                Sign in to proceed directly with your issue report.
              </p>
            </div>
          </div>
        )}

        {/* 3-Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase">
            Select Your Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[
              { role: 'student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
              { role: 'green_club', label: 'Green Club', icon: <UserCheck className="w-3.5 h-3.5" /> },
              { role: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            ].map(tab => (
              <button
                key={tab.role}
                type="button"
                onClick={() => handleRoleTabChange(tab.role as UserRole)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === tab.role
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Role Description & Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> Authorized Demo Credentials
            </span>
            <button
              type="button"
              onClick={handleAutofill}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              Autofill
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 font-mono">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-sans">Name</span>
              <span className="font-bold text-slate-800 truncate block">{activeCred.defaultName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-sans">Password</span>
              <span className="font-bold text-slate-800 truncate block">{activeCred.defaultPassword}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            {activeCred.description}
          </p>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Login Form: Name & Password */}
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
                placeholder={`e.g. ${activeCred.defaultName}`}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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

          {/* Strict Notice: No Account Creation Allowed */}
          <div className="text-[11px] text-slate-400 text-center py-1 border-t border-slate-100">
            Institutional access is managed by college administration. No self-registration is permitted.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeCred.themeColor.btn
            } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign In to SWACHH Community</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
