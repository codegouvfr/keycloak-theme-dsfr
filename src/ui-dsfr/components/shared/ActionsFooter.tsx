import React, { memo, ReactNode } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";

export type Props = {
    className?: string;
    children: ReactNode;
};

export const ActionsFooter = memo((props: Props) => {
    const { className, children, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    return (
        <div className={classes.wrapper}>
            <div className={cx(fr.cx("fr-container"), className)}>{children}</div>
        </div>
    );
});

const useStyles = makeStyles()(theme => ({
    "wrapper": {
        "position": "sticky",
        "bottom": "0",
        "marginTop": fr.spacing("6v"),
        "boxShadow": `0 -5px 5px -5px ${theme.decisions.background.overlap.grey.active}`,
        ...fr.spacing("padding", {
            "top": "4v",
            "bottom": "6v"
        }),
        "background": theme.decisions.background.default.grey.default
    }
}));
