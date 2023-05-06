import type { Thunks, State as RootState, CreateEvt } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import { id } from "tsafe/id";

export type State = {
    isRemovingUserDeclaration: boolean;
};

export const name = "declarationRemoval" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<State>({
        "isRemovingUserDeclaration": false
    }),
    "reducers": {
        "declarationRemovalStarted": state => {
            state.isRemovingUserDeclaration = true;
        },
        "userOrReferentRemoved": state => {
            state.isRemovingUserDeclaration = false;
        }
    }
});

export const thunks = {
    "removeAgentAsReferentOrUserFromSoftware":
        (params: { softwareName: string; declarationType: "user" | "referent" }) =>
        async (...args) => {
            const { declarationType, softwareName } = params;

            const [dispatch, , { sillApi }] = args;

            dispatch(actions.declarationRemovalStarted());

            await sillApi.removeUserOrReferent({
                declarationType,
                softwareName
            });

            dispatch(actions.userOrReferentRemoved());
        }
} satisfies Thunks;

export const selectors = (() => {
    const isRemovingUserDeclaration = (rootState: RootState) =>
        rootState[name].isRemovingUserDeclaration;

    return { isRemovingUserDeclaration };
})();

export const createEvt = (({ evtAction }) =>
    evtAction.pipe(action =>
        action.sliceName === name && action.actionName === "userOrReferentRemoved"
            ? [
                  {
                      "action": "close modal" as const
                  }
              ]
            : null
    )) satisfies CreateEvt;
