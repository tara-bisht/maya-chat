import { MAYA_HOME_HREF } from "@maya/shared";

export type AppNavId = "home" | "explore" | "create" | "profile";

export const APP_NAV = [
  { id: "home" as const, href: MAYA_HOME_HREF, label: "Home" },
  { id: "explore" as const, href: "/explore", label: "Explore" },
  {
    id: "create" as const,
    href: `${MAYA_HOME_HREF}?intent=create`,
    label: "Create agent",
  },
  { id: "profile" as const, href: "/settings", label: "Profile" },
] as const;

export const COPY = {
  loading: "Loading…",
  dropped: "Something went wrong.",
  tryAgain: "Try again",
  home: "Home",
  explore: "Explore",
  createAgent: "Create agent",
  createAnAgent: "Create an agent",
  editAgent: "Edit agent",
  newAgent: "New agent",
  profile: "Profile",
  chats: "Chats",
  about: "About",
  upgrade: "Upgrade",
  signIn: "Sign in",
  getStarted: "Get started",
  back: "Back",
  chat: "Chat",
  archive: "Archive",
  save: "Save",
  public: "Public",
  private: "Private",
  comingSoon: "Coming soon",
  continueChatting: "Continue chatting",
  featured: "Featured agents",
  yourAgents: "Your agents",
  fromOthers: "From other people",
  noChats: "No chats yet. Pick an agent to start.",
  noAgents: "You have not created an agent yet.",
  featuredBody: "Marcus and Dr. Priya are free. The others need Plus.",
  yourAgentsEmpty: "You have not created an agent yet.",
  recentChats: "Chats",
  olderChats: "Older chats",
  newChat: "New chat",
  plan: "Plan",
  credits: "Credits",
  managePlan: "Manage plan",
  checkoutSuccess:
    "Checkout finished. Your plan updates when Stripe confirms.",
  checkoutCanceled: "Checkout was canceled.",
  everyAgentReads: "Every agent can read this.",
  bioHelp: "500 characters. What they should already know about you.",
  agentMissing: "That agent is not available.",
  archived: "This agent is archived.",
  agentLimit: "Agent limit reached.",
  privatePlus: "Private agents are Plus.",
  privatePlusBody: "Upgrade to Plus to make this agent private.",
  publicHint: "Anyone signed in can chat. They do not see the instructions.",
  privateHint: "Only you can chat with this agent.",
  studioInvalid: "Name, description, and instructions are required.",
  signInTitle: "Sign in.",
  signInHelp: "Continue with Google. Apple lands later.",
  authErrorTitle: "Sign-in did not finish.",
  authErrorBody: "Google sign-in did not complete. Try again.",
  none: "None",
  signOut: "Sign out",
  signingOut: "Signing out…",
  menu: "Menu",
  close: "Close",
  collapseRail: "Collapse",
  expandRail: "Expand",
  keepGoingHere: "Keep going here",
  notNow: "Not now",
} as const;

export function chatWithLabel(name: string): string {
  return `Chat with ${name}`;
}

export function addAgentLabel(name: string): string {
  return `Add ${name}`;
}

export function addedAgentLabel(name: string): string {
  return `${name} is on your agents`;
}

export function greetingName(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0];
  return first ? `Hi, ${first}` : COPY.home;
}

export function lockedAgentCopy(shortName: string): string {
  return `${shortName} is on Plus. Marcus and Dr. Priya are free.`;
}

export function quotaCopy(): string {
  return "Out of credits today. Come back after 00:00 UTC, switch to a cheaper model, or upgrade.";
}

export function monthlyQuotaCopy(): string {
  return "Monthly credit limit reached. Upgrade, or wait for next month.";
}

export function lockedVoiceTitle(
  displayName: string,
  plan: "free" | "plus" | "pro",
): string {
  return `${displayName} is on ${planLabel(plan)}`;
}

export function lockedVoiceCopy(): string {
  return "Upgrade to use this model.";
}

export function lockedVoiceFallbackTitle(): string {
  return "That model is locked";
}

export function creditsLeftLabel(remaining: number): string {
  return `${remaining.toLocaleString("en-US")} left`;
}

export function creditsRailLabel(remaining: number, limit: number): string {
  return `${creditsLeftLabel(remaining)} of ${limit.toLocaleString("en-US")}`;
}

export function creditsResetLabel(
  resetsAt?: string | null,
  options?: { locale?: string; timeZone?: string },
): string {
  if (!resetsAt) {
    return "Resets 00:00 UTC";
  }
  const date = new Date(resetsAt);
  if (Number.isNaN(date.getTime())) {
    return "Resets 00:00 UTC";
  }
  const time = date.toLocaleTimeString(options?.locale ?? undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: options?.timeZone,
  });
  return `Resets ${time}`;
}

export function creditsMonthLabel(remaining: number, limit: number): string {
  return `${remaining.toLocaleString("en-US")} of ${limit.toLocaleString("en-US")} this month`;
}

export function studioCapCopy(max: number | null, planName: string): string {
  if (max === null) {
    return `${planName} does not limit custom agents.`;
  }
  return `${max} agent${max === 1 ? "" : "s"} on ${planName}. Archive one, or upgrade.`;
}

export function agentsCapLabel(
  liveCount: number,
  max: number | null,
  planName: string,
): string {
  if (max === null) {
    return `${liveCount} agents · ${planName} does not limit you`;
  }
  return `${liveCount} of ${max} agents on ${planName}`;
}

export function planLabel(plan: "free" | "plus" | "pro"): string {
  if (plan === "plus") {
    return "Plus";
  }
  if (plan === "pro") {
    return "Pro";
  }
  return "Free";
}

export function planHref(): string {
  return "/plan";
}

export function profileInitial(displayName: string): string {
  const first = displayName.trim()[0];
  return first ? first.toLocaleUpperCase() : "Y";
}

export function navIsActive(href: string, pathname: string): boolean {
  if (href === MAYA_HOME_HREF) {
    return (
      pathname === MAYA_HOME_HREF || pathname.startsWith(`${MAYA_HOME_HREF}/`)
    );
  }
  if (href.startsWith(`${MAYA_HOME_HREF}?intent=create`)) {
    return false;
  }
  if (href === "/studio/new") {
    return pathname.startsWith("/studio");
  }
  if (href === "/settings") {
    return pathname === "/settings" || pathname.startsWith("/settings/");
  }
  if (href === "/explore") {
    return pathname === "/explore" || pathname.startsWith("/explore/");
  }
  return pathname === href;
}
