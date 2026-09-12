-- Create projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  overview TEXT NOT NULL,
  icon TEXT NOT NULL,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create comments/reviews table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  is_bug_report BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Open', -- For bug reports: Open, In Progress, Resolved
  developer_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert mock data to get started
INSERT INTO projects (id, title, tagline, overview, icon, link)
VALUES 
  ('cigarette-counter', 'Cigarette Counter', 'Track your smoking habits.', 'A simple app designed to help you monitor and eventually reduce your daily cigarette intake.', '🚬', '#'),
  ('brahmin-simulator', 'Brahmin Simulator', 'How long can you survive Indian Brahmin family life?', 'A humorous text-based survival game where you navigate the daily challenges.', '🕉️', '#');

INSERT INTO comments (project_id, user_name, rating, text, created_at, developer_reply)
VALUES
  ('cigarette-counter', 'John D.', 5, 'Really helped me cut down from 20 to 5 a day. Simple and does exactly what it needs to.', '2023-10-05', 'Thanks John! Glad to hear it is helping you.'),
  ('cigarette-counter', 'Sarah M.', 4, 'Good app, but I wish there was a widget.', '2023-10-08', NULL);

INSERT INTO comments (project_id, user_name, text, is_bug_report, status, created_at, developer_reply)
VALUES
  ('cigarette-counter', 'AlexK', 'App crashes when I try to view history past 30 days.', TRUE, 'Resolved', '2023-10-10', 'Fixed in the upcoming 1.1.1 update! Thanks for reporting.'),
  ('brahmin-simulator', 'GamerGuy99', 'Karma meter doesn''t update after the temple visit event.', TRUE, 'In Progress', '2023-11-22', 'Looking into this right now. Will push a hotfix soon.');
