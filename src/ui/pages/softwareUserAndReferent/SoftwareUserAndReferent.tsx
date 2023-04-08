import { useEffect, useState } from "react";
import { routes, session } from "ui/routes";
import { selectors, useCoreState, useCoreFunctions } from "core";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { ActionsFooter } from "ui/shared/ActionsFooter";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { assert } from "tsafe/assert";
import type { PageRoute } from "./route";
import softwareLogoPlaceholder from "ui/assets/software_logo_placeholder.png";

export type Props = {
    className?: string;
    route: PageRoute;
};

export default function SoftwareUserAndReferent(props: Props) {
    const { route } = props;

    const { softwareDetails, softwareUserAndReferent } = useCoreFunctions();

    useEffect(() => {
        softwareUserAndReferent.initialize({ "softwareName": route.params.name });

        return () => {
            softwareUserAndReferent.clear();
        };
    }, [route.params.name]);

    useEffect(() => {
        softwareDetails.initialize({
            "softwareName": route.params.name
        });

        return () => softwareDetails.clear();
    }, [route.params.name]);

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ SoftwareUserAndReferent });
    const { software } = useCoreState(selectors.softwareDetails.software);

    const [activeMenu, setActiveMenu] = useState(0);

    const { isReady } = useCoreState(selectors.softwareUserAndReferent.isReady);
    const { users } = useCoreState(selectors.softwareUserAndReferent.users);
    const { referents } = useCoreState(selectors.softwareUserAndReferent.referents);
    const { logoUrl } = useCoreState(selectors.softwareUserAndReferent.logoUrl);

    if (!isReady) {
        return null;
    }

    assert(users !== undefined);
    assert(referents !== undefined);

    if (software === undefined) {
        return null;
    }

    const MenuTabs = [
        {
            "id": 0,
            "label": `${t("tab referent title")} (${referents.length})`
        },
        {
            "id": 1,
            "label": `${t("tab user title")} (${users.length})`
        }
    ];

    const onChangeTabMenu = (id: number) => {
        setActiveMenu(id);
    };

    const contentItems = activeMenu === 0 ? referents : users;

    return (
        <div>
            <div className={fr.cx("fr-container")}>
                <Breadcrumb
                    segments={[
                        {
                            linkProps: {
                                href: "#"
                            },
                            label: t("catalog breadcrumb")
                        },
                        {
                            linkProps: {
                                href: "#"
                            },
                            label: software.softwareName
                        }
                    ]}
                    currentPageLabel={t("user and referent breadcrumb")}
                    className={classes.breadcrumb}
                />
                <div className={classes.header}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                        href={"#"}
                        onClick={() => session.back()}
                        className={classes.backButton}
                    >
                        <i className={fr.cx("fr-icon-arrow-left-s-line")} />
                    </a>
                    <h4 className={classes.title}>{t("title")}</h4>
                </div>
                <div className={classes.main}>
                    <nav
                        className={cx(fr.cx("fr-sidemenu"), classes.sidemenu)}
                        aria-labelledby="fr-sidemenu-title"
                    >
                        <div className={fr.cx("fr-sidemenu__inner")}>
                            <button
                                className={fr.cx("fr-sidemenu__btn")}
                                hidden
                                aria-controls="fr-sidemenu-wrapper"
                                aria-expanded="false"
                            >
                                {t("category")} (
                                {activeMenu === 0
                                    ? t("tab referent title")
                                    : t("tab user title")}
                                )
                            </button>
                            <div
                                className={fr.cx("fr-collapse")}
                                id="fr-sidemenu-wrapper"
                            >
                                <div
                                    className={cx(
                                        fr.cx("fr-sidemenu__title"),
                                        classes.sidemenuTitle
                                    )}
                                    id="fr-sidemenu-title"
                                >
                                    <div className={classes.logoWrapper}>
                                        <img
                                            className={classes.logo}
                                            src={logoUrl ?? softwareLogoPlaceholder}
                                            alt="Logo du logiciel"
                                        />
                                    </div>
                                    {software.softwareName}
                                </div>
                                <ul className={fr.cx("fr-sidemenu__list")}>
                                    {MenuTabs.map(tab => {
                                        const ariaCurrent =
                                            tab.id === activeMenu
                                                ? {
                                                      "aria-current": "step" as const
                                                  }
                                                : {
                                                      "aria-current": undefined
                                                  };

                                        return (
                                            <li
                                                className={cx(
                                                    fr.cx("fr-sidemenu__item"),
                                                    {
                                                        "fr-sidemenu__item--active":
                                                            tab.id === activeMenu
                                                    }
                                                )}
                                                key={tab.id}
                                            >
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a
                                                    className={fr.cx("fr-sidemenu__link")}
                                                    href="#"
                                                    target="_self"
                                                    {...ariaCurrent}
                                                    onClick={() =>
                                                        onChangeTabMenu(tab.id)
                                                    }
                                                >
                                                    {tab.label}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className={classes.contentMenuTab}>
                        <ul>
                            {contentItems?.map(user => {
                                return (
                                    <li key={user.organization}>
                                        <a href={user.serviceUrl}>{user.organization}</a>
                                        {user.serviceUrl && (
                                            <span>({user.serviceUrl})</span>
                                        )}
                                        <p> {user.usecaseDescription} </p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <ActionsFooter className={classes.container}>
                <Button
                    iconId="fr-icon-eye-line"
                    priority="secondary"
                    className={classes.softwareDetails}
                    {...routes.softwareDetails({ name: software.softwareName }).link}
                >
                    {t("softwareDetails")}
                </Button>
                <Button
                    priority="primary"
                    linkProps={
                        routes.declarationForm({
                            "name": route.params.name
                        }).link
                    }
                >
                    {activeMenu === 0 ? t("declare user") : t("declare referent")}
                </Button>
            </ActionsFooter>
        </div>
    );
}

const useStyles = makeStyles({
    "name": { SoftwareUserAndReferent }
})(() => ({
    "breadcrumb": {
        "marginBottom": fr.spacing("4v")
    },
    "header": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("10v")
    },
    "backButton": {
        "background": "none",
        "marginRight": fr.spacing("4v"),

        "&>i": {
            "&::before": {
                "--icon-size": fr.spacing("8v")
            }
        }
    },
    "title": {
        "marginBottom": 0
    },
    "main": {
        "display": "flex",
        [fr.breakpoints.down("md")]: {
            "flexDirection": "column"
        }
    },
    "sidemenu": {
        "flex": 1
    },
    "sidemenuTitle": {
        "display": "flex",
        "alignItems": "center"
    },
    "logoWrapper": {
        "height": fr.spacing("10v"),
        "width": fr.spacing("10v"),
        "minWidth": fr.spacing("10v"),
        "marginRight": fr.spacing("2v"),
        "overflow": "hidden",
        [fr.breakpoints.down("md")]: {
            "height": fr.spacing("5v"),
            "width": fr.spacing("5v")
        }
    },
    "logo": {
        "height": "100%"
    },
    "contentMenuTab": {
        "flex": 2
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
    | "catalog breadcrumb"
    | "user and referent breadcrumb"
    | "title"
    | "tab user title"
    | "tab referent title"
    | "category"
    | "softwareDetails"
    | "declare referent"
    | "declare user"
>()({ SoftwareUserAndReferent });
