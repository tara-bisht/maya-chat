export const MAYA_PLANS = ["free", "plus", "pro"] as const;
export type MayaPlan = (typeof MAYA_PLANS)[number];
