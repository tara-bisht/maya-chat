export { MAYA_PLANS, type MayaPlan } from "./plans";

export const AGENT_CATEGORIES = [
  "learning",
  "philosophy",
  "productivity",
  "wellbeing",
  "lifestyle",
  "custom",
] as const;
export type AgentCategory = (typeof AGENT_CATEGORIES)[number];

export { COSTUME_IDS, parseCostumeId, type CostumeId } from "./costumes";

export {
  STUDIO_TOOLS,
  DEFAULT_TONE,
  toneSettingsSchema,
  studioUpsertSchema,
  evaluateStudioWrite,
  canUseAgent,
  canEditAgent,
  parseStudioWriteError,
  allowedStudioTools,
  upgradePlanFor,
  type LanguagePreset,
  type StudioTool,
  type ToneSettings,
  type StudioUpsert,
  type StudioWriteAction,
  type StudioWriteInput,
  type StudioWriteResult,
  type StudioWriteCode,
} from "./studio";

export {
  DISPLAY_NAME_MAX,
  ENTITLEMENT_STATUSES,
  GLOBAL_BIO_MAX,
  LANGUAGE_PRESET_IDS,
  LANGUAGE_PRESETS,
  parseEntitlementStatus,
  parseLanguagePreset,
  parseMayaPlan,
  parseProfileUpdate,
  profileUpdateSchema,
  toSettingsView,
} from "./profile";
export type {
  EntitlementStatus,
  LanguagePresetId,
  ParseProfileUpdateResult,
  ProfileField,
  ProfileUpdate,
  SettingsBill,
  SettingsView,
  SettingsViewInput,
} from "./profile";

export {
  CONVERSATION_TITLE_MAX,
  HISTORY_WINDOW,
  OPEN_NIGHT_TITLE,
  USER_MESSAGE_MAX,
  chatRequestSchema,
  conversationCreateSchema,
  isDailyCapReached,
  isUuid,
  parseChatRequest,
  parseConversationCreate,
  systemPromptWithLanguage,
  textFromUserParts,
  titleFromFirstMessage,
  type ChatRequest,
  type ConversationCreate,
  type ParseChatRequestResult,
} from "./chat";
