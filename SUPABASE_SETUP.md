# Supabase Database Setup Guide

This guide will help you set up your Supabase database for the StudentCollab application.

## Prerequisites

- Supabase account (free tier works fine)
- Your Supabase project URL and anon key (already configured)

## Setup Steps

### 1. Create Database Schema

1. Go to your Supabase Dashboard: https://vapvmlwrtwiiuxxutufg.supabase.co
2. Navigate to the SQL Editor (left sidebar)
3. Click "New Query"
4. Copy and paste the entire contents of `supabase_schema.sql` into the editor
5. Click "Run" to execute the SQL

This will create all necessary tables, relationships, indexes, and security policies.

### 2. Verify Tables

After running the schema, verify that all tables were created:

1. Go to "Table Editor" in the left sidebar
2. You should see these tables:
   - `students`
   - `projects`
   - `project_students`
   - `tasks`
   - `comments`
   - `study_materials`
   - `subjects`
   - `portfolio_skills`
   - `portfolio_projects`
   - `portfolio_timeline`
   - `portfolio_achievements`
   - `admin_feedback`
   - `portfolio_settings`
   - `ai_alerts`
   - `study_groups`
   - `study_group_members`
   - `activity_logs`

### 3. Migrate Existing Data

The application includes a built-in data migration tool:

1. **Start the application** (if not already running)
2. **Add the migration component** temporarily to your app for easy access
3. **Run the migration** by clicking the "Start Migration" button

Alternatively, you can run the migration programmatically:

```typescript
import { migrateDataToSupabase } from './services/migrateData';

// Call this once to migrate data
migrateDataToSupabase();
```

## Database Structure

### Core Tables

#### `students`
Stores user information including:
- Basic info (name, email, avatar)
- Role and status
- Contact information
- Profile details (bio, social links)

#### `projects`
Stores project data:
- Project details (name, description, status)
- Progress tracking
- AI-generated summaries

#### `tasks`
Task management:
- Task information
- Assigned users
- Status tracking
- Deadlines

#### `study_materials`
Learning resources:
- File/resource information
- Subject categorization
- AI-generated summaries and key points

#### Portfolio Tables
Multiple tables for comprehensive portfolio tracking:
- `portfolio_skills`: User skills and proficiency levels
- `portfolio_projects`: Portfolio projects
- `portfolio_timeline`: Activity timeline
- `portfolio_achievements`: Awards and achievements
- `admin_feedback`: Admin feedback on portfolios
- `portfolio_settings`: Portfolio preferences and AI insights

### Features

#### Row Level Security (RLS)
All tables have RLS enabled with basic policies allowing all operations. You can customize these policies based on your security requirements.

#### Real-time Subscriptions
The application uses Supabase real-time subscriptions for:
- Project updates
- Task changes
- Study material uploads

This enables collaborative features where multiple users can see updates in real-time.

#### Indexes
Optimized indexes are created for:
- Foreign key relationships
- Frequently queried fields
- User-specific data lookups

## Application Integration

The application is now configured to use Supabase:

### Configuration
- Supabase URL and Key are configured in `/src/app/lib/supabaseClient.ts`
- Database operations are in `/src/app/services/database.ts`
- React hook for easy data access: `/src/app/hooks/useDatabase.ts`

### Using the Database in Your App

The `useDatabase` hook provides all the functionality you need:

```typescript
import { useDatabase } from './hooks/useDatabase';

function MyComponent() {
  const {
    students,
    projects,
    materials,
    portfolios,
    loading,
    createProject,
    updateTaskStatus,
    uploadMaterial,
    addAchievement,
  } = useDatabase();

  // All data is automatically loaded and synchronized
  // Use the provided functions to create, update, or delete data
}
```

### Real-time Updates

The application automatically subscribes to database changes:
- When any user creates/updates/deletes data, all connected users see the changes
- No manual refresh needed
- Perfect for collaborative work

## Security Considerations

### Current Setup
The database is configured with permissive RLS policies (`ALLOW ALL`) for development purposes.

### Production Recommendations

Before deploying to production, update the RLS policies to:

1. **Restrict user access** to their own data:
```sql
-- Example: Users can only see their own portfolio
CREATE POLICY "Users can view own portfolio"
  ON portfolio_skills
  FOR SELECT
  USING (auth.uid() = user_id);
```

2. **Admin-only operations**:
```sql
-- Example: Only admins can delete projects
CREATE POLICY "Admins can delete projects"
  ON projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );
```

3. **Implement authentication**:
   - Currently using simple client-side role switching
   - For production, implement Supabase Auth
   - Use auth.uid() in RLS policies

## Troubleshooting

### Migration Fails
1. Check the browser console for detailed error messages
2. Verify all tables exist in the database
3. Ensure the SQL schema was executed successfully

### Data Not Appearing
1. Check the Network tab for failed API calls
2. Verify RLS policies aren't blocking access
3. Check Supabase logs in the dashboard

### Real-time Not Working
1. Ensure real-time is enabled in Supabase project settings
2. Check that subscriptions are properly set up
3. Verify the browser has an active connection

## API Reference

### Database Service Functions

All functions are in `/src/app/services/database.ts`:

#### Students
- `fetchStudents()`: Get all students
- `createStudent(data)`: Create a new student
- `updateStudent(id, updates)`: Update student info
- `deleteStudent(id)`: Delete a student

#### Projects
- `fetchProjects()`: Get all projects with tasks and team
- `createProject(data)`: Create a new project
- `updateProject(id, updates)`: Update project
- `deleteProject(id)`: Delete a project

#### Tasks
- `createTask(projectId, data)`: Add a task to a project
- `updateTask(id, updates)`: Update task status or details
- `deleteTask(id)`: Delete a task

#### Study Materials
- `fetchStudyMaterials()`: Get all study materials
- `createStudyMaterial(data)`: Upload new material
- `deleteStudyMaterial(id)`: Delete a material

#### Portfolio
- `fetchPortfolio(userId)`: Get user's complete portfolio
- `fetchAllPortfolios()`: Get all portfolios (admin)
- `addPortfolioSkill(userId, skill)`: Add a skill
- `addPortfolioProject(userId, project)`: Add a project
- `addAchievement(userId, achievement)`: Add an achievement
- `addAdminFeedback(userId, feedback)`: Add admin feedback

## Next Steps

1. **Run the SQL schema** to create all tables
2. **Migrate your data** using the migration tool
3. **Test the application** to ensure everything works
4. **Customize RLS policies** for your security needs
5. **Deploy to production** when ready

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review the SQL schema for table structures
3. Check the console for error messages
4. Verify your Supabase project settings

---

Your Supabase project is now configured and ready to use! 🎉
