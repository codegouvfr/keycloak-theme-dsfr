import { CatalogCard } from "ui-dsfr/components/pages/Catalog/CatalogCards/CatalogCard";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import LibreOfficeLogo from "stories/assets/logo_libreoffice.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { CatalogCard },
    "defaultContainerWidth": 450,
    "argTypes": {
        "softwareLogoUrl": {
            "control": {
                "type": null,
            },
        },
    },
});

export default meta;

export const VueDefault = getStory({
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
    ...logCallbacks([
        "onLogin",
        "onDeclareReferentAnswer",
        "onUserNoLongerReferent",
        "onTagClick",
    ]),
});

export const TooLongDescription = getStory({
    softwareLogoUrl: LibreOfficeLogo,
    softwareName: "LibreOffice",
    softwareCurrentVersion: "2.0.1",
    softwareDateCurrentVersion: 1640995200000,
    declareUserOrReferent: {
        href: "#",
        onClick: () => {},
    },
    seeUserAndReferent: {
        href: "#",
        onClick: () => {},
    },
    demoLink: {
        href: "#",
        onClick: () => {},
    },
    isPresentInSupportMarket: false,
    isDesktop: true,
    isFromFrenchPublicService: true,
    softwareDescription:
        "Suite bureautique (logiciel de traitement de texte, tableur, etc.). Suite bureautique (logiciel de traitement de texte, tableur, etc.). Suite bureautique (logiciel de traitement de texte, tableur, etc.).",
    userCount: 13,
    referentCount: 4,

    softwareDetailsLink: {
        href: "#",
        onClick: () => {},
    },
    ...logCallbacks([
        "onLogin",
        "onDeclareReferentAnswer",
        "onUserNoLongerReferent",
        "onTagClick",
    ]),
});
