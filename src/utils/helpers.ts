import { ConditionRating, IssuePriority, IssueStatus, OperationalStatus } from '../types';

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Not recorded';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Not recorded';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return dateString;
  }
}

export function getConditionBadge(condition: ConditionRating) {
  switch (condition) {
    case 'good':
      return {
        label: 'Good',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'satisfactory':
      return {
        label: 'Satisfactory',
        bg: 'bg-teal-50 text-teal-800 border-teal-200',
        dot: 'bg-teal-500',
      };
    case 'needs_attention':
      return {
        label: 'Needs Attention',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'poor':
      return {
        label: 'Poor Condition',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: 'Not Inspected',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getOperationalBadge(status: OperationalStatus) {
  switch (status) {
    case 'operational':
      return {
        label: 'Operational',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    case 'under_maintenance':
      return {
        label: 'Under Maintenance',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    case 'temporarily_closed':
      return {
        label: 'Temporarily Closed',
        color: 'text-purple-700 bg-purple-50 border-purple-200',
      };
    case 'out_of_service':
      return {
        label: 'Out of Service',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
      };
  }
}

export function getStatusBadge(status: IssueStatus) {
  switch (status) {
    case 'submitted':
      return {
        label: 'Submitted',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'under_review':
      return {
        label: 'Under Review',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      };
    case 'open':
      return {
        label: 'Open / Approved',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
      };
    case 'resolved_awaiting_verification':
      return {
        label: 'Awaiting Verification',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    case 'verified_closed':
      return {
        label: 'Verified & Closed',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    case 'duplicate':
      return {
        label: 'Duplicate',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
      };
  }
}

export function getPriorityBadge(priority: IssuePriority) {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Urgent',
        bg: 'bg-red-100 text-red-800 border-red-300 font-semibold',
      };
    case 'high':
      return {
        label: 'High',
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    case 'medium':
      return {
        label: 'Medium',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    case 'low':
      return {
        label: 'Low',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
      };
  }
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
