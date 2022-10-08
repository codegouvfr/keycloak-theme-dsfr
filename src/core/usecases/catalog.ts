import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CompiledData } from "sill-api";
import { removeReferent, languages } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { ThunksExtraArgument, RootState } from "../setup";
import { waitForDebounceFactory } from "core/tools/waitForDebounce";
import memoize from "memoizee";
import { exclude } from "tsafe/exclude";
import { createResolveLocalizedString } from "i18nifty";
import { removeDuplicates } from "evt/tools/reducers/removeDuplicates";
import { same } from "evt/tools/inDepth/same";
import { arrDiff } from "evt/tools/reducers/diff";
import type { SoftwareRef } from "sill-api";

type CatalogExplorerState = CatalogExplorerState.NotFetched | CatalogExplorerState.Ready;

namespace CatalogExplorerState {
    export type Common = {
        queryString: string;
    };

    export type NotFetched = Common & {
        stateDescription: "not fetched";
        isFetching: boolean;
    };

    export type Ready = Common & {
        stateDescription: "ready";
        softwares: CompiledData.Software<"without referents">[];
        tags: string[];
        referentsBySoftwareId:
            | undefined
            | Record<
                  string,
                  {
                      referents: CompiledData.Software.WithReferent["referents"];
                      userIndex: number | undefined;
                  }
              >;
        isProcessing: boolean;
        displayCount: number;
    };
}

