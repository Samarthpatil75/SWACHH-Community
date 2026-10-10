import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  colorScheme: 'emerald' | 'amber' | 'blue' | 'orange' | 'purple' | 'rose' | 'slate';
  onClick?: () => void;
  active?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorScheme,
  onClick,
  active,
}) => {
  const schemeClasses = {
    emerald: {
      card: 'border-emerald-200 hover:border-emerald-400 bg-white',
      activeCard: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40',
      iconBox: 'bg-emerald-100 text-emerald-800',
      value: 'text-emerald-950',
    },
    amber: {
      card: 'border-amber-200 hover:border-amber-400 bg-white',
      activeCard: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/40',
      iconBox: 'bg-amber-100 text-amber-800',
      value: 'text-amber-950',
    },
    blue: {
      card: 'border-blue-200 hover:border-blue-400 bg-white',
      activeCard: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/40',
      iconBox: 'bg-blue-100 text-blue-800',
      value: 'text-blue-950',
    },
    orange: {
      card: 'border-orange-200 hover:border-orange-400 bg-white',
      activeCard: 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/40',
      iconBox: 'bg-orange-100 text-orange-800',
      value: 'text-orange-950',
    },
    purple: {
      card: 'border-purple-200 hover:border-purple-400 bg-white',
      activeCard: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/40',
      iconBox: 'bg-purple-100 text-purple-800',
      value: 'text-purple-950',
    },
    rose: {
      card: 'border-rose-200 hover:border-rose-400 bg-white',
      activeCard: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/40',
      iconBox: 'bg-rose-100 text-rose-800',
      value: 'text-rose-950',
    },
    slate: {
      card: 'border-slate-200 hover:border-slate-400 bg-white',
      activeCard: 'ring-2 ring-slate-500 border-slate-500 bg-slate-50/40',
      iconBox: 'bg-slate-100 text-slate-800',
      value: 'text-slate-950',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-2xl border transition-all duration-150 shadow-2xs ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${active ? schemeClasses.activeCard : schemeClasses.card}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${schemeClasses.value}`}>
              {value}
            </span>
            {subtitle && (
              <span className="text-[11px] text-slate-400 font-medium">{subtitle}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`p-2 rounded-xl ${schemeClasses.iconBox}`}>
            {icon}
          </div>
          {onClick && (
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              View <ArrowUpRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
