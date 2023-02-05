import type { Theme } from "ui/theme";

export type TagColor = {
    color: string;
    isContrastTextWhite: boolean;
};

export const getTagColors = (theme: Theme): TagColor[] => [
    {
        "color": theme.colors.palette.blueInfo.light,
        "isContrastTextWhite": false
    }
];

export function getTagColor(params: { tag: string; theme: Theme }): TagColor {
    const { tag, theme } = params;

    const tagColors = getTagColors(theme);

    return tagColors[
        Array.from(tag)
            .map(char => char.charCodeAt(0))
            .reduce((p, c) => p + c, 0) % tagColors.length
    ];
}
