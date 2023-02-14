import type { ThunkAction, State as RootState } from "../setup";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { SillApiClient } from "../ports/SillApiClient";
import {
    type SoftwareCatalogState,
    apiSoftwareToExternalCatalogSoftware
} from "./softwareCatalog";

export type SoftwareDetailsState = {
    software: SoftwareDetailsState.Software | undefined;
};

export namespace SoftwareDetailsState {
    export type Software = {
        softwareName: string;
        softwareDescription: string;
        logoUrl: string | undefined;
        authors: {
            authorName: string;
            authorUrl: string;
        }[];
        officialWebsiteUrl: string | undefined;
        codeRepositoryUrl: string | undefined;
        lastVersion:
            | {
                  semVer: string;
                  publicationTime: number;
              }
            | undefined;
        addedTime: number;
        versionMin: string;
        license: string;
        serviceProviderCount: number;
        serviceProviderUrl: string;
        compotoirDuLibreUrl: string | undefined;
        wikidataUrl: string;
        prerogatives: Record<SoftwareCatalogState.Prerogative, boolean>;
        userCount: number;
        referentCount: number;
        testUrl: string | undefined;
        instances: {
            instanceUrl: string;
            targetAudience: string;
        }[];
        parentSoftware:
            | ({ softwareName: string } & (
                  | { isInSill: true }
                  | { isInSill: false; url: string }
              ))
            | undefined;
        similarSoftwares: (
            | {
                  isInSill: true;
                  software: SoftwareCatalogState.Software.External;
              }
            | {
                  isInSill: false;
                  url: string;
              }
        )[];
    };
}

export const name = "softwareDetails" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<SoftwareDetailsState>({ "software": undefined }),
    "reducers": {
        "softwareSet": (
            _state,
            {
                payload
            }: PayloadAction<{ software: SoftwareDetailsState.Software | undefined }>
        ) => {
            const { software } = payload;

            return { software };
        }
    }
});

export const thunks = {
    "setSoftware":
        (params: { softwareName: string | undefined }): ThunkAction<void> =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, , { sillApiClient }] = args;

            dispatch(
                actions.softwareSet({
                    "software":
                        softwareName === undefined
                            ? undefined
                            : apiSoftwareToSoftware({
                                  "apiSoftwares": await sillApiClient.getSoftwares(),
                                  softwareName
                              })
                })
            );
        }
};

export const selectors = (() => {
    const software = (rootState: RootState) => rootState.softwareDetails.software;

    return { software };
})();

function apiSoftwareToSoftware(params: {
    apiSoftwares: SillApiClient.Software[];
    softwareName: string;
}): SoftwareDetailsState.Software {
    const { apiSoftwares, softwareName } = params;

    const apiSoftware = apiSoftwares.find(
        apiSoftware => apiSoftware.softwareName === softwareName
    );

    assert(apiSoftware !== undefined);

    const {
        logoUrl,
        authors,
        officialWebsiteUrl,
        codeRepositoryUrl,
        softwareDescription,
        lastVersion,
        parentSoftware: parentSoftwareWikidata_api,
        testUrl,
        addedTime,
        prerogatives,
        users,
        serviceProviderCount,
        serviceProviderUrl,
        compotoirDuLibreId,
        similarSoftwares: similarSoftwares_api,
        wikidataId,
        license,
        versionMin,
        softwareType
    } = apiSoftware;

    const referentCount = users.filter(user => user.type === "referent").length;

    const parentSoftware: SoftwareDetailsState.Software["parentSoftware"] = (() => {
        if (parentSoftwareWikidata_api === undefined) {
            return undefined;
        }

        in_sill: {
            const software = apiSoftwares.find(
                software => software.wikidataId === parentSoftwareWikidata_api.wikidataId
            );

            if (software === undefined) {
                break in_sill;
            }

            return {
                "softwareName": software.softwareName,
                "isInSill": true
            };
        }

        return {
            "isInSill": false,
            "softwareName": parentSoftwareWikidata_api.wikidataLabel,
            "url": `https://www.wikidata.org/wiki/${parentSoftwareWikidata_api.wikidataId}`
        };
    })();

    return {
        logoUrl,
        authors,
        officialWebsiteUrl,
        codeRepositoryUrl,
        softwareName,
        softwareDescription,
        lastVersion,
        referentCount,
        "userCount": users.length - referentCount,
        parentSoftware,
        addedTime,
        serviceProviderUrl,
        "compotoirDuLibreUrl": `https://comptoir-du-libre.org/fr/softwares/${compotoirDuLibreId}`,
        "wikidataUrl": `https://www.wikidata.org/wiki/${wikidataId}`,
        "instances": [],
        "similarSoftwares": similarSoftwares_api.map(softwareRef => {
            const software = apiSoftwareToExternalCatalogSoftware({
                apiSoftwares,
                "wikidataId": softwareRef.wikidataId
            });

            if (software === undefined) {
                return {
                    "isInSill": false,
                    "url": `https://www.wikidata.org/wiki/${softwareRef.wikidataId}`
                };
            }

            return {
                "isInSill": true,
                software
            };
        }),
        license,
        "prerogatives": {
            "isTestable": testUrl !== undefined,
            "isInstallableOnUserTerminal": softwareType.type === "desktop",
            "isPresentInSupportContract": prerogatives.isPresentInSupportContract,
            "isFromFrenchPublicServices": prerogatives.isFromFrenchPublicServices,
            "doRespectRgaa": prerogatives.doRespectRgaa
        },
        serviceProviderCount,
        testUrl,
        versionMin
    };
}
