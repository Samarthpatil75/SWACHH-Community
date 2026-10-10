import React, { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../utils/helpers';

export const NotificationsDrawer: React.FC<{ onNavigate?: (link: string) => void }> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, currentRole } = useApp();
  const [open, setOpen] = useState(false);

  // Filter notifications relevant to current role or all
  const filtered = notifications.filter(
    n => n.recipientRole === 'all' || n.recipientRole === currentRole || currentRole === 'admin'
  );
  const unreadCount = filtered.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Campus Notifications
                </h4>
                <p className="text-[11px] text-slate-500">
                  {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No notifications for your current role.
                </div>
              ) : (
                filtered.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markNotificationRead(item.id);
                      if (item.link && onNavigate) {
                        onNavigate(item.link);
                        setOpen(false);
                      }
                    }}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !item.read ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <div className="mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-medium ${!item.read ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
