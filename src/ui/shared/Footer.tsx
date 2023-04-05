import { memo } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { useTranslation } from "ui/i18n";
import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import { routes } from "ui/routes";
import { headerFooterDisplayItem, Display } from "@codegouvfr/react-dsfr/Display";
import { brandTop } from "ui/shared/Header";

export type Props = {
    className?: string;
    apiVersion: string;
    webVersion: string;
};

export const Footer = memo((props: Props) => {
    const { className, apiVersion, webVersion, ...rest } = props;

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
                    headerFooterDisplayItem
                ]}
            />
            <Display />
        </>
    );
});
