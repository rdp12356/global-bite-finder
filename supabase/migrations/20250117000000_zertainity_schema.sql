-- Zertainity.com Database Schema
-- AI-driven educational guidance platform

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  location_city TEXT,
  location_country TEXT,
  current_class TEXT CHECK (current_class IN ('10', '11', '12')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('language', 'core', 'elective')),
  stream TEXT CHECK (stream IN ('science', 'commerce', 'arts', 'humanities')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interest_areas table
CREATE TABLE public.interest_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_marks table
CREATE TABLE public.student_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL CHECK (marks_obtained >= 0),
  total_marks INTEGER NOT NULL CHECK (total_marks > 0),
  percentage DECIMAL(5, 2) GENERATED ALWAYS AS ((marks_obtained::DECIMAL / total_marks * 100)) STORED,
  exam_type TEXT DEFAULT 'board' CHECK (exam_type IN ('board', 'internal', 'mock')),
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, subject_id, exam_type, academic_year)
);

-- Create aptitude_questions table
CREATE TABLE public.aptitude_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('logical', 'analytical', 'interest', 'motivation')),
  options JSONB NOT NULL,
  correct_answer TEXT,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create aptitude_results table
CREATE TABLE public.aptitude_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('logical', 'interest')),
  question_id UUID REFERENCES public.aptitude_questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN,
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, test_type, question_id)
);

-- Create student_interests table
CREATE TABLE public.student_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_area_id UUID REFERENCES public.interest_areas(id) ON DELETE CASCADE,
  preference_level INTEGER CHECK (preference_level >= 1 AND preference_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, interest_area_id)
);

-- Create ai_conversations table
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'ai')),
  message_text TEXT NOT NULL,
  emotional_tone TEXT,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create streams table
CREATE TABLE public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  subjects JSONB NOT NULL,
  career_paths JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  type TEXT CHECK (type IN ('government', 'private', 'deemed', 'autonomous')),
  rating DECIMAL(2, 1),
  website TEXT,
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stream TEXT NOT NULL CHECK (stream IN ('science', 'commerce', 'arts', 'humanities')),
  duration_years INTEGER,
  fees_range JSONB,
  cutoff_percentage DECIMAL(5, 2),
  eligibility_criteria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('stream', 'college', 'course')),
  recommended_id UUID NOT NULL, -- Can reference streams, colleges, or courses
  confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  reasoning TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

-- RLS Policies for interest_areas (public read)
CREATE POLICY "Anyone can view interest areas"
  ON public.interest_areas FOR SELECT
  USING (true);

-- RLS Policies for student_marks
CREATE POLICY "Users can view own marks"
  ON public.student_marks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own marks"
  ON public.student_marks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own marks"
  ON public.student_marks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own marks"
  ON public.student_marks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for aptitude_questions (public read)
CREATE POLICY "Anyone can view aptitude questions"
  ON public.aptitude_questions FOR SELECT
  USING (true);

-- RLS Policies for aptitude_results
CREATE POLICY "Users can view own aptitude results"
  ON public.aptitude_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own aptitude results"
  ON public.aptitude_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for student_interests
CREATE POLICY "Users can view own interests"
  ON public.student_interests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interests"
  ON public.student_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interests"
  ON public.student_interests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests"
  ON public.student_interests FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_conversations
CREATE POLICY "Users can view own conversations"
  ON public.ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streams (public read)
CREATE POLICY "Anyone can view streams"
  ON public.streams FOR SELECT
  USING (true);

-- RLS Policies for colleges (public read)
CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  USING (true);

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

-- RLS Policies for recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_marks_updated_at
  BEFORE UPDATE ON public.student_marks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_interests_updated_at
  BEFORE UPDATE ON public.student_interests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial subjects
