export function houseHref(
  agentId: string,
  conversationId?: string | null,
): string {
  if (conversationId) {
    return `/chat/${agentId}/${conversationId}`;
  }
  return `/chat/${agentId}`;
}