export const name = "catalog";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<CatalogExplorerState>(
        id<CatalogExplorerState.NotFetched>({
            "stateDescription": "not fetched",
            "isFetching": false,
            "queryString": "",
        }),
    ),
    "reducers": {
        "catalogsFetching": state => {
            assert(state.stateDescription === "not fetched");
            state.isFetching = true;
        },
        "catalogsFetched": (
            state,
            {
                payload,
            }: PayloadAction<
                Pick<
                    CatalogExplorerState.Ready,
                    "softwares" | "referentsBySoftwareId" | "tags"
                >
            >,
        ) => {
            const { softwares, referentsBySoftwareId, tags } = payload;

            return id<CatalogExplorerState.Ready>({
                "stateDescription": "ready",
                softwares,
                referentsBySoftwareId,
                "isProcessing": false,
                tags,
                "displayCount": 24,
                "queryString": state.queryString,
            });
        },
        "setQueryString": (
            state,
            { payload }: PayloadAction<{ queryString: string }>,
        ) => {
            const { queryString } = payload;

            state.queryString = queryString;

            if (queryString === "" && state.stateDescription === "ready") {
                state.displayCount = 24;
            }
        },
        "moreLoaded": state => {
            assert(state.stateDescription === "ready");

            state.displayCount += 24;
        },
        "processingStarted": state => {
            assert(state.stateDescription === "ready");

            state.isProcessing = true;
        },
        "tagCreated": (state, { payload }: PayloadAction<{ tag: string }>) => {
            const { tag } = payload;

            assert(state.stateDescription === "ready");

            state.tags.push(tag);
        },
        "userDeclaredReferent": (
            state,
            {
                payload,
            }: PayloadAction<{
                email: string;
                agencyName: string;
                firstName: string;
                familyName: string;
                isExpert: boolean;
                useCaseDescription: string;
                isPersonalUse: boolean;
                softwareId: number;
            }>,
        ) => {
            const {
                agencyName,
                softwareId,
                firstName,
                familyName,
                isExpert,
                email,
                useCaseDescription,
                isPersonalUse,
            } = payload;

            assert(state.stateDescription === "ready");

            const { referentsBySoftwareId } = state;

            assert(referentsBySoftwareId !== undefined);

            const referents = referentsBySoftwareId[softwareId];

            referents.referents.push({
                email,
                agencyName,
                firstName,
                familyName,
                isExpert,
                useCaseDescription,
                isPersonalUse,
            });

            referents.userIndex = referents.referents.length - 1;

            state.isProcessing = false;
        },
        "userNoLongerReferent": (
            state,
            {
                payload,
            }: PayloadAction<{
                softwareId: number;
            }>,
        ) => {
            const { softwareId } = payload;

            assert(state.stateDescription === "ready");

            const { referentsBySoftwareId } = state;

            assert(referentsBySoftwareId !== undefined);

            const referents = referentsBySoftwareId[softwareId];

            const { userIndex } = referents;

            assert(userIndex !== undefined);

            referents.referents.splice(userIndex, 1);

            referents.userIndex = undefined;

            state.isProcessing = false;
        },
        "softwareAddedOrUpdated": (
            state,
            {
                payload,
            }: PayloadAction<{ software: CompiledData.Software<"with referents"> }>,
        ) => {
            const { software } = payload;

            if (state.stateDescription === "not fetched") {
                return;
            }

            const { softwares, referentsBySoftwareId } = state;

            const oldSoftware = softwares.find(({ id }) => id === software.id);

            if (oldSoftware !== undefined) {
                softwares[softwares.indexOf(oldSoftware)!] = removeReferent(software);
            } else {
                softwares.push(removeReferent(software));

                assert(referentsBySoftwareId !== undefined);

                referentsBySoftwareId[software.id] = {
                    "referents": software.referents,
                    "userIndex": 0,
                };
            }
        },
        "userAgencyNameUpdated": (
            state,
            { payload }: PayloadAction<{ agencyName: string }>,
        ) => {
            if (state.stateDescription !== "ready") {
                return;
            }

            const { agencyName } = payload;

            const { referentsBySoftwareId } = state;

            assert(referentsBySoftwareId !== undefined);

            Object.values(referentsBySoftwareId).forEach(({ referents, userIndex }) => {
                if (userIndex === undefined) {
                    return;
                }

                referents[userIndex].agencyName = agencyName;
            });
        },
        "userEmailUpdated": (state, { payload }: PayloadAction<{ email: string }>) => {
            if (state.stateDescription !== "ready") {
                return;
            }

            const { email } = payload;

            const { referentsBySoftwareId } = state;

            assert(referentsBySoftwareId !== undefined);

            Object.values(referentsBySoftwareId).forEach(({ referents, userIndex }) => {
                if (userIndex === undefined) {
                    return;
                }

                referents[userIndex].email = email;
            });

            Object.values(referentsBySoftwareId).forEach(wrap => {
                if (wrap.userIndex !== undefined) {
                    return;
                }

                const index = wrap.referents.findIndex(
                    referent => referent.email === email,
                );

                if (index === -1) {
                    return;
                }

                wrap.userIndex = index;
            });
        },
        "softwareDereferenced": (
            state,
            {
                payload,
            }: PayloadAction<{
                softwareId: number;
                reason: string | undefined;
                time: number;
                lastRecommendedVersion: string | undefined;
            }>,
        ) => {
            const { softwareId, reason, time, lastRecommendedVersion } = payload;

            if (state.stateDescription === "not fetched") {
                return;
            }

            const software = state.softwares.find(software => software.id === softwareId);

            assert(software !== undefined);

            software.dereferencing = {
                time,
                reason,
                lastRecommendedVersion,
            };

            state.isProcessing = false;
        },
    },
});

