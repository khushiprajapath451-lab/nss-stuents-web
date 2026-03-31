
-- Profiles table (seeded with two demo users)
CREATE TABLE public.profiles (
  id text PRIMARY KEY,
  roll_number text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'volunteer',
  avatar text DEFAULT '',
  branch text DEFAULT 'CSE',
  section text DEFAULT 'A',
  semester integer DEFAULT 2,
  total_hours numeric DEFAULT 0,
  events_attended integer DEFAULT 0,
  activities_completed integer DEFAULT 0,
  reward_points integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  is_inactive boolean DEFAULT false,
  inactive_warnings integer DEFAULT 0,
  last_activity_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Event proposals
CREATE TABLE public.event_proposals (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  proposed_by text NOT NULL,
  proposed_date text,
  votes integer DEFAULT 0,
  voters text[] DEFAULT '{}',
  status text DEFAULT 'pending',
  location text,
  time text,
  created_at timestamptz DEFAULT now()
);

-- Urgent alerts
CREATE TABLE public.urgent_alerts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  urgency_level text DEFAULT 'high',
  posted_at timestamptz DEFAULT now(),
  category text DEFAULT '',
  contact text DEFAULT '',
  location text,
  blood_group text,
  help_type text,
  person_in_need text
);

-- Service posts
CREATE TABLE public.service_posts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  volunteer_id text NOT NULL,
  volunteer_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  photos text[] DEFAULT '{}',
  status text DEFAULT 'pending',
  posted_at timestamptz DEFAULT now(),
  points_awarded integer DEFAULT 0
);

-- Attendance records
CREATE TABLE public.attendance_records (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id text NOT NULL,
  event_title text NOT NULL,
  event_date text NOT NULL,
  marked_at timestamptz DEFAULT now(),
  present_volunteer_ids text[] DEFAULT '{}',
  claimed_by jsonb DEFAULT '{}'
);

-- Notifications
CREATE TABLE public.notifications (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  user_id text
);

-- Previous events (user's personal record)
CREATE TABLE public.previous_events (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  date text NOT NULL,
  category text DEFAULT 'General',
  hours numeric DEFAULT 0,
  certificate_file text,
  created_at timestamptz DEFAULT now()
);

-- Certificates
CREATE TABLE public.certificates (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL,
  event_name text NOT NULL,
  date text NOT NULL,
  hours numeric DEFAULT 0,
  type text DEFAULT 'participation'
);

-- Seed the two demo users
INSERT INTO public.profiles (id, roll_number, name, role, avatar, branch, section, semester)
VALUES 
  ('1', '24881A05AG', 'Volunteer AG', 'volunteer', 'AG', 'CSE', 'A', 2),
  ('head', 'NSRINIVAS', 'N. Srinivas', 'head', 'NS', 'CSE', 'A', 4);
