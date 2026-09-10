import type {
  CostumeId,
  LanguagePresetId,
  MayaPlan,
  ToneSettings,
} from "@maya/shared";

export type HydratedTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ThreadSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type CastMember = {
  id: string;
  shortName: string;
  costume: CostumeId;
  avatar: string;
  latestTitle: string | null;
  latestId: string | null;
};

export type HouseAgent = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  costume: CostumeId;
  avatar: string;
  languagePreset: LanguagePresetId;
  tone: ToneSettings;
  toolsEnabled: string[];
  isCurated: boolean;
  isPublic: boolean;
  freeTier: boolean;
  canEdit: boolean;
  canChat: boolean;
  backstory: string | null;
};

export type HouseConversation = {
  id: string;
  title: string;
  messages: HydratedTurn[];
};

export type HouseView = {
  agent: HouseAgent;
  plan: MayaPlan;
  displayName: string;
  defaultModelId: string;
  dailyLimit: number | null;
  threads: ThreadSummary[];
  cast: CastMember[];
  conversation: HouseConversation | null;
};
