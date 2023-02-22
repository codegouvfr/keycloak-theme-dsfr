import React, { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../../i18n";
import { Header as HeaderDS } from "@codegouvfr/react-dsfr/Header";
import { routes } from "../../routes";
import { Route } from "type-route";

export type Props = {
    className?: string;
    isUserLoggedIn: boolean;
    route: Route<any>;
};

export const Header = memo((props: Props) => {
    const { className, isUserLoggedIn, route, ...rest } = props;

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
                    "linkProps": {
                        "href": "#",
                        "className": "fr-btn--tertiary"
                    },
                    "text": isUserLoggedIn
                        ? t("quick access account")
                        : t("quick access connect")
                }
            ]}
            navigation={[
                {
                    "isActive": route.name === routes.home.name,
                    "linkProps": {
                        ...routes.home().link
                    },
                    "text": t("navigation welcome")
                },
                {
                    "isActive": route.name === routes.softwareCatalog.name,
                    "linkProps": {
                        ...routes.softwareCatalog().link
                    },
                    "text": t("navigation catalog")
                },
                {
                    "isActive": route.name === routes.addSoftwareLanding.name,
                    "linkProps": {
                        ...routes.addSoftwareLanding().link
                    },
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
