import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { shortEndMonthDate, monthDate } from "ui-dsfr/useMoment";
import Tooltip from "@mui/material/Tooltip";

export type Prerogative = {
    label: string;
    status: boolean;
};

export type Props = {
    className?: string;
    softwareCurrentVersion: string;
    softwareDateCurrentVersion: number;
    registerDate: number;
    minimalVersionRequired: string;
    license: string;
    serviceProvider: Link;
    comptoireDuLibreSheet: Link;
    wikiDataSheet: Link;
    isDesktop: boolean;
    isPresentInSupportMarket: boolean;
    isFromFrenchPublicService: boolean;
    isRGAACompliant: boolean;
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
        wikiDataSheet,
    } = props;

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ PreviewTab });

    const prerogativeList = [
        {
            label: t("isDesktop"),
            status: isDesktop,
        },
        {
            label: t("isPresentInSupportMarket"),
            status: isPresentInSupportMarket,
        },
        {
            label: t("isFromFrenchPublicService"),
            status: isFromFrenchPublicService,
        },
        {
            label: t("isRGAACompliant"),
            status: isRGAACompliant,
        },
    ];

    return (
        <div className={classes.tabContainer}>
            <div className="section">
                <p className={cx(fr.cx("fr-text--bold"), classes.item)}>{t("about")}</p>
                <p className={cx(fr.cx("fr-text--regular"), classes.item)}>
                    <span className={classes.labelDetail}>{t("last version")}</span>
                    <span
                        className={cx(
                            fr.cx(
                                "fr-badge",
                                "fr-badge--yellow-tournesol",
                                "fr-badge--sm",
                            ),
                            classes.badgeVersion,
                        )}
                    >
                        {softwareCurrentVersion}
                    </span>
                    {t("last version date", {
                        date: shortEndMonthDate({
                            time: softwareDateCurrentVersion,
                        }),
                    })}
                </p>
                <p className={cx(fr.cx("fr-text--regular"), classes.item)}>
                    <span className={classes.labelDetail}>{t("register")}</span>
                    <span>
                        {t("register date", { date: monthDate({ time: registerDate }) })}
                    </span>
                </p>

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
                        <div className={cx(classes.item, classes.prerogativeItem)}>
                            <i
                                className={cx(
                                    fr.cx(
                                        status
                                            ? "fr-icon-check-line"
                                            : "fr-icon-close-line",
                                    ),
                                    status
                                        ? classes.prerogativeStatusSuccess
                                        : classes.prerogativeStatusError,
                                )}
                            />
                            <p
                                className={cx(
                                    fr.cx("fr-text--md"),
                                    classes.prerogativeItemDetail,
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
                    {...serviceProvider}
                    target="_blank"
                    title={t("service provider")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("service provider")}
                </a>
                <a
                    {...comptoireDuLibreSheet}
                    target="_blank"
                    title={t("comptoire du libre sheet")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("comptoire du libre sheet")}
                </a>
                <a
                    {...wikiDataSheet}
                    target="_blank"
                    title={t("wikiData sheet")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("wikiData sheet")}
                </a>
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    "name": { PreviewTab },
})(theme => ({
    "tabContainer": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("4v"),
        "rowGap": fr.spacing("3v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
        },
    },
    "section": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "flex-start",
    },
    "item": {
        "&:not(:last-of-type)": {
            "marginBottom": fr.spacing("4v"),
        },
    },
    "prerogativeItem": {
        "display": "flex",
        "alignItems": "center",
    },
    "prerogativeItemDetail": {
        "color": theme.decisions.text.label.grey.default,
        ...fr.spacing("margin", {
            "left": "3v",
            "right": "1v",
            "bottom": 0,
        }),
    },
    "prerogativeStatusSuccess": {
        "color": theme.decisions.text.default.success.default,
    },
    "prerogativeStatusError": {
        "color": theme.decisions.text.default.error.default,
    },
    "labelDetail": {
        "color": theme.decisions.text.mention.grey.default,
    },
    "badgeVersion": {
        ...fr.spacing("margin", { rightLeft: "2v" }),
    },
    "externalLink": {
        "color": theme.decisions.text.actionHigh.blueFrance.default,
    },
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
