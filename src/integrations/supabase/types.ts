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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          claimed_by: Json | null
          event_date: string
          event_id: string
          event_title: string
          id: string
          marked_at: string | null
          present_volunteer_ids: string[] | null
        }
        Insert: {
          claimed_by?: Json | null
          event_date: string
          event_id: string
          event_title: string
          id?: string
          marked_at?: string | null
          present_volunteer_ids?: string[] | null
        }
        Update: {
          claimed_by?: Json | null
          event_date?: string
          event_id?: string
          event_title?: string
          id?: string
          marked_at?: string | null
          present_volunteer_ids?: string[] | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          date: string
          event_name: string
          hours: number | null
          id: string
          type: string | null
          user_id: string
        }
        Insert: {
          date: string
          event_name: string
          hours?: number | null
          id?: string
          type?: string | null
          user_id: string
        }
        Update: {
          date?: string
          event_name?: string
          hours?: number | null
          id?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_proposals: {
        Row: {
          created_at: string | null
          description: string
          id: string
          location: string | null
          proposed_by: string
          proposed_date: string | null
          status: string | null
          time: string | null
          title: string
          voters: string[] | null
          votes: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          location?: string | null
          proposed_by: string
          proposed_date?: string | null
          status?: string | null
          time?: string | null
          title: string
          voters?: string[] | null
          votes?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          proposed_by?: string
          proposed_date?: string | null
          status?: string | null
          time?: string | null
          title?: string
          voters?: string[] | null
          votes?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          message: string
          read: boolean | null
          timestamp: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          id?: string
          message: string
          read?: boolean | null
          timestamp?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string
          read?: boolean | null
          timestamp?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      previous_events: {
        Row: {
          category: string | null
          certificate_file: string | null
          created_at: string | null
          date: string
          description: string | null
          hours: number | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          certificate_file?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          hours?: number | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          certificate_file?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          hours?: number | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activities_completed: number | null
          avatar: string | null
          badges: string[] | null
          branch: string | null
          created_at: string | null
          events_attended: number | null
          id: string
          inactive_warnings: number | null
          is_inactive: boolean | null
          last_activity_date: string | null
          name: string
          reward_points: number | null
          role: string
          roll_number: string
          section: string | null
          semester: number | null
          total_hours: number | null
          year: number | null
        }
        Insert: {
          activities_completed?: number | null
          avatar?: string | null
          badges?: string[] | null
          branch?: string | null
          created_at?: string | null
          events_attended?: number | null
          id: string
          inactive_warnings?: number | null
          is_inactive?: boolean | null
          last_activity_date?: string | null
          name: string
          reward_points?: number | null
          role?: string
          roll_number: string
          section?: string | null
          semester?: number | null
          total_hours?: number | null
          year?: number | null
        }
        Update: {
          activities_completed?: number | null
          avatar?: string | null
          badges?: string[] | null
          branch?: string | null
          created_at?: string | null
          events_attended?: number | null
          id?: string
          inactive_warnings?: number | null
          is_inactive?: boolean | null
          last_activity_date?: string | null
          name?: string
          reward_points?: number | null
          role?: string
          roll_number?: string
          section?: string | null
          semester?: number | null
          total_hours?: number | null
          year?: number | null
        }
        Relationships: []
      }
      service_posts: {
        Row: {
          date: string
          description: string
          hours_requested: number
          id: string
          photos: string[] | null
          points_awarded: number | null
          posted_at: string | null
          status: string | null
          title: string
          volunteer_id: string
          volunteer_name: string
        }
        Insert: {
          date: string
          description: string
          hours_requested?: number
          id?: string
          photos?: string[] | null
          points_awarded?: number | null
          posted_at?: string | null
          status?: string | null
          title: string
          volunteer_id: string
          volunteer_name: string
        }
        Update: {
          date?: string
          description?: string
          hours_requested?: number
          id?: string
          photos?: string[] | null
          points_awarded?: number | null
          posted_at?: string | null
          status?: string | null
          title?: string
          volunteer_id?: string
          volunteer_name?: string
        }
        Relationships: []
      }
      urgent_alerts: {
        Row: {
          blood_group: string | null
          category: string | null
          contact: string | null
          description: string
          help_type: string | null
          id: string
          location: string | null
          person_in_need: string | null
          posted_at: string | null
          title: string
          urgency_level: string | null
        }
        Insert: {
          blood_group?: string | null
          category?: string | null
          contact?: string | null
          description: string
          help_type?: string | null
          id?: string
          location?: string | null
          person_in_need?: string | null
          posted_at?: string | null
          title: string
          urgency_level?: string | null
        }
        Update: {
          blood_group?: string | null
          category?: string | null
          contact?: string | null
          description?: string
          help_type?: string | null
          id?: string
          location?: string | null
          person_in_need?: string | null
          posted_at?: string | null
          title?: string
          urgency_level?: string | null
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
