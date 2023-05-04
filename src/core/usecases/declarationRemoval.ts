import type { ThunkAction, State as RootState, CreateEvt } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import type { Param0 } from "tsafe";
import { assert } from "tsafe/assert";

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
        (params: {
            softwareName: string;
            declarationType: "user" | "referent";
        }): ThunkAction =>
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
};

export const selectors = (() => {
    const isRemovingUserDeclaration = (rootState: RootState) =>
        rootState[name].isRemovingUserDeclaration;

    return { isRemovingUserDeclaration };
})();

export const createEvt = ({ evtAction }: Param0<CreateEvt>) =>
    evtAction.pipe(action =>
        action.sliceName === name && action.actionName === "userOrReferentRemoved"
            ? [
                  {
                      "action": "close modal" as const
                  }
              ]
            : null
    );
assert<typeof createEvt extends CreateEvt ? true : false>();
