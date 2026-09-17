export const MAYA_AGENT_ID = "00000000-0000-0000-0000-00000000000a";

export const MAYA_HOME_HREF = `/chat/${MAYA_AGENT_ID}`;

export const HOST_TOOLS = ["recommendAgent", "proposeCustomAgent"] as const;

export type HostTool = (typeof HOST_TOOLS)[number];
