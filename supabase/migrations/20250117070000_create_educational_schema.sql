-- Drop existing tables that are not needed for educational platform
DROP TABLE IF EXISTS public.user_reviews CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.taste_preferences CASCADE;
DROP TABLE IF EXISTS public.restaurant_cuisines CASCADE;
DROP TABLE IF EXISTS public.restaurants CASCADE;
DROP TABLE IF EXISTS public.cuisines CASCADE;

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'language', 'core', 'optional'
  description TEXT,
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

-- Create streams table (for Class 11 recommendations)
CREATE TABLE public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'Science', 'Commerce', 'Arts', 'Humanities'
  description TEXT,
  subjects TEXT[], -- Array of subject names
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  state TEXT,
  city TEXT,
  type TEXT, -- 'Government', 'Private', 'Deemed', 'Central'
  rating DECIMAL(2, 1),
  website TEXT,
  established_year INTEGER,
  cutoff_marks JSONB, -- Store cutoff data for different courses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES public.streams(id) ON DELETE CASCADE,
  duration_years INTEGER,
  eligibility_criteria TEXT,
  cutoff_marks INTEGER,
  fees_range JSONB, -- {min: number, max: number}
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_marks table
CREATE TABLE public.student_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_marks > 0 THEN (marks_obtained::DECIMAL / total_marks::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,
  exam_type TEXT, -- 'Class 10', 'Class 12', 'Entrance Exam'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, subject_id, exam_type)
);

