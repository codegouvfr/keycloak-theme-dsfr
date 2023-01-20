import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { shortEndMonthDate, monthDate } from "ui-dsfr/useMoment";
import Tooltip from "@mui/material/Tooltip";
import type { Props as CatalogCardProps } from "../CatalogCards/CatalogCard";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { ReferencedInstancesTab } from "./ReferencedInstancesTab";
import { Props as ReferencedInstanceTabProps } from "./ReferencedInstancesTab";
import { Prerogative, PreviewTab } from "./PreviewTab";

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
    declareUserOrReferent: Link;
    authors: Link[];
    minimalVersionRequired: string;
    license: string;
    serviceProvider: Link;
    comptoireDuLibreSheet: Link;
    wikiDataSheet: Link;
    officialWebsite: Link;
    sourceCodeRepository: Link;
    referencedInstances: number;
    alikeSoftware: CatalogCardProps[];
};

const organizationList: ReferencedInstanceTabProps["organizationList"] = [
    {
        name: "CNRS",
        maintainedInstances: [
            {
                name: "https://videos.ahp-numerique.fr",
                description: "Archives Henri-Poincaré",
                userCount: 3,
                referentCount: 2,
                instanceLink: {
                    href: "#",
                    onClick: () => {},
                },
                seeUserAndReferent: {
                    href: "#",
                    onClick: () => {},
                },
            },
            {
                name: "https://videos.ahp-numerique.fr",
                description: "Archives Henri-Poincaré",
                userCount: 3,
                referentCount: 2,
                instanceLink: {
                    href: "#",
                    onClick: () => {},
                },
                seeUserAndReferent: {
                    href: "#",
                    onClick: () => {},
                },
            },
            {
                name: "https://videos.ahp-numerique.fr",
                description: "Archives Henri-Poincaré",
                userCount: 3,
                referentCount: 2,
                instanceLink: {
                    href: "#",
                    onClick: () => {},
                },
                seeUserAndReferent: {
                    href: "#",
                    onClick: () => {},
                },
            },
        ],
    },
    {
        name: "Foo",
        maintainedInstances: [
            {
                name: "https://videos.ahp-numerique.fr",
                description: "Bar",
                userCount: 3,
                referentCount: 2,
                instanceLink: {
                    href: "#",
                    onClick: () => {},
                },
                seeUserAndReferent: {
                    href: "#",
                    onClick: () => {},
                },
            },
            {
                name: "https://videos.ahp-numerique.fr",
                description: "Archives Henri-Poincaré",
                userCount: 3,
                referentCount: 2,
                instanceLink: {
                    href: "#",
                    onClick: () => {},
                },
                seeUserAndReferent: {
                    href: "#",
                    onClick: () => {},
                },
            },
        ],
    },
];

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
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    //assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ DetailCard });

    return (
        <div className={cx(classes.root, className)}>
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
                            softwareCurrentVersion,
                        }),
                    },
                    {
                        "label": t("tab title instance", { instanceCount: 2 }),
                        "content": ReferencedInstancesTab({ organizationList }),
                    },
                    {
                        "label": t("tab title alike software", { alikeSoftwareCount: 1 }),
                        "content": <p>Content of tab2</p>,
                    },
                ]}
            />
        </div>
    );
});

const useStyles = makeStyles({
    "name": { DetailCard },
})(() => ({
    "root": {},
}));

export const { i18n } = declareComponentKeys<
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
