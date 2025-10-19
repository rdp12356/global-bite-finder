-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'student');

-- Create user_roles table for role-based authentication
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Update profiles table to remove restaurant-specific fields
ALTER TABLE public.profiles DROP COLUMN IF EXISTS location_country;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS location_city;

-- Add student-specific fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_grade TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_name TEXT;

-- Create schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  board TEXT,
  description TEXT,
  website TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schools"
  ON public.schools FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schools"
  ON public.schools FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  type TEXT,
  description TEXT,
  website TEXT,
  phone_number TEXT,
  accreditation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage colleges"
  ON public.colleges FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create career fields table
CREATE TABLE public.career_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.career_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career fields"
  ON public.career_fields FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage career fields"
  ON public.career_fields FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  field_id UUID REFERENCES public.career_fields(id) ON DELETE CASCADE,
  duration_years INTEGER,
  degree_level TEXT,
  description TEXT,
  cutoff_marks NUMERIC(5,2),
  avg_fees_per_year NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create college_courses junction table
CREATE TABLE public.college_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  seats_available INTEGER,
  specific_cutoff NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(college_id, course_id)
);

ALTER TABLE public.college_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view college courses"
  ON public.college_courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage college courses"
  ON public.college_courses FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage subjects"
  ON public.subjects FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create student_marks table
CREATE TABLE public.student_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  marks_obtained NUMERIC(5,2) NOT NULL CHECK (marks_obtained >= 0),
  max_marks NUMERIC(5,2) NOT NULL CHECK (max_marks > 0),
  exam_type TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.student_marks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own marks"
  ON public.student_marks FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own marks"
  ON public.student_marks FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own marks"
  ON public.student_marks FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage all marks"
  ON public.student_marks FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create quiz_categories table
CREATE TABLE public.quiz_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.quiz_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz categories"
  ON public.quiz_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage quiz categories"
  ON public.quiz_categories FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.quiz_categories(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage quiz questions"
  ON public.quiz_questions FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create student_quiz_responses table
CREATE TABLE public.student_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE NOT NULL,
  response TEXT NOT NULL,
  session_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.student_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own responses"
  ON public.student_quiz_responses FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own responses"
  ON public.student_quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all responses"
  ON public.student_quiz_responses FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create career_pathways table
CREATE TABLE public.career_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES public.career_fields(id) ON DELETE CASCADE NOT NULL,
  job_role TEXT NOT NULL,
  description TEXT,
  school_subjects TEXT[],
  required_skills TEXT[],
  certifications TEXT[],
  avg_salary_range TEXT,
  job_outlook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.career_pathways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career pathways"
  ON public.career_pathways FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage career pathways"
  ON public.career_pathways FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create pathway_courses junction table
CREATE TABLE public.pathway_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID REFERENCES public.career_pathways(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  is_required BOOLEAN DEFAULT true,
  step_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pathway_id, course_id)
);

ALTER TABLE public.pathway_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pathway courses"
  ON public.pathway_courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage pathway courses"
  ON public.pathway_courses FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create ai_recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommended_fields JSONB NOT NULL,
  recommended_courses JSONB NOT NULL,
  recommended_colleges JSONB NOT NULL,
  career_pathways JSONB NOT NULL,
  analysis_summary TEXT,
  marks_data JSONB,
  quiz_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create triggers for updated_at columns
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_marks_updated_at
  BEFORE UPDATE ON public.student_marks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_pathways_updated_at
  BEFORE UPDATE ON public.career_pathways
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Drop old restaurant tables
DROP TABLE IF EXISTS public.user_reviews CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.taste_preferences CASCADE;
DROP TABLE IF EXISTS public.restaurant_cuisines CASCADE;
DROP TABLE IF EXISTS public.restaurants CASCADE;
DROP TABLE IF EXISTS public.cuisines CASCADE;