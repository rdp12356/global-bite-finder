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
      students: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          date_of_birth: string | null
          current_class: number
          board: string | null
          school_name: string | null
          location_city: string | null
          location_state: string | null
          location_country: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          date_of_birth?: string | null
          current_class?: number
          board?: string | null
          school_name?: string | null
          location_city?: string | null
          location_state?: string | null
          location_country?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string | null
          current_class?: number
          board?: string | null
          school_name?: string | null
          location_city?: string | null
          location_state?: string | null
          location_country?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          id: string
          name: string
          category: string
          stream: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          stream?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          stream?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      student_marks: {
        Row: {
          id: string
          student_id: string
          subject_id: string
          marks_obtained: number
          total_marks: number
          percentage: number
          exam_type: string
          exam_year: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          subject_id: string
          marks_obtained: number
          total_marks: number
          exam_type?: string
          exam_year?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          subject_id?: string
          marks_obtained?: number
          total_marks?: number
          exam_type?: string
          exam_year?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_questions: {
        Row: {
          id: string
          question_text: string
          question_type: string
          options: Json
          correct_answer: number | null
          weight: number
          difficulty_level: number
          created_at: string | null
        }
        Insert: {
          id?: string
          question_text: string
          question_type: string
          options: Json
          correct_answer?: number | null
          weight?: number
          difficulty_level?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          question_text?: string
          question_type?: string
          options?: Json
          correct_answer?: number | null
          weight?: number
          difficulty_level?: number
          created_at?: string | null
        }
        Relationships: []
      }
      aptitude_results: {
        Row: {
          id: string
          student_id: string
          test_type: string
          question_id: string
          selected_answer: number
          time_taken: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          test_type: string
          question_id: string
          selected_answer: number
          time_taken?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          test_type?: string
          question_id?: string
          selected_answer?: number
          time_taken?: number | null
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
          {
            foreignKeyName: "aptitude_results_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "aptitude_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          student_id: string
          session_id: string
          message_type: string
          message_text: string
          emotional_tone: string | null
          stress_level: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          session_id: string
          message_type: string
          message_text: string
          emotional_tone?: string | null
          stress_level?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          session_id?: string
          message_type?: string
          message_text?: string
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
          description: string | null
          subjects_required: Json | null
          career_paths: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          subjects_required?: Json | null
          career_paths?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          subjects_required?: Json | null
          career_paths?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          id: string
          name: string
          type: string
          location_city: string
          location_state: string
          location_country: string
          website: string | null
          rating: number | null
          established_year: number | null
          accreditation: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          location_city: string
          location_state: string
          location_country?: string
          website?: string | null
          rating?: number | null
          established_year?: number | null
          accreditation?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          location_city?: string
          location_state?: string
          location_country?: string
          website?: string | null
          rating?: number | null
          established_year?: number | null
          accreditation?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          college_id: string
          name: string
          stream_id: string
          duration_years: number
          degree_type: string
          eligibility_criteria: Json | null
          fee_structure: Json | null
          cutoff_marks: number | null
          seats_available: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          college_id: string
          name: string
          stream_id: string
          duration_years: number
          degree_type: string
          eligibility_criteria?: Json | null
          fee_structure?: Json | null
          cutoff_marks?: number | null
          seats_available?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          college_id?: string
          name?: string
          stream_id?: string
          duration_years?: number
          degree_type?: string
          eligibility_criteria?: Json | null
          fee_structure?: Json | null
          cutoff_marks?: number | null
          seats_available?: number | null
          created_at?: string | null
          updated_at?: string | null
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
      recommendations: {
        Row: {
          id: string
          student_id: string
          recommendation_type: string
          recommended_id: string
          confidence_score: number
          reasoning: string
          factors_considered: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          recommendation_type: string
          recommended_id: string
          confidence_score: number
          reasoning: string
          factors_considered?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          recommendation_type?: string
          recommended_id?: string
          confidence_score?: number
          reasoning?: string
          factors_considered?: Json | null
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
