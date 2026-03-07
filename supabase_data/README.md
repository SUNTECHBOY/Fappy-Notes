# Supabase Data Import Guide

This folder contains 17 comprehensive CSV files for importing all mock data into your Supabase database for the Collaborative Generative AI Platform.

## 📋 Database Tables Overview

### Core Tables (Import First)

1. **students.csv** - User/student profiles with complete information (8 users including admins)
2. **subjects.csv** - Academic subject categories (8 subjects)
3. **projects.csv** - Collaborative project data (6 projects)
4. **study_groups.csv** - Study group information (6 groups)

### Relationship Tables (Junction Tables)

5. **project_students.csv** - Links students to projects (many-to-many)
6. **study_group_members.csv** - Links students to study groups (many-to-many)

### Project & Task Tables

7. **tasks.csv** - Project tasks with assignments and status (20 tasks)
8. **comments.csv** - Comments on tasks (10 comments)

### Study Materials Tables

9. **study_materials.csv** - Educational materials with AI summaries (12 materials)

### Portfolio Tables

10. **portfolio_skills.csv** - User skills and proficiency levels (28 skills)
11. **portfolio_projects.csv** - User portfolio projects (12 projects)
12. **portfolio_timeline.csv** - User learning timeline events (30 entries)
13. **portfolio_achievements.csv** - User achievements and awards (17 achievements)
14. **portfolio_settings.csv** - Portfolio settings and AI analysis (6 user settings)

### Admin & Analytics Tables

15. **admin_feedback.csv** - Admin feedback on user portfolios (6 feedback items)
16. **activity_logs.csv** - System activity tracking (25 activity logs)
17. **ai_alerts.csv** - AI-generated project alerts (12 alerts)

## 🗄️ Database Schema

The complete SQL schema is available in `/supabase_schema.sql` at the project root. Run this file in your Supabase SQL Editor to create all tables with proper relationships, indexes, and Row Level Security policies.

### Quick Schema Creation

```sql
-- Run this in Supabase SQL Editor
-- Copy and paste the contents of /supabase_schema.sql
```

The schema includes:
- ✅ All table definitions with proper data types
- ✅ Foreign key relationships
- ✅ Indexes for performance optimization
- ✅ Row Level Security (RLS) enabled
- ✅ Permissive policies (customize based on your auth setup)

## 📥 Import Order (Critical!)

**IMPORTANT:** Import CSV files in this exact order to avoid foreign key constraint errors:

### Phase 1: Base Tables (No Dependencies)
1. students.csv
2. subjects.csv
3. projects.csv
4. study_groups.csv

### Phase 2: Relationship Tables
5. project_students.csv (depends on: projects, students)
6. study_group_members.csv (depends on: study_groups, students)

### Phase 3: Project Data
7. tasks.csv (depends on: projects, students)
8. comments.csv (depends on: tasks, students)

### Phase 4: Study Materials
9. study_materials.csv (depends on: subjects, students)

### Phase 5: Portfolio Data
10. portfolio_skills.csv (depends on: students)
11. portfolio_projects.csv (depends on: students)
12. portfolio_timeline.csv (depends on: students)
13. portfolio_achievements.csv (depends on: students)
14. portfolio_settings.csv (depends on: students)

### Phase 6: Admin & Analytics
15. admin_feedback.csv (depends on: students)
16. activity_logs.csv (depends on: students)
17. ai_alerts.csv (depends on: projects)

## 🔧 How to Import in Supabase

### Option 1: Using Supabase Dashboard (Recommended)

1. **Create Tables First:**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the entire contents of `/supabase_schema.sql`
   - Paste and execute to create all tables

2. **Import CSV Files:**
   - Navigate to **Table Editor**
   - For each table (in the order specified above):
     - Click on the table name
     - Click **Insert** → **Import from CSV**
     - Upload the corresponding CSV file
     - Verify column mapping (should auto-map correctly)
     - Click **Import**

3. **Verify Import:**
   - Check row counts match expected values (see below)
   - Run verification queries (provided at end of this document)

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations (create tables)
# First, copy supabase_schema.sql to supabase/migrations/
supabase db push

