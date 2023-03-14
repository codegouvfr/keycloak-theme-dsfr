import React from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import type { State as SoftwareCatalogState } from "core/usecases/softwareCatalog";
import { SoftwareCatalogCard } from "../softwareCatalog/SoftwareCatalogCard";

export type Props = {
    className?: string;
    alikeSoftwares?: SoftwareCatalogState.Software.External[];
};

export const AlikeSoftwareTab = (props: Props) => {
    const { className, alikeSoftwares, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ AlikeSoftwareTab });

    return (
        <section className={className}>
            <p className={fr.cx("fr-text--bold")}>
                {t("alike software sill")} ({alikeSoftwares?.length}) :
            </p>
            {alikeSoftwares?.map(software => {
                const {
                    logoUrl,
                    softwareName,
                    lastVersion,
                    softwareDescription,
                    userCount,
                    referentCount,
                    testUrl,
                    prerogatives
                } = software;

                return (
                    <SoftwareCatalogCard
                        key={softwareName}
                        logoUrl={logoUrl}
                        softwareName={softwareName}
                        lastVersion={lastVersion}
                        softwareDescription={softwareDescription}
                        prerogatives={prerogatives}
                        testUrl={testUrl}
                        userCount={userCount}
                        referentCount={referentCount}
                        declareForm={{
                            href: "",
                            onClick: () => {}
                        }}
                        softwareDetails={{
                            href: "",
                            onClick: () => {}
                        }}
                        softwareUserAndReferent={{
                            href: "",
                            onClick: () => {}
                        }}
                    />
                );
            })}
        </section>
    );
};

export const { i18n } = declareComponentKeys<
    "alike software sill" | "alike software proprietary"
>()({ AlikeSoftwareTab });
