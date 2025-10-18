-- Create educational platform tables for Zertainity.com

-- Create students table (extends profiles for educational data)
CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  current_class INTEGER CHECK (current_class >= 1 AND current_class <= 12),
  school_name TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'India',
  phone_number TEXT,
  parent_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('language', 'core', 'optional', 'practical')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_marks table
CREATE TABLE public.student_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL CHECK (marks_obtained >= 0),
  max_marks INTEGER NOT NULL CHECK (max_marks > 0),
  exam_type TEXT DEFAULT 'board' CHECK (exam_type IN ('board', 'internal', 'practical', 'project')),
  exam_date DATE,
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, subject_id, exam_type, academic_year)
);

-- Create aptitude_tests table
CREATE TABLE public.aptitude_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  test_type TEXT NOT NULL CHECK (test_type IN ('logical', 'interest', 'personality')),
  total_questions INTEGER NOT NULL,
  time_limit_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create aptitude_questions table
CREATE TABLE public.aptitude_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.aptitude_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'rating_scale', 'text')),
  options JSONB, -- For multiple choice questions
  correct_answer INTEGER, -- Index of correct answer for multiple choice
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  category TEXT,
  weight DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_aptitude_results table
CREATE TABLE public.student_aptitude_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.aptitude_tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_taken_seconds INTEGER,
  responses JSONB, -- Store all question responses
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ai_conversations table
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL, -- Store conversation messages
  emotional_analysis JSONB, -- Store emotional tone analysis
  conversation_summary TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create streams table
CREATE TABLE public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  subjects JSONB NOT NULL, -- Array of subject names
  career_paths JSONB, -- Array of potential career paths
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  type TEXT CHECK (type IN ('government', 'private', 'deemed', 'autonomous')),
  category TEXT CHECK (category IN ('engineering', 'medical', 'commerce', 'arts', 'science', 'law', 'management')),
  rating DECIMAL(3,2),
  website_url TEXT,
  established_year INTEGER,
  accreditation TEXT[],
  facilities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stream_id UUID REFERENCES public.streams(id),
  duration_years INTEGER,
  degree_type TEXT CHECK (degree_type IN ('diploma', 'bachelor', 'master', 'phd', 'certificate')),
  eligibility_criteria JSONB,
  fee_structure JSONB,
  cutoff_percentage DECIMAL(5,2),
  seats_available INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_recommendations table
