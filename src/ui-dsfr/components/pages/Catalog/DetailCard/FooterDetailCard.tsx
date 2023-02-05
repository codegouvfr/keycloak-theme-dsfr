import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { DetailUsersAndReferents } from "../DetailUsersAndReferents";

export type Props = {
    className?: string;
    usersCount: number;
    referentCount: number;
    seeUserAndReferent: Link;
    shareSoftware: Link;
    declareUserOrReferent: Link;
};

export const FooterDetailCard = memo((props: Props) => {
    const {
        className,
        usersCount,
        referentCount,
        seeUserAndReferent,
        shareSoftware,
        declareUserOrReferent,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ FooterDetailCard });

    return (
        <div className={cx(classes.root, className)}>
            <div className={cx(classes.container)}>
                <DetailUsersAndReferents
                    className={cx(fr.cx("fr-text--lg"), classes.detailUsersAndReferents)}
                    seeUserAndReferent={seeUserAndReferent}
                    referentCount={referentCount}
                    userCount={usersCount}
                />
                <div className={classes.buttons}>
                    <Button
                        iconId="ri-share-forward-line"
                        onClick={function noRefCheck() {}}
                        priority="secondary"
                        className={classes.shareSoftware}
                    >
                        {t("share software")}
                    </Button>
                    <Button onClick={function noRefCheck() {}} priority="secondary">
                        {t("declare referent")}
                    </Button>
                </div>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { FooterDetailCard }
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
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("6v"),
        "marginBottom": fr.spacing("6v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
            "gridRowGap": fr.spacing("6v")
        }
    },
    "buttons": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end"
    },
    "shareSoftware": {
        "marginRight": fr.spacing("4v"),
        "&&::before": {
            "--icon-size": fr.spacing("6v")
        }
    },
    "detailUsersAndReferents": {
        color: theme.decisions.text.actionHigh.blueFrance.default
    }
}));

export const { i18n } = declareComponentKeys<"share software" | "declare referent">()({
    FooterDetailCard
});
