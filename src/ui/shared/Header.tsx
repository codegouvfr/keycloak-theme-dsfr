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
};

export const brandTop = (
    /* cSpell:disable */
    <>
        République <br /> Française
    </>
    /* cSpell:enable */
);

export const Header = memo((props: Props) => {
    const { className, routeName, userAuthenticationApi, ...rest } = props;

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
                      ])
            ]}
            navigation={[
                {
                    "isActive": routeName === routes.home.name,
                    "linkProps": routes.home().link,
                    "text": t("navigation welcome")
                },
                {
                    "isActive":
                        routeName === routes.softwareCatalog.name ||
                        routeName === routes.softwareDetails.name,
                    "linkProps": routes.softwareCatalog().link,
                    "text": t("navigation catalog")
                },
                {
                    "isActive":
                        routeName === routes.addSoftwareLanding.name ||
                        routeName === routes.softwareUpdateForm.name ||
                        routeName === routes.softwareCreationForm.name,
                    "linkProps": routes.addSoftwareLanding().link,
                    "text": t("navigation add software")
                },
                {
                    "isActive": routeName === routes.readme.name,
                    "linkProps": routes.readme().link,
                    "text": t("navigation about")
                },
                {
                    "linkProps": {
                        "target": "_blank",
                        /* cSpell:disable */
                        "href": `mailto:${contactEmail}?subject=${encodeURIComponent(
                            "Demande d'accompagnement"
                        )}`
                        /* cSpell:enable */
                    },
                    "text": t("navigation support request")
                }
            ]}
        />
    );
});

const useStyles = makeStyles<{ isOnPageMyAccount: boolean }>({ "name": { Header } })(
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
