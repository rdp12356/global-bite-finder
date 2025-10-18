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
      academic_marks: {
        Row: {
          created_at: string | null
          exam_type: string | null
          exam_year: number | null
          grade: string | null
          id: string
          marks_obtained: number
          percentage: number | null
          student_id: string | null
          subject_name: string
          subject_type: string
          total_marks: number
        }
        Insert: {
          created_at?: string | null
          exam_type?: string | null
          exam_year?: number | null
          grade?: string | null
          id?: string
          marks_obtained: number
          student_id?: string | null
          subject_name: string
          subject_type: string
          total_marks: number
        }
        Update: {
          created_at?: string | null
          exam_type?: string | null
          exam_year?: number | null
          grade?: string | null
          id?: string
          marks_obtained?: number
          student_id?: string | null
          subject_name?: string
          subject_type?: string
          total_marks?: number
        }
        Relationships: [
          {
            foreignKeyName: "academic_marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string | null
          emotional_tone: string | null
          id: string
          message_text: string
          message_type: string
          session_id: string
          student_id: string | null
          stress_level: number | null
        }
        Insert: {
          created_at?: string | null
          emotional_tone?: string | null
          id?: string
          message_text: string
          message_type: string
          session_id: string
          student_id?: string | null
          stress_level?: number | null
        }
        Update: {
          created_at?: string | null
          emotional_tone?: string | null
          id?: string
          message_text?: string
          message_type?: string
          session_id?: string
          student_id?: string | null
          stress_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      aptitude_questions: {
        Row: {
          category: string | null
          correct_answer: number | null
          created_at: string | null
          difficulty_level: number | null
          id: string
          options: Json
          question_text: string
          test_type: Database["public"]["Enums"]["test_type"]
          weight: number | null
        }
        Insert: {
          category?: string | null
          correct_answer?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          options: Json
          question_text: string
          test_type: Database["public"]["Enums"]["test_type"]
          weight?: number | null
        }
        Update: {
          category?: string | null
          correct_answer?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          options?: Json
          question_text?: string
          test_type?: Database["public"]["Enums"]["test_type"]
          weight?: number | null
        }
        Relationships: []
      }
      aptitude_results: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          selected_answer: number
          student_id: string | null
          test_type: Database["public"]["Enums"]["test_type"]
          time_taken: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_answer: number
          student_id?: string | null
          test_type: Database["public"]["Enums"]["test_type"]
          time_taken?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_answer?: number
          student_id?: string | null
          test_type?: Database["public"]["Enums"]["test_type"]
          time_taken?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aptitude_results_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "aptitude_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aptitude_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          accreditation: string | null
          created_at: string | null
          description: string | null
          email: string | null
          established_year: number | null
          facilities: Json | null
          id: string
          location_city: string
          location_country: string | null
          location_state: string
          name: string
          phone: string | null
          rating: number | null
          type: string
          website: string | null
        }
        Insert: {
          accreditation?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          established_year?: number | null
          facilities?: Json | null
          id?: string
          location_city: string
          location_country?: string | null
          location_state: string
          name: string
          phone?: string | null
          rating?: number | null
          type: string
          website?: string | null
        }
        Update: {
          accreditation?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          established_year?: number | null
          facilities?: Json | null
          id?: string
          location_city?: string
          location_country?: string | null
          location_state?: string
          name?: string
          phone?: string | null
          rating?: number | null
          type?: string
          website?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          college_id: string | null
          created_at: string | null
          cutoff_percentage: number | null
          degree_type: string
          description: string | null
          duration_years: number
          eligibility_criteria: Json | null
          fees_annual: number | null
          id: string
          name: string
          seats_available: number | null
          seats_total: number | null
          stream_type: Database["public"]["Enums"]["stream_type"]
        }
        Insert: {
          college_id?: string | null
          created_at?: string | null
          cutoff_percentage?: number | null
          degree_type: string
          description?: string | null
          duration_years: number
          eligibility_criteria?: Json | null
          fees_annual?: number | null
          id?: string
          name: string
          seats_available?: number | null
          seats_total?: number | null
          stream_type: Database["public"]["Enums"]["stream_type"]
        }
        Update: {
          college_id?: string | null
          created_at?: string | null
          cutoff_percentage?: number | null
          degree_type?: string
          description?: string | null
          duration_years?: number
          eligibility_criteria?: Json | null
          fees_annual?: number | null
          id?: string
          name?: string
          seats_available?: number | null
          seats_total?: number | null
          stream_type?: Database["public"]["Enums"]["stream_type"]
        }
        Relationships: [
          {
            foreignKeyName: "courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_areas: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          college_id: string | null
          confidence_score: number | null
          course_id: string | null
          created_at: string | null
          id: string
          is_accepted: boolean | null
          reasoning: string
          recommendation_type: Database["public"]["Enums"]["recommendation_type"]
          student_id: string | null
          stream_id: string | null
        }
        Insert: {
          college_id?: string | null
          confidence_score?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_accepted?: boolean | null
          reasoning: string
          recommendation_type: Database["public"]["Enums"]["recommendation_type"]
          student_id?: string | null
          stream_id?: string | null
        }
        Update: {
          college_id?: string | null
          confidence_score?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_accepted?: boolean | null
          reasoning?: string
          recommendation_type?: Database["public"]["Enums"]["recommendation_type"]
          student_id?: string | null
          stream_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      student_interests: {
        Row: {
          created_at: string | null
          id: string
          interest_id: string | null
          preference_level: number | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interest_id?: string | null
          preference_level?: number | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interest_id?: string | null
          preference_level?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interest_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_interests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          board: string | null
          created_at: string | null
          current_class: number | null
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          location_city: string | null
          location_country: string | null
          location_state: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          board?: string | null
          created_at?: string | null
          current_class?: number | null
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          board?: string | null
          created_at?: string | null
          current_class?: number | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          career_paths: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          stream_type: Database["public"]["Enums"]["stream_type"]
          subjects: Json
        }
        Insert: {
          career_paths?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          stream_type: Database["public"]["Enums"]["stream_type"]
          subjects: Json
        }
        Update: {
          career_paths?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          stream_type?: Database["public"]["Enums"]["stream_type"]
          subjects?: Json
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
      recommendation_type: "stream" | "college" | "course"
      stream_type: "science" | "commerce" | "arts" | "humanities"
      test_type: "logical" | "interest"
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
