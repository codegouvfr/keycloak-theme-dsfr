import { DetailCard } from "ui-dsfr/components/pages/Catalog/DetailCard/DetailCard";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";
import LibreOfficeLogo from "stories/assets/logo_libreoffice.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DetailCard },
    "defaultContainerWidth": 0,
});

export default meta;

export const VueDefault = getStory({
    softwareLogoUrl: LibreOfficeLogo,
    softwareName: "LibreOffice",
    softwareCurrentVersion: "2.0.1",
    softwareDateCurrentVersion: 1640995200000,
    registerDate: 1640995200000,
    declareUserOrReferent: {
        href: "#",
        onClick: () => {},
    },
    seeUserAndReferent: {
        href: "#",
        onClick: () => {},
    },
    isPresentInSupportMarket: true,
    isDesktop: false,
    isFromFrenchPublicService: true,
    isRGAACompliant: true,
    userCount: 13,
    referentCount: 4,
    authors: [
        {
            href: "#",
            onClick: () => {},
        },
    ],
    comptoireDuLibreSheet: {
        href: "#",
        onClick: () => {},
    },
    license: "MIT",
    minimalVersionRequired: "68",
    serviceProvider: {
        href: "#",
        onClick: () => {},
    },
    wikiDataSheet: {
        href: "#",
        onClick: () => {},
    },
    sourceCodeRepository: {
        href: "#",
        onClick: () => {},
    },
    officialWebsite: {
        href: "#",
        onClick: () => {},
    },
    referencedInstances: 2,
    alikeSoftware: [
        {
            softwareLogoUrl: LibreOfficeLogo,
            softwareName: "LibreOffice",
            softwareCurrentVersion: "2.0.1",
            softwareDateCurrentVersion: 1640995200000,
            declareUserOrReferent: {
                href: "#",
                onClick: () => {},
            },
            demoLink: {
                href: "#",
                onClick: () => {},
            },
            seeUserAndReferent: {
                href: "#",
                onClick: () => {},
            },
            isPresentInSupportMarket: true,
            isDesktop: true,
            isFromFrenchPublicService: true,
            softwareDescription:
                "Suite bureautique (logiciel de traitement de texte, tableur, etc.) ",
            userCount: 13,
            referentCount: 4,

            softwareDetailsLink: {
                href: "#",
                onClick: () => {},
            },
        },
    ],
});
