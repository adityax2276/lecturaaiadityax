-- =========================================================
-- LECTURA AI: Supabase Database Schema & Row-Level Security
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. LECTURES
CREATE TABLE IF NOT EXISTS public.lectures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam_level TEXT,
  preferred_language TEXT DEFAULT 'English' NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate' NOT NULL,
  study_goal TEXT,
  source_type TEXT NOT NULL, -- 'youtube', 'transcript', 'audio', 'video'
  source_url TEXT,
  file_name TEXT,
  duration_formatted TEXT,
  status TEXT DEFAULT 'uploaded' NOT NULL, -- 'uploaded', 'validating', 'transcribing', 'generating', 'saving', 'completed', 'failed'
  progress_percent INT DEFAULT 0 NOT NULL,
  status_message TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. LECTURE SOURCES
CREATE TABLE IF NOT EXISTS public.lecture_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TRANSCRIPTS
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_text TEXT NOT NULL,
  segments JSONB DEFAULT '[]'::jsonb NOT NULL,
  language TEXT DEFAULT 'English' NOT NULL,
  confidence NUMERIC(4,3),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. STUDY KITS
CREATE TABLE IF NOT EXISTS public.study_kits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE NOT NULL UNIQUE,
  language TEXT DEFAULT 'English' NOT NULL,
  overview TEXT NOT NULL,
  revision_sheet JSONB DEFAULT '{}'::jsonb NOT NULL,
  mind_map JSONB DEFAULT '{}'::jsonb NOT NULL,
  missing_or_uncertain_info JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. STUDY KIT SECTIONS (Detailed Notes & Concepts)
CREATE TABLE IF NOT EXISTS public.study_kit_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  study_kit_id UUID REFERENCES public.study_kits(id) ON DELETE CASCADE NOT NULL,
  section_order INT DEFAULT 0 NOT NULL,
  title TEXT NOT NULL,
  timestamp_ref TEXT,
  summary TEXT NOT NULL,
  key_points JSONB DEFAULT '[]'::jsonb NOT NULL,
  important_definitions JSONB DEFAULT '[]'::jsonb,
  teacher_examples JSONB DEFAULT '[]'::jsonb,
  formula_or_code JSONB DEFAULT '[]'::jsonb,
  relationships JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. CONCEPT EXPLANATIONS
CREATE TABLE IF NOT EXISTS public.concept_explanations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  study_kit_id UUID REFERENCES public.study_kits(id) ON DELETE CASCADE NOT NULL,
  concept_name TEXT NOT NULL,
  what_it_means TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  step_by_step JSONB DEFAULT '[]'::jsonb NOT NULL,
  lecture_example TEXT NOT NULL,
  common_confusion TEXT NOT NULL,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. FLASHCARDS
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  study_kit_id UUID REFERENCES public.study_kits(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Medium' NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. PRACTICE QUESTIONS
CREATE TABLE IF NOT EXISTS public.practice_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  study_kit_id UUID REFERENCES public.study_kits(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'mcq' NOT NULL, -- 'mcq', 'short', 'conceptual', 'application'
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Medium' NOT NULL,
  timestamp_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  cited_sections JSONB DEFAULT '[]'::jsonb,
  cited_timestamps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. PROCESSING JOBS (Background tracker)
CREATE TABLE IF NOT EXISTS public.processing_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE NOT NULL,
  step TEXT NOT NULL,
  status TEXT NOT NULL,
  progress_percent INT DEFAULT 0 NOT NULL,
  log_message TEXT,
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_lectures_user_id ON public.lectures(user_id);
CREATE INDEX IF NOT EXISTS idx_lectures_status ON public.lectures(status);
CREATE INDEX IF NOT EXISTS idx_transcripts_lecture_id ON public.transcripts(lecture_id);
CREATE INDEX IF NOT EXISTS idx_study_kits_lecture_id ON public.study_kits(lecture_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_lecture_id ON public.chat_messages(lecture_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_lecture_id ON public.processing_jobs(lecture_id);

-- =========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Strict user ownership isolation
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_kit_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Lectures: Only owner can read, insert, update, delete
CREATE POLICY "Users read own lectures" ON public.lectures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own lectures" ON public.lectures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lectures" ON public.lectures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own lectures" ON public.lectures FOR DELETE USING (auth.uid() = user_id);

-- Lecture Sources: Accessible only via lecture ownership
CREATE POLICY "Users read own lecture sources" ON public.lecture_sources FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.lectures WHERE lectures.id = lecture_sources.lecture_id AND lectures.user_id = auth.uid()));
CREATE POLICY "Users insert own lecture sources" ON public.lecture_sources FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.lectures WHERE lectures.id = lecture_sources.lecture_id AND lectures.user_id = auth.uid()));

-- Transcripts
CREATE POLICY "Users read own transcripts" ON public.transcripts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.lectures WHERE lectures.id = transcripts.lecture_id AND lectures.user_id = auth.uid()));
CREATE POLICY "Users insert own transcripts" ON public.transcripts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.lectures WHERE lectures.id = transcripts.lecture_id AND lectures.user_id = auth.uid()));

-- Study Kits
CREATE POLICY "Users read own study kits" ON public.study_kits FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.lectures WHERE lectures.id = study_kits.lecture_id AND lectures.user_id = auth.uid()));
CREATE POLICY "Users insert own study kits" ON public.study_kits FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.lectures WHERE lectures.id = study_kits.lecture_id AND lectures.user_id = auth.uid()));

-- Chat Messages
CREATE POLICY "Users read own chat messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
