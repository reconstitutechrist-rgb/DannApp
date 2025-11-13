# Supabase Setup

This directory contains database migrations and configuration for the AI App Builder.

## Database Schema

### Tables

1. **profiles** - Extended user profile data
   - Links to Supabase Auth users
   - Stores email, full name, avatar URL

2. **projects** - Generated applications/projects
   - Stores project files as JSONB
   - Soft delete support with `is_deleted` flag
   - Belongs to a user

3. **conversations** - Chat conversations
   - Can be linked to a project
   - Belongs to a user

4. **messages** - Individual chat messages
   - Belongs to a conversation
   - Supports user, assistant, and system roles
   - Metadata stored as JSONB

5. **versions** - Project version history
   - Stores file snapshots
   - Tracks version numbers
   - Belongs to a project

6. **analytics** - Usage analytics
   - Tracks user events
   - Event data stored as JSONB

## Row Level Security (RLS)

All tables have Row Level Security enabled to ensure users can only access their own data.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

### 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy the following values:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon/public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 3. Run Migrations

#### Option A: Using Supabase Dashboard (Recommended for first-time setup)

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `migrations/20250113000001_initial_schema.sql`
3. Paste and run it in the SQL Editor

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### 4. Configure Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication

The app uses Supabase Auth with the following features:

- Email/Password authentication
- Automatic profile creation on signup
- Session management via middleware
- Protected routes

## Testing the Setup

After running the migrations, you can test the setup:

1. Try signing up a new user
2. Check if a profile was automatically created
3. Try creating a project
4. Verify RLS policies are working (users can only see their own data)
