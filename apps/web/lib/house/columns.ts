/** Columns the House may send to the client. Never include `system_prompt`. */
export const HOUSE_AGENT_COLUMNS =
  "id, user_id, name, tagline, avatar_url, category, is_curated, is_public, free_tier, language_preset, tone_settings, tools_enabled, costume_id, archived_at" as const;

export type HouseAgentRow = {
  id: string;
  user_id: string | null;
  name: string;
  tagline: string;
  avatar_url: string | null;
  category: string;
  is_curated: boolean;
  is_public: boolean;
  free_tier: boolean;
  language_preset: string;
  tone_settings: unknown;
  tools_enabled: string[];
  costume_id: string;
  archived_at: string | null;
};
