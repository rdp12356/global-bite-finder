-- Zertainity.com Database Schema
-- Educational guidance platform for stream and college recommendations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE stream_type AS ENUM ('science', 'commerce', 'arts', 'humanities');
CREATE TYPE test_type AS ENUM ('logical', 'interest');
CREATE TYPE recommendation_type AS ENUM ('stream', 'college', 'course');

-- Student profiles table
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    current_class INTEGER DEFAULT 10,
    board TEXT, -- CBSE, ICSE, State Board, etc.
    location_city TEXT,
    location_state TEXT,
    location_country TEXT DEFAULT 'India',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic marks table
CREATE TABLE academic_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_type TEXT NOT NULL, -- 'language', 'core', 'optional'
    marks_obtained INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN total_marks > 0 THEN (marks_obtained::DECIMAL / total_marks) * 100
            ELSE 0
        END
    ) STORED,
    grade TEXT,
    exam_type TEXT, -- 'board', 'internal', 'mock'
    exam_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interest areas table
CREATE TABLE interest_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL, -- 'technology', 'arts', 'business', 'medicine', 'engineering', etc.
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student interests mapping
CREATE TABLE student_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interest_areas(id) ON DELETE CASCADE,
    preference_level INTEGER DEFAULT 1 CHECK (preference_level >= 1 AND preference_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, interest_id)
);

-- Aptitude test questions table
CREATE TABLE aptitude_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_type test_type NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of answer options
    correct_answer INTEGER, -- Index of correct answer (for logical tests)
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    category TEXT, -- For logical tests: 'verbal', 'numerical', 'spatial', etc.
    weight INTEGER DEFAULT 1, -- Weight for scoring
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aptitude test results table
CREATE TABLE aptitude_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    test_type test_type NOT NULL,
    question_id UUID REFERENCES aptitude_questions(id) ON DELETE CASCADE,
    selected_answer INTEGER NOT NULL,
    is_correct BOOLEAN,
    time_taken INTEGER, -- Time in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversation sessions
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    message_type TEXT NOT NULL, -- 'user', 'ai'
    message_text TEXT NOT NULL,
    emotional_tone TEXT, -- 'positive', 'neutral', 'negative', 'anxious', etc.
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streams table
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    stream_type stream_type NOT NULL,
    description TEXT,
    subjects JSONB NOT NULL, -- Array of subjects in this stream
    career_paths JSONB, -- Array of potential career paths
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Colleges table
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'university', 'college', 'institute'
    location_city TEXT NOT NULL,
    location_state TEXT NOT NULL,
    location_country TEXT DEFAULT 'India',
    website TEXT,
    phone TEXT,
    email TEXT,
    established_year INTEGER,
    accreditation TEXT, -- NAAC, NBA, etc.
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    description TEXT,
    facilities JSONB, -- Array of facilities
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stream_type stream_type NOT NULL,
    duration_years INTEGER NOT NULL,
    degree_type TEXT NOT NULL, -- 'bachelor', 'master', 'diploma', 'certificate'
    description TEXT,
    eligibility_criteria JSONB, -- JSON object with eligibility requirements
    fees_annual DECIMAL(10,2),
    cutoff_percentage DECIMAL(5,2),
    seats_total INTEGER,
    seats_available INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    recommendation_type recommendation_type NOT NULL,
    stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    reasoning TEXT NOT NULL, -- AI-generated explanation
    is_accepted BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_academic_marks_student_id ON academic_marks(student_id);
