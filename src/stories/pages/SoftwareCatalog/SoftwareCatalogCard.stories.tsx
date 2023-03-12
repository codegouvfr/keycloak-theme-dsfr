import { SoftwareCatalogCard } from "ui/pages/SoftwareCatalog/SoftwareCatalogCard";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import LibreOfficeLogo from "stories/assets/logo_libreoffice.png";
import LogoNextCloud from "stories/assets/logo_nextcloud.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SoftwareCatalogCard },
    "defaultContainerWidth": 450
});

export default meta;

export const VueDefault = getStory({
    "declareForm": {
        href: "",
        onClick: () => {}
    },
    "referentCount": 3,
    "softwareUserAndReferent": {
        "href": "",
        onClick: () => {}
    },
    "softwareDetails": {
        href: "",
        onClick: () => {}
    },
    "userCount": 0,
    "logoUrl": LogoNextCloud,
    "softwareName": "NextCloud",
    "softwareDescription": "Partage de fichiers",
    "lastVersion": {
        "semVer": "25.0.2",
        "publicationTime": 1669985280
    },
    "testUrl": undefined,
    "prerogatives": {
        "isFromFrenchPublicServices": true,
        "isPresentInSupportContract": true,
        "isInstallableOnUserTerminal": true
    }
});

export const VueTooLongDescription = getStory({
    "declareForm": {
        href: "",
        onClick: () => {}
    },
    "referentCount": 3,
    "softwareUserAndReferent": {
        "href": "",
        onClick: () => {}
    },
    "softwareDetails": {
        href: "",
        onClick: () => {}
    },
    "userCount": 0,
    "logoUrl": LogoNextCloud,
    "softwareName": "NextCloud",
    "softwareDescription":
        "Partage de fichiers, suite d'une fausse description pour tester le comportement d'une carte avec un text trop long",
    "lastVersion": {
        "semVer": "25.0.2",
        "publicationTime": 1669985280
    },
    "testUrl": undefined,
    "prerogatives": {
        "isFromFrenchPublicServices": true,
        "isPresentInSupportContract": true,
        "isInstallableOnUserTerminal": true
    }
});
