import type { ThunkAction, State as RootState } from "../core";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import { exclude } from "tsafe/exclude";
import { createSelector } from "@reduxjs/toolkit";
import type { ApiTypes } from "@codegouvfr/sill";

export type State = State.NotReady | State.Ready;

export namespace State {
    export type NotReady = {
        stateDescription: "not ready";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        softwareName: string;
        logoUrl: string | undefined;
        users: SoftwareUser[];
        referents: SoftwareReferent[];
    };

    export type SoftwareUser = {
        organization: string;
        usecaseDescription: string;
        /** NOTE: undefined if the software is not of type desktop */
        os: ApiTypes.Os | undefined;
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
        "isInitializing": false
    }),
    "reducers": {
        "initializationStarted": () => ({
            "stateDescription": "not ready" as const,
            "isInitializing": true
        }),
        "initializationCompleted": (
            _state,
            {
                payload
            }: PayloadAction<{
                softwareName: string;
                logoUrl: string | undefined;
                users: State.SoftwareUser[];
                referents: State.SoftwareReferent[];
            }>
        ) => {
            const { softwareName, logoUrl, users, referents } = payload;

            return {
                "stateDescription": "ready",
                softwareName,
                logoUrl,
                users,
                referents
            };
        },
        "cleared": () => ({
            "stateDescription": "not ready" as const,
            "isInitializing": false
        })
    }
});

export const thunks = {
    "initialize":
        (params: { softwareName: string }): ThunkAction<void> =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, { sillApi }] = args;

            {
                const state = getState()[name];

                if (state.stateDescription === "not ready" && state.isInitializing) {
                    return;
                }
            }

            dispatch(actions.initializationStarted());

            const { agents } = await sillApi.getAgents();

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

            const software = (await sillApi.getSoftwares()).find(
                software => software.softwareName === softwareName
            );

            assert(software !== undefined);

            dispatch(
                actions.initializationCompleted({
                    softwareName,
                    "logoUrl": software.logoUrl,
                    users,
                    referents
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

    const isReady = createSelector(readyState, readyState => readyState !== undefined);
    const logoUrl = createSelector(readyState, readyState => readyState?.logoUrl);
    const users = createSelector(readyState, readyState => readyState?.users);
    const referents = createSelector(readyState, readyState => readyState?.referents);

    return { isReady, logoUrl, users, referents };
})();
