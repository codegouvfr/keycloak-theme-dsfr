import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { shortEndMonthDate, monthDate } from "ui-dsfr/useMoment";
import Tooltip from "@mui/material/Tooltip";
import type { Props as CatalogCardProps } from "./CatalogCards/CatalogCard";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";

export type Props = {
    className?: string;
    softwareLogoUrl?: string;
    softwareName: string;
    isFromFrenchPublicService: boolean;
    isDesktop: boolean;
    isPresentInSupportMarket: boolean;
    isRGAACompliant: boolean;
    softwareCurrentVersion: string;
    softwareDateCurrentVersion: number;
    registerDate: number;
    userCount: number;
    referentCount: number;
    seeUserAndReferent: Link;
    declareUserOrReferent: Link;
    authors: Link[];
    minimalVersionRequired: string;
    license: string;
    serviceProvider: Link;
    comptoireDuLibreSheet: Link;
    wikiDataSheet: Link;
    officialWebsite: Link;
    sourceCodeRepository: Link;
    referencedInstances: number;
    alikeSoftware: CatalogCardProps[];
};

export const DetailCard = memo((props: Props) => {
    const {
        className,
        softwareCurrentVersion,
        softwareDateCurrentVersion,
        minimalVersionRequired,
        registerDate,
        license,
        serviceProvider,
        isDesktop,
        isPresentInSupportMarket,
        isFromFrenchPublicService,
        isRGAACompliant,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    //assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ DetailCard });

    const prerogativesList = [
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

    const previewTab = (
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
                {prerogativesList.map(prerogative => {
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
                    {...serviceProvider}
                    target="_blank"
                    title={t("comptoire du libre sheet")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("comptoire du libre sheet")}
                </a>
                <a
                    {...serviceProvider}
                    target="_blank"
                    title={t("wikiData sheet")}
                    className={cx(classes.externalLink, classes.item)}
                >
                    {t("wikiData sheet")}
                </a>
            </div>
        </div>
    );

    return (
        <div className={cx(classes.root, className)}>
            <Tabs
                tabs={[
                    { "label": t("tab title overview"), "content": previewTab },
                    {
                        "label": t("tab title instance", { instanceCount: 2 }),
                        "content": <p>Content of tab2</p>,
                    },
                    {
                        "label": t("tab title alike software", { alikeSoftwareCount: 1 }),
                        "content": <p>Content of tab2</p>,
                    },
                ]}
            />
        </div>
    );
});

const useStyles = makeStyles({
    "name": { DetailCard },
})(theme => ({
    "root": {},
    "tabContainer": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("4v"),
        "rowGap": fr.spacing("3v"),
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
    | "tab title overview"
    | { K: "tab title instance"; P: { instanceCount: number } }
    | { K: "tab title alike software"; P: { alikeSoftwareCount: number } }
    | "about"
    | "use full links"
    | "prerogatives"
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | "register"
    | { K: "register date"; P: { date: string } }
    | "minimal version"
    | "license"
    | { K: "userAndReferentCount"; P: { userCount: number; referentCount: number } }
    | "declare oneself referent"
    | "isDesktop"
    | "isPresentInSupportMarket"
    | "isFromFrenchPublicService"
    | "isRGAACompliant"
    | "service provider"
    | "comptoire du libre sheet"
    | "wikiData sheet"
>()({ DetailCard });
