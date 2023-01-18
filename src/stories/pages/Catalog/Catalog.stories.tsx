import { Catalog } from "ui-dsfr/components/pages/Catalog/Catalog";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Catalog },
    "defaultContainerWidth": 0,
});

export default meta;

export const VueDefault = getStory({
    route: createMockRoute("catalog", { "q": "" }),
});
