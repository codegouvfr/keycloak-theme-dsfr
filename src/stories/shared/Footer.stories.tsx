import { Footer } from "ui-dsfr/components/shared/Footer";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Footer },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({});
