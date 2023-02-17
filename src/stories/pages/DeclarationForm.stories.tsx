import { DeclarationForm } from "ui-dsfr/components/pages/DeclarationForm";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { DeclarationForm }
});

export default meta;

export const VueCreation = getStory({
    "route": createMockRoute("declarationForm", { "name": "NextCloud" })
});
