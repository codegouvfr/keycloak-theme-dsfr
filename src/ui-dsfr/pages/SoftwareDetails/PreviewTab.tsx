import React from "react";
import { declareComponentKeys } from "i18nifty";
import { useLang, useTranslation } from "ui-dsfr/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { shortEndMonthDate, monthDate } from "ui-dsfr/useMoment";
import Tooltip from "@mui/material/Tooltip";

export type Props = {
    className?: string;
    softwareCurrentVersion?: string;
    softwareDateCurrentVersion?: number;
    registerDate?: number;
    minimalVersionRequired?: string;
    license?: string;
    serviceProvider?: string;
    comptoireDuLibreSheet?: string;
    wikiDataSheet?: string;
    isDesktop?: boolean;
    isPresentInSupportMarket?: boolean;
    isFromFrenchPublicService?: boolean;
    isRGAACompliant?: boolean;
};
export const PreviewTab = (props: Props) => {
    const {
        softwareCurrentVersion,
        softwareDateCurrentVersion,
        registerDate,
        minimalVersionRequired,
        license,
        isDesktop,
        isPresentInSupportMarket,
        isFromFrenchPublicService,
        isRGAACompliant,
        serviceProvider,
        comptoireDuLibreSheet,
        wikiDataSheet
    } = props;

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ PreviewTab });
    const { lang } = useLang();

    const prerogativeList = [
        {
            "label": t("isDesktop"),
            "status": isDesktop
        },
        {
            "label": t("isPresentInSupportMarket"),
            "status": isPresentInSupportMarket
        },
        {
            "label": t("isFromFrenchPublicService"),
            "status": isFromFrenchPublicService
        },
        {
            "label": t("isRGAACompliant"),
            "status": isRGAACompliant
        }
    ];

    return (
        <section className={classes.tabContainer}>
            <div className="section">
                <p className={cx(fr.cx("fr-text--bold"), classes.item)}>{t("about")}</p>
                {softwareDateCurrentVersion && (
                    <p className={cx(fr.cx("fr-text--regular"), classes.item)}>
                        <span className={classes.labelDetail}>{t("last version")}</span>
                        <span
                            className={cx(
                                fr.cx(
                                    "fr-badge",
                                    "fr-badge--yellow-tournesol",
                                    "fr-badge--sm"
                                ),
                                classes.badgeVersion
                            )}
                        >
                            {softwareCurrentVersion}
                        </span>
                        {t("last version date", {
                            date: shortEndMonthDate({
                                "time": softwareDateCurrentVersion,
                                lang
                            })
                        })}
                    </p>
                )}
                {registerDate && (
                    <p className={cx(fr.cx("fr-text--regular"), classes.item)}>
                        <span className={classes.labelDetail}>{t("register")}</span>
                        {t("register date", {
                            date: monthDate({ "time": registerDate, lang })
                        })}
                    </p>
                )}

                <p className={cx(fr.cx("fr-text--regular"), classes.item)}>
                    <span className={classes.labelDetail}>{t("minimal version")}</span>
                    <span>{minimalVersionRequired}</span>
                </p>
                <p className={cx(fr.cx("fr-text--regular"), classes.item)}>
                    <span className={classes.labelDetail}>{t("license")}</span>
                    <span>{license}</span>
                </p>
            </div>
            <div className={classes.section}>
                <p className={cx(fr.cx("fr-text--bold"), classes.item)}>
                    {t("prerogatives")}
                </p>
                {prerogativeList.map(prerogative => {
                    const { label, status } = prerogative;
                    return (
                        <div
                            key={prerogative.label}
                            className={cx(classes.item, classes.prerogativeItem)}
                        >
                            <i
                                className={cx(
                                    fr.cx(
                                        status
                                            ? "fr-icon-check-line"
                                            : "fr-icon-close-line"
                                    ),
                                    status
                                        ? classes.prerogativeStatusSuccess
                                        : classes.prerogativeStatusError
                                )}
                            />
                            <p
                                className={cx(
                                    fr.cx("fr-text--md"),
                                    classes.prerogativeItemDetail
                                )}
                            >
                                {label}
                            </p>
                            <Tooltip title={"tooltip"} arrow>
                                <i className={fr.cx("fr-icon-information-line")} />
                            </Tooltip>
                        </div>
                    );
                })}
            </div>
            <div className={classes.section}>
                <p className={cx(fr.cx("fr-text--bold"), classes.item)}>
                    {t("use full links")}
                </p>
                <a
                    href={serviceProvider}
                    target="_blank"
                    rel="noreferrer"
                    title={t("service provider")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("service provider")}
                </a>
                <a
                    href={comptoireDuLibreSheet}
                    target="_blank"
                    rel="noreferrer"
                    title={t("comptoire du libre sheet")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("comptoire du libre sheet")}
                </a>
                <a
                    href={wikiDataSheet}
                    target="_blank"
                    rel="noreferrer"
                    title={t("wikiData sheet")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("wikiData sheet")}
                </a>
            </div>
        </section>
    );
};

const useStyles = makeStyles({
    "name": { PreviewTab }
})(theme => ({
    "tabContainer": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("4v"),
        "rowGap": fr.spacing("3v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    },
    "section": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "flex-start"
    },
    "item": {
        "&:not(:last-of-type)": {
            "marginBottom": fr.spacing("4v")
        }
    },
    "prerogativeItem": {
        "display": "flex",
        "alignItems": "center"
    },
    "prerogativeItemDetail": {
        "color": theme.decisions.text.label.grey.default,
        ...fr.spacing("margin", {
            "left": "3v",
            "right": "1v",
            "bottom": 0
        })
    },
    "prerogativeStatusSuccess": {
        "color": theme.decisions.text.default.success.default
    },
    "prerogativeStatusError": {
        "color": theme.decisions.text.default.error.default
    },
    "labelDetail": {
        "color": theme.decisions.text.mention.grey.default
    },
    "badgeVersion": {
        ...fr.spacing("margin", { rightLeft: "2v" })
    },
    "externalLink": {
        "color": theme.decisions.text.actionHigh.blueFrance.default
    }
}));

export const { i18n } = declareComponentKeys<
    | "about"
    | "use full links"
    | "prerogatives"
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | "register"
    | { K: "register date"; P: { date: string } }
    | "minimal version"
    | "license"
    | "isDesktop"
    | "isPresentInSupportMarket"
    | "isFromFrenchPublicService"
    | "isRGAACompliant"
    | "service provider"
    | "comptoire du libre sheet"
    | "wikiData sheet"
>()({ PreviewTab });
