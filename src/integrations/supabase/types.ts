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
      alerts: {
        Row: {
          created_at: string
          farm_id: string | null
          id: string
          is_read: boolean | null
          level: string
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          farm_id?: string | null
          id?: string
          is_read?: boolean | null
          level?: string
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          farm_id?: string | null
          id?: string
          is_read?: boolean | null
          level?: string
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_results: {
        Row: {
          analysis_text: string
          created_at: string
          farm_id: string
          id: string
          image_id: string
          recommendations: string | null
          severity_level: string | null
          user_id: string
        }
        Insert: {
          analysis_text: string
          created_at?: string
          farm_id: string
          id?: string
          image_id: string
          recommendations?: string | null
          severity_level?: string | null
          user_id: string
        }
        Update: {
          analysis_text?: string
          created_at?: string
          farm_id?: string
          id?: string
          image_id?: string
          recommendations?: string | null
          severity_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          created_at: string
          id: string
          name: string
          typical_days_to_maturity: number | null
          variety: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          typical_days_to_maturity?: number | null
          variety?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          typical_days_to_maturity?: number | null
          variety?: string | null
        }
        Relationships: []
      }
      farms: {
        Row: {
          area_ha: number | null
          created_at: string
          has_irrigation: boolean | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          soil_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area_ha?: number | null
          created_at?: string
          has_irrigation?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          soil_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area_ha?: number | null
          created_at?: string
          has_irrigation?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          soil_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          ai_confidence: number | null
          ai_label: string | null
          captured_at: string
          created_at: string
          farm_id: string
          id: string
          plot_id: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_label?: string | null
          captured_at?: string
          created_at?: string
          farm_id: string
          id?: string
          plot_id?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          ai_label?: string | null
          captured_at?: string
          created_at?: string
          farm_id?: string
          id?: string
          plot_id?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      plots: {
        Row: {
          created_at: string
          crop_id: string | null
          expected_harvest_date: string | null
          farm_id: string
          id: string
          name: string
          planting_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          expected_harvest_date?: string | null
          farm_id: string
          id?: string
          name: string
          planting_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          expected_harvest_date?: string | null
          farm_id?: string
          id?: string
          name?: string
          planting_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plots_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string
          description: string
          expires_at: string | null
          farm_id: string
          id: string
          payload: Json | null
          plot_id: string | null
          priority: string
          recommended_at: string
          source_model: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          expires_at?: string | null
          farm_id: string
          id?: string
          payload?: Json | null
          plot_id?: string | null
          priority?: string
          recommended_at?: string
          source_model?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          expires_at?: string | null
          farm_id?: string
          id?: string
          payload?: Json | null
          plot_id?: string | null
          priority?: string
          recommended_at?: string
          source_model?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          credits_used: number
          id: string
          last_reset_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          id?: string
          last_reset_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          id?: string
          last_reset_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_use_credit: { Args: { p_user_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "agronomist" | "farmer"
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
      app_role: ["admin", "agronomist", "farmer"],
    },
  },
} as const
