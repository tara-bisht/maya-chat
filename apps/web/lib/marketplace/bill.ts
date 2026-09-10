import { COMPANY, type PosterCostumeId } from "@/lib/company";

export type MarketplaceStatus = "on_tonight" | "coming_soon";

export type MarketplaceCategoryId =
  | "learning"
  | "philosophy"
  | "productivity"
  | "wellbeing"
  | "lifestyle";

export type MarketplacePlayer = {
  id: string;
  shortName: string;
  tagline: string;
  category: MarketplaceCategoryId;
  costume: PosterCostumeId;
  avatar: string;
  freeTier: boolean;
  status: MarketplaceStatus;
};

export type MarketplaceSection = {
  id: MarketplaceCategoryId;
  label: string;
  body: string;
  players: MarketplacePlayer[];
};

export const MARKETPLACE_COPY = {
  kicker: "Explore",
  title: "Agents",
  body: "Featured voices now. More on the way. Sign in to chat — or write yours in Studio.",
  signedInBody: "Featured voices now. More on the way.",
} as const;

export const MARKETPLACE_CATEGORIES: readonly {
  id: MarketplaceCategoryId;
  label: string;
  body: string;
}[] = [
  {
    id: "learning",
    label: "Learning",
    body: "Proofs, drafts, and money that isn't a TED talk.",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    body: "A roast, then the dichotomy. Or a quiet metaphysician.",
  },
  {
    id: "productivity",
    label: "Productivity",
    body: "The PR is on fire. The panel already hates take-homes.",
  },
  {
    id: "wellbeing",
    label: "Wellbeing",
    body: "Sit down. Eat. Then we talk.",
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    body: "A cat who thinks you're the irrational one, and a cinephile who wants the cut.",
  },
];

export const COMING_SOON: MarketplacePlayer[] = [
  {
    id: "next-jules",
    shortName: "Jules",
    tagline:
      "That ending was a cop-out and you know it. Sit down. We're talking about the cut.",
    category: "lifestyle",
    costume: "jules",
    avatar: "/avatars/jules-cinephile.jpg",
    freeTier: false,
    status: "coming_soon",
  },
  {
    id: "next-meera",
    shortName: "Meera",
    tagline:
      "I will bleed on this draft. Then I'll tell you why sentence three is the real lede.",
    category: "learning",
    costume: "meera",
    avatar: "/avatars/meera-editor.jpg",
    freeTier: false,
    status: "coming_soon",
  },
  {
    id: "next-kenji",
    shortName: "Kenji",
    tagline:
      "Walk me through it like I'm the panel that already hates take-home tests.",
    category: "productivity",
    costume: "kenji",
    avatar: "/avatars/kenji-panel.jpg",
    freeTier: false,
    status: "coming_soon",
  },
  {
    id: "next-sofia",
    shortName: "Sofia",
    tagline:
      "Your emergency fund is a shopping bag. Let's talk about money like adults, not a TED talk.",
    category: "learning",
    costume: "sofia",
    avatar: "/avatars/sofia-economist.jpg",
    freeTier: false,
    status: "coming_soon",
  },
];

function isMarketplaceCategory(
  category: string,
): category is MarketplaceCategoryId {
  return MARKETPLACE_CATEGORIES.some((entry) => entry.id === category);
}

export function buildMarketplaceBill(): MarketplaceSection[] {
  const players: MarketplacePlayer[] = [
    ...COMPANY.flatMap((player) => {
      if (!isMarketplaceCategory(player.category)) {
        return [];
      }
      return [
        {
          id: player.id,
          shortName: player.shortName,
          tagline: player.tagline,
          category: player.category,
          costume: player.costume,
          avatar: player.avatar,
          freeTier: player.freeTier,
          status: "on_tonight" as const,
        },
      ];
    }),
    ...COMING_SOON,
  ];

  return MARKETPLACE_CATEGORIES.flatMap((category) => {
    const inCategory = players.filter(
      (player) => player.category === category.id,
    );
    if (inCategory.length === 0) {
      return [];
    }
    return [{ ...category, players: inCategory }];
  });
}

export function talkHref(
  player: MarketplacePlayer,
  signedIn: boolean,
): string | null {
  if (player.status === "coming_soon") {
    return null;
  }
  return signedIn ? `/chat/${player.id}` : `/login?next=/chat/${player.id}`;
}
