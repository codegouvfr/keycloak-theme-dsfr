import { memo } from "react";
import { Tag } from "onyxia-ui/Tag";
import { getTagColor } from "./TagColor";
import type { TagColor } from "./TagColor";
import { makeStyles, useTheme } from "ui/theme";

export type Props = {
    className?: string;
    tag: string;
};

export const CustomTag = memo((props: Props) => {
    const { tag, className } = props;

    const theme = useTheme();

    const { classes, cx } = useStyles({ "tagColor": getTagColor({ tag, theme }) });

    return (
        <Tag
            className={cx(classes.root, className)}
            classes={{
                "text": classes.text,
            }}
            text={tag}
        />
    );
});

const useStyles = makeStyles<{ tagColor: TagColor }>({ "name": { CustomTag } })(
    (theme, { tagColor }) => ({
        "root": {
            "backgroundColor": tagColor.color,
        },
        "text": {
            "color":
                theme.colors.palette[tagColor.isContrastTextWhite ? "light" : "dark"]
                    .main,
        },
    }),
);
