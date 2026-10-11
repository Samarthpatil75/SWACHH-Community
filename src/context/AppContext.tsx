import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  CampusZone,
  FacilityCategory,
  Facility,
  IssueReport,
  IssueStatus,
  Inspection,
  MaintenanceSchedule,
  MaintenanceRecord,
  ActivityLog,
  AppNotification,
  FilterState,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_ZONES,
  INITIAL_CATEGORIES,
  INITIAL_FACILITIES,
  INITIAL_ISSUES,
  INITIAL_SCHEDULES,
  INITIAL_INSPECTIONS,
  INITIAL_MAINTENANCE_RECORDS,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  // Role & Auth
  currentRole: UserRole;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  canManageFacilities: boolean;
  canInspect: boolean;
  canAssignIssues: boolean;
  canUpdateWorkStatus: boolean;
  canVerifyResolution: boolean;
  canManageSchedules: boolean;
  canExportData: boolean;

  // Data collections
  zones: CampusZone[];
  categories: FacilityCategory[];
  facilities: Facility[];
  issues: IssueReport[];
  schedules: MaintenanceSchedule[];
  inspections: Inspection[];
  maintenanceRecords: MaintenanceRecord[];
  logs: ActivityLog[];
  notifications: AppNotification[];

  // CRUD & Operations
  addFacility: (facility: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>) => Facility;
  updateFacility: (id: string, updates: Partial<Facility>) => void;
  addIssueReport: (report: Omit<IssueReport, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>) => IssueReport;
  updateIssueStatus: (
    issueId: string, 
    newStatus: IssueStatus, 
    workNotes?: string, 
    actionTaken?: string,
    evidenceUrl?: string
  ) => void;
  assignIssue: (issueId: string, department: string, assignedTo?: string) => void;
  addInspection: (inspection: Omit<Inspection, 'id' | 'createdAt'>) => Inspection;
  addSchedule: (schedule: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>) => MaintenanceSchedule;
  completeScheduleTask: (scheduleId: string, workNotes: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetSampleData: () => void;

  // Global Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Computed KPIs
  kpiStats: {
    totalFacilities: number;
    issuesReported: number;
    openIssues: number;
    inProgressIssues: number;
    resolvedIssues: number;
    overdueMaintenance: number;
    facilitiesRequiringAttention: number;
  };
}

