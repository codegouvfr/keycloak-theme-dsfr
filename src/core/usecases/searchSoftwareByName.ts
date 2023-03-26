import type { ThunkAction, State as RootState } from "../core";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { ApiTypes } from "@codegouvfr/sill";

export type WikidataEntry = ApiTypes.WikidataEntry;

type State = State.NotInitialized | State.Ready;

namespace State {
    export type NotInitialized = {
        stateDescription: "not ready";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        allSillSoftwares: {
            softwareName: string;
            softwareSillId: number;
            softwareDescription: string;
        }[];
    };
}

export const name = "searchSoftwareByNameForm" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<State>({
        "stateDescription": "not ready",
        "isInitializing": false
    }),
    "reducers": {
        "initializationStarted": state => {
            assert(state.stateDescription === "not ready");
            state.isInitializing = true;
        },
        "initializationCompleted": (
            _state,
            {
                payload
            }: PayloadAction<{
                allSillSoftwares: {
                    softwareName: string;
                    softwareSillId: number;
                    softwareDescription: string;
                }[];
            }>
        ) => {
            const { allSillSoftwares } = payload;

            return {
                "stateDescription": "ready",
                allSillSoftwares
            };
        },
        "cleared": () => ({
            "stateDescription": "not ready" as const,
            "isInitializing": false
        })
    }
});

export const thunks = {};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
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

            const softwares = await sillApi.getSoftwares();

            const allSillSoftwares = softwares.map(
                ({ softwareName, softwareId, softwareDescription }) => ({
                    softwareDescription,
                    "softwareSillId": softwareId,
                    softwareName
                })
            );

            dispatch(
                actions.initializationCompleted({
                    allSillSoftwares
                })
            );
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

        if (state.stateDescription === "not ready") {
            return undefined;
        }

        return state;
    };

    const allSillSoftwares = createSelector(
        readyState,
        readyState => readyState?.allSillSoftwares
    );

    return { allSillSoftwares };
})();
