import { SoftwareCatalog } from "ui-dsfr/pages/SoftwareCatalog/SoftwareCatalog";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SoftwareCatalog },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({
    "route": createMockRoute("softwareCatalog", {})
});

export const VueWithSearch = getStory({
    "route": createMockRoute("softwareCatalog", {
        "search": "chromium",
        "organization": "DINUM"
    })
});
