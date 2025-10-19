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
      cuisines: {
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
      restaurant_cuisines: {
        Row: {
          cuisine_id: string | null
          id: string
          restaurant_id: string | null
        }
        Insert: {
          cuisine_id?: string | null
          id?: string
          restaurant_id?: string | null
        }
        Update: {
          cuisine_id?: string | null
          id?: string
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_cuisines_cuisine_id_fkey"
            columns: ["cuisine_id"]
            isOneToOne: false
            referencedRelation: "cuisines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_cuisines_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_open: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_date: string | null
          phone_number: string | null
          photo_url: string | null
          place_id: string | null
          price_level: number | null
          rating: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_date?: string | null
          phone_number?: string | null
          photo_url?: string | null
          place_id?: string | null
          price_level?: number | null
          rating?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_date?: string | null
          phone_number?: string | null
          photo_url?: string | null
          place_id?: string | null
          price_level?: number | null
          rating?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      taste_preferences: {
        Row: {
          created_at: string | null
          cuisine_id: string | null
          dietary_restrictions: string[] | null
          id: string
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          preference_level: number | null
          spice_level: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          cuisine_id?: string | null
          dietary_restrictions?: string[] | null
          id?: string
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          preference_level?: number | null
          spice_level?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          cuisine_id?: string | null
          dietary_restrictions?: string[] | null
          id?: string
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          preference_level?: number | null
          spice_level?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taste_preferences_cuisine_id_fkey"
            columns: ["cuisine_id"]
            isOneToOne: false
            referencedRelation: "cuisines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taste_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          restaurant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          restaurant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          restaurant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reviews: {
        Row: {
          created_at: string | null
          dishes_tried: string[] | null
          id: string
          rating: number | null
          restaurant_id: string | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string | null
          dishes_tried?: string[] | null
          id?: string
          rating?: number | null
          restaurant_id?: string | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string | null
          dishes_tried?: string[] | null
          id?: string
          rating?: number | null
          restaurant_id?: string | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
