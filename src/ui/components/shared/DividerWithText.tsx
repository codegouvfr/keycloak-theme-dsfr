import { memo } from "react";
import { makeStyles, Text } from "ui/theme";

export type Props = {
    className?: string;
    text: string;
};

export const DividerWithText = memo((props: Props) => {
    const { className, text } = props;

    const { classes, cx } = useStyles();

    const separator = <div role="separator" className={classes.separator} />;

    return (
        <div className={cx(classes.root, className)}>
            {separator}
            <Text typo="body 2" color="secondary" className={classes.text}>
                {text}
            </Text>
            {separator}
        </div>
    );
});

const useStyles = makeStyles({ "name": { DividerWithText } })(theme => ({
    "root": {
        "display": "flex",
        "alignItems": "center"
    },
    "separator": {
        "height": 1,
        "backgroundColor": theme.colors.useCases.typography.textSecondary,
        "flex": 1
    },
    "text": {
        ...theme.spacing.rightLeft("margin", 2),
        "paddingBottom": 2
    }
}));
