import { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { Header as HeaderDsfr } from "@codegouvfr/react-dsfr/Header";
import { routes } from "ui/routes";
import { LanguageSelector } from "./LanguageSelector";
import type { Language } from "ui/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { contactEmail } from "ui/shared/contactEmail";

type Props = {
    className?: string;
    routeName: keyof typeof routes | false;
    userAuthenticationApi:
        | {
              isUserLoggedIn: true;
              logout: () => void;
          }
        | {
              isUserLoggedIn: false;
              login: () => Promise<never>;
          };
    i18nApi: {
        lang: Language;
        setLang: (lang: Language) => void;
    };
};

export const brandTop = (
    <>
        République <br /> Française
    </>
);

export const Header = memo((props: Props) => {
    const { className, routeName, userAuthenticationApi, i18nApi, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ Header });

    const { classes, cx } = useStyles({ "isOnPageMyAccount": routeName === "account" });

    return (
        <HeaderDsfr
            className={className}
            brandTop={brandTop}
            serviceTitle={t("title")}
            homeLinkProps={{
                ...routes.home().link,
                "title": t("home title")
            }}
            quickAccessItems={[
                {
                    "iconId": "fr-icon-bank-fill",
                    "linkProps": {
                        "href": "https://code.gouv.fr/"
                    },
                    "text": "Code Gouv"
                },
                /*
                {
                    "iconId": "fr-icon-play-circle-fill",
                    "linkProps": {
                        "href": "#"
                    },
                    "text": t("quick access test")
                },
                */
                {
                    "iconId": "fr-icon-lock-line",
                    ...(userAuthenticationApi.isUserLoggedIn
                        ? {
                              "linkProps": {
                                  "onClick": userAuthenticationApi.logout,
                                  "href": "#"
                              }
                          }
                        : {
                              "buttonProps": {
                                  "onClick": userAuthenticationApi.login
                              }
                          }),
                    "text": userAuthenticationApi.isUserLoggedIn
                        ? t("quick access logout")
                        : t("quick access login")
                },
                ...(!userAuthenticationApi.isUserLoggedIn
                    ? []
                    : [
                          {
                              "iconId": "fr-icon-account-fill",
                              "linkProps": {
                                  "className": cx(
                                      fr.cx("fr-btn--tertiary"),
                                      classes.myAccountButton
                                  ),
                                  ...routes.account().link
                              },
                              "text": t("quick access account")
                          } as const
                      ]),
                {
                    "buttonProps": {
                        "aria-controls": "translate-select",
                        "aria-expanded": false,
                        "title": t("select language"),
                        "className": fr.cx("fr-btn--tertiary", "fr-translate", "fr-nav")
                    },
                    "iconId": "fr-icon-translate-2",
                    "text": (
                        <LanguageSelector lang={i18nApi.lang} setLang={i18nApi.setLang} />
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
                        "href": `mailto:${contactEmail}?subject=${encodeURIComponent(
                            "Demande d'accompagnement"
                        )}`
                    },
                    "text": t("navigation support request")
                },
                {
                    "isActive": routeName === routes.readme.name,
                    "linkProps": routes.readme().link,
                    "text": t("navigation about")
                }
            ]}
        />
    );
});

const useStyles = makeStyles<{ isOnPageMyAccount: boolean }>()(
    (theme, { isOnPageMyAccount }) => ({
        "myAccountButton": {
            "&&": {
                "backgroundColor": !isOnPageMyAccount
                    ? undefined
                    : theme.decisions.background.default.grey.hover
            }
        }
    })
);

export const { i18n } = declareComponentKeys<
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
