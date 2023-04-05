import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation, useResolveLocalizedString, useLang } from "ui/i18n";
import type { Link } from "type-route";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { shortEndMonthDate } from "ui/useMoment";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import Tooltip from "@mui/material/Tooltip";
import { DetailUsersAndReferents } from "ui/shared/DetailUsersAndReferents";
import softwareLogoPlaceholder from "ui/assets/software_logo_placeholder.png";

export type Props = {
    className?: string;
    logoUrl?: string;
    softwareName: string;
    prerogatives: {
        isFromFrenchPublicServices: boolean;
        isInstallableOnUserTerminal: boolean;
        isPresentInSupportContract: boolean;
    };
    lastVersion?: {
        semVer: string;
        publicationTime: number;
    };
    softwareDescription?: string;
    userCount: number;
    referentCount: number;
    softwareUserAndReferent: Link;
    declareForm: Link;
    testUrl?: string;
    softwareDetails: Link;
};

export const SoftwareCatalogCard = memo((props: Props) => {
    const {
        className,
        logoUrl,
        softwareName,
        prerogatives,
        lastVersion,
        softwareDescription,
        userCount,
        referentCount,
        softwareUserAndReferent,
        softwareDetails,
        declareForm,
        testUrl,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ SoftwareCatalogCard });
    const { t: tCommon } = useTranslation({ App: null });
    const { resolveLocalizedString } = useResolveLocalizedString();
    const { classes, cx } = useStyles();
    const { lang } = useLang();

    return (
        <div className={cx(fr.cx("fr-card"), classes.root, className)}>
            <div className={classes.cardBody}>
                <div className={cx(classes.headerContainer)}>
                    <div className={classes.logoWrapper}>
                        <img
                            className={cx(classes.logo)}
                            src={logoUrl ?? softwareLogoPlaceholder}
                            alt="Logo du logiciel"
                        />
                    </div>

                    <div className={cx(classes.header)}>
                        <div className={cx(classes.titleContainer)}>
                            <h3 className={cx(classes.title)}>{softwareName}</h3>
                            <div className={cx(classes.titleActionsContainer)}>
                                {prerogatives.isInstallableOnUserTerminal && (
                                    <Tooltip title={t("isDesktop")} arrow>
                                        <i className={fr.cx("fr-icon-computer-line")} />
                                    </Tooltip>
                                )}
                                {prerogatives.isFromFrenchPublicServices && (
                                    <Tooltip title={t("isFromFrenchPublicService")} arrow>
                                        <i className={fr.cx("fr-icon-france-line")} />
                                    </Tooltip>
                                )}
                                {prerogatives.isPresentInSupportContract && (
                                    <Tooltip title={t("isPresentInSupportMarket")} arrow>
                                        <i
                                            className={fr.cx(
                                                "fr-icon-questionnaire-line"
                                            )}
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div>
                            <p
                                className={cx(
                                    fr.cx("fr-card__detail"),
                                    classes.softwareVersionContainer
                                )}
                            >
                                {t("last version")} :
                                <span
                                    className={cx(
                                        fr.cx(
                                            {
                                                "fr-badge--no-icon":
                                                    lastVersion?.semVer === undefined,
                                                "fr-badge--yellow-tournesol":
                                                    lastVersion?.semVer !== undefined
                                            },
                                            "fr-badge",
                                            "fr-badge--sm"
                                        ),
                                        classes.badgeVersion
                                    )}
                                >
                                    {lastVersion?.semVer ?? tCommon("not provided")}
                                </span>
                                {lastVersion &&
                                    t("last version date", {
                                        date: shortEndMonthDate({
                                            time: lastVersion.publicationTime,
                                            lang
                                        })
                                    })}
                            </p>
                        </div>
                    </div>
                </div>

                <p className={cx(fr.cx("fr-card__desc"), classes.description)}>
                    {softwareDescription
                        ? resolveLocalizedString(softwareDescription)
                        : "software.function"}
                </p>
                <DetailUsersAndReferents
                    seeUserAndReferent={
                        referentCount > 0 || userCount > 0
                            ? softwareUserAndReferent
                            : undefined
                    }
                    referentCount={referentCount}
                    userCount={userCount}
                    className={classes.detailUsersAndReferents}
                />
            </div>
            <div className={cx(classes.footer)}>
                <a
                    className={cx(
                        fr.cx("fr-btn", "fr-btn--secondary", "fr-text--sm"),
                        classes.declareReferentOrUserButton
                    )}
                    {...declareForm}
                >
                    {t("declare oneself referent")}
                </a>
                <div className={cx(classes.footerActionsContainer)}>
                    <a className={cx(classes.footerActionLink)} {...softwareDetails}>
                        <i className={fr.cx("fr-icon-arrow-right-line")} />
                    </a>
                </div>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { SoftwareCatalogCard }
})(theme => ({
    "root": {
        ...fr.spacing("padding", {
            "topBottom": "7v",
            "rightLeft": "6v"
        }),
        "backgroundColor": theme.decisions.background.default.grey.default,
        [fr.breakpoints.down("md")]: {
            ...fr.spacing("padding", {
                "topBottom": "5v",
                "rightLeft": "3v"
            })
        }
    },
    "cardBody": {
        "height": "100%",
        "display": "flex",
        "flexDirection": "column",
        "marginBottom": fr.spacing("8v")
    },
    "headerContainer": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("4v")
    },
    "header": {
        "width": "100%"
    },
    "logoWrapper": {
        "height": fr.spacing("10v"),
        "width": fr.spacing("10v"),
        "minWidth": fr.spacing("10v"),
        "marginRight": fr.spacing("3v"),
        "overflow": "hidden",
        [fr.breakpoints.down("md")]: {
            "height": fr.spacing("5v"),
            "width": fr.spacing("5v")
        }
    },
    "logo": {
        "height": "100%"
    },
    "titleContainer": {
        "display": "flex",
        "justifyContent": "space-between"
    },
    "title": {
        "margin": 0,
        "color": theme.decisions.text.title.grey.default
    },
    "titleActionsContainer": {
        "display": "flex",
        "alignItems": "center",
        "gap": fr.spacing("2v"),
        "&>i": {
            "color": theme.decisions.text.title.blueFrance.default,
            "&::before": {
                "--icon-size": fr.spacing("4v")
            }
        }
    },
    "softwareVersionContainer": {
        [fr.breakpoints.down("md")]: {
            fontSize: fr.spacing("2v")
        }
    },
    "badgeVersion": {
        ...fr.spacing("margin", { rightLeft: "1v" })
    },
    "description": {
        "marginTop": 0,
        "marginBottom": fr.spacing("3v"),
        "color": theme.decisions.text.default.grey.default,
        "overflow": "hidden",
        "display": "-webkit-box",
        "WebkitBoxOrient": "vertical",
        "WebkitLineClamp": "3",
        "whiteSpace": "pre-wrap"
    },
    "detailUsersAndReferents": {
        "order": 4,
        "marginTop": "auto"
    },
    "footer": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between",
        [fr.breakpoints.down("md")]: {
            "flexDirection": "column",
            "justifyContent": "flex-start",
            "alignItems": "flex-start"
        }
    },
    "declareReferentOrUserButton": {
        [fr.breakpoints.down("md")]: {
            "width": "100%",
            "justifyContent": "center"
        }
    },
    "footerActionsContainer": {
        "display": "flex",
        "marginLeft": fr.spacing("4v"),
        "flex": 1,
        "justifyContent": "flex-end",
        "color": theme.decisions.text.title.blueFrance.default,
        [fr.breakpoints.down("md")]: {
            "marginLeft": 0,
            "marginTop": fr.spacing("3v"),
            "gap": fr.spacing("4v"),
            "alignSelf": "end"
        }
    },
    "footerActionLink": {
        "background": "none"
    }
}));

export const { i18n } = declareComponentKeys<
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | "declare oneself referent"
    | "isDesktop"
    | "isPresentInSupportMarket"
    | "isFromFrenchPublicService"
>()({ SoftwareCatalogCard });
