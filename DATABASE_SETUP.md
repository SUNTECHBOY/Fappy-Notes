# Database Setup and Security Guide

This guide explains how to set up Row Level Security (RLS) and other security configurations for your StudentCollab application.

## Overview

Your application is configured to:
- ✅ Use environment variables for Supabase credentials (never hardcoded)
- ✅ Connect to Supabase Postgres database
- ✅ Use real-time subscriptions for live data updates
- ✅ Support user authentication and role-based access

## Setting Up Row Level Security (RLS)

### Step 1: Access Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project
3. Navigate to **SQL Editor**

### Step 2: Execute RLS Policies

1. Open `RLS_POLICIES.sql` file in this directory
2. Copy all the SQL code
3. Paste it into your Supabase SQL Editor
4. Click **Run**

This will enable RLS on all tables and set up access policies.

### Step 3: Verify RLS is Enabled

Run this query to check RLS status:

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

## User Authentication Setup

### Current Setup

Your app uses the Supabase **Anon Key** which allows:
- Anonymous read access to public data
- Authenticated operations for logged-in users
- Real-time subscriptions

### Recommended: Add Supabase Auth

1. **Enable Email/Password Auth:**
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - Configure email settings

2. **Add Auth UI to your React app:**
   ```tsx
   import { Auth } from '@supabase/auth-ui-react'
   import { ThemeSupa } from '@supabase/auth-ui-shared'
   
   export function LoginPage() {
     return (
       <Auth
         supabaseClient={supabase}
         appearance={{ theme: ThemeSupa }}
         providers={['google', 'github']}
       />
     )
   }
   ```

## Security Best Practices

### 1. Use Service Role Key Only on Backend

The **Service Role Key** bypasses RLS. Use it only in:
- Server-side API routes
- Backend jobs
- Data migrations (already used in `scripts/run-migration.ts`)

**Never expose Service Role Key to frontend.**

### 2. Rotate Exposed Keys

If you accidentally expose a key:
1. Go to Supabase **Settings** → **API**
2. Click the **rotate** icon next to the key
3. Update your `.env` file with the new key
4. Restart your app

### 3. Enable API Rate Limiting

In Supabase **Project Settings**:
1. Navigate to **API** section
2. Enable **Rate Limiting** (recommended: 1000 requests/minute per IP)

### 4. Set Up Audit Logging

Monitor access and changes:

```sql
-- View recent database changes
SELECT * FROM pg_stat_statements
ORDER BY query_time DESC
LIMIT 10;
```

Or use Supabase **Logs** feature in the dashboard.

### 5: Database Backups

Supabase automatically backs up your database. To restore:
1. Go to **Project Settings** → **Backups**
2. Click **Restore** on any backup point

Manual backups can be created via:
```bash
# Export with pg_dump
pg_dump postgresql://user:password@host/db > backup.sql

# Restore
psql postgresql://user:password@host/db < backup.sql
```

## Environment Variables Reference

Create a `.env` file in your project root (never commit this):

```dotenv
# Required for development and Vite
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# For Node.js scripts (optional)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Never commit `.env` — it's in `.gitignore` for a reason.**

## Running the App

### Development Server

```bash
npm run dev
```

The app will:
1. Load credentials from `.env`
2. Connect to Supabase
3. Fetch data via `useDatabase()` hook
4. Subscribe to real-time updates

### Data Migration

If you need to re-migrate data:

```bash
npx ts-node -r dotenv/config scripts/run-migration.ts
```

## Monitoring and Maintenance

### Check Database Usage

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)) DESC;
```

### Monitor Active Queries

```sql
SELECT pid, usename, application_name, query, query_start
FROM pg_stat_activity
WHERE state = 'active';
```

## Troubleshooting

### "Not authenticated" errors

**Solution:** Check that:
- `.env` file exists with valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Credentials haven't been rotated or revoked
- RLS policies allow the current user's role

### Data not loading

**Solution:** 
1. Check browser console for errors
2. Verify RLS policies are not blocking access
3. Ensure user is in `project_students` table if trying to access projects

### Real-time updates not working

**Solution:**
1. Confirm Realtime is enabled in Supabase **Project Settings** → **Realtime**
2. Check that subscriptions use correct table names
3. Verify RLS policies allow the user to view the table

## Next Steps

1. ✅ Set up RLS policies using `RLS_POLICIES.sql`
2. ✅ Configure Supabase Auth
3. ✅ Test all CRUD operations
4. ✅ Set up monitoring and backups
5. ✅ Deploy to production
6. ✅ Monitor logs and performance

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Security Best Practices](https://supabase.com/docs/guides/sql/best-practices)

---

**Last Updated:** March 7, 2026
**App:** StudentCollab - Collaborative Project Management Board
**Database:** Supabase PostgreSQL
