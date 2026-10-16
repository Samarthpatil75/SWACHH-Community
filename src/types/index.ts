export type UserRole = 'admin' | 'green_club' | 'student';

export type DepartmentType = 
  | 'Housekeeping'
  | 'Plumbing'
  | 'Water Facility'
  | 'Gardening'
  | 'Electrical'
  | 'General Maintenance'
  | 'Administration';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: DepartmentType;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface CampusZone {
  id: string;
  name: string;
  building: string;
  floor?: string;
  floors?: string[];
  locationDescription: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
}

export type FacilityCategoryKey = 
  | 'waste_management'
  | 'toilets_sanitation'
  | 'drinking_water'
  | 'water_tanks'
  | 'general_facilities'
  | 'green_areas';

export interface FacilityCategory {
  id: string;
  key: FacilityCategoryKey;
  name: string;
  description: string;
  iconKey: string;
  isActive: boolean;
}

export type OperationalStatus = 
  | 'operational'
  | 'under_maintenance'
  | 'temporarily_closed'
  | 'out_of_service';

export type ConditionRating = 
  | 'good'
  | 'satisfactory'
  | 'needs_attention'
  | 'poor'
  | 'not_inspected';

export interface Facility {
  id: string;
  facilityCode: string;
  name: string;
  categoryId: string;
  categoryKey: FacilityCategoryKey;
  zoneId: string;
  zoneName: string;
  building: string;
  floor?: string;
  locationDescription: string;
  description: string;
  operationalStatus: OperationalStatus;
  currentCondition: ConditionRating;
  lastInspectedAt?: string;
  lastCleanedAt?: string;
  nextCleaningDueAt?: string;
  lastMaintenanceAt?: string;
  nextMaintenanceDueAt?: string;
  assignedDepartment: DepartmentType;
  qrEnabled: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export type IssueStatus = 
  | 'submitted'
  | 'under_review'
  | 'open'
  | 'in_progress'
  | 'resolved_awaiting_verification'
  | 'verified_closed'
  | 'rejected'
  | 'duplicate';

export interface IssueReport {
  id: string;
  referenceNumber: string; // e.g. SW-2026-1001
  facilityId: string;
  facilityName: string;
  facilityCode: string;
  zoneName: string;
  categoryKey: FacilityCategoryKey;
  reportedBy?: string; // user id or undefined for anonymous
  reporterName?: string;
  reporterEmail?: string;
  issueType: string;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  observedAt: string;
  submittedAt: string;
  assignedDepartment?: DepartmentType;
  assignedTo?: string; // assigned personnel name
  resolvedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  duplicateOf?: string;
  workNotes?: string;
  actionTaken?: string;
  resolutionEvidenceUrl?: string;
  photoUrl?: string;
  feedbackRating?: number;
  feedbackComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssueStatusHistory {
  id: string;
  issueId: string;
  previousStatus: IssueStatus;
  newStatus: IssueStatus;
  changedBy: string;
  changedByRole: UserRole;
  changeReason?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityCode: string;
  inspectorId: string;
  inspectorName: string;
  conditionRating: ConditionRating;
  cleanlinessRating: ConditionRating;
  maintenanceRequired: boolean;
  observationNotes: string;
  photoUrl?: string;
  inspectedAt: string;
  followUpRequired: boolean;
  relatedIssueId?: string;
  checklistItems?: {
    item: string;
    passed: boolean;
  }[];
  createdAt: string;
}

export type ScheduleTaskType = 
  | 'routine_cleaning'
  | 'facility_inspection'
  | 'water_cooler_cleaning'
  | 'water_tank_cleaning'
  | 'plumbing_maintenance'
  | 'equipment_maintenance'
  | 'green_area_inspection'
  | 'waste_collection'
  | 'other';

export type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'one_time';

export interface MaintenanceSchedule {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityCode: string;
  taskType: ScheduleTaskType;
  taskDescription: string;
  frequency: FrequencyType;
  lastCompletedAt?: string;
  nextDueAt: string;
  responsibleDepartment: DepartmentType;
  assignedTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityCode: string;
  scheduleId?: string;
  relatedIssueId?: string;
  taskDescription: string;
  performedBy: string;
  completedAt: string;
  workNotes: string;
  evidenceUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  entityType: 'facility' | 'issue' | 'inspection' | 'schedule' | 'system';
  entityId: string;
  entityName?: string;
  actionType: string;
  description: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientRole: UserRole | 'all';
  type: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface FilterState {
  building: string;
  zoneId: string;
  categoryKey: string;
  condition: string;
  issueStatus: string;
  priority: string;
  department: string;
  dateRange: 'all' | '7d' | '30d' | 'this_month';
  searchQuery: string;
}

export interface CampusQRTarget {
  id: string;
  code: string;
  title: string;
  zoneId: string;
  zoneName: string;
  building: string;
  floor?: string;
  description: string;
  recommendedPlacement: string;
}

export type SuggestionCategory =
  | 'waste_recycling'
  | 'water_conservation'
  | 'energy_solar'
  | 'greenery_biodiversity'
  | 'hygiene_sanitation'
  | 'campus_awareness';

export interface SustainabilitySuggestion {
  id: string;
  referenceNumber: string;
  title: string;
  category: SuggestionCategory;
  categoryLabel: string;
  zoneName: string;
  floor?: string;
  description: string;
  expectedImpact: string;
  submittedBy: string;
  submitterRole: UserRole;
  upvotes: number;
  status: 'under_review' | 'approved_for_pilot' | 'in_discussion' | 'implemented';
  createdAt: string;
}

