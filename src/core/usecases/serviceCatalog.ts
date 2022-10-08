import "minimal-polyfills/Object.fromEntries";
import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CompiledData } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { ThunksExtraArgument, RootState } from "../setup";
import { waitForDebounceFactory } from "core/tools/waitForDebounce";
import memoize from "memoizee";
import { exclude } from "tsafe/exclude";
import { thunks as catalogThunks, selectors as catalogSelectors } from "./catalog";
import { removeDuplicates } from "evt/tools/reducers/removeDuplicates";

export type ServiceWithSoftwareInfo = Omit<
    CompiledData.Service,
    "softwareSillId" | "softwareName" | "comptoirDuLibreId"
> & {
    deployedSoftware: { softwareName: string } & (
        | {
              isInSill: true;
              softwareId: number;
              logoUrl: string | undefined;
          }
        | {
              isInSill: false;
              comptoirDuLibreId: number | undefined;
          }
    );
};

type ServiceCatalogExplorerState =
    | ServiceCatalogExplorerState.NotFetched
    | ServiceCatalogExplorerState.Ready;

namespace ServiceCatalogExplorerState {
    export type Common = {
        queryString: string;
    };

    export type NotFetched = Common & {
        stateDescription: "not fetched";
        isFetching: boolean;
    };

    export type Ready = Common & {
        stateDescription: "ready";
        services: CompiledData.Service[];
        isProcessing: boolean;
        displayCount: number;
    };
}

