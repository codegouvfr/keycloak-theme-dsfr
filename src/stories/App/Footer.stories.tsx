import { Footer } from "ui/components/App/Footer";
import { getStoryFactory } from "stories/getStory";
import { sectionName } from "./sectionName";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Footer },
    "defaultContainerWidth": 1000,
});

export default meta;

export const Vue1 = getStory({
    "packageJsonVersion": "0.9.3",
    "apiPackageJsonVersion": "1.0.0",
    "termsLink": {
        "href": "https://example.com",
        "onClick": () => {},
    },
    "sillJsonHref": "https://sill.etalab.gouv.fr/api/sill.json",
});
