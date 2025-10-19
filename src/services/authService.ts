import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/callback`;

// Auth Service for Google OAuth and user management
class AuthService {
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: GOOGLE_REDIRECT_URI,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { data: null, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return { user, error: null };
    } catch (error) {
      console.error('Error getting current user:', error);
      return { user: null, error };
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return { session, error: null };
    } catch (error) {
      console.error('Error getting current session:', error);
      return { session: null, error };
    }
  }

  // Create or update user profile
  async createUserProfile(user: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { data: null, error };
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }
  }

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { data: null, error };
    }
  }

  // Save user's academic data
  async saveAcademicData(userId: string, data: any) {
    try {
      const { data: result, error } = await supabase
        .from('student_marks')
        .upsert({
          user_id: userId,
          ...data,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Error saving academic data:', error);
      return { data: null, error };
    }
  }

  // Save aptitude test results
  async saveAptitudeResults(userId: string, testType: string, results: any[]) {
    try {
      const { data, error } = await supabase
        .from('aptitude_results')
        .upsert({
          user_id: userId,
          test_type: testType,
          results: results,
          score: this.calculateScore(results),
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error saving aptitude results:', error);
      return { data: null, error };
    }
  }

  // Save AI conversation
  async saveAIConversation(userId: string, sessionId: string, messages: any[]) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .upsert({
          user_id: userId,
          session_id: sessionId,
          messages: messages,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error saving AI conversation:', error);
      return { data: null, error };
    }
  }

  // Save recommendations
  async saveRecommendations(userId: string, recommendations: any) {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .upsert({
          user_id: userId,
          stream_recommendations: recommendations.streamRecommendations || [],
          college_recommendations: recommendations.collegeRecommendations || [],
          career_recommendations: recommendations.careerPaths || [],
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error saving recommendations:', error);
      return { data: null, error };
    }
  }

  // Get user's complete profile
  async getUserCompleteProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          student_marks(*),
          aptitude_results(*),
          ai_conversations(*),
          recommendations(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error getting complete user profile:', error);
      return { data: null, error };
    }
  }

  // Calculate aptitude test score
  private calculateScore(results: any[]): number {
    if (!results || results.length === 0) return 0;
    
    const correctAnswers = results.filter(r => r.isCorrect).length;
    return Math.round((correctAnswers / results.length) * 100);
  }

  // Check if user has completed all assessments
  async hasCompletedAssessments(userId: string): Promise<boolean> {
    try {
      const { data: marks } = await supabase
        .from('student_marks')
        .select('id')
        .eq('user_id', userId)
        .single();

      const { data: aptitude } = await supabase
        .from('aptitude_results')
        .select('id')
        .eq('user_id', userId)
        .limit(2);

      const { data: conversation } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .single();

      return !!(marks && aptitude && aptitude.length >= 2 && conversation);
    } catch (error) {
      console.error('Error checking assessment completion:', error);
      return false;
    }
  }

  // Get user's progress
  async getUserProgress(userId: string) {
    try {
      const [marksResult, aptitudeResult, conversationResult] = await Promise.all([
        supabase.from('student_marks').select('id').eq('user_id', userId).single(),
        supabase.from('aptitude_results').select('test_type').eq('user_id', userId),
        supabase.from('ai_conversations').select('id').eq('user_id', userId).single()
      ]);

      return {
        marksCompleted: !!marksResult.data,
        aptitudeCompleted: aptitudeResult.data?.length || 0,
        conversationCompleted: !!conversationResult.data,
        totalProgress: [
          marksResult.data,
          aptitudeResult.data?.length >= 2,
          conversationResult.data
        ].filter(Boolean).length
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        marksCompleted: false,
        aptitudeCompleted: 0,
        conversationCompleted: false,
        totalProgress: 0
      };
    }
  }
}

export default new AuthService();