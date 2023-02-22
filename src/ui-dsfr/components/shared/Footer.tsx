import React, { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { Footer as FooterDS } from "@codegouvfr/react-dsfr/Footer";
import { routes } from "../../routes";

export type Props = {
    className?: string;
};

export const Footer = memo((props: Props) => {
    const { className, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ Footer });

    return (
        <FooterDS
            className={className}
            brandTop={t("brand")}
            homeLinkProps={{
                ...routes.home().link,
                title: t("home title")
            }}
            accessibility={"partially compliant"}
            contentDescription={t("description")}
            cookiesManagementLinkProps={{
                href: "#"
            }}
            personalDataLinkProps={{
                href: "#"
            }}
            termsLinkProps={{
                href: "#"
            }}
            websiteMapLinkProps={{
                href: "#"
            }}
        />
    );
});

export const { i18n } = declareComponentKeys<"brand" | "home title" | "description">()({
    Footer
});