INSERT INTO public.subjects (name, category, stream) VALUES
  -- Languages
  ('English', 'language', NULL),
  ('Hindi', 'language', NULL),
  ('French', 'language', NULL),
  ('Spanish', 'language', NULL),
  ('Sanskrit', 'language', NULL),
  
  -- Science Stream Core Subjects
  ('Mathematics', 'core', 'science'),
  ('Physics', 'core', 'science'),
  ('Chemistry', 'core', 'science'),
  ('Biology', 'core', 'science'),
  ('Computer Science', 'core', 'science'),
  
  -- Commerce Stream Core Subjects
  ('Accountancy', 'core', 'commerce'),
  ('Business Studies', 'core', 'commerce'),
  ('Economics', 'core', 'commerce'),
  ('Mathematics', 'core', 'commerce'),
  
  -- Arts Stream Core Subjects
  ('History', 'core', 'arts'),
  ('Political Science', 'core', 'arts'),
  ('Geography', 'core', 'arts'),
  ('Psychology', 'core', 'arts'),
  ('Sociology', 'core', 'arts'),
  ('Literature', 'core', 'arts');

-- Insert initial interest areas
INSERT INTO public.interest_areas (name, description, icon_name) VALUES
  ('Technology', 'Programming, AI, Software Development, Data Science', 'code'),
  ('Medicine', 'Healthcare, Medical Research, Patient Care', 'heart'),
  ('Engineering', 'Mechanical, Civil, Electrical, Chemical Engineering', 'wrench'),
  ('Business', 'Entrepreneurship, Management, Finance, Marketing', 'briefcase'),
  ('Arts', 'Visual Arts, Music, Literature, Creative Writing', 'palette'),
  ('Science', 'Research, Laboratory Work, Scientific Discovery', 'microscope'),
  ('Law', 'Legal Studies, Justice, Advocacy', 'scale'),
  ('Education', 'Teaching, Academic Research, Educational Technology', 'book-open'),
  ('Sports', 'Athletics, Sports Science, Physical Education', 'trophy'),
  ('Social Work', 'Community Service, Social Justice, Counseling', 'users');

-- Insert initial streams
INSERT INTO public.streams (name, description, subjects, career_paths) VALUES
  ('Science', 'Focus on Mathematics, Physics, Chemistry, and Biology', 
   '["Mathematics", "Physics", "Chemistry", "Biology", "English"]',
   '["Engineering", "Medicine", "Research", "Technology", "Data Science"]'),
  
  ('Commerce', 'Focus on Business, Economics, and Accountancy',
   '["Accountancy", "Business Studies", "Economics", "Mathematics", "English"]',
   '["Business", "Finance", "Management", "Economics", "Entrepreneurship"]'),
  
  ('Arts', 'Focus on Humanities, Social Sciences, and Languages',
   '["History", "Political Science", "Geography", "Psychology", "English"]',
   '["Law", "Journalism", "Education", "Social Work", "Public Administration"]');

-- Insert sample aptitude questions
INSERT INTO public.aptitude_questions (question_text, question_type, options, correct_answer, difficulty_level, category) VALUES
  -- Logical Reasoning Questions
  ('If all roses are flowers and some flowers are red, which statement is definitely true?', 'logical', 
   '{"A": "All roses are red", "B": "Some roses are red", "C": "Some red things are roses", "D": "No roses are red"}', 
   'C', 2, 'logical_reasoning'),
  
  ('Complete the sequence: 2, 6, 12, 20, ?', 'logical',
   '{"A": "28", "B": "30", "C": "32", "D": "36"}',
   'B', 3, 'number_sequence'),
  
  -- Interest Profiling Questions
  ('I enjoy solving complex problems and puzzles', 'interest',
   '{"A": "Strongly Agree", "B": "Agree", "C": "Neutral", "D": "Disagree", "E": "Strongly Disagree"}',
   NULL, 1, 'problem_solving'),
  
  ('I prefer working in a team rather than alone', 'interest',
   '{"A": "Strongly Agree", "B": "Agree", "C": "Neutral", "D": "Disagree", "E": "Strongly Disagree"}',
   NULL, 1, 'teamwork');