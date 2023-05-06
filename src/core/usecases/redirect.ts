/* eslint-disable array-callback-return */
import type { Thunks, State as RootState } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture";
import type { PayloadAction } from "@reduxjs/toolkit";

export type State = {
    softwareNameBySillId: Record<number, string>;
};

export const name = "redirect" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": createObjectThatThrowsIfAccessed<State>(),
    "reducers": {
        "initialized": (_state, { payload }: PayloadAction<State>) => payload
    }
});

export const thunks = {};

export const privateThunks = {
    "initialize":
        () =>
        async (...args) => {
            const [dispatch, , { sillApi }] = args;

            dispatch(
                actions.initialized({
                    "softwareNameBySillId": Object.fromEntries(
                        (await sillApi.getSoftwares()).map(
                            ({ softwareId, softwareName }) => [softwareId, softwareName]
                        )
                    )
                })
            );
        }
} satisfies Thunks;

export const selectors = (() => {
    const softwareNameBySillId = (rootState: RootState) =>
        rootState[name].softwareNameBySillId;

    return {
        softwareNameBySillId
    };
})();
