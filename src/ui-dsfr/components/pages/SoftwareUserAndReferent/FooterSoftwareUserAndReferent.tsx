import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
    className?: string;
    softwareDetails: string;
    declareUserOrReferent: Link;
    activeMenu: number;
};

export const FooterSoftwareUserAndReferent = memo((props: Props) => {
    const { className, softwareDetails, declareUserOrReferent, activeMenu, ...rest } =
        props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ FooterSoftwareUserAndReferent });

    return (
        <div className={cx(classes.root, className)}>
            <div className={cx(fr.cx("fr-container"), classes.container)}>
                <Button
                    iconId="fr-icon-eye-line"
                    onClick={function noRefCheck() {}}
                    priority="secondary"
                    className={classes.softwareDetails}
                >
                    {t("softwareDetails")}
                </Button>
                <Button onClick={function noRefCheck() {}} priority="primary">
                    {activeMenu === 0 ? t("declare user") : t("declare referent")}
                </Button>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { FooterSoftwareUserAndReferent }
})(theme => ({
    "root": {
        "position": "sticky",
        "bottom": "0",
        "marginTop": fr.spacing("6v"),
        "boxShadow": `0 -5px 5px -5px ${theme.decisions.background.overlap.grey.active}`,
        ...fr.spacing("padding", {
            "top": "4v",
            "bottom": "6v"
        }),
        "background": theme.decisions.background.default.grey.default
    },
    "container": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end"
    },
    "softwareDetails": {
        "marginRight": fr.spacing("4v"),
        "&&::before": {
            "--icon-size": fr.spacing("6v")
        }
    }
}));

export const { i18n } = declareComponentKeys<
    "softwareDetails" | "declare referent" | "declare user"
>()({
    FooterSoftwareUserAndReferent
});
