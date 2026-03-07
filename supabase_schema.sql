-- Students/Users Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'User',
  status TEXT DEFAULT 'Active',
  mobile_number TEXT,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  bio TEXT,
  github_id TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  twitter_handle TEXT,
  location TEXT,
  occupation TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Not Started',
  progress INTEGER DEFAULT 0,
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Students (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS project_students (
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (project_id, student_id)
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  assigned_to TEXT REFERENCES students(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending',
  deadline TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author TEXT REFERENCES students(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Materials Table
CREATE TABLE IF NOT EXISTS study_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  uploaded_by TEXT REFERENCES students(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  url TEXT NOT NULL,
  thumbnail TEXT,
  size TEXT,
  ai_summary TEXT,
  ai_key_points JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  materials_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Skills Table
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  learned_at TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Projects Table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  technologies JSONB,
  link TEXT,
  completed_at TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Timeline Table
CREATE TABLE IF NOT EXISTS portfolio_timeline (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Achievements Table
CREATE TABLE IF NOT EXISTS portfolio_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  awarded_by TEXT,
  awarded_at TEXT,
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Feedback Table
CREATE TABLE IF NOT EXISTS admin_feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  admin_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Settings Table
CREATE TABLE IF NOT EXISTS portfolio_settings (
  user_id TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  work_samples_github TEXT,
  work_samples_portfolio TEXT,
  work_samples_demo TEXT,
  ai_skill_gap_analysis TEXT,
  ai_recommendations JSONB,
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Alerts Table
CREATE TABLE IF NOT EXISTS ai_alerts (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  alert_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Groups Table
CREATE TABLE IF NOT EXISTS study_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  created_by TEXT REFERENCES students(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Study Group Members (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS study_group_members (
  group_id TEXT REFERENCES study_groups(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, student_id)
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES students(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for Students (allow all for now - you can customize based on your needs)
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on project_students" ON project_students FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on study_materials" ON study_materials FOR ALL USING (true);
CREATE POLICY "Allow all operations on subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on portfolio_skills" ON portfolio_skills FOR ALL USING (true);
CREATE POLICY "Allow all operations on portfolio_projects" ON portfolio_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on portfolio_timeline" ON portfolio_timeline FOR ALL USING (true);
CREATE POLICY "Allow all operations on portfolio_achievements" ON portfolio_achievements FOR ALL USING (true);
CREATE POLICY "Allow all operations on admin_feedback" ON admin_feedback FOR ALL USING (true);
CREATE POLICY "Allow all operations on portfolio_settings" ON portfolio_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_alerts" ON ai_alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations on study_groups" ON study_groups FOR ALL USING (true);
CREATE POLICY "Allow all operations on study_group_members" ON study_group_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_logs" ON activity_logs FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_students_project ON project_students(project_id);
CREATE INDEX IF NOT EXISTS idx_project_students_student ON project_students(student_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_comments_task ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON study_materials(subject);
CREATE INDEX IF NOT EXISTS idx_study_materials_uploaded_by ON study_materials(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_portfolio_skills_user ON portfolio_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_user ON portfolio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_timeline_user ON portfolio_timeline(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_achievements_user ON portfolio_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_feedback_user ON admin_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_project ON ai_alerts(project_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_student ON study_group_members(student_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
