import { Header } from "ui-dsfr/components/shared/Header";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Header },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({
    isUserLoggedIn: false
});