# Import data via dashboard (CLI doesn't support CSV import directly)
# Use the dashboard method for CSV imports
```

## 📊 Expected Row Counts

After successful import, you should have:

| Table | Row Count | Description |
|-------|-----------|-------------|
| students | 8 | Users including 2 admins, 5 active users, 1 inactive |
| subjects | 8 | Academic subjects |
| projects | 6 | Collaborative projects (1 completed, 4 in progress, 1 not started) |
| study_groups | 6 | Study groups |
| project_students | 15 | Project memberships |
| study_group_members | 20 | Study group memberships |
| tasks | 20 | Project tasks |
| comments | 10 | Task comments |
| study_materials | 12 | Study materials with AI summaries |
| portfolio_skills | 28 | User skills |
| portfolio_projects | 12 | Portfolio projects |
| portfolio_timeline | 30 | Timeline events |
| portfolio_achievements | 17 | Achievements |
| portfolio_settings | 6 | Portfolio settings with AI analysis |
| admin_feedback | 6 | Admin feedback items |
| activity_logs | 25 | Activity log entries |
| ai_alerts | 12 | AI project alerts |

**Total Records:** 221 rows across 17 tables

## ✅ Verification Queries

Run these queries after import to verify data integrity:

```sql
-- Check row counts for all tables
SELECT 'students' as table_name, COUNT(*) as count FROM students
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'study_materials', COUNT(*) FROM study_materials
UNION ALL SELECT 'study_groups', COUNT(*) FROM study_groups
UNION ALL SELECT 'portfolio_skills', COUNT(*) FROM portfolio_skills
UNION ALL SELECT 'portfolio_projects', COUNT(*) FROM portfolio_projects
UNION ALL SELECT 'portfolio_timeline', COUNT(*) FROM portfolio_timeline
UNION ALL SELECT 'portfolio_achievements', COUNT(*) FROM portfolio_achievements
UNION ALL SELECT 'portfolio_settings', COUNT(*) FROM portfolio_settings
UNION ALL SELECT 'admin_feedback', COUNT(*) FROM admin_feedback
UNION ALL SELECT 'activity_logs', COUNT(*) FROM activity_logs
UNION ALL SELECT 'ai_alerts', COUNT(*) FROM ai_alerts
UNION ALL SELECT 'project_students', COUNT(*) FROM project_students
UNION ALL SELECT 'study_group_members', COUNT(*) FROM study_group_members
UNION ALL SELECT 'comments', COUNT(*) FROM comments;

-- Verify project relationships
SELECT 
  p.name as project,
  COUNT(ps.student_id) as members,
  COUNT(t.id) as tasks,
  COUNT(DISTINCT c.id) as comments
FROM projects p
LEFT JOIN project_students ps ON p.id = ps.project_id
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN comments c ON t.id = c.task_id
GROUP BY p.id, p.name
ORDER BY p.created_at;

-- Verify study group relationships
SELECT 
  sg.name as study_group,
  sg.subject,
  COUNT(sgm.student_id) as members
FROM study_groups sg
LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id
GROUP BY sg.id, sg.name, sg.subject
ORDER BY members DESC;

-- Verify portfolio data per user
SELECT 
  s.name,
  s.role,
  COUNT(DISTINCT ps.id) as skills,
  COUNT(DISTINCT pp.id) as projects,
  COUNT(DISTINCT pt.id) as timeline_events,
  COUNT(DISTINCT pa.id) as achievements
FROM students s
LEFT JOIN portfolio_skills ps ON s.id = ps.user_id
LEFT JOIN portfolio_projects pp ON s.id = pp.user_id
LEFT JOIN portfolio_timeline pt ON s.id = pt.user_id
LEFT JOIN portfolio_achievements pa ON s.id = pa.user_id
GROUP BY s.id, s.name, s.role
ORDER BY s.name;

