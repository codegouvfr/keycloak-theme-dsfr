import type { ThunkAction, State as RootState, CreateEvt } from "../setup";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { SillApiClient } from "../ports/SillApiClient";
import type { Param0 } from "tsafe";

type State = State.NotInitialized | State.Ready;

namespace State {
    export type NotInitialized = {
        stateDescription: "not initialized";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        step: 1 | 2;
        /** Defined when update */
        instanceId: number | undefined;
        mainSoftwareSillId: number | undefined;
        otherSoftwareInvolvedWikidataIds: string[];
        isSubmitting: boolean;
        allSillSoftwares: {
            softwareName: string;
            softwareSillId: number;
            softwareDescription: string;
        }[];
    };
}

export const name = "instanceForm" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<State>({
        "stateDescription": "not initialized",
        "isInitializing": false
    }),
    "reducers": {
        "initializationStarted": state => {
            assert(state.stateDescription === "not initialized");
            state.isInitializing = true;
        },
        "initialized": (
            _state,
            {
                payload
            }: PayloadAction<{
                instanceId: number | undefined;
                mainSoftwareSillId: number | undefined;
                otherSoftwareInvolvedWikidataIds: string[];
                allSillSoftwares: {
                    softwareName: string;
                    softwareSillId: number;
                    softwareDescription: string;
                }[];
            }>
        ) => {
            const {
                instanceId,
                mainSoftwareSillId,
                otherSoftwareInvolvedWikidataIds,
                allSillSoftwares
            } = payload;

            return {
                "stateDescription": "ready",
                "step": 1,
                instanceId,
                mainSoftwareSillId,
                otherSoftwareInvolvedWikidataIds,
                "isSubmitting": false,
                allSillSoftwares
            };
        },
        "step1Completed": (
            state,
            {
                payload
            }: PayloadAction<{
                mainSoftwareSillId: number;
                otherSoftwareInvolvedWikidataIds: string[];
            }>
        ) => {
            const { mainSoftwareSillId, otherSoftwareInvolvedWikidataIds } = payload;

            assert(state.stateDescription === "ready");

            state.mainSoftwareSillId = mainSoftwareSillId;
            state.otherSoftwareInvolvedWikidataIds = otherSoftwareInvolvedWikidataIds;
        },
        "navigatedToPreviousStep": state => {
            assert(state.stateDescription === "ready");
            state.step--;
        },
        "submissionStarted": state => {
            assert(state.stateDescription === "ready");
            state.isSubmitting = true;
        },
        "formSubmitted": (
            _state,
            {
                payload: _payload
            }: PayloadAction<{
                instanceId: number;
            }>
        ) => ({
            "stateDescription": "not initialized",
            "isInitializing": false
        })
    }
});

export const thunks = {
    "initialize":
        (
            params:
                | {
                      type: "update";
                      instanceId: number;
                  }
                | {
                      type: "create";
                      softwareName: string | undefined;
                  }
        ): ThunkAction =>
        async (...args) => {
            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState()[name];

            if (state.stateDescription === "ready" || state.isInitializing) {
                return;
            }

            dispatch(actions.initializationStarted());

            const softwares = await sillApiClient.getSoftwares();

            const allSillSoftwares = softwares.map(
                ({ softwareName, softwareId, softwareDescription }) => ({
                    softwareDescription,
                    "softwareSillId": softwareId,
                    softwareName
                })
            );

            switch (params.type) {
                case "update":
                    const instance = (await sillApiClient.getInstances()).find(
                        instance => instance.instanceId === params.instanceId
                    );

                    assert(instance !== undefined);

                    dispatch(
                        actions.initialized({
                            allSillSoftwares,
                            "instanceId": instance.instanceId,
                            "mainSoftwareSillId": instance.mainSoftwareSillId,
                            "otherSoftwareInvolvedWikidataIds":
                                instance.otherSoftwaresInvolved.map(
                                    ({ wikidataId }) => wikidataId
                                )
                        })
                    );

                    break;
                case "create":
                    const software =
                        params.softwareName === undefined
                            ? undefined
                            : softwares.find(
                                  software =>
                                      software.softwareName === params.softwareName
                              );

                    dispatch(
                        actions.initialized({
                            allSillSoftwares,
                            "instanceId": undefined,
                            "mainSoftwareSillId": software?.softwareId,
                            "otherSoftwareInvolvedWikidataIds": []
                        })
                    );

                    break;
            }
        },
    "step1Completed":
        (props: {
            mainSoftwareSillId: number;
            otherSoftwareInvolvedWikidataIds: string[];
        }): ThunkAction<void> =>
        (...args) => {
            const { mainSoftwareSillId, otherSoftwareInvolvedWikidataIds } = props;

            const [dispatch] = args;

            dispatch(
                actions.step1Completed({
                    mainSoftwareSillId,
                    otherSoftwareInvolvedWikidataIds
                })
            );
        },
    "submit":
        (props: {
            targetAudience: string;
            publicUrl: string | undefined;
            organization: string;
        }): ThunkAction =>
        async (...args) => {
            const { targetAudience, publicUrl, organization } = props;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState()[name];

            assert(state.stateDescription === "ready");

            const { mainSoftwareSillId, otherSoftwareInvolvedWikidataIds } = state;

            assert(mainSoftwareSillId !== undefined);
            assert(otherSoftwareInvolvedWikidataIds !== undefined);

            const instanceDescription = {
                mainSoftwareSillId,
                organization,
                otherSoftwareInvolvedWikidataIds,
                publicUrl,
                targetAudience
            };

            let instanceId = state.instanceId;

            dispatch(actions.submissionStarted());

            if (instanceId !== undefined) {
                await sillApiClient.updateInstance({
                    ...instanceDescription,
                    instanceId
                });
            } else {
                instanceId = (await sillApiClient.createInstance(instanceDescription))
                    .instanceId;
            }

            sillApiClient.getInstances.clear();

            dispatch(actions.formSubmitted({ instanceId }));
        },
    "returnToPreviousStep":
        (): ThunkAction<void> =>
        (...args) => {
            const [dispatch] = args;

            dispatch(actions.navigatedToPreviousStep());
        },
    "getWikidataOptions":
        (props: {
            queryString: string;
        }): ThunkAction<ReturnType<SillApiClient["getWikidataOptions"]>> =>
        (...args) => {
            const { queryString } = props;

            const [, , { sillApiClient }] = args;

            return sillApiClient.getWikidataOptions({ queryString });
        }
};

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState[name];

        if (state.stateDescription === "not initialized") {
            return undefined;
        }

        return state;
    };

    const step = createSelector(readyState, readyState => readyState?.step);

    const initializationData = createSelector(readyState, readyState => {
        if (readyState === undefined) {
            return undefined;
        }

        const { mainSoftwareSillId, otherSoftwareInvolvedWikidataIds } = readyState;

        return {
            mainSoftwareSillId,
            otherSoftwareInvolvedWikidataIds
        };
    });

    const isSubmitting = createSelector(
        readyState,
        readyState => readyState?.isSubmitting ?? false
    );

    const allSillSoftwares = createSelector(
        readyState,
        readyState => readyState?.allSillSoftwares
    );

    return { step, initializationData, allSillSoftwares, isSubmitting };
})();

export const createEvt = ({ evtAction }: Param0<CreateEvt>) => {
    return evtAction.pipe(action =>
        action.sliceName === name && action.actionName === "formSubmitted"
            ? [
                  {
                      "action": "redirect" as const,
                      "softwareName": action.payload.instanceId
                  }
              ]
            : null
    );
};
