import { CatalogCards, Props } from "ui/components/pages/Catalog/CatalogCards/onyxia";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import { css } from "@emotion/css";
import { id } from "tsafe/id";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { CatalogCards },
    "defaultContainerWidth": 1550,
});

export default meta;

const className = css({ "height": 700 });

const filteredSoftwares = new Array(20).fill(0).map((...[, _i]) =>
    id<Props["filteredSoftwares"][number]>({
        "id": 233,
        "name": "Onyxia",
        "function":
            "Lanceur de conteneurs orienté Data science. Mise en commun de ressources matérielles (CPU/GPU/RAM)",
        "referencedSinceTime": 1640995200000,
        "isStillInObservation": false,
        "isFromFrenchPublicService": true,
        "isPresentInSupportContract": false,
        "alikeSoftwares": [
            {
                "isKnown": false,
                "softwareName": "AWS,GoogleCloudPlatform,MicrosoftAzure",
            },
        ],
        "license": "MIT",
        "contextOfUse": "Onyxia est déployé par l'INSEE sur https://datalab.sspcloud.fr",
        "mimGroup": "MIMDEVOPS",
        "versionMin": "0.26.25",
        "workshopUrls": ["https://www.dailymotion.com/video/x85y31u?playlist=x767bq"],
        "testUrls": [],
        "useCaseUrls": [],
        "wikidataData": {
            "id": "Q110492908",
            "label": {
                "en": "Onyxia",
            },
            "description": {
                "fr": "Un lanceur de conteneur orienté data science",
                "en": "A data science oriented container launcher",
            },
            "logoUrl":
                "//upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Onyxia.svg/220px-Onyxia.svg.png",
            "websiteUrl": "https://github.com/InseeFrLab/onyxia",
            "sourceUrl": "https://github.com/InseeFrLab/onyxia",
            "license": "MIT",
            "documentationUrl": undefined,
            "framaLibreId": undefined,
            "developers": [
                {
                    "name": "Joseph Garrone",
                    "id": "Q111738960",
                },
            ],
        },
        "comptoirDuLibreSoftware": {
            "id": 461,
            "created": "2022-01-09T18:54:43+00:00",
            "modified": "2022-01-17T08:57:54+00:00",
            "url": "https://comptoir-du-libre.org/fr/softwares/461",
            "name": "Onyxia",
            "licence": "MIT",
            "external_resources": {
                "website": "https://datalab.sspcloud.fr",
                "repository": "https://github.com/InseeFrLab/onyxia",
            },
            "providers": [],
            "users": [],
        },
        "hasExpertReferent": true,
        "referentCount": 1,
        "agentWorkstation": true,
        "tags": ["data-science", "container", "docker", "kubernetes", "devops"],
        "annuaireCnllServiceProviders": [],
    }),
);

export const VueDefault = getStory({
    className,
    filteredSoftwares,
    "searchResultCount": 44,
    "alikeSoftwares": [],
    "referentsBySoftwareId": {
        "233": {
            "referents": [],
            "userIndex": undefined,
        },
    },
    "openLinkBySoftwareId": {
        "233": {
            "href": "https://example.com",
            "onClick": () => {},
        },
    },
    "editLinkBySoftwareId": {
        "233": {
            "href": "https://example.com",
            "onClick": () => {},
        },
    },
    "parentSoftwareBySoftwareId": {
        "233": {
            "name": "Keycloak",
            "link": {
                "href": "https://example.com",
                "onClick": () => {},
            },
        },
    },
    "search": "",
    "tags": ["data-science", "container", "docker", "kubernetes", "devops"],
    "selectedTags": [],
    "hasMoreToLoad": true,
    "searchBarWrapperElement": document.createElement("div"),
    "referenceNewSoftwareLink": {
        "href": "https://example.com",
        "onClick": () => {},
    },
    ...logCallbacks([
        "onSearchChange",
        "onLoadMore",
        "onLogin",
        "onDeclareReferentAnswer",
        "onUserNoLongerReferent",
        "onSelectedTagsChange",
    ]),
});
