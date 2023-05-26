import { memo, forwardRef } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { useTranslation } from "ui/i18n";
import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import { routes } from "ui/routes";
import { headerFooterDisplayItem, Display } from "@codegouvfr/react-dsfr/Display";
import { brandTop } from "ui/shared/Header";
import { declareComponentKeys } from "i18nifty";

export type Props = {
    className?: string;
    apiVersion: string;
    webVersion: string;
};

export const Footer = memo(
    forwardRef<HTMLDivElement, Props>((props, ref) => {
        const { className, apiVersion, webVersion, ...rest } = props;

        assert<Equals<typeof rest, {}>>();

        const { t: tHeader } = useTranslation({ "Header": undefined });
        const { t } = useTranslation({ Footer });

        return (
            <>
                <DsfrFooter
                    ref={ref}
                    className={className}
                    brandTop={brandTop}
                    homeLinkProps={{
                        ...routes.home().link,
                        title: tHeader("home title")
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
                        {
                            "text": t("bug report and suggestions"),
                            "linkProps": {
                                "href": "https://github.com/codegouvfr/sill-web/issues/new"
                            }
                        },
                        {
                            "text": "sill.json",
                            "linkProps": {
                                "href": `https://${window.location.host}/api/sill.json`
                            }
                        },
                        {
                            "text": "sill.pdf",
                            "linkProps": {
                                "href": "https://code.gouv.fr/data/sill.pdf"
                            }
                        },
                        {
                            "text": "sill.tsv",
                            "linkProps": {
                                "href": "https://code.gouv.fr/data/sill.tsv"
                            }
                        },
                        headerFooterDisplayItem
                    ]}
                />
                <Display />
            </>
        );
    })
);

export const { i18n } = declareComponentKeys<"bug report and suggestions">()({ Footer });
