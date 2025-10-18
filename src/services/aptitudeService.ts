import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'logical' | 'interest';
  explanation?: string;
}

export interface AptitudeTestResult {
  testType: 'logical' | 'interest';
  score: number;
  maxScore: number;
  percentage: number;
  responses: { questionId: string; selectedAnswer: number; isCorrect: boolean }[];
  timeSpent: number;
}

export class AptitudeService {
  // Get aptitude tests
  static async getAptitudeTests() {
    try {
      const { data, error } = await supabase
        .from('aptitude_tests')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching aptitude tests:', error);
      return { success: false, error };
    }
  }

  // Get questions for a specific test
  static async getTestQuestions(testId: string) {
    try {
      const { data, error } = await supabase
        .from('aptitude_questions')
        .select('*')
        .eq('test_id', testId)
        .order('created_at');

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching test questions:', error);
      return { success: false, error };
    }
  }

  // Save aptitude test results
  static async saveTestResults(studentId: string, results: AptitudeTestResult[]) {
    try {
      const resultsToInsert: TablesInsert<'student_aptitude_results'>[] = [];
      
      for (const result of results) {
        const testId = await this.getTestIdByType(result.testType);
        resultsToInsert.push({
          student_id: studentId,
          test_id: testId,
          score: result.score,
          max_score: result.maxScore,
          percentage: result.percentage,
          time_taken_seconds: result.timeSpent,
          responses: result.responses as any, // JSONB field
          completed_at: new Date().toISOString()
        });
      }

      const { error } = await supabase
        .from('student_aptitude_results')
        .insert(resultsToInsert);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error saving test results:', error);
      return { success: false, error };
    }
  }

  // Get student's aptitude test results
  static async getStudentResults(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_aptitude_results')
        .select(`
          *,
          aptitude_tests (
            name,
            test_type
          )
        `)
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching student results:', error);
      return { success: false, error };
    }
  }

  // Helper method to get test ID by type
  private static async getTestIdByType(testType: 'logical' | 'interest'): Promise<string> {
    const { data, error } = await supabase
      .from('aptitude_tests')
      .select('id')
      .eq('test_type', testType)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data.id;
  }

  // Create sample questions for testing (in production, these would be in the database)
  static getSampleQuestions(): { logical: AptitudeQuestion[], interest: AptitudeQuestion[] } {
    const logicalQuestions: AptitudeQuestion[] = [
      {
        id: 'l1',
        question: 'If all roses are flowers and some flowers are red, which statement is definitely true?',
        options: [
          'All roses are red',
          'Some roses are red', 
          'Some red things are roses',
          'Cannot be determined'
        ],
        correctAnswer: 2,
        difficulty: 'easy',
        category: 'logical'
      },
      {
        id: 'l2',
        question: 'A sequence follows the pattern: 2, 6, 12, 20, 30, ? What comes next?',
        options: ['40', '42', '44', '48'],
        correctAnswer: 1,
        difficulty: 'medium',
        category: 'logical'
      },
      {
        id: 'l3',
        question: 'If A is taller than B, and B is taller than C, but C is taller than D, who is the shortest?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 3,
        difficulty: 'easy',
        category: 'logical'
      },
      {
        id: 'l4',
        question: 'In a group of 30 students, 18 like math and 20 like science. If 12 like both, how many like neither?',
        options: ['2', '4', '6', '8'],
        correctAnswer: 1,
        difficulty: 'hard',
        category: 'logical'
      },
      {
        id: 'l5',
        question: 'What is the next number in the series: 1, 4, 9, 16, 25, ?',
        options: ['30', '36', '40', '49'],
        correctAnswer: 1,
        difficulty: 'medium',
        category: 'logical'
      },
      {
        id: 'l6',
        question: 'If PENCIL is coded as 123456, how would you code PEN?',
        options: ['123', '124', '125', '126'],
        correctAnswer: 0,
        difficulty: 'medium',
        category: 'logical'
      },
      {
        id: 'l7',
        question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
        options: ['0°', '7.5°', '15°', '30°'],
        correctAnswer: 1,
        difficulty: 'hard',
        category: 'logical'
      },
      {
        id: 'l8',
        question: 'If 5 machines can produce 5 widgets in 5 minutes, how many machines are needed to produce 100 widgets in 100 minutes?',
        options: ['5', '10', '20', '100'],
        correctAnswer: 0,
        difficulty: 'hard',
        category: 'logical'
      }
    ];

    const interestQuestions: AptitudeQuestion[] = [
      {
        id: 'i1',
        question: 'When faced with a complex problem, I prefer to:',
        options: [
          'Break it down into smaller parts and solve systematically',
          'Look for creative and innovative solutions',
          'Collaborate with others to brainstorm ideas',
          'Research similar problems and learn from others'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        category: 'interest'
      },
      {
        id: 'i2',
        question: 'I feel most motivated when I am:',
        options: [
          'Learning new technical skills',
          'Helping others solve their problems',
          'Creating something artistic or creative',
          'Analyzing data and finding patterns'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        category: 'interest'
      },
      {
        id: 'i3',
        question: 'In my free time, I would most likely:',
        options: [
          'Read about new technologies or scientific discoveries',
          'Volunteer for a social cause',
          'Create art, music, or write',
          'Play strategy games or puzzles'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        category: 'interest'
      },
      {
        id: 'i4',
        question: 'I consider myself most skilled at:',
        options: [
          'Mathematical and logical reasoning',
          'Understanding and helping people',
          'Creative expression and design',
          'Research and analysis'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        category: 'interest'
      },
      {
        id: 'i5',
        question: 'My ideal work environment would be:',
        options: [
          'A laboratory or research facility',
          'A hospital or healthcare setting',
          'A design studio or creative space',
          'An office with analytical tools and data'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        category: 'interest'
      },
      {
        id: 'i6',
        question: 'I am most interested in understanding:',
        options: [
          'How things work and why they work that way',
          'How to improve people\'s lives and well-being',
          'How to express ideas and emotions creatively',
          'How to solve complex problems efficiently'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        category: 'interest'
      },
      {
        id: 'i7',
        question: 'When choosing a career, the most important factor for me is:',
        options: [
          'Intellectual challenge and learning opportunities',
          'Making a positive impact on society',
          'Creative freedom and self-expression',
          'Job security and financial stability'
        ],
        correctAnswer: 0,
        difficulty: 'hard',
        category: 'interest'
      },
      {
        id: 'i8',
        question: 'I believe my greatest strength is:',
        options: [
          'Analytical thinking and problem-solving',
          'Empathy and interpersonal skills',
          'Creativity and innovation',
          'Attention to detail and precision'
        ],
        correctAnswer: 0,
        difficulty: 'hard',
        category: 'interest'
      }
    ];

    return { logical: logicalQuestions, interest: interestQuestions };
  }
}