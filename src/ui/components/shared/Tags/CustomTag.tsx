import { memo } from "react";
import { Tag } from "onyxia-ui/Tag";
import { getTagColor } from "./TagColor";
import type { TagColor } from "./TagColor";
import { makeStyles, useTheme } from "ui/theme";
import { IconButton } from "ui/theme";

export type Props = {
    className?: string;
    tag: string;
    onRemove?: () => void;
};

export const CustomTag = memo((props: Props) => {
    const { tag, className, onRemove } = props;

    const theme = useTheme();

    const { classes, cx } = useStyles({
        "tagColor": getTagColor({ tag, theme }),
        "hasOnRemove": onRemove !== undefined,
    });

    return (
        <Tag
            className={cx(classes.root, className)}
            classes={{
                "text": classes.text,
            }}
            text={
                <>
                    {tag}
                    {onRemove !== undefined && (
                        <IconButton
                            className={classes.icon}
                            iconId="cancel"
                            size="small"
                            onClick={onRemove}
                        />
                    )}
                </>
            }
        />
    );
});

const useStyles = makeStyles<{ tagColor: TagColor; hasOnRemove: boolean }>({
    "name": { CustomTag },
})((theme, { tagColor, hasOnRemove }) => ({
    "root": {
        "backgroundColor": tagColor.color,
    },
    "text": {
        "color":
            theme.colors.palette[tagColor.isContrastTextWhite ? "light" : "dark"].main,
        "paddingLeft": hasOnRemove ? theme.spacing(2) : undefined,
    },
    "icon": {
        "& > svg": {
            "color":
                theme.colors.palette[tagColor.isContrastTextWhite ? "light" : "dark"]
                    .greyVariant2,
        },
    },
}));
