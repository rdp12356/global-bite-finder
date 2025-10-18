import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export interface SubjectMarks {
  id: string;
  name: string;
  marks: number;
  maxMarks: number;
  type: 'language' | 'core' | 'optional';
}

export interface MarksData {
  subjects: SubjectMarks[];
  interestArea: string;
  totalMarks: number;
  totalMaxMarks: number;
  overallPercentage: number;
}

export class MarksService {
  // Save marks data to database
  static async saveMarks(studentId: string, marksData: MarksData) {
    try {
      // First, get or create subjects
      const subjectIds: { [key: string]: string } = {};
      
      for (const subject of marksData.subjects) {
        // Check if subject exists
        const { data: existingSubject } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', subject.name)
          .single();

        if (existingSubject) {
          subjectIds[subject.name] = existingSubject.id;
        } else {
          // Create new subject
          const { data: newSubject, error } = await supabase
            .from('subjects')
            .insert({
              name: subject.name,
              category: subject.type,
              description: `${subject.name} subject`
            })
            .select('id')
            .single();

          if (error) throw error;
          subjectIds[subject.name] = newSubject.id;
        }
      }

      // Save marks for each subject
      const marksToInsert: TablesInsert<'student_marks'>[] = marksData.subjects.map(subject => ({
        student_id: studentId,
        subject_id: subjectIds[subject.name],
        marks_obtained: subject.marks,
        max_marks: subject.maxMarks,
        exam_type: 'board',
        academic_year: new Date().getFullYear().toString()
      }));

      const { error: marksError } = await supabase
        .from('student_marks')
        .insert(marksToInsert);

      if (marksError) throw marksError;

      // Update student profile with interest area
      const { error: profileError } = await supabase
        .from('students')
        .update({
          // Add interest area to student profile if needed
        })
        .eq('id', studentId);

      if (profileError) throw profileError;

      return { success: true };
    } catch (error) {
      console.error('Error saving marks:', error);
      return { success: false, error };
    }
  }

  // Get marks data for a student
  static async getMarks(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_marks')
        .select(`
          *,
          subjects (
            name,
            category
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching marks:', error);
      return { success: false, error };
    }
  }

  // Get all subjects
  static async getSubjects() {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return { success: false, error };
    }
  }

  // Get interest areas
  static async getInterestAreas() {
    try {
      const { data, error } = await supabase
        .from('interest_areas')
        .select('*')
        .order('name');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching interest areas:', error);
      return { success: false, error };
    }
  }

  // Update marks for a specific subject
  static async updateSubjectMarks(
    studentId: string, 
    subjectId: string, 
    marks: number, 
    maxMarks: number
  ) {
    try {
      const { error } = await supabase
        .from('student_marks')
        .update({
          marks_obtained: marks,
          max_marks: maxMarks,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', studentId)
        .eq('subject_id', subjectId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating marks:', error);
      return { success: false, error };
    }
  }

  // Delete marks for a specific subject
  static async deleteSubjectMarks(studentId: string, subjectId: string) {
    try {
      const { error } = await supabase
        .from('student_marks')
        .delete()
        .eq('student_id', studentId)
        .eq('subject_id', subjectId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting marks:', error);
      return { success: false, error };
    }
  }
}