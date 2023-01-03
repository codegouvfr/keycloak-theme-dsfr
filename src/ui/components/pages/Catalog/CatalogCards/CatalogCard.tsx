import { memo } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";

import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { CompiledData } from "sill-api";
import type { Link } from "type-route";
import { useResolveLocalizedString } from "ui/i18n";
import { useLang } from "ui/i18n";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";

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
    const { lang } = useLang();
    const { classes } = useStyles();

    return (
        <div className={cx(fr.cx("fr-card"), className)}>
            <div className={cx(fr.cx("fr-card__body"))}>
                <div className={cx(fr.cx("fr-card__content"))}>
                    <div className={cx(classes.head)}>
                        <img
                            className={cx(classes.logo)}
                            src={software.wikidataData?.logoUrl}
                            alt=""
                        />
                        <div>
                            <div className={cx(classes.title)}>
                                <h3 className={cx(fr.cx("fr-card__title"))}>Titre</h3>
                                <div>
                                    <i className={fr.cx("fr-icon-computer-line")} />
                                    <i className={fr.cx("fr-icon-france-line")} />
                                    <i className={fr.cx("fr-icon-questionnaire-line")} />
                                </div>
                            </div>
                            <div>
                                <p className={cx(fr.cx("fr-card__detail"))}>
                                    Dernière version
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
                                        25.0.2
                                    </span>
                                    en déc. 2022
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className={cx(fr.cx("fr-card__desc"))}>Description</p>
                    <div className={cx(fr.cx("fr-card__end"))}>
                        <p
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
                            <span>13 utilisateurs et 4 référents</span>
                        </p>
                    </div>
                </div>
                <div className={cx(fr.cx("fr-card__footer"), classes.footer)}>
                    <a
                        className={cx(fr.cx("fr-btn", "fr-btn--secondary"))}
                        {...declareUserOrReferent}
                    >
                        Se déclarer référent / utilisateur
                    </a>
                    <i className={fr.cx("fr-icon-play-circle-line")} />
                    <i className={fr.cx("fr-icon-arrow-right-line")} />
                </div>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { CatalogCard },
})(() => ({
    "head": {
        display: "flex",
        alignItems: "center",
    },
    "logo": {
        width: 40,
        height: 40,
        marginRight: fr.spacing("3v"),
    },
    "title": {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
    },
    "badgeVersion": {
        marginLeft: fr.spacing("1v"),
        marginRight: fr.spacing("1v"),
    },
    "detailsUsersContainer": {
        display: "flex",
        alignItems: "center",
    },
    "detailsUsersIcon": {
        marginRight: fr.spacing("2v"),
    },
    "footer": {
        display: "flex",
        alignItems: "center",
    },
}));

export const { i18n } = declareComponentKeys<
    | {
          K: "parent software";
          P: { name: string; link: Link | undefined };
          R: JSX.Element;
      }
    | "learn more"
    | "try it"
    | { K: "you are referent"; P: { isOnlyReferent: boolean } }
    | "declare oneself referent"
    | "this software has no referent"
    | "no longer referent"
    | "to install on the computer of the agent"
    | { K: "authors"; P: { doUsePlural: boolean } }
    | { K: "show referents"; P: { isUserReferent: boolean; referentCount: number } }
>()({ CatalogCard });
