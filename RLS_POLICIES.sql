-- Row Level Security (RLS) Policies for StudentCollab
-- These policies restrict data access based on user roles and ownership
-- Execute these commands in your Supabase SQL editor

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_students ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STUDENTS TABLE POLICIES
-- ============================================

-- Policy: Users can view all students
CREATE POLICY "Students can be viewed by all authenticated users"
  ON students 
  FOR SELECT 
  USING (auth.role() = 'authenticated_user');

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON students
  FOR UPDATE
  USING (auth.uid()::text = id);

-- Policy: Only admins can insert students
CREATE POLICY "Admins can create students"
  ON students
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE id = auth.uid()::text AND role = 'Admin'
    )
  );

-- ============================================
-- PROJECTS TABLE POLICIES
-- ============================================

-- Policy: Users can view projects they are part of
CREATE POLICY "Users can view projects they are assigned to"
  ON projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_students
      WHERE project_students.project_id = projects.id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- Policy: Project members can update projects
CREATE POLICY "Project members can update projects"
  ON projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_students
      WHERE project_students.project_id = projects.id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- Policy: Admins can insert projects
CREATE POLICY "Admins can create projects"
  ON projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE id = auth.uid()::text AND role = 'Admin'
    )
  );

-- ============================================
-- TASKS TABLE POLICIES
-- ============================================

-- Policy: Users can view tasks in projects they are part of
CREATE POLICY "Users can view tasks in their projects"
  ON tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN project_students ON projects.id = project_students.project_id
      WHERE projects.id = tasks.project_id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- Policy: Task assignee can update their task
CREATE POLICY "Task assignees can update their tasks"
  ON tasks
  FOR UPDATE
  USING (assigned_to = auth.uid()::text);

-- Policy: Project members can insert tasks
CREATE POLICY "Project members can create tasks"
  ON tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      JOIN project_students ON projects.id = project_students.project_id
      WHERE projects.id = tasks.project_id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- ============================================
-- COMMENTS TABLE POLICIES
-- ============================================

-- Policy: Users can view comments on tasks in their projects
CREATE POLICY "Users can view comments on their project tasks"
  ON comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON tasks.project_id = projects.id
      JOIN project_students ON projects.id = project_students.project_id
      WHERE tasks.id = comments.task_id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- Policy: Users can insert comments on tasks
CREATE POLICY "Users can add comments to tasks"
  ON comments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON tasks.project_id = projects.id
      JOIN project_students ON projects.id = project_students.project_id
      WHERE tasks.id = comments.task_id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- ============================================
-- STUDY MATERIALS TABLE POLICIES
-- ============================================

-- Policy: All authenticated users can view study materials
CREATE POLICY "All users can view study materials"
  ON study_materials
  FOR SELECT
  USING (auth.role() = 'authenticated_user');

-- Policy: Upload author can update their materials
CREATE POLICY "Users can update their own study materials"
  ON study_materials
  FOR UPDATE
  USING (uploaded_by = auth.uid()::text);

-- Policy: Authenticated users can upload materials
CREATE POLICY "Authenticated users can upload study materials"
  ON study_materials
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated_user');

-- ============================================
-- PORTFOLIO TABLES POLICIES
-- ============================================

-- Policy: Users can view their own portfolio data
CREATE POLICY "Users can view their own portfolio"
  ON portfolio_skills
  FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their own projects"
  ON portfolio_projects
  FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their own timeline"
  ON portfolio_timeline
  FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their own achievements"
  ON portfolio_achievements
  FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their own settings"
  ON portfolio_settings
  FOR SELECT
  USING (user_id = auth.uid()::text);

-- Policy: Users can update their own portfolio data
CREATE POLICY "Users can update their own portfolio"
  ON portfolio_skills
  FOR UPDATE
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own projects"
  ON portfolio_projects
  FOR UPDATE
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own settings"
  ON portfolio_settings
  FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Policy: Users can insert their own portfolio data
CREATE POLICY "Users can create portfolio skills"
  ON portfolio_skills
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can create portfolio projects"
  ON portfolio_projects
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can create portfolio timeline"
  ON portfolio_timeline
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- ============================================
-- ADMIN FEEDBACK POLICIES
-- ============================================

-- Policy: Users can view feedback on their portfolio
CREATE POLICY "Users can view their own admin feedback"
  ON admin_feedback
  FOR SELECT
  USING (user_id = auth.uid()::text);

-- Policy: Admins can insert feedback
CREATE POLICY "Admins can create feedback"
  ON admin_feedback
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE id = auth.uid()::text AND role = 'Admin'
    )
  );

-- ============================================
-- AI ALERTS POLICIES
-- ============================================

-- Policy: Users can view alerts for projects they are part of
CREATE POLICY "Users can view alerts for their projects"
  ON ai_alerts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN project_students ON projects.id = project_students.project_id
      WHERE projects.id = ai_alerts.project_id
      AND project_students.student_id = auth.uid()::text
    )
  );

-- ============================================
-- PROJECT STUDENTS POLICIES
-- ============================================

-- Policy: Users can view project memberships
CREATE POLICY "Users can view project memberships"
  ON project_students
  FOR SELECT
  USING (auth.role() = 'authenticated_user');

-- IMPORTANT NOTES:
-- 1. These policies assume you have a `role` column in your students table set to 'Admin' or 'User'
-- 2. Update `auth.uid()::text` references if your student IDs are stored differently
-- 3. For production, review and test these policies thoroughly
-- 4. Consider adding time-based restrictions for sensitive data
-- 5. Monitor access logs regularly for security audits
