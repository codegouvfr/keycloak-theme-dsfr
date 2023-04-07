import { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { useTranslation } from "ui/i18n";
import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import { routes } from "ui/routes";
import { headerFooterDisplayItem, Display } from "@codegouvfr/react-dsfr/Display";
import { brandTop } from "ui/shared/Header";
import { fr } from "@codegouvfr/react-dsfr";
import { LanguageSelector } from "./LanguageSelector";
import { Language } from "../i18n";

export type Props = {
    className?: string;
    apiVersion: string;
    webVersion: string;
    i18nApi: {
        lang: Language;
        setLang: (lang: Language) => void;
    };
};

export const Footer = memo((props: Props) => {
    const { className, apiVersion, webVersion, i18nApi, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ "Header": undefined });

    return (
        <>
            <DsfrFooter
                className={className}
                brandTop={brandTop}
                homeLinkProps={{
                    ...routes.home().link,
                    title: t("home title")
                }}
                accessibility="fully compliant"
                termsLinkProps={routes.terms().link}
                bottomItems={[
                    {
                        "text": `sill-api: v${apiVersion}`,
                        "linkProps": {
                            "href": `https://github.com/codegouvfr/sill-api/tree/v${apiVersion}`
                        }
                    },
                    {
                        "text": `sill-web: v${webVersion}`,
                        "linkProps": {
                            "href": `https://github.com/codegouvfr/sill-web/tree/v${webVersion}`
                        }
                    },
                    headerFooterDisplayItem,
                    {
                        "buttonProps": {
                            "aria-controls": "translate-select",
                            "aria-expanded": false,
                            "title": t("select language"),
                            "className": fr.cx(
                                "fr-btn--tertiary",
                                "fr-translate",
                                "fr-nav"
                            )
                        },
                        "iconId": "fr-icon-translate-2",
                        "text": (
                            <LanguageSelector
                                lang={i18nApi.lang}
                                setLang={i18nApi.setLang}
                            />
                        )
                    }
                ]}
            />
            <Display />
        </>
    );
});
