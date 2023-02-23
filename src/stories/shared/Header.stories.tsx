import { Header } from "ui-dsfr/shared/Header";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Header },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({
    authentication: {
        "isUserLoggedIn": false,
        "login": () => {
            console.log("Logging in");
            return new Promise<never>(() => {});
        }
    },
    "routeName": "home"
});
