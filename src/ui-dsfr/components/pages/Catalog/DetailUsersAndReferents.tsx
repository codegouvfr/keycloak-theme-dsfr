import React from "react";
import { declareComponentKeys } from "i18nifty";
import { fr } from "@codegouvfr/react-dsfr";
import type { Link } from "type-route";
import { useResolveLocalizedString, useTranslation } from "../../../i18n";
import { makeStyles } from "tss-react/dsfr";

export type Props = {
    seeUserAndReferent: Link;
    referentCount: number;
    userCount: number;
};

export const DetailUsersAndReferents = (props: Props) => {
    const { seeUserAndReferent, referentCount, userCount } = props;
    const { t } = useTranslation({ DetailUsersAndReferents });
    const { classes, cx } = useStyles();

    return (
        <a
            {...seeUserAndReferent}
            className={cx(fr.cx("fr-card__detail"), classes.detailsUsersContainer)}
        >
            <i className={cx(fr.cx("fr-icon-user-line"), classes.detailsUsersIcon)} />
            <span>
                {t("userAndReferentCount", {
                    referentCount: referentCount ?? 0,
                    userCount: userCount ?? 0,
                })}
            </span>
            <i className={cx(fr.cx("fr-icon-arrow-right-s-line"))} />
        </a>
    );
};

const useStyles = makeStyles({
    "name": { DetailUsersAndReferents },
})(() => ({
    "detailsUsersContainer": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("8v"),
        "background": "none",
    },
    "detailsUsersIcon": {
        "marginRight": fr.spacing("2v"),
    },
}));

export const { i18n } = declareComponentKeys<{
    K: "userAndReferentCount";
    P: { userCount: number; referentCount: number };
}>()({ DetailUsersAndReferents });
