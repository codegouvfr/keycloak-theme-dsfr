import { useEffect, useState } from "react";
import { Header } from "ui/components/shared/Header";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import { sectionName } from "./sectionName";
import { css } from "tss-react/@emotion/css";

const defaultContainerWidth = 1200;

function useIsCloudShellVisible() {
    const [isCloudShellVisible, setIsCloudShellVisible] = useState(false);

    useEffect(() => {
        console.log(`isCloudShellVisible set to ${isCloudShellVisible}`);
    }, [isCloudShellVisible]);

    return { isCloudShellVisible, setIsCloudShellVisible };
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Header },
    defaultContainerWidth,
});

export default meta;

const propsCommon = {
    "className": css({ "height": 64, "paddingRight": (defaultContainerWidth * 2) / 100 }),
    "logoContainerWidth": (defaultContainerWidth * 4) / 100,
    "logoLink": {
        "href": "https://example.com",
        "onClick": () => {},
    },
};

const propCoreAppCommon = {
    ...propsCommon,
    "isUserLoggedIn": true,
    "useCase": "core app",
    useIsCloudShellVisible,
} as const;

export const VueUserLoggedIn = getStory({
    ...propCoreAppCommon,
    "isUserLoggedIn": true,
    ...logCallbacks(["onLogoutClick", "onSelectedProjectChange"]),
});

export const VueUserNotLoggedIn = getStory({
    ...propCoreAppCommon,
    "isUserLoggedIn": false,
    ...logCallbacks(["onLoginClick"]),
});

export const LoginPage = getStory({
    ...propsCommon,
    "useCase": "login pages",
});
