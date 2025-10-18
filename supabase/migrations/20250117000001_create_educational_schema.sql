-- Create educational platform schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS user_reviews CASCADE;
DROP TABLE IF EXISTS restaurant_cuisines CASCADE;
DROP TABLE IF EXISTS taste_preferences CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS cuisines CASCADE;

-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  current_class INTEGER DEFAULT 10,
  board TEXT, -- CBSE, ICSE, State Board, etc.
  school_name TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'language', 'core', 'optional'
  stream TEXT, -- 'science', 'commerce', 'arts', 'general'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_marks table
CREATE TABLE student_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (marks_obtained::DECIMAL / total_marks * 100) STORED,
  exam_type TEXT DEFAULT 'board', -- 'board', 'internal', 'mock'
  exam_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, exam_type, exam_year)
);

-- Create aptitude_questions table
CREATE TABLE aptitude_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'logical', 'analytical', 'interest', 'motivation'
  options JSONB NOT NULL, -- Array of options
  correct_answer INTEGER, -- Index of correct option (for logical/analytical)
  weight DECIMAL(3,2) DEFAULT 1.0, -- Weight for scoring
  difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aptitude_results table
CREATE TABLE aptitude_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL, -- 'logical_analytical', 'interest_motivation'
  question_id UUID REFERENCES aptitude_questions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  time_taken INTEGER, -- Time in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_conversations table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  message_type TEXT NOT NULL, -- 'user', 'ai'
  message_text TEXT NOT NULL,
  emotional_tone TEXT, -- 'positive', 'negative', 'neutral', 'anxious', 'confident'
  stress_level INTEGER, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streams table
CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  subjects_required JSONB, -- Array of required subject IDs
  career_paths JSONB, -- Array of potential career paths
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colleges table
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'university', 'college', 'institute'
  location_city TEXT NOT NULL,
  location_state TEXT NOT NULL,
  location_country TEXT DEFAULT 'India',
  website TEXT,
  rating DECIMAL(3,2), -- 1.0 to 5.0
  established_year INTEGER,
  accreditation TEXT, -- NAAC, NBA, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  duration_years INTEGER NOT NULL,
  degree_type TEXT NOT NULL, -- 'bachelor', 'master', 'diploma', 'certificate'
  eligibility_criteria JSONB, -- JSON object with requirements
  fee_structure JSONB, -- JSON object with fee details
  cutoff_marks DECIMAL(5,2), -- Last year's cutoff
  seats_available INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'stream', 'college', 'course'
  recommended_id UUID NOT NULL, -- ID of stream, college, or course
  confidence_score DECIMAL(3,2) NOT NULL, -- 0.0 to 1.0
  reasoning TEXT NOT NULL, -- AI-generated explanation
  factors_considered JSONB, -- JSON object with factors used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_student_marks_student_id ON student_marks(student_id);
CREATE INDEX idx_aptitude_results_student_id ON aptitude_results(student_id);
CREATE INDEX idx_ai_conversations_student_id ON ai_conversations(student_id);
CREATE INDEX idx_recommendations_student_id ON recommendations(student_id);
CREATE INDEX idx_courses_college_id ON courses(college_id);
CREATE INDEX idx_courses_stream_id ON courses(stream_id);

-- Insert sample subjects
INSERT INTO subjects (name, category, stream) VALUES
  ('English', 'language', 'general'),
  ('Hindi', 'language', 'general'),
  ('Mathematics', 'core', 'science'),
  ('Physics', 'core', 'science'),
  ('Chemistry', 'core', 'science'),
  ('Biology', 'core', 'science'),
  ('Economics', 'core', 'commerce'),
  ('Business Studies', 'core', 'commerce'),
  ('Accountancy', 'core', 'commerce'),
  ('History', 'core', 'arts'),
  ('Geography', 'core', 'arts'),
  ('Political Science', 'core', 'arts'),
  ('Computer Science', 'core', 'science'),
  ('Physical Education', 'optional', 'general');

-- Insert sample streams
INSERT INTO streams (name, description, subjects_required, career_paths) VALUES
  ('Science (PCM)', 'Physics, Chemistry, Mathematics', 
   '["Mathematics", "Physics", "Chemistry"]'::jsonb,
   '["Engineering", "Medicine", "Research", "Data Science"]'::jsonb),
  ('Science (PCB)', 'Physics, Chemistry, Biology',
   '["Physics", "Chemistry", "Biology"]'::jsonb,
   '["Medicine", "Biotechnology", "Pharmacy", "Research"]'::jsonb),
  ('Commerce', 'Business and Economics focused',
   '["Mathematics", "Economics", "Business Studies", "Accountancy"]'::jsonb,
   '["Business", "Finance", "Accounting", "Management"]'::jsonb),
  ('Arts/Humanities', 'Liberal Arts and Social Sciences',
   '["History", "Geography", "Political Science"]'::jsonb,
   '["Law", "Journalism", "Social Work", "Education"]'::jsonb);

-- Insert sample colleges
INSERT INTO colleges (name, type, location_city, location_state, website, rating, established_year, accreditation) VALUES
  ('Indian Institute of Technology Delhi', 'institute', 'New Delhi', 'Delhi', 'https://www.iitd.ac.in', 4.8, 1961, 'NAAC A++'),
  ('Delhi University', 'university', 'New Delhi', 'Delhi', 'https://www.du.ac.in', 4.2, 1922, 'NAAC A++'),
  ('St. Stephen''s College', 'college', 'New Delhi', 'Delhi', 'https://www.ststephens.edu', 4.5, 1881, 'NAAC A++'),
  ('Lady Shri Ram College', 'college', 'New Delhi', 'Delhi', 'https://www.lsr.edu.in', 4.3, 1956, 'NAAC A++'),
  ('Indian Institute of Science', 'institute', 'Bangalore', 'Karnataka', 'https://www.iisc.ac.in', 4.7, 1909, 'NAAC A++');

-- Insert sample courses
INSERT INTO courses (college_id, name, stream_id, duration_years, degree_type, eligibility_criteria, fee_structure, cutoff_marks, seats_available) VALUES
  ((SELECT id FROM colleges WHERE name = 'Indian Institute of Technology Delhi'), 'Computer Science Engineering', 
   (SELECT id FROM streams WHERE name = 'Science (PCM)'), 4, 'bachelor',
   '{"min_marks": 95, "subjects": ["Mathematics", "Physics", "Chemistry"]}'::jsonb,
   '{"tuition": 200000, "hostel": 50000, "total_annual": 250000}'::jsonb, 98.5, 120),
  ((SELECT id FROM colleges WHERE name = 'Delhi University'), 'B.Sc. Physics (Hons)', 
   (SELECT id FROM streams WHERE name = 'Science (PCM)'), 3, 'bachelor',
   '{"min_marks": 85, "subjects": ["Mathematics", "Physics", "Chemistry"]}'::jsonb,
   '{"tuition": 15000, "hostel": 30000, "total_annual": 45000}'::jsonb, 92.0, 200),
  ((SELECT id FROM colleges WHERE name = 'St. Stephen''s College'), 'B.A. Economics (Hons)', 
   (SELECT id FROM streams WHERE name = 'Commerce'), 3, 'bachelor',
   '{"min_marks": 90, "subjects": ["Mathematics", "Economics"]}'::jsonb,
   '{"tuition": 25000, "hostel": 40000, "total_annual": 65000}'::jsonb, 95.0, 80);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_marks_updated_at BEFORE UPDATE ON student_marks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
