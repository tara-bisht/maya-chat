export const MAYA_AGENT_ID = "00000000-0000-0000-0000-00000000000a";

export const MAYA_HOME_HREF = `/chat/${MAYA_AGENT_ID}`;

/** Model-facing tools on the host row. Not added to `plans.tools_allowed`. */
export const HOST_TOOLS = ["proposeCustomAgent"] as const;

export type HostTool = (typeof HOST_TOOLS)[number];

export const HOST_ROUTE = ["open", "stay", "handed_off"] as const;
export type HostRoute = (typeof HOST_ROUTE)[number];

export function parseHostRoute(value: string | null | undefined): HostRoute {
  if (value === "stay" || value === "handed_off" || value === "open") {
    return value;
  }
  return "open";
}
