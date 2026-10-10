import React, { useState } from 'react';
import { AlertCircle, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DemoBanner: React.FC = () => {
  const { resetSampleData } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (dismissed) return null;

  const handleReset = () => {
    resetSampleData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="bg-emerald-900 text-white text-xs sm:text-sm px-4 py-2.5 transition-all duration-200 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 border border-emerald-600">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            PILOT DEMO MODE
          </span>
          <span className="text-emerald-100 text-xs sm:text-sm">
            Displaying sample data for selected pilot zones (Block A, B, Amenities). Official verified records will be integrated under ICEM administration guidance.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {resetSuccess ? (
            <span className="inline-flex items-center gap-1 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sample Data Reloaded
            </span>
          ) : (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors text-xs font-medium border border-emerald-700 cursor-pointer"
              title="Reset all facilities, issues and schedules to fresh demo seed data"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Sample Data
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-emerald-300 hover:text-white p-1 rounded hover:bg-emerald-800 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
