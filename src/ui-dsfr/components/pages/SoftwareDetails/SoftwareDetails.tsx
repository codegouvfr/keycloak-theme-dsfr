import React, { useEffect } from "react";
import { createGroup } from "type-route";
import type { Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { selectors, useCoreState, useCoreFunctions } from "core-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../../../i18n";
import { HeaderDetailCard } from "./HeaderDetailCard";
import { PreviewTab } from "./PreviewTab";
import { ReferencedInstancesTab } from "./ReferencedInstancesTab";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { FooterDetailCard } from "./FooterDetailCard";
import { AlikeSoftwareTab } from "./AlikeSoftwareTab";
import { compact } from "lodash";

SoftwareDetails.routeGroup = createGroup([routes.softwareDetails]);

type PageRoute = Route<typeof SoftwareDetails.routeGroup>;

SoftwareDetails.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function SoftwareDetails(props: Props) {
    const { route } = props;

    const { softwareDetails } = useCoreFunctions();

    const { classes } = useStyles();

    const { t } = useTranslation({ SoftwareDetails });

    const { software } = useCoreState(selectors.softwareDetails.software);

    useEffect(() => {
        softwareDetails.setSoftware({
            "softwareName": route.params.name
        });

        return () =>
            softwareDetails.setSoftware({
                "softwareName": undefined
            });
    }, [route.params.name]);

    //TODO: Add fallback if no software
    if (software === undefined) {
        return null;
    }

    return (
        <div>
            <div className={fr.cx("fr-container")}>
                <Breadcrumb
                    segments={[
                        {
                            "linkProps": {
                                "href": routes.softwareCatalog().href
                            },
                            "label": t("catalog breadcrumb")
                        }
                    ]}
                    currentPageLabel={software.softwareName}
                    className={classes.breadcrumb}
                />
                <HeaderDetailCard
                    softwareLogoUrl={software.logoUrl}
                    softwareName={software.softwareName}
                    authors={software.authors}
                    officialWebsite={software.officialWebsiteUrl}
                    sourceCodeRepository={software.codeRepositoryUrl}
                />
                <Tabs
                    tabs={[
                        {
                            "label": t("tab title overview"),
                            "content": (
                                <PreviewTab
                                    wikiDataSheet={software.wikidataUrl}
                                    comptoireDuLibreSheet={software.compotoirDuLibreUrl}
                                    serviceProvider={software.serviceProviderUrl}
                                    license={software.license}
                                    isDesktop={
                                        software.prerogatives.isInstallableOnUserTerminal
                                    }
                                    isPresentInSupportMarket={
                                        software.prerogatives.isPresentInSupportContract
                                    }
                                    isFromFrenchPublicService={
                                        software.prerogatives.isFromFrenchPublicServices
                                    }
                                    isRGAACompliant={software.prerogatives.doRespectRgaa}
                                    minimalVersionRequired={software.versionMin}
                                    registerDate={software.addedTime}
                                    softwareDateCurrentVersion={
                                        software.lastVersion?.publicationTime
                                    }
                                    softwareCurrentVersion={software.lastVersion?.semVer}
                                />
                            )
                        },
                        {
                            "label": t("tab title instance", {
                                "instanceCount": software.instances.length ?? 0
                            }),
                            "content": (
                                <ReferencedInstancesTab
                                    organizationList={software.instances}
                                    instanceCount={software.instances.length}
                                />
                            )
                        },
                        {
                            "label": t("tab title alike software", {
                                alikeSoftwareCount: software.similarSoftwares.length ?? 0
                            }),
                            "content": (
                                <AlikeSoftwareTab
                                    alikeSoftwares={compact(
                                        software.similarSoftwares.map(item =>
                                            item.isInSill ? item.software : undefined
                                        )
                                    )}
                                />
                            )
                        }
                    ]}
                />
            </div>
            <FooterDetailCard
                usersCount={software.userCount ?? 0}
                referentCount={software.referentCount ?? 0}
                //TODO: Fix link
                seeUserAndReferent={
                    routes.softwareUsersAndReferents({
                        "name": software.softwareName
                    }).link
                }
                shareSoftware={{
                    "href": "",
                    "onClick": () => {}
                }}
                declareUserOrReferent={
                    routes.declarationForm({
                        "name": software.softwareName
                    }).link
                }
            />
        </div>
    );
}

const useStyles = makeStyles({
    "name": { SoftwareDetails }
})(() => ({
    "breadcrumb": {
        "marginBottom": fr.spacing("4v")
    }
}));

export const { i18n } = declareComponentKeys<
    | "catalog breadcrumb"
    | "tab title overview"
    | { K: "tab title instance"; P: { instanceCount: number } }
    | { K: "tab title alike software"; P: { alikeSoftwareCount: number } }
    | "about"
    | "use full links"
    | "prerogatives"
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | "register"
    | { K: "register date"; P: { date: string } }
    | "minimal version"
    | "license"
    | "declare oneself referent"
    | "isDesktop"
    | "isPresentInSupportMarket"
    | "isFromFrenchPublicService"
    | "isRGAACompliant"
    | "service provider"
    | "comptoire du libre sheet"
    | "wikiData sheet"
>()({ SoftwareDetails });
