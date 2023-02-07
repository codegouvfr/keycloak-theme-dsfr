import { DetailCard } from "ui-dsfr/components/pages/Catalog/DetailCard/DetailCard";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";
import LibreOfficeLogo from "stories/assets/logo_libreoffice.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DetailCard },
    "defaultContainerWidth": 0
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
        onClick: () => {}
    },
    seeUserAndReferent: {
        href: "#",
        onClick: () => {}
    },
    isPresentInSupportMarket: true,
    isDesktop: false,
    isFromFrenchPublicService: true,
    isRGAACompliant: true,
    userCount: 13,
    referentCount: 4,
    authors: [
        {
            name: "MZLA Technologies Corporation",
            link: {
                href: "#",
                onClick: () => {}
            }
        },
        {
            name: "Mozilla Foundation",
            link: {
                href: "#",
                onClick: () => {}
            }
        },
        {
            name: "Mozzila Messaging",
            link: {
                href: "#",
                onClick: () => {}
            }
        }
    ],
    comptoireDuLibreSheet: {
        href: "#",
        onClick: () => {}
    },
    license: "MIT",
    minimalVersionRequired: "68",
    serviceProvider: {
        href: "#",
        onClick: () => {}
    },
    wikiDataSheet: {
        href: "#",
        onClick: () => {}
    },
    sourceCodeRepository: {
        href: "#",
        onClick: () => {}
    },
    officialWebsite: {
        href: "#",
        onClick: () => {}
    },
    shareSoftware: {
        href: "#",
        onClick: () => {}
    },
    organizationList: [
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
                        onClick: () => {}
                    },
                    seeUserAndReferent: {
                        href: "#",
                        onClick: () => {}
                    }
                },
                {
                    name: "https://videos.ahp-numerique.fr",
                    description: "Archives Henri-Poincaré",
                    userCount: 3,
                    referentCount: 2,
                    instanceLink: {
                        href: "#",
                        onClick: () => {}
                    },
                    seeUserAndReferent: {
                        href: "#",
                        onClick: () => {}
                    }
                },
                {
                    name: "https://videos.ahp-numerique.fr",
                    description: "Archives Henri-Poincaré",
                    userCount: 3,
                    referentCount: 2,
                    instanceLink: {
                        href: "#",
                        onClick: () => {}
                    },
                    seeUserAndReferent: {
                        href: "#",
                        onClick: () => {}
                    }
                }
            ]
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
                        onClick: () => {}
                    },
                    seeUserAndReferent: {
                        href: "#",
                        onClick: () => {}
                    }
                },
                {
                    name: "https://videos.ahp-numerique.fr",
                    description: "Archives Henri-Poincaré",
                    userCount: 3,
                    referentCount: 2,
                    instanceLink: {
                        href: "#",
                        onClick: () => {}
                    },
                    seeUserAndReferent: {
                        href: "#",
                        onClick: () => {}
                    }
                }
            ]
        }
    ]
});
