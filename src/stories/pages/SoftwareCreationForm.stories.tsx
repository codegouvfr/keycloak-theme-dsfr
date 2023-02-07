import { SoftwareCreationForm } from "ui-dsfr/components/pages/SoftwareCreationForm/SoftwareCreationForm";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SoftwareCreationForm }
});

export default meta;

export const VueCreation = getStory({
    "route": createMockRoute("softwareCreationForm", undefined)
});

export const VueUpdate = getStory({
    "route": createMockRoute("softwareUpdateForm", {
        "name": "Onyxia"
    })
});