CREATE INDEX idx_aptitude_results_student_id ON aptitude_results(student_id);
CREATE INDEX idx_ai_conversations_student_id ON ai_conversations(student_id);
CREATE INDEX idx_recommendations_student_id ON recommendations(student_id);
CREATE INDEX idx_courses_college_id ON courses(college_id);
CREATE INDEX idx_courses_stream_type ON courses(stream_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_student_profiles_updated_at 
    BEFORE UPDATE ON student_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO interest_areas (name, description, category, icon_name) VALUES
('Technology', 'Computers, programming, software development', 'technology', 'laptop'),
('Medicine', 'Healthcare, medical sciences, patient care', 'medicine', 'heart'),
('Engineering', 'Design, construction, problem-solving', 'engineering', 'wrench'),
('Arts', 'Creative expression, visual arts, design', 'arts', 'palette'),
('Business', 'Commerce, management, entrepreneurship', 'business', 'briefcase'),
('Science', 'Research, experimentation, discovery', 'science', 'microscope'),
('Law', 'Legal studies, justice, advocacy', 'law', 'scale'),
('Education', 'Teaching, learning, knowledge sharing', 'education', 'book-open');

INSERT INTO streams (name, stream_type, description, subjects, career_paths) VALUES
('Science (PCM)', 'science', 'Physics, Chemistry, Mathematics stream', 
 '["Physics", "Chemistry", "Mathematics", "English", "Computer Science/Physical Education"]',
 '["Engineering", "Medicine", "Research", "Data Science", "Architecture"]'),
('Science (PCB)', 'science', 'Physics, Chemistry, Biology stream',
 '["Physics", "Chemistry", "Biology", "English", "Physical Education"]',
 '["Medicine", "Dentistry", "Pharmacy", "Biotechnology", "Research"]'),
('Commerce', 'commerce', 'Business and commerce stream',
 '["Accountancy", "Business Studies", "Economics", "English", "Mathematics/Informatics Practices"]',
 '["Chartered Accountancy", "Business Management", "Banking", "Finance", "Entrepreneurship"]'),
('Arts/Humanities', 'arts', 'Liberal arts and humanities stream',
 '["History", "Political Science", "Geography", "English", "Psychology/Sociology"]',
 '["Journalism", "Law", "Civil Services", "Social Work", "Education"]');

-- Insert sample colleges
INSERT INTO colleges (name, type, location_city, location_state, website, established_year, rating, description) VALUES
('Indian Institute of Technology Delhi', 'institute', 'New Delhi', 'Delhi', 'https://www.iitd.ac.in', 1961, 4.8, 'Premier engineering institute'),
('Delhi University', 'university', 'New Delhi', 'Delhi', 'https://www.du.ac.in', 1922, 4.5, 'One of the largest universities in India'),
('St. Stephen''s College', 'college', 'New Delhi', 'Delhi', 'https://www.ststephens.edu', 1881, 4.7, 'Renowned liberal arts college'),
('Lady Shri Ram College', 'college', 'New Delhi', 'Delhi', 'https://www.lsr.edu.in', 1956, 4.6, 'Leading women''s college'),
('Hindu College', 'college', 'New Delhi', 'Delhi', 'https://www.hinducollege.ac.in', 1899, 4.4, 'Historic college with strong academic tradition');

-- Insert sample courses
INSERT INTO courses (college_id, name, stream_type, duration_years, degree_type, description, fees_annual, cutoff_percentage, seats_total) VALUES
((SELECT id FROM colleges WHERE name = 'Indian Institute of Technology Delhi'), 'Computer Science Engineering', 'science', 4, 'bachelor', 'B.Tech in Computer Science', 250000, 98.5, 120),
((SELECT id FROM colleges WHERE name = 'Delhi University'), 'B.Sc (Hons) Physics', 'science', 3, 'bachelor', 'Bachelor of Science in Physics', 45000, 85.0, 60),
((SELECT id FROM colleges WHERE name = 'St. Stephen''s College'), 'B.A (Hons) English', 'arts', 3, 'bachelor', 'Bachelor of Arts in English Literature', 35000, 90.0, 40),
((SELECT id FROM colleges WHERE name = 'Lady Shri Ram College'), 'B.Com (Hons)', 'commerce', 3, 'bachelor', 'Bachelor of Commerce', 30000, 88.0, 80),
((SELECT id FROM colleges WHERE name = 'Hindu College'), 'B.A (Hons) Economics', 'commerce', 3, 'bachelor', 'Bachelor of Arts in Economics', 32000, 87.0, 50);
