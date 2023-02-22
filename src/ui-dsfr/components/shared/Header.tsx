import { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { Header as HeaderDS } from "@codegouvfr/react-dsfr/Header";
import { routes } from "../../routes";
import type { Link } from "type-route";

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
    | "quick access connect"
    | "quick access account"
>()({ Header });
