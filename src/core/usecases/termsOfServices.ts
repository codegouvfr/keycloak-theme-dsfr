import type { Thunks, State as RootState } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import type { Language } from "@codegouvfr/sill";
import { createSelector } from "@reduxjs/toolkit";

type State = State.NotInitialized | State.Ready;

namespace State {
    export type NotInitialized = {
        stateDescription: "not initialized";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        markdown: string;
    };
}

export const name = "termsOfServices";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<State>({
        "stateDescription": "not initialized",
        "isInitializing": false
    }),
    "reducers": {
        "initializationStarted": state => {
            if (state.stateDescription === "not initialized") {
                state.isInitializing = true;
            }
        },
        "initialized": (
            _state,
            {
                payload
            }: PayloadAction<{
                markdown: string;
            }>
        ) => {
            const { markdown } = payload;

            return {
                "stateDescription": "ready",
                markdown
            };
        }
    }
});

export const thunks = {
    "initialize":
        (params: { lang: Language }) =>
        async (...args) => {
            const { lang } = params;

            const [dispatch, getState, { sillApi }] = args;

            {
                const state = getState()[name];

                if (
                    state.stateDescription === "not initialized" &&
                    state.isInitializing
                ) {
                    return;
                }
            }

            dispatch(actions.initializationStarted());

            const markdown = await sillApi.getMarkdown({
                "name": "termsOfService",
                "language": lang
            });

            dispatch(actions.initialized({ markdown }));
        }
} satisfies Thunks;

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState[name];

        if (state.stateDescription !== "ready") {
            return undefined;
        }

        const { stateDescription, ...rest } = state;

        return rest;
    };

    const markdown = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }

        return state.markdown;
    });

    return { markdown };
})();