-- Check for orphaned records (should return 0 rows)
SELECT 'Orphaned tasks' as issue, COUNT(*) as count
FROM tasks t
WHERE t.project_id NOT IN (SELECT id FROM projects)
UNION ALL
SELECT 'Orphaned comments', COUNT(*)
FROM comments c
WHERE c.task_id NOT IN (SELECT id FROM tasks);
```

## 🎯 Sample Data Highlights

### Users
- **Alice Johnson (u1)** - Admin, Full-stack developer with AWS expertise
- **Bob Smith (u2)** - PhD student in Machine Learning, published researcher
- **Carol Davis (u3)** - UX/UI designer with strong portfolio
- **David Lee (u4)** - Cloud architect, AWS certified professional
- **Emma Wilson (u5)** - Admin, Academic advisor
- **Frank Martinez (u6)** - Mobile developer (React Native, Flutter)
- **Grace Chen (u7)** - AI researcher, Best Paper Award winner
- **Henry Thompson (u8)** - DevOps engineer (inactive account)

### Projects
- AI Study Assistant Platform (65% complete, in progress)
- Campus Event Management System (100% complete)
- Sustainable Campus Initiative (40% complete)
- Mobile Learning App (not started)
- Blockchain Credential System (55% complete)
- Virtual Reality Lab Simulations (30% complete)

### Study Materials
- Neural Networks PDF with AI summary
- React Patterns video tutorial
- Linear Algebra fundamentals
- Cloud Architecture guide
- Deep Learning architectures
- And 7 more comprehensive materials

## 🚨 Common Issues & Solutions

### Issue: Foreign key constraint error
**Solution:** Ensure you import files in the exact order specified above. Base tables must be imported before tables that reference them.

### Issue: Duplicate key error
**Solution:** Delete existing data before re-importing:
```sql
-- Clear all data (careful!)
TRUNCATE TABLE ai_alerts CASCADE;
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE admin_feedback CASCADE;
TRUNCATE TABLE portfolio_settings CASCADE;
TRUNCATE TABLE portfolio_achievements CASCADE;
TRUNCATE TABLE portfolio_timeline CASCADE;
TRUNCATE TABLE portfolio_projects CASCADE;
TRUNCATE TABLE portfolio_skills CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE study_materials CASCADE;
TRUNCATE TABLE study_group_members CASCADE;
TRUNCATE TABLE study_groups CASCADE;
TRUNCATE TABLE project_students CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE subjects CASCADE;
TRUNCATE TABLE students CASCADE;
```

### Issue: JSONB column import error
**Solution:** Ensure JSONB fields (like `technologies` in portfolio_projects) are properly formatted as JSON arrays in the CSV. Example: `["React", "Node.js"]`

### Issue: Timestamp format error
**Solution:** All timestamps use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

### Issue: NULL vs empty string
**Solution:** Empty CSV cells are treated as empty strings, not NULL. If you need NULL values, leave the cell completely empty.

## 🔒 Row Level Security (RLS)

The schema includes RLS policies set to allow all operations for development. **For production**, customize these policies:

```sql
-- Example: Users can only view their own portfolio
DROP POLICY IF EXISTS "Allow all operations on portfolio_skills" ON portfolio_skills;

CREATE POLICY "Users can view own skills"
  ON portfolio_skills FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own skills"
  ON portfolio_skills FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Example: Admins can view all data
CREATE POLICY "Admins can view all skills"
  ON portfolio_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = auth.uid()::text
      AND students.role = 'Admin'
    )
  );
```

## 🔄 Updating Your Application

After importing data to Supabase:

1. ✅ **Supabase client configured** (`/src/app/lib/supabaseClient.ts`)
2. ✅ **Database service layer created** (`/src/app/services/database.ts`)
3. ✅ **React hooks for data fetching** (`/src/app/hooks/useDatabase.ts`)
4. ✅ **Real-time subscriptions** enabled for projects, tasks, and study materials
5. ✅ **Data migration tool** (`/src/app/components/DataMigration.tsx`)

### Testing the Integration

1. Update Supabase credentials in your `.env` file
2. Use the Data Migration component to migrate local data
3. Test real-time collaboration by opening app in multiple tabs
4. Verify all CRUD operations work correctly

## 📝 Notes

- All IDs use text format for flexibility (e.g., "u1", "p1", "t1")
- Timestamps are in UTC timezone (ISO 8601 format)
- JSONB columns store structured data (arrays, objects)
- AI summaries and recommendations are pre-generated mock data
- Profile photos use placeholder avatar URLs (replace with actual uploads)
- Empty fields are represented as empty strings unless specified as NULL

## 🎨 Data Quality

This dataset includes:
- ✅ Realistic user profiles with complete information
- ✅ Diverse project types and statuses
- ✅ Rich portfolio data across multiple users
- ✅ AI-generated summaries and recommendations
- ✅ Activity logs covering various user actions
- ✅ Proper relationships and referential integrity
- ✅ Dates spanning from 2019 to current (2026)
- ✅ Mix of completed, in-progress, and pending items

## 📞 Support

If you encounter issues:

1. Check Supabase logs: **Dashboard → Logs**
2. Verify table structure matches schema
3. Ensure RLS policies allow data access
4. Check foreign key relationships
5. Review import order sequence

## 🚀 Ready to Import!

1. Create tables using `/supabase_schema.sql`
2. Import CSV files in the specified order
3. Run verification queries
4. Configure your app's Supabase client
5. Test real-time features

**Happy Importing! 🎉**

---

*Last updated: January 12, 2026*
*Dataset version: 2.0*
*Total records: 221 across 17 tables*
