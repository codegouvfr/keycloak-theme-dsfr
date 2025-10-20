export const allowedNoticeSeverities = ["info", "warning", "alert"] as const;
export type NoticeSeverity = typeof allowedNoticeSeverities[number];

export function isNoticeSeverity(value: unknown): value is NoticeSeverity {
    return (allowedNoticeSeverities as readonly string[]).includes(value as string);
}

export function getNoticeSeverityOrDefault(value: unknown, fallback: NoticeSeverity = "info"): NoticeSeverity {
    return isNoticeSeverity(value) ? value : fallback;
}


