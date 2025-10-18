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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location_city: string | null
          location_country: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location_city?: string | null
          location_country?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location_city?: string | null
          location_country?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          id: string
          user_id: string
          current_class: number
          board: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_class: number
          board: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_class?: number
          board?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          id: string
          student_id: string
          subject: string
          marks_obtained: number
          total_marks: number
          percentage: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          subject: string
          marks_obtained: number
          total_marks: number
          percentage: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          subject?: string
          marks_obtained?: number
          total_marks?: number
          percentage?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_tests: {
        Row: {
          id: string
          student_id: string
          test_type: string
          question_id: string
          question_text: string
          selected_answer: string
          is_correct: boolean
          time_taken: number
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          test_type: string
          question_id: string
          question_text: string
          selected_answer: string
          is_correct: boolean
          time_taken: number
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          test_type?: string
          question_id?: string
          question_text?: string
          selected_answer?: string
          is_correct?: boolean
          time_taken?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aptitude_tests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_results: {
        Row: {
          id: string
          student_id: string
          logical_score: number
          interest_score: number
          overall_score: number
          test_completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          logical_score: number
          interest_score: number
          overall_score: number
          test_completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          logical_score?: number
          interest_score?: number
          overall_score?: number
          test_completed_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aptitude_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          student_id: string
          message_type: string
          content: string
          emotional_tone: string | null
          stress_level: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          message_type: string
          content: string
          emotional_tone?: string | null
          stress_level?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          message_type?: string
          content?: string
          emotional_tone?: string | null
          stress_level?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          id: string
          name: string
          description: string
          subjects: string[]
          career_paths: string[]
          difficulty_level: number
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          subjects: string[]
          career_paths: string[]
          difficulty_level: number
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          subjects?: string[]
          career_paths?: string[]
          difficulty_level?: number
          created_at?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          id: string
          name: string
          location: string
          type: string
          rating: number
          cutoff_percentage: number
          courses: string[]
          website: string | null
          established_year: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          location: string
          type: string
          rating: number
          cutoff_percentage: number
          courses: string[]
          website?: string | null
          established_year?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string
          type?: string
          rating?: number
          cutoff_percentage?: number
          courses?: string[]
          website?: string | null
          established_year?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          id: string
          student_id: string
          recommendation_type: string
          stream_id: string | null
          college_id: string | null
          confidence_score: number
          reasoning: string
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          recommendation_type: string
          stream_id?: string | null
          college_id?: string | null
          confidence_score: number
          reasoning: string
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          recommendation_type?: string
          stream_id?: string | null
          college_id?: string | null
          confidence_score?: number
          reasoning?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
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
