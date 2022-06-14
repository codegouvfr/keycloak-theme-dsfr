export type TagColor = {
    color: string;
    isContrastTextWhite: boolean;
};

export const tagColors: TagColor[] = [
    {
        "color": "#ee0701",
        "isContrastTextWhite": true,
    },
    {
        "color": "#84b6eb",
        "isContrastTextWhite": false,
    },
    {
        "color": "#bfe5bf",
        "isContrastTextWhite": false,
    },
    {
        "color": "#bcf5db",
        "isContrastTextWhite": false,
    },
    {
        "color": "#e99695",
        "isContrastTextWhite": false,
    },
    {
        "color": "#fbca04",
        "isContrastTextWhite": false,
    },
    {
        "color": "#ff7619",
        "isContrastTextWhite": true,
    },
    {
        "color": "#0e8a16",
        "isContrastTextWhite": true,
    },
    {
        "color": "#eeeeee",
        "isContrastTextWhite": false,
    },
    {
        "color": "#cc317c",
        "isContrastTextWhite": true,
    },
    {
        "color": "#5319e7",
        "isContrastTextWhite": true,
    },
    {
        "color": "#d4c5f9",
        "isContrastTextWhite": false,
    },
    {
        "color": "#b4a8d1",
        "isContrastTextWhite": false,
    },
    {
        "color": "#000000",
        "isContrastTextWhite": true,
    },
    {
        "color": "#555555",
        "isContrastTextWhite": true,
    },
];

export function getTagColor(tag: string): TagColor {
    return tagColors[
        Array.from(tag)
            .map(char => char.charCodeAt(0))
            .reduce((p, c) => p + c, 0) % tagColors.length
    ];
}
