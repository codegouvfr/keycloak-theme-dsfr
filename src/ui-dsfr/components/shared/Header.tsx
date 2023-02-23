import React, { memo, MouseEvent, useState } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { Header as HeaderDS } from "@codegouvfr/react-dsfr/Header";
import { routes } from "../../routes";
import { LanguageSelector } from "./LanguageSelector";

export type Props = {
    className?: string;
    routeName: keyof typeof routes | false;
    authentication:
        | {
              isUserLoggedIn: true;
              logout: () => void;
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
    const [selectedLanguage, setSelectedLanguage] = useState("fr");

    const onChangeLanguage = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setSelectedLanguage(
            e.currentTarget.attributes.getNamedItem("lang")?.value ?? "fr"
        );
    };

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
                    "iconId": "fr-icon-lock-line",
                    ...(authentication.isUserLoggedIn
                        ? {
                              "linkProps": {
                                  "onClick": authentication.logout
                              }
                          }
                        : {
                              "buttonProps": {
                                  "onClick": authentication.login
                              }
                          }),
                    "text": authentication.isUserLoggedIn
                        ? t("quick access logout")
                        : t("quick access login")
                },
                {
                    "iconId": "fr-icon-account-fill",
                    "linkProps": {
                        "className": "fr-btn--tertiary",
                        ...routes.account().link
                    },
                    "text": t("quick access account")
                },
                {
                    "buttonProps": {
                        "aria-controls": "translate-select",
                        "aria-expanded": false,
                        "title": t("select language"),
                        "className": "fr-btn--tertiary fr-translate fr-nav"
                    },
                    "iconId": "fr-icon-translate-2",
                    "text": (
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            onChangeLanguage={onChangeLanguage}
                        />
                    )
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
    | "quick access login"
    | "quick access logout"
    | "quick access account"
    | "select language"
>()({ Header });
