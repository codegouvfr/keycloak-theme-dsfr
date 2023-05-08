import type { Thunks, State as RootState } from "../core";
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
import { exclude } from "tsafe/exclude";
import { createUsecaseContextApi } from "redux-clean-architecture";
import { Evt } from "evt";

export type State = State.NotReady | State.Ready;

export namespace State {
    export type NotReady = {
        stateDescription: "not ready";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        software: Software;
        // undefined when not logged in
        userDeclaration:
            | {
                  isReferent: boolean;
                  isUser: boolean;
              }
            | undefined;
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
        latestVersion:
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
        prerogatives: Record<SoftwareCatalogState.Prerogative, boolean | undefined>;
        userCount: number;
        referentCount: number;
        testUrl: string | undefined;
        instances:
            | {
                  organization: string;
                  instanceUrl: string;
                  targetAudience: string;
              }[]
            | undefined;
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
                  description: string;
                  name: string;
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
            {
                payload
            }: PayloadAction<{
                software: State.Software;
                userDeclaration:
                    | {
                          isUser: boolean;
                          isReferent: boolean;
                      }
                    | undefined;
            }>
        ) => {
            const { software, userDeclaration } = payload;

            return {
                "stateDescription": "ready",
                software,
                "userDeclaration":
                    userDeclaration === undefined
                        ? undefined
                        : {
                              ...userDeclaration,
                              "isRemovingRole": false
                          }
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
        (params: { softwareName: string }) =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, extraArg] = args;

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

            const { sillApi, oidc, getUser, evtAction } = extraArg;

            {
                const context = getContext(extraArg);

                const ctx = Evt.newCtx();

                evtAction.attach(
                    action =>
                        action.sliceName === "declarationRemoval" &&
                        action.actionName === "userOrReferentRemoved",
                    ctx,
                    () => {
                        dispatch(thunks.clear());

                        dispatch(thunks.initialize({ softwareName }));
                    }
                );

                context.detachHandlers = () => ctx.done();
            }

            dispatch(actions.initializationStarted());

            const [apiSoftwares, apiInstances] = await Promise.all([
                sillApi.getSoftwares(),
                sillApi.getInstances()
            ]);

            const software = apiSoftwareToSoftware({
                apiSoftwares,
                apiInstances,
                softwareName
            });

            const userDeclaration: { isReferent: boolean; isUser: boolean } | undefined =
                await (async () => {
                    if (!oidc.isUserLoggedIn) {
                        return undefined;
                    }

                    const [{ agents }, user] = await Promise.all([
                        sillApi.getAgents(),
                        getUser()
                    ]);

                    const agent = agents.find(agent => agent.email === user.email);

                    if (agent === undefined) {
                        return {
                            "isReferent": false,
                            "isUser": false
                        };
                    }

                    return {
                        "isReferent":
                            agent.declarations.find(
                                d =>
                                    d.softwareName === softwareName &&
                                    d.declarationType === "referent"
                            ) !== undefined,
                        "isUser":
                            agent.declarations.find(
                                d =>
                                    d.softwareName === softwareName &&
                                    d.declarationType === "user"
                            ) !== undefined
                    };
                })();

            dispatch(actions.initializationCompleted({ software, userDeclaration }));
        },
    "clear":
        () =>
        (...args) => {
            const [dispatch, getState, extraArg] = args;

            {
                const state = getState()[name];

                if (state.stateDescription === "not ready") {
                    return;
                }
            }

            {
                const context = getContext(extraArg);

                assert(context.detachHandlers !== undefined);

                context.detachHandlers();

                context.detachHandlers = undefined;
            }

            dispatch(actions.cleared());
        }
} satisfies Thunks;

const { getContext } = createUsecaseContextApi(() => ({
    "detachHandlers": id<undefined | (() => void)>(undefined)
}));

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState[name];

        if (state.stateDescription !== "ready") {
            return undefined;
        }

        return state;
    };

    const software = createSelector(readyState, readyState => readyState?.software);

    const userDeclaration = createSelector(readyState, state => state?.userDeclaration);

    return { software, userDeclaration };
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
        latestVersion,
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
        latestVersion,
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
        "instances":
            softwareType.type !== "cloud"
                ? undefined
                : apiInstances
                      .filter(instance => instance.mainSoftwareSillId === softwareId)
                      .map(instance =>
                          instance.publicUrl === undefined
                              ? undefined
                              : {
                                    "instanceUrl": instance.publicUrl,
                                    "organization": instance.organization,
                                    "targetAudience": instance.targetAudience
                                }
                      )
                      .filter(exclude(undefined)),
        "similarSoftwares": similarSoftwares_api.map(softwareRef => {
            const software = apiSoftwareToExternalCatalogSoftware({
                apiSoftwares,
                "wikidataId": softwareRef.wikidataId
            });

            if (software === undefined) {
                return {
                    "isInSill": false,
                    "url": `https://www.wikidata.org/wiki/${softwareRef.wikidataId}`,
                    "description": softwareRef.wikidataDescription,
                    "name": softwareRef.wikidataLabel
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
            "isInstallableOnUserTerminal":
                softwareType.type === "stack"
                    ? undefined
                    : softwareType.type === "desktop",
            "isPresentInSupportContract": prerogatives.isPresentInSupportContract,
            "isFromFrenchPublicServices": prerogatives.isFromFrenchPublicServices,
            "doRespectRgaa": prerogatives.doRespectRgaa
        },
        serviceProviderCount,
        testUrl,
        versionMin
    };
}
