import type { ThunkAction, State as RootState } from "../setup";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import { exclude } from "tsafe/exclude";
import { createSelector } from "@reduxjs/toolkit";

export type State = State.NotReady | State.Ready;

export namespace State {
    export type NotReady = {
        stateDescription: "not ready";
        currentlyInitializingForSoftwareName: string | undefined;
    };

    export type Ready = {
        stateDescription: "ready";
        softwareName: string;
        users: SoftwareUser[];
        referents: SoftwareReferent[];
    };

    export type SoftwareUser = {
        organization: string;
        usecaseDescription: string;
        /** NOTE: undefined if the software is not of type desktop */
        os: "windows" | "linux" | "mac" | undefined;
        version: string;
        /** NOTE: Defined only when software is cloud */
        serviceUrl: string | undefined;
    };

    export type SoftwareReferent = {
        email: string;
        organization: string;
        isTechnicalExpert: boolean;
        usecaseDescription: string;
        /** NOTE: Can be not undefined only if cloud */
        serviceUrl: string | undefined;
    };
}

export const name = "softwareUserAndReferent" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<State>({
        "stateDescription": "not ready",
        "currentlyInitializingForSoftwareName": undefined
    }),
    "reducers": {
        "setSoftwareStart": (
            _state,
            { payload }: PayloadAction<{ softwareName: string }>
        ) => {
            const { softwareName } = payload;

            return {
                "stateDescription": "not ready",
                "currentlyInitializingForSoftwareName": softwareName
            };
        },
        "setSoftwareCompleted": (
            state,
            {
                payload
            }: PayloadAction<{
                users: State.SoftwareUser[];
                referents: State.SoftwareReferent[];
            }>
        ) => {
            const { users, referents } = payload;

            assert(state.stateDescription === "not ready");

            const softwareName = state.currentlyInitializingForSoftwareName;

            assert(softwareName !== undefined);

            return {
                "stateDescription": "ready",
                softwareName,
                users,
                referents
            };
        }
    }
});

export const thunks = {
    "setSoftware":
        (params: { softwareName: string }): ThunkAction<void> =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            {
                const state = getState().softwareUserAndReferent;

                if (
                    state.stateDescription === "not ready" &&
                    state.currentlyInitializingForSoftwareName === softwareName
                ) {
                    return;
                }
            }

            dispatch(actions.setSoftwareStart({ softwareName }));

            const agents = await sillApiClient.getAgents();

            const users: State.SoftwareUser[] = [];
            const referents: State.SoftwareReferent[] = [];

            for (const agent of agents) {
                user: {
                    const declaration = agent.declarations
                        .map(declaration =>
                            declaration.declarationType === "user"
                                ? declaration
                                : undefined
                        )
                        .filter(exclude(undefined))
                        .find(declaration => declaration.softwareName === softwareName);

                    if (declaration === undefined) {
                        break user;
                    }

                    users.push({
                        "organization": agent.organization,
                        "os": declaration.os,
                        "serviceUrl": declaration.serviceUrl,
                        "usecaseDescription": declaration.usecaseDescription,
                        "version": declaration.version
                    });
                }

                referent: {
                    const declaration = agent.declarations
                        .map(declaration =>
                            declaration.declarationType === "referent"
                                ? declaration
                                : undefined
                        )
                        .filter(exclude(undefined))
                        .find(declaration => declaration.softwareName === softwareName);

                    if (declaration === undefined) {
                        break referent;
                    }

                    const { email } = agent;

                    assert(email !== undefined);

                    referents.push({
                        email,
                        "organization": agent.organization,
                        "isTechnicalExpert": declaration.isTechnicalExpert,
                        "serviceUrl": declaration.serviceUrl,
                        "usecaseDescription": declaration.usecaseDescription
                    });
                }
            }

            dispatch(
                actions.setSoftwareCompleted({
                    users,
                    referents
                })
            );
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

    const users = createSelector(readyState, readyState => readyState?.users);
    const referents = createSelector(readyState, readyState => readyState?.referents);

    return { users, referents };
})();
