export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_sessions: {
        Row: {
          id: string
          user_id: string
          session_data: Json
          emotional_analysis: Json | null
          recommendations: Json | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_data: Json
          emotional_analysis?: Json | null
          recommendations?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_data?: Json
          emotional_analysis?: Json | null
          recommendations?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_results: {
        Row: {
          id: string
          user_id: string
          test_id: string
          answers: Json
          score: number
          max_score: number
          percentage: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          answers: Json
          score: number
          max_score: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_id?: string
          answers?: Json
          score?: number
          max_score?: number
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aptitude_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "aptitude_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aptitude_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_tests: {
        Row: {
          id: string
          name: string
          description: string | null
          test_type: string
          questions: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          test_type: string
          questions: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          test_type?: string
          questions?: Json
          created_at?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          id: string
          name: string
          location: string | null
          state: string | null
          city: string | null
          type: string | null
          rating: number | null
          website: string | null
          established_year: number | null
          cutoff_marks: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          state?: string | null
          city?: string | null
          type?: string | null
          rating?: number | null
          website?: string | null
          established_year?: number | null
          cutoff_marks?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          state?: string | null
          city?: string | null
          type?: string | null
          rating?: number | null
          website?: string | null
          established_year?: number | null
          cutoff_marks?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          name: string
          college_id: string | null
          stream_id: string | null
          duration_years: number | null
          eligibility_criteria: string | null
          cutoff_marks: number | null
          fees_range: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          college_id?: string | null
          stream_id?: string | null
          duration_years?: number | null
          eligibility_criteria?: string | null
          cutoff_marks?: number | null
          fees_range?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          college_id?: string | null
          stream_id?: string | null
          duration_years?: number | null
          eligibility_criteria?: string | null
          cutoff_marks?: number | null
          fees_range?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_areas: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          location_city: string | null
          location_country: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location_city?: string | null
          location_country?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location_city?: string | null
          location_country?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          id: string
          user_id: string
          chat_session_id: string | null
          recommendation_type: string
          recommended_item_id: string | null
          confidence_score: number | null
          reasoning: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chat_session_id?: string | null
          recommendation_type: string
          recommended_item_id?: string | null
          confidence_score?: number | null
          reasoning?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chat_session_id?: string | null
          recommendation_type?: string
          recommended_item_id?: string | null
          confidence_score?: number | null
          reasoning?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          id: string
          name: string
          description: string | null
          subjects: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          subjects?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          subjects?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      student_marks: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          marks_obtained: number
          total_marks: number
          percentage: number
          exam_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          marks_obtained: number
          total_marks: number
          exam_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          marks_obtained?: number
          total_marks?: number
          exam_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_marks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          class_level: string | null
          interest_area_id: string | null
          preferred_stream_id: string | null
          emotional_tone: Json | null
          stress_level: number | null
          confidence_level: number | null
          learning_style: string | null
          career_goals: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          class_level?: string | null
          interest_area_id?: string | null
          preferred_stream_id?: string | null
          emotional_tone?: Json | null
          stress_level?: number | null
          confidence_level?: number | null
          learning_style?: string | null
          career_goals?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          class_level?: string | null
          interest_area_id?: string | null
          preferred_stream_id?: string | null
          emotional_tone?: Json | null
          stress_level?: number | null
          confidence_level?: number | null
          learning_style?: string | null
          career_goals?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_interest_area_id_fkey"
            columns: ["interest_area_id"]
            isOneToOne: false
            referencedRelation: "interest_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_preferred_stream_id_fkey"
            columns: ["preferred_stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const