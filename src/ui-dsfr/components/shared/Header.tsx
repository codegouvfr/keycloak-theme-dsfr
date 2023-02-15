import React, { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../../i18n";
import { Header as HeaderDS } from "@codegouvfr/react-dsfr/Header";
import { routes } from "../../routes";

export type Props = {
    className?: string;
    isUserLoggedIn: boolean;
};

export const Header = memo((props: Props) => {
    const { className, isUserLoggedIn, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ Header });

    return (
        <HeaderDS
            className={className}
            brandTop={t("brand")}
            serviceTitle={t("title")}
            homeLinkProps={{
                href: routes.home().link.href,
                title: t("home title")
            }}
            quickAccessItems={[
                {
                    iconId: "fr-icon-bank-fill",
                    linkProps: {
                        href: "https://code.gouv.fr/"
                    },
                    text: "Code Gouv"
                },
                {
                    iconId: "fr-icon-play-circle-fill",
                    linkProps: {
                        href: "#"
                    },
                    text: t("quick access test")
                },
                {
                    iconId: "fr-icon-account-fill",
                    linkProps: {
                        href: "#",
                        className: "fr-btn--tertiary"
                    },
                    text: isUserLoggedIn
                        ? t("quick access account")
                        : t("quick access connect")
                }
            ]}
            navigation={[
                {
                    linkProps: {
                        href: "https://code.gouv.fr/",
                        target: "_self"
                    },
                    text: t("navigation welcome")
                },
                {
                    isActive: true,
                    linkProps: {
                        href: "#",
                        target: "_self"
                    },
                    text: t("navigation catalog")
                },
                {
                    linkProps: {
                        href: "#",
                        target: "_self"
                    },
                    text: t("navigation add software")
                },
                {
                    linkProps: {
                        href: "#",
                        target: "_self"
                    },
                    text: t("navigation support request")
                },
                {
                    linkProps: {
                        href: "#",
                        target: "_self"
                    },
                    text: t("navigation about")
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
