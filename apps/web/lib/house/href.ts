import { isUuid, uuidToShortId } from "@maya/shared";
import { getSlugForAgent } from "./slugs";

export function houseHref(
  agentSlugOrId: string,
  conversationId?: string | null,
): string {
  const slug = getSlugForAgent(agentSlugOrId);
  if (conversationId) {
    const threadToken = isUuid(conversationId)
      ? uuidToShortId(conversationId)
      : conversationId;
    return `/chat/${slug}/${threadToken}`;
  }
  return `/chat/${slug}`;
}
