import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Software } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { ThunksExtraArgument, RootState } from "../setup";
import { waitForDebounceFactory } from "core/tools/waitForDebounce";
import memoize from "memoizee";
import { exclude } from "tsafe/exclude";

type CatalogExplorerState = CatalogExplorerState.NotFetched | CatalogExplorerState.Ready;

namespace CatalogExplorerState {
    export type NotFetched = {
        stateDescription: "not fetched";
        isFetching: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        "~internal": {
            softwares: Software[];
        };
        search: string;
    };
}

export const { name, reducer, actions } = createSlice({
    "name": "catalogExplorer",
    "initialState": id<CatalogExplorerState>(
        id<CatalogExplorerState.NotFetched>({
            "stateDescription": "not fetched",
            "isFetching": false,
        }),
    ),
    "reducers": {
        "catalogsFetching": state => {
            assert(state.stateDescription === "not fetched");
            state.isFetching = true;
        },
        "catalogsFetched": (
            _state,
            {
                payload,
            }: PayloadAction<{
                softwares: Software[];
            }>,
        ) => {
            const { softwares } = payload;

            return id<CatalogExplorerState.Ready>({
                "stateDescription": "ready",
                "~internal": { softwares },
                "search": "",
            });
        },
        "setSearch": (state, { payload }: PayloadAction<{ search: string }>) => {
            const { search } = payload;

            assert(state.stateDescription === "ready");

            state.search = search;
        },
    },
});

export const thunks = {
    "fetchCatalogs":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, , { sillApiClient }] = args;

            dispatch(actions.catalogsFetching());

            const softwares = await sillApiClient.getSoftware();

            dispatch(actions.catalogsFetched({ softwares }));
        },
    "setSearch":
        (params: { search: string }): ThunkAction =>
        async (...args) => {
            const { search } = params;
            const [dispatch, getState, extra] = args;

            const { waitForSearchDebounce } = getSliceContext(extra);

            await waitForSearchDebounce();

            if (getState().catalogExplorer.stateDescription !== "ready") {
                return;
            }

            dispatch(actions.setSearch({ search }));
        },
};

const getSliceContext = memoize((_: ThunksExtraArgument) => {
    const { waitForDebounce } = waitForDebounceFactory({ "delay": 500 });
    return {
        "waitForSearchDebounce": waitForDebounce,
    };
});

export const selectors = (() => {
    const getSoftwareWeight = memoize(
        (software: Software): number => JSON.stringify(software).length,
    );

    const filteredSoftwares = (rootState: RootState) => {
        const state = rootState.catalogExplorer;

        if (state.stateDescription !== "ready") {
            return undefined;
        }

        const {
            search,
            "~internal": { softwares },
        } = state;

        return [...softwares]
            .sort((a, b) => getSoftwareWeight(a) - getSoftwareWeight(b))
            .filter(
                ({ name, function: fn, license, comptoirDuLibreSoftware, wikidata }) =>
                    [
                        name,
                        fn,
                        license,
                        comptoirDuLibreSoftware?.name,
                        wikidata?.descriptionFr,
                        wikidata?.descriptionFr,
                        wikidata?.sourceUrl,
                        wikidata?.websiteUrl,
                    ]
                        .map(e => (!!e ? e : undefined))
                        .filter(exclude(undefined))
                        .map(str => str.toLowerCase().includes(search.toLowerCase()))
                        .indexOf(true) >= 0,
            );
    };

    return { filteredSoftwares };
})();
