import { memo } from "react";
import { Tag } from "onyxia-ui/Tag";
import { getTagColor } from "./TagColor";
import type { TagColor } from "./TagColor";
import { makeStyles, useTheme } from "ui/theme";
import { IconButton } from "ui/theme";
import { Text } from "ui/theme";

export type Props = {
    className?: string;
    tag: string;
    onRemove?: () => void;
    onClick?: () => void;
};

export const CustomTag = memo((props: Props) => {
    const { tag, className, onRemove, onClick } = props;

    const theme = useTheme();

    const { classes, cx } = useStyles({
        "tagColor": getTagColor({ tag, theme }),
        "hasOnRemove": onRemove !== undefined
    });

    return (
        <Tag
            className={cx(classes.root, className)}
            onClick={onClick}
            text={
                <div className={classes.bodyWrapper}>
                    <Text className={classes.text} typo="body 3">
                        {tag}
                    </Text>
                    {onRemove !== undefined && (
                        <IconButton
                            className={classes.icon}
                            iconId="cancel"
                            size="small"
                            onClick={onRemove}
                        />
                    )}
                </div>
            }
        />
    );
});

const useStyles = makeStyles<{ tagColor: TagColor; hasOnRemove: boolean }>({
    "name": { CustomTag }
})((theme, { tagColor, hasOnRemove }) => ({
    "root": {
        "backgroundColor": tagColor.color
    },
    "text": {
        "color":
            theme.colors.palette[tagColor.isContrastTextWhite ? "light" : "dark"].main,
        "paddingLeft": hasOnRemove ? theme.spacing(2) : undefined
    },
    "icon": {
        "& > svg": {
            "color":
                theme.colors.palette[tagColor.isContrastTextWhite ? "light" : "dark"]
                    .greyVariant2
        }
    },
    "bodyWrapper": {
        "display": "flex",
        "alignItems": "center"
    }
}));
