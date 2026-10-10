-- ==============================================================================
-- SWACHH Community — Digital Campus Monitoring & Sustainability Dashboard
-- The Green Club, ICEM
-- Supabase / PostgreSQL Production Database Schema & RLS Security Policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Custom Enums
CREATE TYPE user_role_enum AS ENUM ('admin', 'green_club', 'staff', 'student', 'public');
CREATE TYPE operational_status_enum AS ENUM ('operational', 'under_maintenance', 'temporarily_closed', 'out_of_service');
CREATE TYPE condition_rating_enum AS ENUM ('good', 'satisfactory', 'needs_attention', 'poor', 'not_inspected');
CREATE TYPE issue_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE issue_status_enum AS ENUM (
  'submitted',
  'under_review',
  'open',
  'in_progress',
  'resolved_awaiting_verification',
  'verified_closed',
  'rejected',
  'duplicate'
);
CREATE TYPE schedule_task_type_enum AS ENUM (
  'routine_cleaning',
  'facility_inspection',
  'water_cooler_cleaning',
  'water_tank_cleaning',
  'plumbing_maintenance',
  'equipment_maintenance',
  'green_area_inspection',
  'waste_collection',
  'other'
);
CREATE TYPE frequency_enum AS ENUM ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'one_time');

-- 3. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role_enum NOT NULL DEFAULT 'student',
  department TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Campus Zones Table
CREATE TABLE IF NOT EXISTS campus_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor TEXT,
  location_description TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Facility Categories Table
CREATE TABLE IF NOT EXISTS facility_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT NOT NULL DEFAULT 'Wrench',
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 6. Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES facility_categories(id) ON DELETE RESTRICT,
  zone_id UUID NOT NULL REFERENCES campus_zones(id) ON DELETE RESTRICT,
  description TEXT,
  operational_status operational_status_enum NOT NULL DEFAULT 'operational',
  current_condition condition_rating_enum NOT NULL DEFAULT 'not_inspected',
  last_inspected_at TIMESTAMPTZ,
  last_cleaned_at TIMESTAMPTZ,
  next_cleaning_due_at TIMESTAMPTZ,
  last_maintenance_at TIMESTAMPTZ,
  next_maintenance_due_at TIMESTAMPTZ,
  assigned_department TEXT NOT NULL DEFAULT 'General Maintenance',
  qr_enabled BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Issue Reports Table
CREATE TABLE IF NOT EXISTS issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reporter_name TEXT,
  reporter_email TEXT,
  issue_category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority issue_priority_enum NOT NULL DEFAULT 'medium',
  status issue_status_enum NOT NULL DEFAULT 'submitted',
  observed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  assigned_department TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  duplicate_of UUID REFERENCES issue_reports(id) ON DELETE SET NULL,
  work_notes TEXT,
  action_taken TEXT,
  photo_url TEXT,
  resolution_evidence_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Issue Attachments Table
CREATE TABLE IF NOT EXISTS issue_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issue_reports(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Facility Inspections Table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  inspector_name TEXT NOT NULL,
  condition_rating condition_rating_enum NOT NULL,
  cleanliness_rating condition_rating_enum NOT NULL,
  maintenance_required BOOLEAN NOT NULL DEFAULT false,
  observation_notes TEXT NOT NULL,
  photo_url TEXT,
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  follow_up_required BOOLEAN NOT NULL DEFAULT false,
  related_issue_id UUID REFERENCES issue_reports(id) ON DELETE SET NULL,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Maintenance Schedules Table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  task_type schedule_task_type_enum NOT NULL,
  task_description TEXT NOT NULL,
  frequency frequency_enum NOT NULL DEFAULT 'daily',
  last_completed_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ NOT NULL,
  responsible_department TEXT NOT NULL,
  assigned_to TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Maintenance Records Table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES maintenance_schedules(id) ON DELETE SET NULL,
  related_issue_id UUID REFERENCES issue_reports(id) ON DELETE SET NULL,
  task_description TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  work_notes TEXT NOT NULL,
  evidence_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Issue Status History Table
CREATE TABLE IF NOT EXISTS issue_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issue_reports(id) ON DELETE CASCADE,
  previous_status issue_status_enum NOT NULL,
  new_status issue_status_enum NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  changed_by_role user_role_enum NOT NULL,
  change_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  actor_role user_role_enum NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_role TEXT NOT NULL DEFAULT 'all',
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE FILTERING AND REPORTING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_facilities_category ON facilities(category_id);
CREATE INDEX IF NOT EXISTS idx_facilities_zone ON facilities(zone_id);
CREATE INDEX IF NOT EXISTS idx_facilities_condition ON facilities(current_condition);
CREATE INDEX IF NOT EXISTS idx_facilities_code ON facilities(facility_code);

CREATE INDEX IF NOT EXISTS idx_issues_facility ON issue_reports(facility_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issue_reports(priority);
CREATE INDEX IF NOT EXISTS idx_issues_ref ON issue_reports(reference_number);
CREATE INDEX IF NOT EXISTS idx_issues_dept ON issue_reports(assigned_department);
CREATE INDEX IF NOT EXISTS idx_issues_dates ON issue_reports(submitted_at);

CREATE INDEX IF NOT EXISTS idx_schedules_next_due ON maintenance_schedules(next_due_at);
CREATE INDEX IF NOT EXISTS idx_schedules_facility ON maintenance_schedules(facility_id);
CREATE INDEX IF NOT EXISTS idx_inspections_facility ON inspections(facility_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

-- Public & student read access for monitored facilities and non-sensitive dashboards
CREATE POLICY "Public read facilities" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON facility_categories FOR SELECT USING (true);
CREATE POLICY "Public read zones" ON campus_zones FOR SELECT USING (true);

-- Any authenticated or anonymous user may submit an issue report
CREATE POLICY "Allow public issue submission" ON issue_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read issue reports" ON issue_reports FOR SELECT USING (true);

-- Green Club and Admin can record inspections
CREATE POLICY "Monitors insert inspections" ON inspections FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'green_club')
  )
);

-- Staff and Admin can update maintenance & assigned issues
CREATE POLICY "Staff update assigned issues" ON issue_reports FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'staff', 'green_club')
  )
);
