import type { ThunkAction, State as RootState } from "../setup";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { SillApiClient } from "../ports/SillApiClient";
import {
    type SoftwareCatalogState,
    apiSoftwareToExternalCatalogSoftware,
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
        prerogatives: Pick<
            Record<SoftwareCatalogState.Prerogative, boolean>,
            | "isInstallableOnUserTerminal"
            | "isPresentInSupportContract"
            | "isFromFrenchPublicServices"
            | "doRespectRgaa"
        >;
        userCount: number;
        referentCount: number;
        testUrl: string | undefined;
        instances: {
            instanceUrl: string;
            targetAudience: string;
        }[];
        parentSoftwareName: string | undefined;
        alikeSoftwares: SoftwareCatalogState.Software.External[];
        proprietaryAlikeSoftwaresNames: string[];
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
                payload,
            }: PayloadAction<{ software: SoftwareDetailsState.Software | undefined }>,
        ) => {
            const { software } = payload;

            return { software };
        },
    },
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
                                  softwareName,
                              }),
                }),
            );
        },
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
        apiSoftware => apiSoftware.softwareName === softwareName,
    );

    assert(apiSoftware !== undefined);

    const {
        logoUrl,
        authors,
        officialWebsiteUrl,
        codeRepositoryUrl,
        softwareDescription,
        lastVersion,
        parentSoftwareName,
        testUrl,
        addedTime,
        prerogatives,
        users,
        serviceProviderCount,
        serviceProviderUrl,
        compotoirDuLibreUrl,
        wikidataUrl,
        instances,
        alikeSoftwareNames,
        proprietaryAlikeSoftwaresNames,
        license,
        versionMin,
    } = apiSoftware;

    const referentCount = users.filter(user => user.type === "referent").length;

    const parentSoftware = (() => {
        if (parentSoftwareName === undefined) {
            return undefined;
        }

        const parentSoftware = apiSoftwares.find(
            ({ softwareName }) => softwareName === parentSoftwareName,
        );

        assert(parentSoftware !== undefined);

        return parentSoftware;
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
        "parentSoftwareName": parentSoftware?.softwareName,
        addedTime,
        serviceProviderUrl,
        compotoirDuLibreUrl,
        wikidataUrl,
        instances,
        "alikeSoftwares": alikeSoftwareNames.map(softwareName =>
            apiSoftwareToExternalCatalogSoftware({
                apiSoftwares,
                softwareName,
            }),
        ),
        proprietaryAlikeSoftwaresNames,
        license,
        "prerogatives": {
            "isInstallableOnUserTerminal": apiSoftwareToExternalCatalogSoftware({
                apiSoftwares,
                softwareName,
            }).prerogatives.isInstallableOnUserTerminal,
            "isPresentInSupportContract": prerogatives.isPresentInSupportContract,
            "isFromFrenchPublicServices": prerogatives.isFromFrenchPublicServices,
            "doRespectRgaa": prerogatives.doRespectRgaa,
        },
        serviceProviderCount,
        testUrl,
        versionMin,
    };
}
