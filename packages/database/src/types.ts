export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      agent_memories: {
        Row: {
          agent_id: string;
          content: string;
          created_at: string;
          embedding: string | null;
          id: string;
          metadata: Json;
          user_id: string;
        };
        Insert: {
          agent_id: string;
          content: string;
          created_at?: string;
          embedding?: string | null;
          id?: string;
          metadata?: Json;
          user_id: string;
        };
        Update: {
          agent_id?: string;
          content?: string;
          created_at?: string;
          embedding?: string | null;
          id?: string;
          metadata?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_memories_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
        ];
      };
      agents: {
        Row: {
          archived_at: string | null;
          avatar_url: string | null;
          category: string;
          costume_id: string;
          created_at: string;
          free_tier: boolean;
          id: string;
          is_curated: boolean;
          is_public: boolean;
          language_preset: string;
          name: string;
          system_prompt: string;
          tagline: string;
          tone_settings: Json;
          tools_enabled: string[];
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          archived_at?: string | null;
          avatar_url?: string | null;
          category: string;
          costume_id?: string;
          created_at?: string;
          free_tier?: boolean;
          id?: string;
          is_curated?: boolean;
          is_public?: boolean;
          language_preset?: string;
          name: string;
          system_prompt: string;
          tagline: string;
          tone_settings?: Json;
          tools_enabled?: string[];
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          archived_at?: string | null;
          avatar_url?: string | null;
          category?: string;
          costume_id?: string;
          created_at?: string;
          free_tier?: boolean;
          id?: string;
          is_curated?: boolean;
          is_public?: boolean;
          language_preset?: string;
          name?: string;
          system_prompt?: string;
          tagline?: string;
          tone_settings?: Json;
          tools_enabled?: string[];
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          agent_id: string;
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          agent_id: string;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          agent_id?: string;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
        ];
      };
      entitlements: {
        Row: {
          current_period_end: string | null;
          plan: string;
          source: string;
          status: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          current_period_end?: string | null;
          plan?: string;
          source?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          current_period_end?: string | null;
          plan?: string;
          source?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entitlements_plan_fkey";
            columns: ["plan"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          role: string;
          tokens_used: number;
          tool_calls: Json | null;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          role: string;
          tokens_used?: number;
          tool_calls?: Json | null;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          role?: string;
          tokens_used?: number;
          tool_calls?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      models: {
        Row: {
          display_name: string;
          gateway_id: string;
          id: string;
          is_enabled: boolean;
          provider: string;
          sort_order: number;
          supports_tools: boolean;
        };
        Insert: {
          display_name: string;
          gateway_id: string;
          id: string;
          is_enabled?: boolean;
          provider: string;
          sort_order?: number;
          supports_tools?: boolean;
        };
        Update: {
          display_name?: string;
          gateway_id?: string;
          id?: string;
          is_enabled?: boolean;
          provider?: string;
          sort_order?: number;
          supports_tools?: boolean;
        };
        Relationships: [];
      };
      plan_models: {
        Row: {
          model_id: string;
          plan_id: string;
        };
        Insert: {
          model_id: string;
          plan_id: string;
        };
        Update: {
          model_id?: string;
          plan_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plan_models_model_id_fkey";
            columns: ["model_id"];
            isOneToOne: false;
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "plan_models_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          curated_agent_limit: number | null;
          daily_message_limit: number | null;
          default_model_id: string;
          display_name: string;
          id: string;
          is_active: boolean;
          max_custom_agents: number | null;
          monthly_price_cents: number;
          stripe_price_id_monthly: string | null;
          stripe_price_id_yearly: string | null;
          tools_allowed: string[];
          vector_memory: boolean;
          yearly_price_cents: number | null;
        };
        Insert: {
          curated_agent_limit?: number | null;
          daily_message_limit?: number | null;
          default_model_id: string;
          display_name: string;
          id: string;
          is_active?: boolean;
          max_custom_agents?: number | null;
          monthly_price_cents?: number;
          stripe_price_id_monthly?: string | null;
          stripe_price_id_yearly?: string | null;
          tools_allowed?: string[];
          vector_memory?: boolean;
          yearly_price_cents?: number | null;
        };
        Update: {
          curated_agent_limit?: number | null;
          daily_message_limit?: number | null;
          default_model_id?: string;
          display_name?: string;
          id: string;
          is_active?: boolean;
          max_custom_agents?: number | null;
          monthly_price_cents?: number;
          stripe_price_id_monthly?: string | null;
          stripe_price_id_yearly?: string | null;
          tools_allowed?: string[];
          vector_memory?: boolean;
          yearly_price_cents?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "plans_default_model_id_fkey";
            columns: ["default_model_id"];
            isOneToOne: false;
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          global_bio: string | null;
          id: string;
          plan: string | null;
          preferred_language: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          global_bio?: string | null;
          id: string;
          plan?: string | null;
          preferred_language?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          global_bio?: string | null;
          id?: string;
          plan?: string | null;
          preferred_language?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      usage_events: {
        Row: {
          created_at: string;
          event_type: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          event_type: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          event_type?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      chat_agent_prompt: {
        Args: { p_agent_id: string };
        Returns: string;
      };
      consume_chat_turn: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      match_agent_memories: {
        Args: { p_agent_id: string; p_match_count?: number; p_query: string };
        Returns: {
          content: string;
          id: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      own_custom_agent_sheet: {
        Args: { p_id: string };
        Returns: {
          archived_at: string | null;
          avatar_url: string | null;
          category: string;
          costume_id: string;
          created_at: string;
          free_tier: boolean;
          id: string;
          is_curated: boolean;
          is_public: boolean;
          language_preset: string;
          name: string;
          system_prompt: string;
          tagline: string;
          tone_settings: Json;
          tools_enabled: string[];
          updated_at: string;
          user_id: string | null;
        };
      };
    };
    Enums: {
      [_ in never]: never;
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
