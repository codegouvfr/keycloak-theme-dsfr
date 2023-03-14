import { declareComponentKeys } from "i18nifty";
import { fr } from "@codegouvfr/react-dsfr";
import type { Link } from "type-route";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

type Props = {
    className?: string;
    seeUserAndReferent: Link;
    referentCount: number;
    userCount: number;
};

export function DetailUsersAndReferents(props: Props) {
    const { className, seeUserAndReferent, referentCount, userCount, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ DetailUsersAndReferents });
    const { classes, cx } = useStyles();

    return (
        <a
            {...seeUserAndReferent}
            className={cx(fr.cx("fr-card__detail"), classes.root, className)}
        >
            <i className={cx(fr.cx("fr-icon-user-line"), classes.detailsUsersIcon)} />
            <span>
                {t("userAndReferentCount", {
                    referentCount: referentCount ?? 0,
                    userCount: userCount ?? 0
                })}
            </span>
            <i className={cx(fr.cx("fr-icon-arrow-right-s-line"))} />
        </a>
    );
}

const useStyles = makeStyles({ "name": { DetailUsersAndReferents } })(() => ({
    "root": {
        "display": "flex",
        "alignItems": "center",
        "background": "none"
    },
    "detailsUsersIcon": {
        "marginRight": fr.spacing("2v")
    }
}));

export const { i18n } = declareComponentKeys<{
    K: "userAndReferentCount";
    P: { userCount: number; referentCount: number };
}>()({ DetailUsersAndReferents });
