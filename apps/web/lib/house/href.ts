import { isUuid, MAYA_AGENT_ID } from "@maya/shared";

export function houseHref(
  agentId: string,
  conversationId?: string | null,
): string {
  if (conversationId) {
    return `/chat/${agentId}/${conversationId}`;
  }
  return `/chat/${agentId}`;
}

export function parseChatPath(pathname: string): {
  agentId: string | null;
  conversationId: string | null;
} {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "chat" || !parts[1] || !isUuid(parts[1])) {
    return { agentId: null, conversationId: null };
  }
  return {
    agentId: parts[1],
    conversationId: parts[2] && isUuid(parts[2]) ? parts[2] : null,
  };
}

export function newChatHref(pathname: string): string {
  const { agentId } = parseChatPath(pathname);
  return houseHref(agentId ?? MAYA_AGENT_ID);
}
