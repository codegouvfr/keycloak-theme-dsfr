import { Catalog, Props } from "ui-dsfr/components/pages/Catalog/Catalog";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory, logCallbacks } from "stories/getStory";
import { css } from "@emotion/css";
import { id } from "tsafe/id";
import LibreOfficeLogo from "../../../assets/logo_libreoffice.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Catalog },
    "defaultContainerWidth": 0,
});

export default meta;

export const VueDefault = getStory({
    route: createMockRoute("catalog", { "q": "This is the default query" }),
});
