-- NC Homeschool Tracker — Supabase Setup
-- Run this in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/ukmyevdvlvnpryawsyea/sql

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS hs_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 12),
  dob DATE,
  ep_courses TEXT,          -- Easy Peasy courses enrolled in
  immunization_notes TEXT,  -- records on file / exemption noted
  notes TEXT,               -- IEP, special needs, graduation plan, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS hs_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES hs_students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Excused Absence')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, date)   -- one record per student per day
);

-- ============================================================
-- SUBJECT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS hs_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES hs_students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  subject TEXT NOT NULL,        -- Easy Peasy course name or custom subject
  ep_lesson TEXT,               -- lesson / day number
  hours NUMERIC(4,2),           -- hours of instruction
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS hs_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES hs_students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,    -- Standardized Test, Teacher Evaluation, etc.
  results TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS hs_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES hs_students(id) ON DELETE SET NULL,  -- nullable — some docs are general
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL,  -- NC Intent to Homeschool, Immunization Record, etc.
  file_url TEXT,           -- link to Google Drive, Dropbox, etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Each parent can only see/edit their own family's data
-- ============================================================
ALTER TABLE hs_students    ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_attendance  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_subjects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hs_documents   ENABLE ROW LEVEL SECURITY;

-- Students
CREATE POLICY "owner_students" ON hs_students
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Attendance
CREATE POLICY "owner_attendance" ON hs_attendance
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Subjects
CREATE POLICY "owner_subjects" ON hs_subjects
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Assessments
CREATE POLICY "owner_assessments" ON hs_assessments
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Documents
CREATE POLICY "owner_documents" ON hs_documents
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- INDEXES (performance for date-range queries)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_att_student_date  ON hs_attendance (student_id, date);
CREATE INDEX IF NOT EXISTS idx_att_user_date      ON hs_attendance (user_id, date);
CREATE INDEX IF NOT EXISTS idx_sub_student_date   ON hs_subjects   (student_id, date);
CREATE INDEX IF NOT EXISTS idx_doc_student        ON hs_documents  (student_id);

-- ============================================================
-- LEARNING PROGRESS
-- Tracks placement level and lesson progress per subject
-- ============================================================
CREATE TABLE IF NOT EXISTS hs_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES hs_students(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  placed_grade INTEGER,
  lessons_completed INTEGER DEFAULT 0,
  current_lesson INTEGER DEFAULT 1,
  last_score INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, subject)
);

ALTER TABLE hs_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_progress" ON hs_progress
  USING (
    student_id IN (SELECT id FROM hs_students WHERE user_id = auth.uid())
  )
  WITH CHECK (
    student_id IN (SELECT id FROM hs_students WHERE user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_prog_student ON hs_progress (student_id);
