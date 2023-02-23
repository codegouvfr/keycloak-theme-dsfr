export const accountTabIds = ["infos", "user-interface"] as const;

export type AccountTabId = (typeof accountTabIds)[number];
