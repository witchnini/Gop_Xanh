export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      campaign_updates: {
        Row: {
          campaign_id: string;
          created_at: string;
          description: string;
          id: string;
          title: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          description?: string;
          id?: string;
          title: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          description?: string;
          id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_updates_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          category: string;
          created_at: string;
          district: string;
          goal: number;
          id: string;
          image_url: string | null;
          impact: string;
          method: string;
          name: string;
          owner_id: string;
          raised: number;
          review_note: string | null;
          slug: string;
          status: Database["public"]["Enums"]["campaign_status"];
          story: string;
          summary: string;
          supporters: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          district: string;
          goal?: number;
          id?: string;
          image_url?: string | null;
          impact?: string;
          method?: string;
          name: string;
          owner_id: string;
          raised?: number;
          review_note?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["campaign_status"];
          story: string;
          summary: string;
          supporters?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          district?: string;
          goal?: number;
          id?: string;
          image_url?: string | null;
          impact?: string;
          method?: string;
          name?: string;
          owner_id?: string;
          raised?: number;
          review_note?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["campaign_status"];
          story?: string;
          summary?: string;
          supporters?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          amount: number;
          anonymous: boolean;
          campaign_id: string | null;
          campaign_slug: string;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
        };
        Insert: {
          amount: number;
          anonymous?: boolean;
          campaign_id?: string | null;
          campaign_slug: string;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
        };
        Update: {
          amount?: number;
          anonymous?: boolean;
          campaign_id?: string | null;
          campaign_slug?: string;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          entity_type: string | null;
          created_at: string;
          full_name: string;
          id: string;
          organization: string | null;
          phone: string | null;
        };
        Insert: {
          entity_type?: string | null;
          created_at?: string;
          full_name?: string;
          id: string;
          organization?: string | null;
          phone?: string | null;
        };
        Update: {
          entity_type?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          organization?: string | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      volunteer_applications: {
        Row: {
          campaign_slug: string;
          created_at: string;
          email: string;
          experience: string;
          full_name: string;
          id: string;
          phone: string;
          role: string;
          user_id: string | null;
        };
        Insert: {
          campaign_slug: string;
          created_at?: string;
          email: string;
          experience: string;
          full_name: string;
          id?: string;
          phone: string;
          role: string;
          user_id?: string | null;
        };
        Update: {
          campaign_slug?: string;
          created_at?: string;
          email?: string;
          experience?: string;
          full_name?: string;
          id?: string;
          phone?: string;
          role?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "partner" | "contributor";
      campaign_status: "cho_duyet" | "can_bo_sung" | "dang_gay_quy" | "hoan_thanh" | "tu_choi";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "partner", "contributor"],
      campaign_status: ["cho_duyet", "can_bo_sung", "dang_gay_quy", "hoan_thanh", "tu_choi"],
    },
  },
} as const;
