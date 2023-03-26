import type { ThunkAction } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { State as RootState } from "../core";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture";
import { removeDuplicates } from "evt/tools/reducers/removeDuplicates";

export type State = {
    softwareCount: number;
    registeredUserCount: number;
    agentReferentCount: number;
    organizationCount: number;
};

export const name = "generalStats";

export const { reducer, actions } = createSlice({
    name,
    "initialState": createObjectThatThrowsIfAccessed<State>({
        "debugMessage": "Not yet initialized"
    }),
    "reducers": {
        "update": (_state, { payload }: PayloadAction<{ state: State }>) => {
            const { state } = payload;
            return state;
        }
    }
});

export const thunks = {};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, , extraArg] = args;

            const { sillApi, evtAction } = extraArg;

            const init = async () => {
                const [{ referentCount }, softwares, registeredUserCount] =
                    await Promise.all([
                        sillApi.getTotalReferentCount(),
                        sillApi.getSoftwares(),
                        sillApi.getRegisteredUserCount()
                    ]);

                dispatch(
                    actions.update({
                        "state": {
                            "agentReferentCount": referentCount,
                            "organizationCount": softwares
                                .map(software =>
                                    Object.keys(
                                        software.userAndReferentCountByOrganization
                                    )
                                )
                                .flat()
                                .reduce(...removeDuplicates()).length,
                            registeredUserCount,
                            "softwareCount": softwares.length
                        }
                    })
                );
            };

            evtAction.attach(
                action =>
                    (action.sliceName === "softwareForm" &&
                        action.actionName === "formSubmitted") ||
                    (action.sliceName === "declarationForm" &&
                        action.actionName === "formSubmitted"),
                () => init()
            );

            await init();
        }
};

export const selectors = (() => {
    const stats = (state: RootState) => state[name];

    return { stats };
})();
