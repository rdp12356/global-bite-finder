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
      ai_recommendations: {
        Row: {
          analysis_summary: string | null
          career_pathways: Json
          created_at: string | null
          id: string
          marks_data: Json | null
          quiz_data: Json | null
          recommended_colleges: Json
          recommended_courses: Json
          recommended_fields: Json
          student_id: string
        }
        Insert: {
          analysis_summary?: string | null
          career_pathways: Json
          created_at?: string | null
          id?: string
          marks_data?: Json | null
          quiz_data?: Json | null
          recommended_colleges: Json
          recommended_courses: Json
          recommended_fields: Json
          student_id: string
        }
        Update: {
          analysis_summary?: string | null
          career_pathways?: Json
          created_at?: string | null
          id?: string
          marks_data?: Json | null
          quiz_data?: Json | null
          recommended_colleges?: Json
          recommended_courses?: Json
          recommended_fields?: Json
          student_id?: string
        }
        Relationships: []
      }
      career_fields: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      career_pathways: {
        Row: {
          avg_salary_range: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          field_id: string
          id: string
          job_outlook: string | null
          job_role: string
          required_skills: string[] | null
          school_subjects: string[] | null
          updated_at: string | null
        }
        Insert: {
          avg_salary_range?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          field_id: string
          id?: string
          job_outlook?: string | null
          job_role: string
          required_skills?: string[] | null
          school_subjects?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avg_salary_range?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          field_id?: string
          id?: string
          job_outlook?: string | null
          job_role?: string
          required_skills?: string[] | null
          school_subjects?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_pathways_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "career_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      college_courses: {
        Row: {
          college_id: string
          course_id: string
          created_at: string | null
          id: string
          seats_available: number | null
          specific_cutoff: number | null
        }
        Insert: {
          college_id: string
          course_id: string
          created_at?: string | null
          id?: string
          seats_available?: number | null
          specific_cutoff?: number | null
        }
        Update: {
          college_id?: string
          course_id?: string
          created_at?: string | null
          id?: string
          seats_available?: number | null
          specific_cutoff?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "college_courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          accreditation: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          name: string
          phone_number: string | null
          rating: number | null
          state: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          accreditation?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          phone_number?: string | null
          rating?: number | null
          state?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          accreditation?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          phone_number?: string | null
          rating?: number | null
          state?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          avg_fees_per_year: number | null
          created_at: string | null
          cutoff_marks: number | null
          degree_level: string | null
          description: string | null
          duration_years: number | null
          field_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avg_fees_per_year?: number | null
          created_at?: string | null
          cutoff_marks?: number | null
          degree_level?: string | null
          description?: string | null
          duration_years?: number | null
          field_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avg_fees_per_year?: number | null
          created_at?: string | null
          cutoff_marks?: number | null
          degree_level?: string | null
          description?: string | null
          duration_years?: number | null
          field_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "career_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_courses: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          is_required: boolean | null
          pathway_id: string
          step_order: number | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          pathway_id: string
          step_order?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          pathway_id?: string
          step_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pathway_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_courses_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "career_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_grade: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          school_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_grade?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          school_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_grade?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          school_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          category_id: string
          correct_answer: string | null
          created_at: string | null
          id: string
          options: Json | null
          question_text: string
          question_type: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          category_id: string
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          question_text: string
          question_type: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          category_id?: string
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          board: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          name: string
          phone_number: string | null
          rating: number | null
          state: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          board?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          phone_number?: string | null
          rating?: number | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          board?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          phone_number?: string | null
          rating?: number | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      student_marks: {
        Row: {
          academic_year: string
          created_at: string | null
          exam_type: string
          grade: string | null
          id: string
          marks_obtained: number
          max_marks: number
          student_id: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          exam_type: string
          grade?: string | null
          id?: string
          marks_obtained: number
          max_marks: number
          student_id: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          exam_type?: string
          grade?: string | null
          id?: string
          marks_obtained?: number
          max_marks?: number
          student_id?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          response: string
          session_id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          response: string
          session_id: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          response?: string
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_quiz_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: string | null
          created_at: string | null
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "student"
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
    Enums: {
      app_role: ["super_admin", "admin", "student"],
    },
  },
} as const
