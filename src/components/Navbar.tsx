import React, { useState } from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  Building2, 
  AlertTriangle, 
  CalendarClock, 
  ClipboardCheck, 
  Trees, 
  BarChart3, 
  Info, 
  Menu, 
  X, 
  Search,
  Sparkles,
  ListTodo,
  QrCode
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationsDrawer } from './NotificationsDrawer';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRole } = useApp();

  const isGreenClubOrAdmin = currentRole === 'green_club' || currentRole === 'admin';

  const navLinks = [
    { id: 'home', label: 'Home', icon: <Leaf className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'facilities', label: 'Facilities', icon: <Building2 className="w-4 h-4" /> },
    { id: 'report', label: 'Report Issue', icon: <AlertTriangle className="w-4 h-4" />, highlight: true },
    ...(isGreenClubOrAdmin ? [
      { id: 'campus-qrcodes', label: 'Campus QR Hub', icon: <QrCode className="w-4 h-4 text-emerald-500" />, badge: 'Print' }
    ] : []),
    { id: 'issues', label: 'Manage Issues', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'schedules', label: 'Schedules', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'inspections', label: 'Inspections', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'green-areas', label: 'Green Areas', icon: <Trees className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sustainability', label: 'Sustainability', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About Pilot', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Wordmark */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  SWACHH<span className="text-emerald-700 font-extrabold ml-1">Community</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                  Pilot
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight">
                The Green Club, ICEM
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 7).map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : link.highlight
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}

            {/* Secondary dropdown/more */}
            <div className="relative group">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  ['campus-qrcodes', 'green-areas', 'analytics', 'sustainability', 'about'].includes(currentTab)
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                More
                <span className="text-[10px]">▾</span>
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50">
                <div className="w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-in fade-in duration-100">
                  {navLinks.slice(7).map(link => (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                        currentTab === link.id ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right Header Utilities: Search, Notifications, Role Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Quick Search (Ctrl + K)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <NotificationsDrawer
              onNavigate={link => {
                const tab = link.replace('/', '');
                if (tab) onSelectTab(tab);
              }}
            />

            <RoleSwitcher />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Navigation Menu (Active: {currentRole.toUpperCase()})
          </div>
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : link.highlight
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-emerald-700'}>{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
