import { CatalogCards, Props } from "ui-dsfr/components/pages/Catalog/CatalogCards";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import { css } from "@emotion/css";
import { id } from "tsafe/id";
import LibreOfficeLogo from "../../../assets/logo_libreoffice.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { CatalogCards },
    "defaultContainerWidth": 1550,
});

export default meta;

export const VueDefault = getStory({
    softwareList: new Array(20).fill(0).map((...[, _i]) =>
        id<Props["softwareList"][number]>({
            softwareId: _i,
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
            isPresentInSupportMarket: true,
            isDesktop: true,
            isFromFrenchPublicService: true,
            softwareDescription:
                "Suite bureautique (logiciel de traitement de texte, tableur, etc.).",
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
        }),
    ),
    "searchResultCount": 44,
    "search": "",
    "hasMoreToLoad": true,
    ...logCallbacks(["onSearchChange", "onLoadMore"]),
});
