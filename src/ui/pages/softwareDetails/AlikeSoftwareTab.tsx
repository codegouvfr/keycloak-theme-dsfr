import React from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import type { State as SoftwareCatalogState } from "core/usecases/softwareCatalog";
import { SoftwareCatalogCard } from "ui/pages/softwareCatalog/SoftwareCatalogCard";
import type { Link } from "type-route";

export type Props = {
    className?: string;
    alikeExternalSoftwares: SoftwareCatalogState.Software.External[];
    alikeInternalSoftwares: {
        isInSill: false;
        url: string;
        description: string;
        name: string;
    }[];
    getLinks: (params: {
        softwareName: string;
    }) => Record<
        "declarationForm" | "softwareDetails" | "softwareUsersAndReferents",
        Link
    >;
};

export const AlikeSoftwareTab = (props: Props) => {
    const {
        className,
        alikeExternalSoftwares,
        alikeInternalSoftwares,
        getLinks,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ AlikeSoftwareTab });

    return (
        <section className={className}>
            <p className={fr.cx("fr-text--bold")}>
                {t("alike software sill")} ({alikeExternalSoftwares.length}) :
            </p>
            {alikeExternalSoftwares.map(software => {
                const {
                    logoUrl,
                    softwareName,
                    latestVersion,
                    softwareDescription,
                    userCount,
                    referentCount,
                    testUrl,
                    prerogatives,
                    userDeclaration
                } = software;

                const { declarationForm, softwareDetails, softwareUsersAndReferents } =
                    getLinks({ softwareName });

                return (
                    <SoftwareCatalogCard
                        key={softwareName}
                        logoUrl={logoUrl}
                        softwareName={softwareName}
                        latestVersion={latestVersion}
                        softwareDescription={softwareDescription}
                        prerogatives={prerogatives}
                        testUrl={testUrl}
                        userCount={userCount}
                        referentCount={referentCount}
                        declareFormLink={declarationForm}
                        softwareDetailsLink={softwareDetails}
                        softwareUsersAndReferentsLink={softwareUsersAndReferents}
                        searchHighlight={undefined}
                        userDeclaration={userDeclaration}
                    />
                );
            })}
            <p className={fr.cx("fr-text--bold")}>
                {t("alike software internal")} ({alikeInternalSoftwares?.length}) :
            </p>
            <ul>
                {alikeInternalSoftwares.map(software => {
                    const { name, description, url } = software;

                    return (
                        <li key={name}>
                            <p>
                                {name} (
                                <a href={url} target="_blank" rel="noreferrer">
                                    {url}
                                </a>
                                )
                            </p>
                            <p>{description}</p>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export const { i18n } = declareComponentKeys<
    "alike software sill" | "alike software internal"
>()({ AlikeSoftwareTab });
