import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation, useResolveLocalizedString } from "ui-dsfr/i18n";
import { CompiledData } from "sill-api";
import type { Link } from "type-route";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr, getColors } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { shortEndMonthDate } from "ui-dsfr/useMoment";

/*export type Props2 = {
    className?: string;
    software: string;
    softwareDescription: string;
    userCount: number;
    referentCount: number;
    testPlatformLink: Link;
    isFromFrench: bolean;
}*/

export type Props = {
    className?: string;
    software: CompiledData.Software;
    declareUserOrReferent: Link;
    editLink: Link;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    parentSoftware:
        | {
              name: string;
              link: Link | undefined;
          }
        | undefined;
    onDeclareReferentAnswer: (params: {
        isExpert: boolean;
        useCaseDescription: string;
        isPersonalUse: boolean;
    }) => void;
    onUserNoLongerReferent: () => void;
    onLogin: () => void;
    onTagClick: (tag: string) => void;
};

export const CatalogCard = memo((props: Props) => {
    const { className, software, declareUserOrReferent } = props;

    const { t } = useTranslation({ CatalogCard });
    const { resolveLocalizedString } = useResolveLocalizedString();
    const { classes } = useStyles();

    return (
        <div className={cx(fr.cx("fr-card"), classes.container, className)}>
            <div className={cx()}>
                <div className={cx()}>
                    <div className={cx(classes.headerContainer)}>
                        <img
                            className={cx(classes.logo)}
                            src={software.wikidataData?.logoUrl}
                            alt=""
                        />
                        <div className={cx(classes.header)}>
                            <div className={cx(classes.titleContainer)}>
                                <h3 className={cx(classes.title)}>{software.name}</h3>
                                <div className={cx(classes.titleActionsContainer)}>
                                    <i className={fr.cx("fr-icon-computer-line")} />
                                    {software.isFromFrenchPublicService && (
                                        <i className={fr.cx("fr-icon-france-line")} />
                                    )}
                                    <i className={fr.cx("fr-icon-questionnaire-line")} />
                                </div>
                            </div>
                            <div>
                                <p className={cx(fr.cx("fr-card__detail"))}>
                                    {t("last version")} :
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
                                        {software.versionMin}
                                    </span>
                                    {t("last version date", {
                                        date: shortEndMonthDate({
                                            time: new Date().getTime(),
                                        }),
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className={cx(fr.cx("fr-card__desc"), classes.description)}>
                        {software.wikidataData?.description
                            ? resolveLocalizedString(software.wikidataData.description)
                            : software.function}
                    </p>
                    <div
                        className={cx(
                            fr.cx("fr-card__detail"),
                            classes.detailsUsersContainer,
                        )}
                    >
                        <i
                            className={cx(
                                fr.cx("fr-icon-user-line"),
                                classes.detailsUsersIcon,
                            )}
                        />
                        <span>
                            {t("userAndReferentCount", {
                                referentCount: software.referentCount ?? 0,
                                userCount: 0,
                            })}
                        </span>
                        <i className={cx(fr.cx("fr-icon-arrow-right-s-line"))} />
                    </div>
                </div>
                <div className={cx(classes.footer)}>
                    <a
                        className={cx(fr.cx("fr-btn", "fr-btn--secondary"))}
                        {...declareUserOrReferent}
                    >
                        {t("declare oneself referent")}
                    </a>
                    <div className={cx(classes.footerActionsContainer)}>
                        <i className={fr.cx("fr-icon-play-circle-line")} />
                        <i className={fr.cx("fr-icon-arrow-right-line")} />
                    </div>
                </div>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { CatalogCard },
})(theme => {
    return {
        "container": {
            "paddingRight": fr.spacing("6v"),
            paddingLeft: fr.spacing("6v"),
            paddingTop: fr.spacing("7v"),
            paddingBottom: fr.spacing("7v"),
            backgroundColor: getColors(theme.isDark).decisions.background.default.grey
                .default,
        },
        "headerContainer": {
            display: "flex",
            alignItems: "center",
            marginBottom: fr.spacing("4v"),
        },
        "header": {
            width: "100%",
        },
        "logo": {
            height: fr.spacing("10v"),
            width: fr.spacing("10v"),
            marginRight: fr.spacing("3v"),
        },
        "titleContainer": {
            display: "flex",
            justifyContent: "space-between",
        },
        "title": {
            margin: 0,
            color: theme.decisions.text.title.grey.default,
        },
        "titleActionsContainer": {
            display: "flex",
            alignItems: "center",
            gap: fr.spacing("2v"),

            "&>i": {
                color: theme.decisions.text.title.blueFrance.default,
                "&::before": {
                    "--icon-size": fr.spacing("4v"),
                },
            },
        },
        "badgeVersion": {
            marginLeft: fr.spacing("1v"),
            marginRight: fr.spacing("1v"),
        },
        "description": {
            marginTop: 0,
            marginBottom: fr.spacing("3v"),
            color: getColors(theme.isDark).decisions.text.default.grey.default,
        },
        "detailsUsersContainer": {
            display: "flex",
            alignItems: "center",
            marginBottom: fr.spacing("8v"),
        },
        "detailsUsersIcon": {
            marginRight: fr.spacing("2v"),
        },
        "footer": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        "footerActionsContainer": {
            display: "flex",
            gap: fr.spacing("4v"),
            color: getColors(theme.isDark).decisions.text.title.blueFrance.default,
        },
    };
});

export const { i18n } = declareComponentKeys<
    | {
          K: "parent software";
          P: { name: string; link: Link | undefined };
          R: JSX.Element;
      }
    | { K: "you are referent"; P: { isOnlyReferent: boolean } }
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | { K: "userAndReferentCount"; P: { userCount: number; referentCount: number } }
    | "declare oneself referent"
    | "this software has no referent"
    | "no longer referent"
    | "to install on the computer of the agent"
    | { K: "authors"; P: { doUsePlural: boolean } }
    | { K: "show referents"; P: { isUserReferent: boolean; referentCount: number } }
>()({ CatalogCard });
