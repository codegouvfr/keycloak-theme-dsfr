import { SoftwareForm } from "ui-dsfr/components/pages/SoftwareForm";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SoftwareForm }
});

export default meta;

export const VueCreation = getStory({
    "route": createMockRoute("softwareCreationForm", {})
});

export const VueUpdate = getStory({
    "route": createMockRoute("softwareUpdateForm", {
        "name": "Onyxia"
    })
});