export const thunks = {
    "fetchCatalog":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, getState, { sillApiClient, oidcClient }] = args;

            {
                const state = getState().catalog;

                if (state.stateDescription === "ready" || state.isFetching) {
                    return;
                }
            }

            dispatch(actions.catalogsFetching());

            dispatch(
                actions.catalogsFetched({
                    "softwares": (await sillApiClient.getCompiledData()).catalog,
                    "referentsBySoftwareId": !oidcClient.isUserLoggedIn
                        ? undefined
                        : await (async () => {
                              const email = getState().userAuthentication.email.value;

                              return Object.fromEntries(
                                  Object.entries(
                                      await sillApiClient.getReferentsBySoftwareId(),
                                  ).map(([softwareId, referents]) => [
                                      softwareId,
                                      {
                                          referents,
                                          "userIndex": (() => {
                                              const userReferent = referents.find(
                                                  referent => referent.email === email,
                                              );

                                              return userReferent === undefined
                                                  ? undefined
                                                  : referents.indexOf(userReferent);
                                          })(),
                                      },
                                  ]),
                              );
                          })(),
                    "tags": await sillApiClient.getTags(),
                }),
            );
        },
    "setQueryString":
        (params: { queryString: string }): ThunkAction =>
        async (...args) => {
            const { queryString } = params;
            const [dispatch, , extra] = args;

            const sliceContext = getSliceContext(extra);

            const { prevQueryString, waitForSearchDebounce } = sliceContext;

            const prevQuery = pure.parseQuery(prevQueryString);
            const query = pure.parseQuery(queryString);

            sliceContext.prevQueryString = queryString;

            update_tags: {
                if (same(prevQuery.tags, query.tags)) {
                    break update_tags;
                }

                dispatch(actions.setQueryString({ queryString }));

                return;
            }

            update_search: {
                if (prevQuery.search === query.search) {
                    break update_search;
                }

                const { search } = query;

                //NOTE: At least 3 character to trigger search
                if (queryString !== "" && search.length <= 2) {
                    break update_search;
                }

                debounce: {
                    //NOTE: We do note debounce if we detect that the search was restored from url or pasted.
                    if (Math.abs(search.length - prevQueryString.length) > 1) {
                        break debounce;
                    }

                    await waitForSearchDebounce();
                }

                dispatch(actions.setQueryString({ queryString }));
            }
        },
    "loadMore":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, , extraArg] = args;

            const { waitForLoadMoreDebounce } = getSliceContext(extraArg);

            await waitForLoadMoreDebounce();

            dispatch(actions.moreLoaded());
        },
    "getHasMoreToLoad":
        (): ThunkAction<boolean> =>
        (...args) => {
            const [, getState] = args;

            const state = getState().catalog;

            assert(state.stateDescription === "ready");

            const { displayCount, softwares } = state;

            return state.queryString === "" && displayCount < softwares.length;
        },
    "declareUserReferent":
        (params: {
            isExpert: boolean;
            useCaseDescription: string;
            isPersonalUse: boolean;
            softwareId: number;
        }): ThunkAction =>
        async (...args) => {
            const { isExpert, useCaseDescription, isPersonalUse, softwareId } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().catalog;

            assert(state.stateDescription === "ready");

            dispatch(actions.processingStarted());

            await sillApiClient.declareUserReferent({
                isExpert,
                softwareId,
                useCaseDescription,
                isPersonalUse,
            });

            const {
                agencyName: { value: agencyName },
                email: { value: email },
            } = getState().userAuthentication;

            dispatch(
                actions.userDeclaredReferent({
                    agencyName,
                    email,
                    "firstName": "",
                    "familyName": "",
                    isExpert,
                    softwareId,
                    useCaseDescription,
                    isPersonalUse,
                }),
            );
        },
    "dereferenceSoftware":
        (params: {
            softwareId: number;
            reason: string | undefined;
            lastRecommendedVersion: string | undefined;
        }): ThunkAction =>
        async (...args) => {
            const { softwareId, reason, lastRecommendedVersion } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().catalog;

            assert(state.stateDescription === "ready");

            const software = state.softwares.find(software => software.id === softwareId);

            assert(software !== undefined);

            dispatch(actions.processingStarted());

            const time = Date.now();

            await sillApiClient.dereferenceSoftware({
                softwareId,
                "dereferencing": {
                    reason,
                    lastRecommendedVersion,
                },
            });

            dispatch(
                actions.softwareDereferenced({
                    softwareId,
                    time,
                    lastRecommendedVersion,
                    reason,
                }),
            );
        },
    "userNoLongerReferent":
        (params: { softwareId: number }): ThunkAction =>
        async (...args) => {
            const { softwareId } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().catalog;

            assert(state.stateDescription === "ready");

            dispatch(actions.processingStarted());

            await sillApiClient.userNoLongerReferent({
                softwareId,
            });

            dispatch(
                actions.userNoLongerReferent({
                    softwareId,
                }),
            );
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction<void> =>
        (...args) => {
            const [dispatch, , { evtAction }] = args;

            evtAction.$attach(
                action =>
                    action.sliceName === "softwareForm" &&
                    action.actionName === "softwareAddedOrUpdated"
                        ? [action.payload.software]
                        : null,
                software => dispatch(actions.softwareAddedOrUpdated({ software })),
            );

            evtAction.$attach(
                action =>
                    action.sliceName === "userAuthentication" &&
                    action.actionName === "updateFieldStarted"
                        ? [action.payload]
                        : null,
                ({ fieldName, value }) =>
                    dispatch(
                        (() => {
                            switch (fieldName) {
                                case "agencyName":
                                    return actions.userAgencyNameUpdated({
                                        "agencyName": value,
                                    });
                                case "email":
                                    return actions.userEmailUpdated({ "email": value });
                            }
                        })(),
                    ),
            );

            evtAction.$attach(
                action =>
                    action.sliceName === "catalog" && action.actionName === "tagCreated"
                        ? [action.payload]
                        : null,
                ({ tag }) => dispatch(actions.tagCreated({ tag })),
            );
        },
};

