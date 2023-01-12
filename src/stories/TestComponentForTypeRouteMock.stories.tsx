import { TestComponentForTypeRouteMock } from "ui-dsfr/components/TestComponentForTypeRouteMock";
import { getStoryFactory, createMockRoute } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    "sectionName": "tests",
    "wrappedComponent": { TestComponentForTypeRouteMock },
});

export default meta;

export const VueDefault = getStory({
    "route": createMockRoute("catalog", { "q": "This is the default query" }),
});
