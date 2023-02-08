import { DeclareUserOrReferent } from "ui-dsfr/components/pages/Catalog/DeclareUserOrReferent/DeclareUserOrReferent";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";
import LibreOfficeLogo from "stories/assets/logo_libreoffice.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DeclareSoftware: DeclareUserOrReferent },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({
    softwareName: "Thunderbirds",
    userCount: 3,
    referentCount: 3,
    seeUserAndReferent: {
        href: "",
        onClick: () => {}
    },
    softwareLogoUrl: LibreOfficeLogo
});
