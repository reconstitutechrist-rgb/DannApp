# Supabase Backend Setup Guide

This guide will walk you through setting up the Supabase backend for the AI App Builder.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create a Supabase Project](#create-a-supabase-project)
3. [Run Database Migrations](#run-database-migrations)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Test the Setup](#test-the-setup)
6. [Features](#features)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git (for cloning the repository)

## Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: AI App Builder (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to you
4. Click **"Create new project"** and wait for it to initialize (2-3 minutes)

## Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Open the file `supabase/migrations/20250113000001_initial_schema.sql` from this repository
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. You should see a success message

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (get project ref from project settings)
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

## Configure Environment Variables

1. In your Supabase project, go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create a `.env.local` file in the root of your project:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your credentials:

```env
# Anthropic API Key (Required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Test the Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. You should see the login page with **Sign In** and **Sign Up** tabs

5. Create a new account:
   - Click **"Sign Up"**
   - Enter your email and password
   - Check your email for a verification link (check spam folder)
   - Click the verification link
   - Return to the app and sign in

6. After signing in, you should be redirected to the main AI App Builder interface

## Features

The Supabase backend provides:

### Authentication
- ✅ Email/Password authentication
- ✅ Session management
- ✅ Protected routes via middleware
- ✅ Automatic profile creation on signup
- ✅ Row-level security (RLS) for data protection

### Data Storage
- ✅ **Projects**: Store generated applications with file content
- ✅ **Conversations**: Track chat conversations
- ✅ **Messages**: Store conversation history
- ✅ **Versions**: Version control for projects
- ✅ **Analytics**: Usage tracking and analytics
- ✅ **Profiles**: Extended user profile data

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Secure session management
- ✅ HTTP-only cookies for authentication

## Database Schema

### Tables

#### `profiles`
- Links to Supabase Auth users
- Stores: email, full name, avatar URL
- Auto-created on user signup

#### `projects`
- User-created applications
- Stores: name, description, files (JSONB), timestamps
- Soft delete support

#### `conversations`
- Chat conversations
- Can be linked to projects
- Stores: title, project link, timestamps

#### `messages`
- Individual chat messages
- Belongs to a conversation
- Stores: role (user/assistant/system), content, metadata (JSONB)

#### `versions`
- Project version history
- Stores: version number, files snapshot, description
- Automatically increments version numbers

#### `analytics`
- Usage analytics events
- Stores: event type, event data (JSONB)

### Row Level Security (RLS)

All tables have RLS policies ensuring:
- Users can only SELECT their own data
- Users can only INSERT data for themselves
- Users can only UPDATE their own data
- Users can only DELETE their own data

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/check` - Check auth status
- `GET /api/auth/callback` - OAuth callback

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project (soft delete)

### Versions
- `GET /api/projects/[id]/versions` - List project versions
- `POST /api/projects/[id]/versions` - Create new version

### Conversations
- `GET /api/conversations` - List all conversations
- `GET /api/conversations?project_id=[id]` - List project conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get conversation details
- `PATCH /api/conversations/[id]` - Update conversation
- `DELETE /api/conversations/[id]` - Delete conversation

### Messages
- `GET /api/conversations/[id]/messages` - List conversation messages
- `POST /api/conversations/[id]/messages` - Create new message

## Troubleshooting

### "Not authenticated" errors
- Make sure you've signed in
- Check that your `.env.local` file has the correct Supabase credentials
- Clear your browser cookies and try signing in again

### Email verification not working
- Check your spam folder
- In Supabase Dashboard, go to **Authentication** > **Settings** > **Auth Providers**
- Make sure "Confirm email" is enabled
- For development, you can disable email confirmation temporarily

### Database connection errors
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check that migrations were run successfully
- Check Supabase project status in the dashboard

### RLS Policy errors
- Make sure you're authenticated
- Check that the user owns the data they're trying to access
- View RLS policies in Supabase Dashboard > **Table Editor** > select table > **Policies**

### Migration errors
- Make sure you're running the migration in the correct order
- Check for syntax errors in the SQL
- Verify PostgreSQL extensions are enabled
- Check Supabase logs in the dashboard

## Email Configuration (Optional)

By default, Supabase sends emails from a shared domain. For production:

1. Go to **Authentication** > **Settings** > **SMTP Settings**
2. Configure your own SMTP server (SendGrid, Mailgun, etc.)
3. This gives you:
   - Custom sender domain
   - Better deliverability
   - Branded emails

## Next Steps

Now that your backend is set up:

1. **Explore the app** - Create projects, start conversations
2. **Check the database** - View your data in Supabase Table Editor
3. **Monitor usage** - Check Analytics table for tracked events
4. **Customize** - Modify database schema or add new features
5. **Deploy** - Deploy to Vercel, Netlify, or your preferred platform

## Support

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)
- GitHub Issues: Report bugs or request features

---

Happy building! 🚀
