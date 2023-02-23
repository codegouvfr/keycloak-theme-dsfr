import React, { memo, MouseEvent, useState } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { Header as HeaderDS } from "@codegouvfr/react-dsfr/Header";
import { routes } from "../../routes";
import type { Link } from "type-route";
import { Route } from "type-route";
import { HeaderProps } from "@codegouvfr/react-dsfr/src/Header";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
    className?: string;
    routeName: keyof typeof routes | false;
    authentication:
        | {
              isUserLoggedIn: true;
              myAccountLink: Link;
          }
        | {
              isUserLoggedIn: false;
              login: () => Promise<never>;
          };
};

export const Header = memo((props: Props) => {
    const { className, routeName, authentication, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ Header });

    console.log("render header");

    return (
        <HeaderDS
            className={className}
            brandTop={t("brand")}
            serviceTitle={t("title")}
            homeLinkProps={{
                ...routes.home().link,
                "title": t("home title")
            }}
            quickAccessItems={[
                {
                    "iconId": "fr-icon-bank-fill",
                    "linkProps": {
                        href: "https://code.gouv.fr/"
                    },
                    "text": "Code Gouv"
                },
                {
                    "iconId": "fr-icon-play-circle-fill",
                    "linkProps": {
                        "href": "#"
                    },
                    "text": t("quick access test")
                },
                {
                    "iconId": "fr-icon-account-fill",
                    ...(authentication.isUserLoggedIn
                        ? {
                              "linkProps": {
                                  "className": "fr-btn--tertiary",
                                  ...authentication.myAccountLink
                              }
                          }
                        : {
                              "buttonProps": {
                                  "className": "fr-btn--tertiary",
                                  "onClick": authentication.login
                              }
                          }),
                    "text": authentication.isUserLoggedIn
                        ? t("quick access account")
                        : t("quick access connect")
                },
                {
                    ...(<languageSelector />)
                }
            ]}
            navigation={[
                {
                    "isActive": routeName === routes.home.name,
                    "linkProps": routes.home().link,
                    "text": t("navigation welcome")
                },
                {
                    "isActive": routeName === routes.softwareCatalog.name,
                    "linkProps": routes.softwareCatalog().link,
                    "text": t("navigation catalog")
                },
                {
                    "isActive": routeName === routes.addSoftwareLanding.name,
                    "linkProps": routes.addSoftwareLanding().link,
                    "text": t("navigation add software")
                },
                {
                    "linkProps": {
                        "href": "#",
                        "target": "_self"
                    },
                    "text": t("navigation support request")
                },
                {
                    "linkProps": {
                        "href": "#",
                        "target": "_self"
                    },
                    "text": t("navigation about")
                }
            ]}
        />
    );
});

const useStyles = makeStyles()(() => ({
    "menuLanguage": {
        "right": 0
    }
}));

export const { i18n } = declareComponentKeys<
    | "brand"
    | "home title"
    | "title"
    | "navigation welcome"
    | "navigation catalog"
    | "navigation add software"
    | "navigation support request"
    | "navigation about"
    | "quick access test"
    | "quick access connect"
    | "quick access account"
>()({ Header });

//export const ActionsFooter = memo((props: Props) => {

export const languageSelector = (): HeaderProps.QuickAccessItem.Button => {
    return {
        "buttonProps": {
            "aria-controls": "translate-select",
            "aria-expanded": false,
            "title": "Sélectionner une langue",
            "className": "fr-btn--tertiary fr-translate fr-nav"
        },
        "iconId": "fr-icon-translate-2",
        "text": (() => {
            const { cx, classes } = useStyles();

            const [selectedLanguage, setSelectedLanguage] = useState("fr");

            const languageOptions = [
                {
                    "hrefLang": "fr",
                    "lang": "fr",
                    "langShort": "FR",
                    "langFull": "Français"
                },
                {
                    "hrefLang": "en",
                    "lang": "en",
                    "langShort": "EN",
                    "langFull": "English"
                }
            ];

            const onChangeLanguage = (e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setSelectedLanguage(
                    e.currentTarget.attributes.getNamedItem("lang")?.value ?? "fr"
                );
            };

            const ActiveLanguage = () => {
                const findActiveLanguage = languageOptions.find(
                    language => language.lang === selectedLanguage
                ) ?? {
                    "hrefLang": "fr",
                    "lang": "fr",
                    "langShort": "FR",
                    "langFull": "Français"
                };

                return (
                    <>
                        {" "}
                        {findActiveLanguage.langShort}
                        <span className={fr.cx("fr-hidden-lg")}>
                            {" "}
                            - {findActiveLanguage.langFull}
                        </span>{" "}
                    </>
                );
            };

            function Text() {
                return (
                    <>
                        <div>
                            <ActiveLanguage />
                        </div>
                        <div
                            className={cx(
                                fr.cx("fr-collapse", "fr-menu"),
                                classes.menuLanguage
                            )}
                            id="translate-select"
                        >
                            <ul className={fr.cx("fr-menu__list")}>
                                {languageOptions.map(language => (
                                    <li key={language.lang}>
                                        <a
                                            className={fr.cx(
                                                "fr-translate__language",
                                                "fr-nav__link"
                                            )}
                                            hrefLang={language.hrefLang}
                                            lang={language.lang}
                                            href="#"
                                            aria-current={
                                                language.lang === selectedLanguage
                                                    ? "true"
                                                    : "false"
                                            }
                                            onClick={onChangeLanguage}
                                        >
                                            {language.langShort} - {language.langFull}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                );
            }

            return <Text />;
        })()
    };
};
