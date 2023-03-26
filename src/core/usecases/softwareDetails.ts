import type { ThunkAction, State as RootState } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { ApiTypes } from "@codegouvfr/sill";
import { createSelector } from "@reduxjs/toolkit";
import {
    type State as SoftwareCatalogState,
    apiSoftwareToExternalCatalogSoftware
} from "./softwareCatalog";

export type State = State.NotReady | State.Ready;

export namespace State {
    export type NotReady = {
        stateDescription: "not ready";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        software: Software;
    };
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
            organization: string;
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
    "initialState": id<State>({
        "stateDescription": "not ready",
        "isInitializing": false
    }),
    "reducers": {
        "initializationStarted": () => ({
            "stateDescription": "not ready" as const,
            "isInitializing": true
        }),
        "initializationCompleted": (
            _state,
            { payload }: PayloadAction<{ software: State.Software }>
        ) => {
            const { software } = payload;

            return {
                "stateDescription": "ready",
                software
            };
        },
        "cleared": () => ({
            "stateDescription": "not ready" as const,
            "isInitializing": false
        })
    }
});

export const thunks = {
    "initialize":
        (params: { softwareName: string }): ThunkAction<void> =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, { sillApi }] = args;

            {
                const state = getState()[name];

                assert(
                    state.stateDescription === "not ready",
                    "The clear function should have been called"
                );

                if (state.isInitializing) {
                    return;
                }
            }

            dispatch(actions.initializationStarted());

            const software = apiSoftwareToSoftware({
                "apiSoftwares": await sillApi.getSoftwares(),
                "apiInstances": await sillApi.getInstances(),
                softwareName
            });

            dispatch(actions.initializationCompleted({ software }));
        },
    "clear":
        (): ThunkAction<void> =>
        (...args) => {
            const [dispatch, getState] = args;

            {
                const state = getState()[name];

                if (state.stateDescription === "not ready") {
                    return;
                }
            }

            dispatch(actions.cleared());
        }
};

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState[name];

        if (state.stateDescription !== "ready") {
            return undefined;
        }

        return state;
    };

    const software = createSelector(readyState, readyState => readyState?.software);

    return { software };
})();

function apiSoftwareToSoftware(params: {
    apiSoftwares: ApiTypes.Software[];
    apiInstances: ApiTypes.Instance[];
    softwareName: string;
}): State.Software {
    const { apiSoftwares, apiInstances, softwareName } = params;

    const apiSoftware = apiSoftwares.find(
        apiSoftware => apiSoftware.softwareName === softwareName
    );

    assert(apiSoftware !== undefined);

    const {
        softwareId,
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
        serviceProviderCount,
        compotoirDuLibreId,
        similarSoftwares: similarSoftwares_api,
        wikidataId,
        license,
        versionMin,
        softwareType,
        userAndReferentCountByOrganization
    } = apiSoftware;

    const parentSoftware: State.Software["parentSoftware"] = (() => {
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
        "referentCount": Object.values(userAndReferentCountByOrganization)
            .map(({ referentCount }) => referentCount)
            .reduce((prev, curr) => prev + curr, 0),
        "userCount": Object.values(userAndReferentCountByOrganization)
            .map(({ userCount }) => userCount)
            .reduce((prev, curr) => prev + curr, 0),
        parentSoftware,
        addedTime,
        "serviceProviderUrl": `https://comptoir-du-libre.org/fr/softwares/servicesProviders/${compotoirDuLibreId}`,
        "compotoirDuLibreUrl": `https://comptoir-du-libre.org/fr/softwares/${compotoirDuLibreId}`,
        "wikidataUrl": `https://www.wikidata.org/wiki/${wikidataId}`,
        "instances": apiInstances
            .filter(instance => instance.mainSoftwareSillId === softwareId)
            .map(instance => ({
                "instanceUrl": instance.publicUrl,
                "organization": instance.organization,
                "targetAudience": instance.targetAudience
            })),
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
