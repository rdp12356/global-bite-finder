export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          current_class: number | null
          school_name: string | null
          location_city: string | null
          location_state: string | null
          location_country: string | null
          phone_number: string | null
          parent_phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          current_class?: number | null
          school_name?: string | null
          location_city?: string | null
          location_state?: string | null
          location_country?: string | null
          phone_number?: string | null
          parent_phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          current_class?: number | null
          school_name?: string | null
          location_city?: string | null
          location_state?: string | null
          location_country?: string | null
          phone_number?: string | null
          parent_phone?: string | null
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
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      student_marks: {
        Row: {
          id: string
          student_id: string | null
          subject_id: string | null
          marks_obtained: number
          max_marks: number
          exam_type: string | null
          exam_date: string | null
          academic_year: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          subject_id?: string | null
          marks_obtained: number
          max_marks: number
          exam_type?: string | null
          exam_date?: string | null
          academic_year?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          subject_id?: string | null
          marks_obtained?: number
          max_marks?: number
          exam_type?: string | null
          exam_date?: string | null
          academic_year?: string | null
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
      aptitude_tests: {
        Row: {
          id: string
          name: string
          description: string | null
          test_type: string
          total_questions: number
          time_limit_minutes: number | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          test_type: string
          total_questions: number
          time_limit_minutes?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          test_type?: string
          total_questions?: number
          time_limit_minutes?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      aptitude_questions: {
        Row: {
          id: string
          test_id: string | null
          question_text: string
          question_type: string | null
          options: Json | null
          correct_answer: number | null
          difficulty_level: string | null
          category: string | null
          weight: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          test_id?: string | null
          question_text: string
          question_type?: string | null
          options?: Json | null
          correct_answer?: number | null
          difficulty_level?: string | null
          category?: string | null
          weight?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          test_id?: string | null
          question_text?: string
          question_type?: string | null
          options?: Json | null
          correct_answer?: number | null
          difficulty_level?: string | null
          category?: string | null
          weight?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aptitude_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "aptitude_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      student_aptitude_results: {
        Row: {
          id: string
          student_id: string | null
          test_id: string | null
          score: number
          max_score: number
          percentage: number
          time_taken_seconds: number | null
          responses: Json | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          test_id?: string | null
          score: number
          max_score: number
          percentage: number
          time_taken_seconds?: number | null
          responses?: Json | null
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          test_id?: string | null
          score?: number
          max_score?: number
          percentage?: number
          time_taken_seconds?: number | null
          responses?: Json | null
          completed_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_aptitude_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_aptitude_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "aptitude_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          student_id: string | null
          session_id: string
          messages: Json
          emotional_analysis: Json | null
          conversation_summary: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          session_id: string
          messages: Json
          emotional_analysis?: Json | null
          conversation_summary?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          session_id?: string
          messages?: Json
          emotional_analysis?: Json | null
          conversation_summary?: string | null
          started_at?: string | null
          completed_at?: string | null
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
          subjects: Json
          career_paths: Json | null
          icon: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          subjects: Json
          career_paths?: Json | null
          icon?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          subjects?: Json
          career_paths?: Json | null
          icon?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          id: string
          name: string
          location: string
          state: string | null
          country: string | null
          type: string | null
          category: string | null
          rating: number | null
          website_url: string | null
          established_year: number | null
          accreditation: string[] | null
          facilities: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          location: string
          state?: string | null
          country?: string | null
          type?: string | null
          category?: string | null
          rating?: number | null
          website_url?: string | null
          established_year?: number | null
          accreditation?: string[] | null
          facilities?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string
          state?: string | null
          country?: string | null
          type?: string | null
          category?: string | null
          rating?: number | null
          website_url?: string | null
          established_year?: number | null
          accreditation?: string[] | null
          facilities?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          college_id: string | null
          name: string
          stream_id: string | null
          duration_years: number | null
          degree_type: string | null
          eligibility_criteria: Json | null
          fee_structure: Json | null
          cutoff_percentage: number | null
          seats_available: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          college_id?: string | null
          name: string
          stream_id?: string | null
          duration_years?: number | null
          degree_type?: string | null
          eligibility_criteria?: Json | null
          fee_structure?: Json | null
          cutoff_percentage?: number | null
          seats_available?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          college_id?: string | null
          name?: string
          stream_id?: string | null
          duration_years?: number | null
          degree_type?: string | null
          eligibility_criteria?: Json | null
          fee_structure?: Json | null
          cutoff_percentage?: number | null
          seats_available?: number | null
          is_active?: boolean | null
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
      student_recommendations: {
        Row: {
          id: string
          student_id: string | null
          recommendation_type: string
          recommended_id: string
          confidence_score: number
          reasons: Json
          ai_analysis: Json | null
          is_accepted: boolean | null
          feedback: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          recommendation_type: string
          recommended_id: string
          confidence_score: number
          reasons: Json
          ai_analysis?: Json | null
          is_accepted?: boolean | null
          feedback?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          recommendation_type?: string
          recommended_id?: string
          confidence_score?: number
          reasons?: Json
          ai_analysis?: Json | null
          is_accepted?: boolean | null
          feedback?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_areas: {
        Row: {
          id: string
          name: string
          description: string | null
          related_streams: Json | null
          related_careers: Json | null
          icon: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          related_streams?: Json | null
          related_careers?: Json | null
          icon?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          related_streams?: Json | null
          related_careers?: Json | null
          icon?: string | null
          created_at?: string | null
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