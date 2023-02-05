import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import type { Props as CatalogCardProps } from "../CatalogCards/CatalogCard";
import { ReferencedInstancesTab } from "./ReferencedInstancesTab";
import { Props as ReferencedInstanceTabProps } from "./ReferencedInstancesTab";
import { PreviewTab } from "./PreviewTab";
import { HeaderDetailCard } from "./HeaderDetailCard";
import { fr } from "@codegouvfr/react-dsfr";
import { FooterDetailCard } from "./FooterDetailCard";

export type Props = {
    className?: string;
    softwareLogoUrl?: string;
    softwareName: string;
    isFromFrenchPublicService: boolean;
    isDesktop: boolean;
    isPresentInSupportMarket: boolean;
    isRGAACompliant: boolean;
    softwareCurrentVersion: string;
    softwareDateCurrentVersion: number;
    registerDate: number;
    userCount: number;
    referentCount: number;
    seeUserAndReferent: Link;
    shareSoftware: Link;
    declareUserOrReferent: Link;
    authors: {
        name: string;
        link: Link;
    }[];
    minimalVersionRequired: string;
    license: string;
    serviceProvider: Link;
    comptoireDuLibreSheet: Link;
    wikiDataSheet: Link;
    officialWebsite: Link;
    sourceCodeRepository: Link;
    alikeSoftware: CatalogCardProps[];
    organizationList: ReferencedInstanceTabProps["organizationList"];
};

export const DetailCard = memo((props: Props) => {
    const {
        className,
        softwareCurrentVersion,
        softwareDateCurrentVersion,
        minimalVersionRequired,
        registerDate,
        license,
        serviceProvider,
        comptoireDuLibreSheet,
        wikiDataSheet,
        isDesktop,
        isPresentInSupportMarket,
        isFromFrenchPublicService,
        isRGAACompliant,
        organizationList,
        softwareName,
        softwareLogoUrl,
        authors,
        officialWebsite,
        sourceCodeRepository,
        userCount,
        referentCount,
        seeUserAndReferent,
        declareUserOrReferent,
        shareSoftware,
        alikeSoftware,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ DetailCard });

    const instanceCount = organizationList.reduce(
        (acc, organization) => acc + organization.maintainedInstances.length,
        0
    );

    return (
        <div className={cx(className)}>
            {/*
            // TODO : Update react dsfr component : wrong styles for active item
            */}
            <Breadcrumb
                segments={[
                    {
                        linkProps: {
                            href: "#"
                        },
                        label: t("catalog breadcrumb")
                    }
                ]}
                currentPageLabel={softwareName}
                className={classes.breadcrumb}
            />
            <HeaderDetailCard
                softwareLogoUrl={softwareLogoUrl}
                softwareName={softwareName}
                authors={authors}
                officialWebsite={officialWebsite}
                sourceCodeRepository={sourceCodeRepository}
            />
            <Tabs
                tabs={[
                    {
                        "label": t("tab title overview"),
                        "content": PreviewTab({
                            wikiDataSheet,
                            comptoireDuLibreSheet,
                            serviceProvider,
                            license,
                            isDesktop,
                            isPresentInSupportMarket,
                            isFromFrenchPublicService,
                            isRGAACompliant,
                            minimalVersionRequired,
                            registerDate,
                            softwareDateCurrentVersion,
                            softwareCurrentVersion
                        })
                    },
                    {
                        "label": t("tab title instance", {
                            instanceCount: instanceCount
                        }),
                        "content": ReferencedInstancesTab({
                            organizationList,
                            instanceCount
                        })
                    },
                    {
                        "label": t("tab title alike software", { alikeSoftwareCount: 1 }),
                        "content": <p>Content of tab2</p>
                    }
                ]}
            />
            <FooterDetailCard
                usersCount={userCount}
                referentCount={referentCount}
                seeUserAndReferent={seeUserAndReferent}
                shareSoftware={shareSoftware}
                declareUserOrReferent={declareUserOrReferent}
            />
        </div>
    );
});

const useStyles = makeStyles({
    "name": { DetailCard }
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
>()({ DetailCard });
