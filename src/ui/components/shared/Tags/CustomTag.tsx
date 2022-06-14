import { memo } from "react";
import { Tag } from "onyxia-ui/Tag";
import { getTagColor } from "./TagColor";
import type { TagColor } from "./TagColor";
import { makeStyles } from "ui/theme";

export type Props = {
    className?: string;
    tag: string;
};

export const CustomTag = memo((props: Props) => {
    const { tag, className } = props;

    const { classes, cx } = useStyles({ "tagColor": getTagColor(tag) });

    return <Tag className={cx(classes.root, className)} text={tag} />;
});

const useStyles = makeStyles<{ tagColor: TagColor }>({ "name": { CustomTag } })(
    (theme, { tagColor }) => ({
        "root": {
            "backgroundColor": tagColor.color,
            "& > *": {
                "color":
                    theme.colors.palette[tagColor.isContrastTextWhite ? "light" : "dark"]
                        .main,
            },
        },
    }),
);
