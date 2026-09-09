-- 1. Add status, screenshots, and github_url to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- (We set default to 'approved' so the existing Stonk Royale and Cigg Tracker don't disappear)

-- 2. Add social links and bio to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- 3. Create Upvotes table
CREATE TABLE IF NOT EXISTS public.upvotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(project_id, user_id) -- A user can only upvote a project once
);