const defaultFilters: FilterState = {
  building: '',
  zoneId: '',
  categoryKey: '',
  condition: '',
  issueStatus: '',
  priority: '',
  department: '',
  dateRange: 'all',
  searchQuery: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'swachh_role_v3',
  FACILITIES: 'swachh_facilities_v3',
  ISSUES: 'swachh_issues_v3',
  SCHEDULES: 'swachh_schedules_v3',
  INSPECTIONS: 'swachh_inspections_v3',
  RECORDS: 'swachh_records_v3',
  LOGS: 'swachh_logs_v3',
  NOTIFICATIONS: 'swachh_notifications_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'admin';
  });

  const currentUser: UserProfile = INITIAL_PROFILES.find(p => p.role === currentRole) || {
    id: 'user-student-default',
    fullName: 'Campus Student / Reporter',
    email: 'student.reporter@icem.demo',
    role: currentRole,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  // State Collections with localStorage persistence
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACILITIES);
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const [issues, setIssues] = useState<IssueReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_RECORDS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Permissions based on Role
  const canManageFacilities = currentRole === 'admin';
  const canInspect = currentRole === 'admin' || currentRole === 'green_club';
  const canAssignIssues = currentRole === 'admin';
  const canUpdateWorkStatus = currentRole === 'admin' || currentRole === 'staff' || currentRole === 'green_club';
  const canVerifyResolution = currentRole === 'admin' || currentRole === 'green_club';
  const canManageSchedules = currentRole === 'admin';
  const canExportData = currentRole === 'admin' || currentRole === 'green_club';

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Add Facility
  const addFacility = (facilityData: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newFacility: Facility = {
      ...facilityData,
      id: `fac-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setFacilities(prev => [newFacility, ...prev]);

    // Log Activity
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      entityType: 'facility',
      entityId: newFacility.id,
      entityName: newFacility.name,
      actionType: 'FACILITY_CREATED',
      description: `Registered new facility ${newFacility.facilityCode}: ${newFacility.name}`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);

    return newFacility;
  };

  // Update Facility
  const updateFacility = (id: string, updates: Partial<Facility>) => {
    const now = new Date().toISOString();
    setFacilities(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates, updatedAt: now } : f))
    );
  };

  // Add Issue Report
  const addIssueReport = (
    reportData: Omit<IssueReport, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `SW-2026-${randomSuffix}`;

    const newIssue: IssueReport = {
      ...reportData,
      id: `iss-${Date.now()}`,
      referenceNumber,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
    };

    setIssues(prev => [newIssue, ...prev]);

    // Automatically flag facility condition if high/urgent priority
    if (reportData.priority === 'urgent' || reportData.priority === 'high') {
      updateFacility(reportData.facilityId, { currentCondition: 'needs_attention' });
    }

    // Add activity log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: reportData.reporterName || 'Campus Reporter',
      actorRole: currentRole,
      entityType: 'issue',
      entityId: newIssue.id,
      entityName: newIssue.title,
      actionType: 'ISSUE_REPORTED',
      description: `Report ${referenceNumber} filed for ${newIssue.facilityName}: ${newIssue.title}`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);

    // Create Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: 'admin',
      type: reportData.priority === 'urgent' ? 'alert' : 'info',
      title: `New Report: ${referenceNumber}`,
      message: `${newIssue.title} reported at ${newIssue.facilityName} (${reportData.priority.toUpperCase()} priority).`,
      link: '/issues',
      read: false,
      createdAt: now,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newIssue;
  };

  // Update Issue Status & Workflow
  const updateIssueStatus = (
    issueId: string,
    newStatus: IssueStatus,
    workNotes?: string,
    actionTaken?: string,
    evidenceUrl?: string
  ) => {
    const now = new Date().toISOString();
    const targetIssue = issues.find(i => i.id === issueId);
    if (!targetIssue) return;

    const updates: Partial<IssueReport> = {
      status: newStatus,
      updatedAt: now,
    };

    if (workNotes) updates.workNotes = workNotes;
    if (actionTaken) updates.actionTaken = actionTaken;
    if (evidenceUrl) updates.resolutionEvidenceUrl = evidenceUrl;

    if (newStatus === 'resolved_awaiting_verification') {
      updates.resolvedAt = now;
      // Record a Maintenance Record
      const newRecord: MaintenanceRecord = {
        id: `mr-${Date.now()}`,
        facilityId: targetIssue.facilityId,
        facilityName: targetIssue.facilityName,
        facilityCode: targetIssue.facilityCode,
        relatedIssueId: targetIssue.id,
        taskDescription: actionTaken || `Resolved issue: ${targetIssue.title}`,
        performedBy: currentUser.fullName,
        completedAt: now,
        workNotes: workNotes || 'Issue addressed by maintenance personnel.',
        evidenceUrl: evidenceUrl,
        verificationStatus: 'pending',
        createdAt: now,
      };
      setMaintenanceRecords(prev => [newRecord, ...prev]);
    } else if (newStatus === 'verified_closed') {
      updates.verifiedAt = now;
      // Update facility condition to satisfactory if it was needs_attention
      updateFacility(targetIssue.facilityId, { currentCondition: 'satisfactory' });
    }

    setIssues(prev =>
      prev.map(i => (i.id === issueId ? { ...i, ...updates } : i))
    );

    // Activity Log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      entityType: 'issue',
      entityId: targetIssue.id,
      entityName: targetIssue.title,
      actionType: 'STATUS_UPDATED',
      description: `Updated status of ${targetIssue.referenceNumber} to ${newStatus.replace('_', ' ').toUpperCase()}`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);

    // Send notification to monitors if awaiting verification
    if (newStatus === 'resolved_awaiting_verification') {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'green_club',
          type: 'alert',
          title: `Verification Needed: ${targetIssue.referenceNumber}`,
          message: `Work finished on ${targetIssue.facilityName}. Green Club verification requested.`,
          link: '/issues',
          read: false,
          createdAt: now,
        },
        ...prev,
      ]);
    }
  };

  // Assign Issue
  const assignIssue = (issueId: string, department: string, assignedTo?: string) => {
    const now = new Date().toISOString();
    const targetIssue = issues.find(i => i.id === issueId);
    if (!targetIssue) return;

    setIssues(prev =>
      prev.map(i =>
        i.id === issueId
          ? {
              ...i,
              assignedDepartment: department as any,
              assignedTo: assignedTo || i.assignedTo,
              status: i.status === 'submitted' ? 'open' : i.status,
              updatedAt: now,
            }
          : i
      )
    );

    // Activity Log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      entityType: 'issue',
      entityId: targetIssue.id,
      entityName: targetIssue.title,
      actionType: 'ASSIGNED',
      description: `Assigned ${targetIssue.referenceNumber} to ${department} (${assignedTo || 'Unassigned individual'})`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Add Inspection
  const addInspection = (inspectionData: Omit<Inspection, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newInspection: Inspection = {
      ...inspectionData,
      id: `insp-${Date.now()}`,
      createdAt: now,
    };

    setInspections(prev => [newInspection, ...prev]);

    // Update facility's condition and inspection timestamp!
    updateFacility(inspectionData.facilityId, {
      currentCondition: inspectionData.conditionRating,
      lastInspectedAt: inspectionData.inspectedAt,
    });

    // If maintenance is required, automatically create an issue report
    if (inspectionData.maintenanceRequired) {
      addIssueReport({
        facilityId: inspectionData.facilityId,
        facilityName: inspectionData.facilityName,
        facilityCode: inspectionData.facilityCode,
        zoneName: 'Assigned Campus Zone',
        categoryKey: 'general_facilities',
        reporterName: inspectionData.inspectorName,
        issueType: 'Inspection Follow-up Required',
        title: `Observation flagged during inspection: ${inspectionData.facilityCode}`,
        description: inspectionData.observationNotes,
        priority: inspectionData.conditionRating === 'poor' ? 'high' : 'medium',
        observedAt: inspectionData.inspectedAt,
        submittedAt: now,
      });
    }

    // Activity Log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: inspectionData.inspectorName,
      actorRole: currentRole,
      entityType: 'inspection',
      entityId: newInspection.id,
      entityName: inspectionData.facilityName,
      actionType: 'INSPECTION_RECORDED',
      description: `Completed physical inspection for ${inspectionData.facilityCode} (Rating: ${inspectionData.conditionRating})`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);

    return newInspection;
  };

  // Add Schedule
  const addSchedule = (scheduleData: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSchedule: MaintenanceSchedule = {
      ...scheduleData,
      id: `sch-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setSchedules(prev => [newSchedule, ...prev]);

    // Log Activity
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      entityType: 'schedule',
      entityId: newSchedule.id,
      entityName: newSchedule.taskDescription,
      actionType: 'SCHEDULE_CREATED',
      description: `Created schedule for ${newSchedule.facilityCode}: ${newSchedule.taskDescription} (${newSchedule.frequency})`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);

    return newSchedule;
  };

  // Complete Schedule Task
  const completeScheduleTask = (scheduleId: string, workNotes: string) => {
    const now = new Date().toISOString();
    const targetSchedule = schedules.find(s => s.id === scheduleId);
    if (!targetSchedule) return;

    // Calculate next due date based on frequency
    const nextDate = new Date();
    if (targetSchedule.frequency === 'daily') {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (targetSchedule.frequency === 'weekly') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else if (targetSchedule.frequency === 'biweekly') {
      nextDate.setDate(nextDate.getDate() + 14);
    } else if (targetSchedule.frequency === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (targetSchedule.frequency === 'quarterly') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    } else {
      nextDate.setDate(nextDate.getDate() + 30);
    }

    setSchedules(prev =>
      prev.map(s =>
        s.id === scheduleId
          ? {
              ...s,
              lastCompletedAt: now,
              nextDueAt: nextDate.toISOString(),
              updatedAt: now,
            }
          : s
      )
    );

    // Also update facility's lastCleanedAt or lastMaintenanceAt
    if (targetSchedule.taskType === 'routine_cleaning' || targetSchedule.taskType === 'waste_collection') {
      updateFacility(targetSchedule.facilityId, {
        lastCleanedAt: now,
        nextCleaningDueAt: nextDate.toISOString(),
      });
    } else {
      updateFacility(targetSchedule.facilityId, {
        lastMaintenanceAt: now,
        nextMaintenanceDueAt: nextDate.toISOString(),
      });
    }

    // Create Maintenance Record
    const newRecord: MaintenanceRecord = {
      id: `mr-${Date.now()}`,
      facilityId: targetSchedule.facilityId,
      facilityName: targetSchedule.facilityName,
      facilityCode: targetSchedule.facilityCode,
      scheduleId: targetSchedule.id,
      taskDescription: targetSchedule.taskDescription,
      performedBy: currentUser.fullName,
      completedAt: now,
      workNotes: workNotes || 'Scheduled maintenance completed.',
      verificationStatus: 'verified',
      createdAt: now,
    };
    setMaintenanceRecords(prev => [newRecord, ...prev]);

    // Activity Log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      entityType: 'schedule',
      entityId: targetSchedule.id,
      entityName: targetSchedule.taskDescription,
      actionType: 'SCHEDULE_COMPLETED',
      description: `Completed task "${targetSchedule.taskDescription}" for ${targetSchedule.facilityCode}`,
      createdAt: now,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset to initial sample data
  const resetSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.FACILITIES);
    localStorage.removeItem(STORAGE_KEYS.ISSUES);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.INSPECTIONS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

    setFacilities(INITIAL_FACILITIES);
    setIssues(INITIAL_ISSUES);
    setSchedules(INITIAL_SCHEDULES);
    setInspections(INITIAL_INSPECTIONS);
    setMaintenanceRecords(INITIAL_MAINTENANCE_RECORDS);
    setLogs(INITIAL_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    resetFilters();
  };

  // KPI Calculations (Real-time from Database records)
  const nowTime = new Date().getTime();

  // Overdue schedules: nextDueAt < nowTime and active
  const overdueCount = schedules.filter(s => {
    if (!s.isActive) return false;
    const dueTime = new Date(s.nextDueAt).getTime();
    return dueTime < nowTime;
  }).length;

  // Facilities requiring attention: condition is needs_attention/poor OR has open urgent/high issues
  const facilitiesNeedingAttention = facilities.filter(f => {
    if (f.currentCondition === 'needs_attention' || f.currentCondition === 'poor') return true;
    const hasCriticalIssue = issues.some(
      i =>
        i.facilityId === f.id &&
        (i.priority === 'urgent' || i.priority === 'high') &&
        (i.status === 'submitted' || i.status === 'open' || i.status === 'in_progress')
    );
    return hasCriticalIssue;
  }).length;

  const kpiStats = {
    totalFacilities: facilities.length,
    issuesReported: issues.length,
    openIssues: issues.filter(i => i.status === 'submitted' || i.status === 'under_review' || i.status === 'open').length,
    inProgressIssues: issues.filter(i => i.status === 'in_progress').length,
    resolvedIssues: issues.filter(
      i => i.status === 'resolved_awaiting_verification' || i.status === 'verified_closed'
    ).length,
    overdueMaintenance: overdueCount,
    facilitiesRequiringAttention: facilitiesNeedingAttention,
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        canManageFacilities,
        canInspect,
        canAssignIssues,
        canUpdateWorkStatus,
        canVerifyResolution,
        canManageSchedules,
        canExportData,

        zones: INITIAL_ZONES,
        categories: INITIAL_CATEGORIES,
        facilities,
        issues,
        schedules,
        inspections,
        maintenanceRecords,
        logs,
        notifications,

        addFacility,
        updateFacility,
        addIssueReport,
        updateIssueStatus,
        assignIssue,
        addInspection,
        addSchedule,
        completeScheduleTask,
        markNotificationRead,
        markAllNotificationsRead,
        resetSampleData,

        filters,
        setFilters,
        resetFilters,
        kpiStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