export const name = "serviceCatalog";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<ServiceCatalogExplorerState>(
        id<ServiceCatalogExplorerState.NotFetched>({
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
            }: PayloadAction<Pick<ServiceCatalogExplorerState.Ready, "services">>,
        ) => {
            const { services } = payload;

            return id<ServiceCatalogExplorerState.Ready>({
                "stateDescription": "ready",
                services,
                "isProcessing": false,
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
        "serviceAddedOrUpdated": (
            state,
            { payload }: PayloadAction<{ service: CompiledData.Service }>,
        ) => {
            const { service } = payload;

            if (state.stateDescription === "not fetched") {
                return;
            }

            const { services } = state;

            const oldService = services.find(({ id }) => id === service.id);

            if (oldService !== undefined) {
                services[services.indexOf(oldService)!] = service;
            } else {
                services.push(service);
            }
        },
        "serviceDereferenced": (
            state,
            {
                payload,
            }: PayloadAction<{
                serviceId: number;
            }>,
        ) => {
            const { serviceId } = payload;

            if (state.stateDescription === "not fetched") {
                return;
            }

            const service = state.services.find(service => service.id === serviceId);

            assert(service !== undefined);

            state.services.splice(state.services.indexOf(service), 1);

            state.isProcessing = false;
        },
    },
});

export const thunks = {
    "fetchCatalog":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, getState, { sillApiClient }] = args;

            {
                const state = getState().serviceCatalog;

                if (state.stateDescription === "ready" || state.isFetching) {
                    return;
                }
            }

            dispatch(actions.catalogsFetching());

            //NOTE: We need that to be able to display the name of the service
            if (getState().catalog.stateDescription === "not fetched") {
                dispatch(catalogThunks.fetchCatalog());
            }

            dispatch(
                actions.catalogsFetched({
                    "services": (await sillApiClient.getCompiledData()).services,
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

            update_softwareId: {
                if (prevQuery.softwareName === query.softwareName) {
                    break update_softwareId;
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

            const state = getState().serviceCatalog;

            assert(state.stateDescription === "ready");

            const { displayCount, services } = state;

            return state.queryString === "" && displayCount < services.length;
        },
    "deleteService":
        (params: { serviceId: number }): ThunkAction =>
        async (...args) => {
            const { serviceId } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().serviceCatalog;

            assert(state.stateDescription === "ready");

            const service = state.services.find(service => service.id === serviceId);

            assert(service !== undefined);

            dispatch(actions.processingStarted());

            await sillApiClient.deleteService({
                serviceId,
            });

            dispatch(
                actions.serviceDereferenced({
                    serviceId,
                }),
            );
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction<void> =>
        (..._args) => {
            //const [dispatch, , { evtAction }] = args;
            /*
                    evtAction.$attach(
                        action =>
                            action.sliceName === "serviceForm" &&
                                action.actionName === "serviceAddedOrUpdated"
                                ? [action.payload.service]
                                : null,
                        service => dispatch(actions.serviceAddedOrUpdated({ service })),
                    );
                    */
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
    const readyState = (
        rootState: RootState,
    ): ServiceCatalogExplorerState.Ready | undefined => {
        const state = rootState.serviceCatalog;
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
        return rootState.serviceCatalog;
    };

    const queryString = (rootState: RootState) => rootState.catalog.queryString;

    const servicesBySoftwareId = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }

        const servicesBySoftwareId: Record<number, CompiledData.Service[] | undefined> =
            {};

        state.services.forEach(service => {
            if (service.softwareSillId === undefined) {
                return;
            }

            (servicesBySoftwareId[service.softwareSillId] ??= []).push(service);
        });

        return servicesBySoftwareId;
    });

    const serviceCountBySoftwareId = createSelector(
        servicesBySoftwareId,
        (servicesBySoftwareId): Record<number, number | undefined> | undefined => {
            if (servicesBySoftwareId === undefined) {
                return undefined;
            }

            return Object.fromEntries(
                Object.entries(servicesBySoftwareId)
                    .map(([softwareId, services]) =>
                        services === undefined ? undefined : [softwareId, services],
                    )
                    .filter(exclude(undefined))
                    .map(
                        ([softwareId, services]) =>
                            [softwareId, services.length] as const,
                    ),
            );
        },
    );

    const serviceWithSoftwares = createSelector(
        readyState,
        catalogSelectors.readyState,
        (state, softwareCatalogState) => {
            if (state === undefined) {
                return undefined;
            }

            if (softwareCatalogState === undefined) {
                return undefined;
            }

            const { services } = state;

            return [...services].map(
                (service): ServiceWithSoftwareInfo => ({
                    ...service,
                    //TODO: Avoid having to overwrite this
                    "description": `${service.serviceName}, ${service.description}`,
                    "serviceName": `${
                        service.serviceUrl.replace(/^https?:\/\//, "").split("/")[0]
                    } - ${service.agencyName}`,
                    "deployedSoftware":
                        service.softwareSillId === undefined
                            ? {
                                  "isInSill": false,
                                  "softwareName": service.softwareName,
                                  "comptoirDuLibreId": service.comptoirDuLibreId,
                              }
                            : {
                                  "isInSill": true,
                                  "softwareId": service.softwareSillId,
                                  ...(() => {
                                      const software =
                                          softwareCatalogState.softwares.find(
                                              software => software.id === service.id,
                                          );

                                      assert(software !== undefined);

                                      return {
                                          "softwareName": software.name,
                                          "logoUrl": software.wikidataData?.logoUrl,
                                      };
                                  })(),
                              },
                }),
            );
        },
    );

    const filteredServices = createSelector(
        readyState,
        serviceWithSoftwares,
        (state, serviceWithSoftwares) => {
            if (state === undefined) {
                return undefined;
            }

            if (serviceWithSoftwares === undefined) {
                return undefined;
            }

            const { queryString, services, displayCount } = state;

            const query = pure.parseQuery(queryString);

            return [...serviceWithSoftwares]
                .sort((a, b) => JSON.stringify(b).length - JSON.stringify(a).length)
                .slice(0, queryString === "" ? displayCount : services.length)
                .filter(
                    service =>
                        query.softwareName === undefined ||
                        service.deployedSoftware.softwareName === query.softwareName,
                )
                .filter(
                    query.search === ""
                        ? () => true
                        : ({
                              agencyName,
                              agencyUrl,
                              contentModerationMethod,
                              description,
                              lastUpdateDate,
                              publicSector,
                              publicationDate,
                              serviceName,
                              serviceUrl,
                              signupScope,
                              signupValidationMethod,
                              usageScope,
                              deployedSoftware,
                          }) =>
                              [
                                  agencyName,
                                  agencyUrl,
                                  contentModerationMethod,
                                  description,
                                  lastUpdateDate,
                                  publicSector,
                                  publicationDate,
                                  serviceName,
                                  serviceUrl,
                                  signupScope,
                                  signupValidationMethod,
                                  usageScope,
                                  deployedSoftware.softwareName,
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
        },
    );

    const searchResultCount = createSelector(
        readyState,
        filteredServices,
        (state, filteredSoftwares) => {
            if (state === undefined) {
                return undefined;
            }
            if (filteredSoftwares === undefined) {
                return undefined;
            }

            const { queryString } = state;

            return queryString !== "" ? filteredSoftwares.length : state.services.length;
        },
    );

    const softwareNames = createSelector(serviceWithSoftwares, serviceWithSoftwares => {
        if (serviceWithSoftwares === undefined) {
            return undefined;
        }

        return serviceWithSoftwares
            .map(service => service.deployedSoftware.softwareName)
            .reduce(...removeDuplicates<string>());
    });

    const isProcessing = createSelector(
        readyState,
        readyState => readyState?.isProcessing,
    );

    return {
        sliceState,
        queryString,
        filteredServices,
        serviceCountBySoftwareId,
        searchResultCount,
        servicesBySoftwareId,
        softwareNames,
        isProcessing,
    };
})();

export type Query = {
    search: string;
    softwareName: string | undefined;
};

export const pure = (() => {
    function parseQuery(queryString: string): Query {
        if (!queryString.startsWith("{")) {
            return {
                "search": queryString,
                "softwareName": undefined,
            };
        }

        return JSON.parse(queryString);
    }

    function stringifyQuery(query: Query) {
        if (query.search === "" && query.softwareName === undefined) {
            return "";
        }

        if (query.softwareName !== undefined) {
            return query.search;
        }

        return JSON.stringify(query);
    }

    return { stringifyQuery, parseQuery };
})();
