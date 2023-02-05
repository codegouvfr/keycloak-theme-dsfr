import { Authentication } from "ui-dsfr/components/pages/Authentication/Authentication";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Authentication },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({});
