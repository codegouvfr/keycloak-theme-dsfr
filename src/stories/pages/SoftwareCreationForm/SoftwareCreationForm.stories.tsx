import { SoftwareCreationForm } from "ui-dsfr/components/pages/SoftwareCreationForm/SoftwareCreationForm";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SoftwareCreationForm }
});

export default meta;

export const VueDefault = getStory({
    "route": createMockRoute("softwareCreationForm", {})
});