CREATE TABLE public.student_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('stream', 'college', 'course')),
  recommended_id UUID NOT NULL, -- ID of stream, college, or course
  confidence_score DECIMAL(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  reasons JSONB NOT NULL, -- Array of reasons for recommendation
  ai_analysis JSONB, -- Store AI analysis data
  is_accepted BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interest_areas table
CREATE TABLE public.interest_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  related_streams JSONB, -- Array of related stream IDs
  related_careers JSONB, -- Array of related career paths
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_aptitude_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_areas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "Users can view own student profile"
  ON public.students FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own student profile"
  ON public.students FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own student profile"
  ON public.students FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

-- RLS Policies for student_marks
CREATE POLICY "Users can view own marks"
  ON public.student_marks FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own marks"
  ON public.student_marks FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own marks"
  ON public.student_marks FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Users can delete own marks"
  ON public.student_marks FOR DELETE
  USING (auth.uid() = student_id);

-- RLS Policies for aptitude_tests (public read)
CREATE POLICY "Anyone can view active aptitude tests"
  ON public.aptitude_tests FOR SELECT
  USING (is_active = true);

-- RLS Policies for aptitude_questions (public read)
CREATE POLICY "Anyone can view aptitude questions"
  ON public.aptitude_questions FOR SELECT
  USING (true);

-- RLS Policies for student_aptitude_results
CREATE POLICY "Users can view own aptitude results"
  ON public.student_aptitude_results FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own aptitude results"
  ON public.student_aptitude_results FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- RLS Policies for ai_conversations
CREATE POLICY "Users can view own conversations"
  ON public.ai_conversations FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own conversations"
  ON public.ai_conversations FOR UPDATE
  USING (auth.uid() = student_id);

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

-- RLS Policies for student_recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.student_recommendations FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.student_recommendations FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own recommendations"
  ON public.student_recommendations FOR UPDATE
  USING (auth.uid() = student_id);

-- RLS Policies for interest_areas (public read)
CREATE POLICY "Anyone can view interest areas"
  ON public.interest_areas FOR SELECT
  USING (true);

-- Create function to handle new user signup for students
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.students (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new student signup
CREATE TRIGGER on_auth_user_created_student
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_student();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_marks_updated_at
  BEFORE UPDATE ON public.student_marks
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
INSERT INTO public.subjects (name, category, description) VALUES
  -- Languages
  ('English', 'language', 'English language and literature'),
  ('Hindi', 'language', 'Hindi language and literature'),
  ('French', 'language', 'French language'),
  ('German', 'language', 'German language'),
  ('Spanish', 'language', 'Spanish language'),
  ('Sanskrit', 'language', 'Sanskrit language'),
  
  -- Core Subjects
  ('Mathematics', 'core', 'Mathematics and statistics'),
  ('Physics', 'core', 'Physics and physical sciences'),
  ('Chemistry', 'core', 'Chemistry and chemical sciences'),
  ('Biology', 'core', 'Biology and life sciences'),
  ('Computer Science', 'core', 'Computer science and programming'),
  ('Economics', 'core', 'Economics and business studies'),
  ('Business Studies', 'core', 'Business and commerce'),
  ('Accountancy', 'core', 'Accounting and finance'),
  ('History', 'core', 'History and social studies'),
  ('Geography', 'core', 'Geography and environmental studies'),
  ('Political Science', 'core', 'Political science and civics'),
  ('Psychology', 'core', 'Psychology and behavioral sciences'),
  ('Sociology', 'core', 'Sociology and social sciences'),
  ('Philosophy', 'core', 'Philosophy and ethics'),
  
  -- Optional Subjects
  ('Physical Education', 'optional', 'Physical education and sports'),
  ('Art', 'optional', 'Fine arts and visual arts'),
  ('Music', 'optional', 'Music and performing arts'),
  ('Drama', 'optional', 'Drama and theater arts'),
  ('Home Science', 'optional', 'Home science and family studies'),
  ('Environmental Science', 'optional', 'Environmental studies'),
  
  -- Practical Subjects
  ('Computer Practical', 'practical', 'Computer practical work'),
  ('Physics Practical', 'practical', 'Physics laboratory work'),
  ('Chemistry Practical', 'practical', 'Chemistry laboratory work'),
  ('Biology Practical', 'practical', 'Biology laboratory work');

-- Insert initial streams
INSERT INTO public.streams (name, description, subjects, career_paths, icon) VALUES
  ('Science', 'Focus on Physics, Chemistry, Mathematics, and Biology for STEM careers', 
   '["Physics", "Chemistry", "Mathematics", "Biology/Computer Science"]',
   '["Engineering", "Medicine", "Research", "Data Science", "Biotechnology", "Pharmacy"]',
   '🔬'),
  ('Commerce', 'Focus on Business Studies, Economics, Accountancy, and Mathematics',
   '["Business Studies", "Economics", "Accountancy", "Mathematics/Computer Science"]',
   '["Business Management", "Finance", "Economics", "Entrepreneurship", "Banking", "Chartered Accountancy"]',
   '💼'),
  ('Arts/Humanities', 'Focus on Literature, History, Political Science, and Psychology',
   '["Literature", "History", "Political Science", "Psychology/Sociology"]',
   '["Journalism", "Law", "Psychology", "Social Work", "Public Administration", "Teaching"]',
   '🎨');

-- Insert initial interest areas
INSERT INTO public.interest_areas (name, description, related_streams, related_careers, icon) VALUES
  ('Technology & Computer Science', 'Interest in computers, programming, and digital technology',
   '["Science", "Commerce"]',
   '["Software Engineering", "Data Science", "Cybersecurity", "AI/ML", "Web Development"]',
   '💻'),
  ('Medicine & Healthcare', 'Interest in healthcare, medicine, and helping people',
   '["Science"]',
   '["Doctor", "Nurse", "Pharmacist", "Physiotherapist", "Medical Research"]',
   '🏥'),
  ('Engineering', 'Interest in building, designing, and problem-solving',
   '["Science"]',
   '["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Aerospace Engineering"]',
   '⚙️'),
  ('Business & Management', 'Interest in business, leadership, and entrepreneurship',
   '["Commerce", "Arts/Humanities"]',
   '["Business Management", "Marketing", "Finance", "Human Resources", "Consulting"]',
   '📈'),
  ('Arts & Humanities', 'Interest in creative expression and human studies',
   '["Arts/Humanities"]',
   '["Writer", "Artist", "Designer", "Historian", "Philosopher"]',
   '🎭'),
  ('Science & Research', 'Interest in scientific discovery and research',
   '["Science"]',
   '["Research Scientist", "Biologist", "Chemist", "Physicist", "Environmental Scientist"]',
   '🔬'),
  ('Law & Legal Studies', 'Interest in justice, legal systems, and advocacy',
   '["Arts/Humanities", "Commerce"]',
   '["Lawyer", "Judge", "Legal Advisor", "Public Prosecutor", "Corporate Counsel"]',
   '⚖️'),
  ('Education & Teaching', 'Interest in teaching and knowledge sharing',
   '["Arts/Humanities", "Science", "Commerce"]',
   '["Teacher", "Professor", "Educational Administrator", "Curriculum Developer"]',
   '👩‍🏫'),
  ('Design & Creative Arts', 'Interest in visual design and creative expression',
   '["Arts/Humanities"]',
   '["Graphic Designer", "Interior Designer", "Fashion Designer", "Architect", "Animator"]',
   '🎨'),
  ('Sports & Physical Education', 'Interest in sports, fitness, and physical activities',
   '["Arts/Humanities"]',
   '["Professional Athlete", "Sports Coach", "Physical Therapist", "Sports Management"]',
   '🏃‍♂️');

-- Insert initial aptitude tests
INSERT INTO public.aptitude_tests (name, description, test_type, total_questions, time_limit_minutes) VALUES
  ('Logical Reasoning Assessment', 'Tests analytical thinking, pattern recognition, and problem-solving abilities', 'logical', 8, 30),
  ('Interest Profiling Test', 'Assesses career interests, learning preferences, and motivation factors', 'interest', 8, 30),
  ('Personality Assessment', 'Evaluates personality traits and behavioral patterns', 'personality', 10, 25);

-- Insert sample colleges
INSERT INTO public.colleges (name, location, state, type, category, rating, website_url, established_year) VALUES
  ('Indian Institute of Technology Delhi', 'New Delhi', 'Delhi', 'government', 'engineering', 4.8, 'https://www.iitd.ac.in', 1961),
  ('Shri Ram College of Commerce', 'New Delhi', 'Delhi', 'government', 'commerce', 4.7, 'https://www.srcc.edu', 1926),
  ('Jawaharlal Nehru University', 'New Delhi', 'Delhi', 'government', 'arts', 4.6, 'https://www.jnu.ac.in', 1969),
  ('Delhi University', 'New Delhi', 'Delhi', 'government', 'arts', 4.5, 'https://www.du.ac.in', 1922),
  ('All India Institute of Medical Sciences', 'New Delhi', 'Delhi', 'government', 'medical', 4.9, 'https://www.aiims.edu', 1956);

-- Insert sample courses
INSERT INTO public.courses (college_id, name, stream_id, duration_years, degree_type, cutoff_percentage, seats_available) VALUES
  ((SELECT id FROM public.colleges WHERE name = 'Indian Institute of Technology Delhi'), 'Computer Science Engineering', (SELECT id FROM public.streams WHERE name = 'Science'), 4, 'bachelor', 95.0, 120),
  ((SELECT id FROM public.colleges WHERE name = 'Shri Ram College of Commerce'), 'B.Com (Hons)', (SELECT id FROM public.streams WHERE name = 'Commerce'), 3, 'bachelor', 98.0, 200),
  ((SELECT id FROM public.colleges WHERE name = 'Jawaharlal Nehru University'), 'Political Science', (SELECT id FROM public.streams WHERE name = 'Arts/Humanities'), 3, 'bachelor', 85.0, 150),
  ((SELECT id FROM public.colleges WHERE name = 'All India Institute of Medical Sciences'), 'MBBS', (SELECT id FROM public.streams WHERE name = 'Science'), 5, 'bachelor', 99.0, 100);