const getSliceContext = memoize((_: ThunksExtraArgument) => {
    return {
        "waitForSearchDebounce": waitForDebounceFactory({ "delay": 750 }).waitForDebounce,
        "waitForLoadMoreDebounce": waitForDebounceFactory({ "delay": 50 })
            .waitForDebounce,
        "prevQueryString": "",
    };
});

export const selectors = (() => {
    const getSoftwareWeight = memoize(
        (software: CompiledData.Software): number =>
            JSON.stringify(software).length -
            (software.wikidataData?.logoUrl === undefined ? 10000 : 0),
    );

    const readyState = (rootState: RootState): CatalogExplorerState.Ready | undefined => {
        const state = rootState.catalog;
        switch (state.stateDescription) {
            case "ready":
                return state;
            default:
                return undefined;
        }
    };

    const sliceState = (
        rootState: RootState,
    ):
        | { stateDescription: "ready" }
        | { stateDescription: "not fetched"; isFetching: boolean } => {
        return rootState.catalog;
    };

    const queryString = (rootState: RootState) => rootState.catalog.queryString;

    const isProcessing = createSelector(readyState, readyState => {
        if (readyState === undefined) {
            return undefined;
        }

        return readyState.isProcessing;
    });

    const filteredSoftwares = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }

        const { queryString, softwares, referentsBySoftwareId, displayCount } = state;

        const query = pure.parseQuery(queryString);

        return [...softwares]
            .map(software => ({
                software,
                "isUserReferent":
                    referentsBySoftwareId?.[software.id].userIndex !== undefined,
            }))
            .sort((a, b) => getSoftwareWeight(b.software) - getSoftwareWeight(a.software))
            .sort((a, b) =>
                a.isUserReferent === b.isUserReferent ? 0 : a.isUserReferent ? -1 : 1,
            )
            .slice(0, queryString === "" ? displayCount : softwares.length)
            .map(({ software }) => software)
            .map(software =>
                software.dereferencing !== undefined ? undefined : software,
            )
            .filter(exclude(undefined))
            .filter(({ tags }) => arrDiff(tags ?? [], query.tags).added.length === 0)
            .filter(
                queryString === ""
                    ? () => true
                    : ({
                          id,
                          name,
                          function: fn,
                          license,
                          comptoirDuLibreSoftware,
                          wikidataData,
                          tags,
                          parentSoftware,
                          alikeSoftwares,
                      }) =>
                          [
                              name,
                              fn,
                              license,
                              comptoirDuLibreSoftware?.name,
                              ...(alikeSoftwares ?? [])
                                  .map(alikeSoftware =>
                                      alikeSoftware.isKnown
                                          ? undefined
                                          : alikeSoftware.softwareName,
                                  )
                                  .filter(exclude(undefined)),
                              ...(parentSoftware !== undefined
                                  ? parentSoftware.isKnown
                                      ? []
                                      : [parentSoftware.softwareName]
                                  : []),
                              ...(tags ?? []),
                              ...(["description", "label"] as const)
                                  .map(prop =>
                                      languages
                                          .map(language => {
                                              const description = wikidataData?.[prop];

                                              if (description === undefined) {
                                                  return undefined;
                                              }

                                              const { resolveLocalizedString } =
                                                  createResolveLocalizedString({
                                                      "currentLanguage": language,
                                                      "fallbackLanguage": "en",
                                                  });

                                              return resolveLocalizedString(description);
                                          })
                                          .filter(exclude(undefined))
                                          .reduce(...removeDuplicates<string>()),
                                  )
                                  .flat(),
                              wikidataData?.sourceUrl,
                              wikidataData?.websiteUrl,
                              ...(referentsBySoftwareId === undefined
                                  ? []
                                  : referentsBySoftwareId[id].referents
                                        .map(({ email, agencyName }) => [
                                            email,
                                            agencyName,
                                        ])
                                        .flat()),
                          ]
                              .map(e => (!!e ? e : undefined))
                              .filter(exclude(undefined))
                              .map(str => {
                                  const format = (str: string) =>
                                      str
                                          .normalize("NFD")
                                          .replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase();

                                  return format(str).includes(format(query.search));
                              })
                              .indexOf(true) >= 0,
            );
    });

    const softwares = createSelector(readyState, readyState => {
        if (readyState === undefined) {
            return undefined;
        }
        return readyState.softwares;
    });

    const softwareNameBySoftwareId = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }

        const { softwares } = state;

        const softwareNameBySoftwareId: Record<number, string> = {};

        softwares.forEach(({ id, name }) => (softwareNameBySoftwareId[id] = name));

        return softwareNameBySoftwareId;
    });

    const tags = createSelector(readyState, readyState => {
        if (readyState === undefined) {
            return undefined;
        }
        return readyState.tags;
    });

    const searchResultCount = createSelector(
        readyState,
        filteredSoftwares,
        (state, filteredSoftwares) => {
            if (state === undefined) {
                return undefined;
            }

            assert(filteredSoftwares !== undefined);

            const { queryString } = state;

            return queryString !== ""
                ? filteredSoftwares.length
                : state.softwares.filter(software => software.dereferencing === undefined)
                      .length;
        },
    );

    const referentsBySoftwareId = createSelector(readyState, readyState => {
        if (readyState === undefined) {
            return undefined;
        }

        return readyState.referentsBySoftwareId;
    });

    const alikeSoftwares = createSelector(
        readyState,
        filteredSoftwares,
        (state, filteredSoftwares) => {
            if (state === undefined) {
                return undefined;
            }

            assert(filteredSoftwares !== undefined);

            const n = 3;

            if (filteredSoftwares.length > n) {
                return [];
            }

            return filteredSoftwares
                .slice(0, n)
                .map(({ alikeSoftwares }) =>
                    (alikeSoftwares ?? []).map(softwareRef =>
                        softwareRef.isKnown
                            ? {
                                  "software": state.softwares.find(
                                      s => s.id === softwareRef.softwareId,
                                  )!,
                                  "isKnown": true as const,
                              }
                            : softwareRef,
                    ),
                )
                .flat();
        },
    );

    const softwareRefs = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }

        const { softwares } = state;

        return [
            ...softwares.map(
                ({ id }): SoftwareRef.Known => ({
                    "isKnown": true,
                    "softwareId": id,
                }),
            ),
            ...softwares
                .map(({ parentSoftware }) => parentSoftware)
                .filter(exclude(undefined)),
            ...softwares.map(({ alikeSoftwares }) => alikeSoftwares ?? []).flat(),
        ].reduce(...removeDuplicates<SoftwareRef>(same));
    });

    return {
        readyState,
        sliceState,
        queryString,
        isProcessing,
        softwares,
        filteredSoftwares,
        alikeSoftwares,
        softwareNameBySoftwareId,
        referentsBySoftwareId,
        tags,
        searchResultCount,
        softwareRefs,
    };
})();

export type Query = {
    search: string;
    tags: string[];
};

export const pure = (() => {
    function parseQuery(queryString: string): Query {
        if (!queryString.startsWith("{")) {
            return {
                "search": queryString,
                "tags": [],
            };
        }

        return JSON.parse(queryString);
    }

    function stringifyQuery(query: Query) {
        if (query.search === "" && query.tags.length === 0) {
            return "";
        }

        if (query.tags.length === 0) {
            return query.search;
        }

        return JSON.stringify(query);
    }

    return { stringifyQuery, parseQuery };
})();