-- Create aptitude_tests table
CREATE TABLE public.aptitude_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  test_type TEXT NOT NULL, -- 'logical_reasoning', 'interest_profiling'
  questions JSONB NOT NULL, -- Store questions and options
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create aptitude_results table
CREATE TABLE public.aptitude_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.aptitude_tests(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Store user answers
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN max_score > 0 THEN (score::DECIMAL / max_score::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_profiles table (extended profile for students)
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  class_level TEXT, -- 'Class 10', 'Class 12'
  interest_area_id UUID REFERENCES public.interest_areas(id),
  preferred_stream_id UUID REFERENCES public.streams(id),
  emotional_tone JSONB, -- Store emotional analysis from AI chat
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  learning_style TEXT, -- 'visual', 'auditory', 'kinesthetic', 'reading'
  career_goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ai_chat_sessions table
CREATE TABLE public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_data JSONB NOT NULL, -- Store conversation history
  emotional_analysis JSONB, -- Store AI analysis of emotional tone
  recommendations JSONB, -- Store AI-generated recommendations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  chat_session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'stream', 'college', 'course'
  recommended_item_id UUID, -- ID of stream, college, or course
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  reasoning TEXT, -- AI explanation for the recommendation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

-- RLS Policies for interest_areas (public read)
CREATE POLICY "Anyone can view interest areas"
  ON public.interest_areas FOR SELECT
  USING (true);

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

-- RLS Policies for aptitude_tests (public read)
CREATE POLICY "Anyone can view aptitude tests"
  ON public.aptitude_tests FOR SELECT
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

-- RLS Policies for aptitude_results
CREATE POLICY "Users can view own aptitude results"
  ON public.aptitude_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own aptitude results"
  ON public.aptitude_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Users can view own student profile"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own student profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own student profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_chat_sessions
CREATE POLICY "Users can view own chat sessions"
  ON public.ai_chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
  ON public.ai_chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON public.ai_chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_marks_updated_at
  BEFORE UPDATE ON public.student_marks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.subjects (name, category, description) VALUES
  -- Languages
  ('English', 'language', 'English Language and Literature'),
  ('Hindi', 'language', 'Hindi Language and Literature'),
  ('French', 'language', 'French Language'),
  ('German', 'language', 'German Language'),
  ('Spanish', 'language', 'Spanish Language'),
  ('Sanskrit', 'language', 'Sanskrit Language'),
  
  -- Core Subjects
  ('Mathematics', 'core', 'Mathematics'),
  ('Physics', 'core', 'Physics'),
  ('Chemistry', 'core', 'Chemistry'),
  ('Biology', 'core', 'Biology'),
  ('History', 'core', 'History'),
  ('Geography', 'core', 'Geography'),
  ('Political Science', 'core', 'Political Science'),
  ('Economics', 'core', 'Economics'),
  ('Business Studies', 'core', 'Business Studies'),
  ('Accountancy', 'core', 'Accountancy'),
  ('Computer Science', 'core', 'Computer Science'),
  ('Psychology', 'core', 'Psychology'),
  ('Sociology', 'core', 'Sociology'),
  ('Philosophy', 'core', 'Philosophy'),
  
  -- Optional Subjects
  ('Physical Education', 'optional', 'Physical Education'),
  ('Art', 'optional', 'Fine Arts'),
  ('Music', 'optional', 'Music'),
  ('Dance', 'optional', 'Dance'),
  ('Home Science', 'optional', 'Home Science');

INSERT INTO public.interest_areas (name, description, icon_name) VALUES
  ('Technology', 'Computer Science, AI, Software Development', 'laptop'),
  ('Medicine', 'Medical Sciences, Healthcare, Biology', 'heart'),
  ('Engineering', 'Mechanical, Civil, Electrical Engineering', 'wrench'),
  ('Business', 'Commerce, Management, Entrepreneurship', 'briefcase'),
  ('Arts', 'Fine Arts, Literature, Creative Writing', 'palette'),
  ('Law', 'Legal Studies, Judiciary, Advocacy', 'scale'),
  ('Science', 'Pure Sciences, Research, Academia', 'microscope'),
  ('Social Work', 'Social Sciences, Community Service', 'users'),
  ('Design', 'Graphic Design, Fashion, Architecture', 'paintbrush'),
  ('Sports', 'Physical Education, Sports Science', 'trophy');

INSERT INTO public.streams (name, description, subjects) VALUES
  ('Science (PCM)', 'Physics, Chemistry, Mathematics', ARRAY['Physics', 'Chemistry', 'Mathematics', 'English']),
  ('Science (PCB)', 'Physics, Chemistry, Biology', ARRAY['Physics', 'Chemistry', 'Biology', 'English']),
  ('Commerce', 'Business Studies, Accountancy, Economics', ARRAY['Business Studies', 'Accountancy', 'Economics', 'English']),
  ('Arts/Humanities', 'History, Geography, Political Science', ARRAY['History', 'Geography', 'Political Science', 'English']),
  ('Computer Science', 'Computer Science, Mathematics, Physics', ARRAY['Computer Science', 'Mathematics', 'Physics', 'English']);

-- Insert sample aptitude tests
INSERT INTO public.aptitude_tests (name, description, test_type, questions) VALUES
  ('Logical Reasoning Test', 'Test your analytical and logical thinking skills', 'logical_reasoning', 
   '[
     {
       "id": 1,
       "question": "If all roses are flowers and some flowers are red, which of the following must be true?",
       "options": [
         "All roses are red",
         "Some roses are red", 
         "Some red things are roses",
         "None of the above"
       ],
       "correct_answer": 2,
       "difficulty": "medium"
     },
     {
       "id": 2,
       "question": "Complete the sequence: 2, 6, 12, 20, ?",
       "options": ["28", "30", "32", "36"],
       "correct_answer": 1,
       "difficulty": "easy"
     },
     {
       "id": 3,
       "question": "If A is taller than B, and B is taller than C, which statement is definitely true?",
       "options": [
         "A is the tallest",
         "C is the shortest",
         "A is taller than C",
         "All of the above"
       ],
       "correct_answer": 3,
       "difficulty": "easy"
     },
     {
       "id": 4,
       "question": "A clock shows 3:15. What is the angle between the hour and minute hands?",
       "options": ["0°", "7.5°", "15°", "30°"],
       "correct_answer": 1,
       "difficulty": "hard"
     },
     {
       "id": 5,
       "question": "If 5 machines can produce 5 widgets in 5 minutes, how many machines are needed to produce 100 widgets in 100 minutes?",
       "options": ["5", "10", "20", "100"],
       "correct_answer": 0,
       "difficulty": "medium"
     },
     {
       "id": 6,
       "question": "What comes next in the pattern: O, T, T, F, F, S, S, ?",
       "options": ["E", "N", "T", "H"],
       "correct_answer": 0,
       "difficulty": "hard"
     },
     {
       "id": 7,
       "question": "If a square has a diagonal of 10 units, what is its area?",
       "options": ["50", "100", "25√2", "50√2"],
       "correct_answer": 0,
       "difficulty": "medium"
     },
     {
       "id": 8,
       "question": "In a group of 30 people, 18 like coffee and 12 like tea. If 8 like both, how many like neither?",
       "options": ["4", "6", "8", "10"],
       "correct_answer": 2,
       "difficulty": "medium"
     }
   ]'::jsonb),
   
  ('Interest Profiling Test', 'Discover your interests and career inclinations', 'interest_profiling',
   '[
     {
       "id": 1,
       "question": "What type of activities do you enjoy most?",
       "options": [
         "Solving puzzles and problems",
         "Creating art or music",
         "Helping others",
         "Working with technology"
       ],
       "categories": ["analytical", "creative", "social", "technical"],
       "difficulty": "easy"
     },
     {
       "id": 2,
       "question": "In your free time, you would prefer to:",
       "options": [
         "Read books or articles",
         "Play sports or exercise",
         "Socialize with friends",
         "Work on personal projects"
       ],
       "categories": ["intellectual", "physical", "social", "independent"],
       "difficulty": "easy"
     },
     {
       "id": 3,
       "question": "What motivates you most in your studies?",
       "options": [
         "Understanding how things work",
         "Expressing your creativity",
         "Making a difference in society",
         "Building something useful"
       ],
       "categories": ["analytical", "creative", "social", "practical"],
       "difficulty": "easy"
     },
     {
       "id": 4,
       "question": "Your ideal work environment would be:",
       "options": [
         "A quiet library or lab",
         "A dynamic, creative space",
         "A place where you help people",
         "A modern office with latest technology"
       ],
       "categories": ["quiet", "creative", "helping", "tech"],
       "difficulty": "easy"
     },
     {
       "id": 5,
       "question": "What type of problems do you find most interesting?",
       "options": [
         "Mathematical or scientific problems",
         "Design or aesthetic challenges",
         "Social or human problems",
         "Technical or engineering problems"
       ],
       "categories": ["scientific", "design", "social", "technical"],
       "difficulty": "medium"
     },
     {
       "id": 6,
       "question": "How do you prefer to learn new things?",
       "options": [
         "Through reading and research",
         "Through hands-on practice",
         "Through discussion with others",
         "Through online tutorials and videos"
       ],
       "categories": ["reading", "practical", "collaborative", "digital"],
       "difficulty": "medium"
     },
     {
       "id": 7,
       "question": "What career field appeals to you most?",
       "options": [
         "Research and academia",
         "Arts and entertainment",
         "Healthcare or social work",
         "Technology and innovation"
       ],
       "categories": ["research", "arts", "helping", "tech"],
       "difficulty": "medium"
     },
     {
       "id": 8,
       "question": "What would you like to be known for?",
       "options": [
         "Your intelligence and knowledge",
         "Your creativity and originality",
         "Your compassion and helpfulness",
         "Your innovation and problem-solving"
       ],
       "categories": ["intellectual", "creative", "compassionate", "innovative"],
       "difficulty": "medium"
     }
   ]'::jsonb);

-- Insert sample colleges
INSERT INTO public.colleges (name, location, state, city, type, rating, website, established_year, cutoff_marks) VALUES
  ('Indian Institute of Technology Delhi', 'New Delhi', 'Delhi', 'New Delhi', 'Central', 4.8, 'https://www.iitd.ac.in', 1961, '{"JEE Advanced": 95, "Class 12": 90}'),
  ('Delhi University', 'New Delhi', 'Delhi', 'New Delhi', 'Central', 4.5, 'https://www.du.ac.in', 1922, '{"Class 12": 85}'),
  ('St. Stephen''s College', 'New Delhi', 'Delhi', 'New Delhi', 'Central', 4.7, 'https://www.ststephens.edu', 1881, '{"Class 12": 95}'),
  ('Lady Shri Ram College', 'New Delhi', 'Delhi', 'New Delhi', 'Central', 4.6, 'https://www.lsr.edu.in', 1956, '{"Class 12": 90}'),
  ('Hindu College', 'New Delhi', 'Delhi', 'New Delhi', 'Central', 4.4, 'https://www.hinducollege.ac.in', 1899, '{"Class 12": 88}'),
  ('Indian Institute of Science Bangalore', 'Bangalore', 'Karnataka', 'Bangalore', 'Central', 4.9, 'https://www.iisc.ac.in', 1909, '{"JEE Advanced": 98, "Class 12": 95}'),
  ('Christ University', 'Bangalore', 'Karnataka', 'Bangalore', 'Deemed', 4.3, 'https://www.christuniversity.in', 1969, '{"Class 12": 80}'),
  ('St. Xavier''s College Mumbai', 'Mumbai', 'Maharashtra', 'Mumbai', 'Private', 4.5, 'https://www.xaviers.edu', 1869, '{"Class 12": 85}'),
  ('Presidency College Chennai', 'Chennai', 'Tamil Nadu', 'Chennai', 'Government', 4.4, 'https://www.presidencycollege.ac.in', 1840, '{"Class 12": 82}'),
  ('Fergusson College Pune', 'Pune', 'Maharashtra', 'Pune', 'Government', 4.2, 'https://www.fergusson.edu', 1885, '{"Class 12": 78}');