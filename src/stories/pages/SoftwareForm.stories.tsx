import { SoftwareForm } from "ui/pages/SoftwareForm";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { SoftwareForm }
});

export default meta;

export const VueCreation = getStory({
    "route": createMockRoute("softwareCreationForm", undefined as void)
});

export const VueUpdate = getStory({
    "route": createMockRoute("softwareUpdateForm", {
        "name": "NextCloud"
    })
});
