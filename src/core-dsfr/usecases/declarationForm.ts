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
        declarationType: "user" | "referent" | undefined;
        step: 1 | 2;
        isSubmitting: boolean;
        software: {
            logoUrl: string | undefined;
            softwareName: string;
            referentCount: number;
            userCount: number;
            softwareType: "desktop" | "cloud" | "other";
        };
    };
}

export type FormData = FormData.User | FormData.Referent;

export namespace FormData {
    export type User = SillApiClient.DeclarationFormData.User;
    export type Referent = SillApiClient.DeclarationFormData.Referent;
}

export const name = "declarationForm" as const;

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
            { payload }: PayloadAction<{ software: State.Ready["software"] }>
        ) => {
            const { software } = payload;

            return id<State.Ready>({
                "stateDescription": "ready",
                "declarationType": undefined,
                "isSubmitting": false,
                "step": 1,
                software
            });
        },
        "declarationTypeSet": (
            state,
            {
                payload
            }: PayloadAction<{ declarationType: State.Ready["declarationType"] }>
        ) => {
            const { declarationType } = payload;

            assert(state.stateDescription === "ready");

            assert(state.step === 1);

            state.step = 2;

            state.declarationType = declarationType;
        },
        "navigatedToPreviousStep": state => {
            assert(state.stateDescription === "ready");
            assert(state.step === 2);

            state.step = 1;
        },
        "submissionStarted": state => {
            assert(state.stateDescription === "ready");

            state.isSubmitting = true;
        },
        "formSubmitted": (
            _state,
            { payload: _payload }: PayloadAction<{ softwareName: string }>
        ) => ({
            "stateDescription": "not initialized",
            "isInitializing": false
        })
    }
});

export const thunks = {
    "initialize":
        (params: { softwareName: string }): ThunkAction =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().softwareForm;

            if (state.stateDescription === "ready" || state.isInitializing) {
                return;
            }

            dispatch(actions.initializationStarted());

            const software = (await sillApiClient.getSoftwares()).find(
                software => software.softwareName === softwareName
            );

            assert(software !== undefined);

            dispatch(
                actions.initialized({
                    "software": {
                        "logoUrl": software.logoUrl,
                        softwareName,
                        "referentCount": software.users.filter(
                            ({ type }) => type === "referent"
                        ).length,
                        "userCount": software.users.filter(({ type }) => type === "user")
                            .length,
                        "softwareType": (() => {
                            switch (software.softwareType.type) {
                                case "cloud":
                                    return "cloud";
                                case "desktop":
                                    return "desktop";
                                case "library":
                                    return "other";
                            }
                        })()
                    }
                })
            );
        },
    "setDeclarationType":
        (props: { declarationType: State.Ready["declarationType"] }): ThunkAction<void> =>
        (...args) => {
            const { declarationType } = props;

            const [dispatch] = args;

            dispatch(actions.declarationTypeSet({ declarationType }));
        },
    "navigateToPreviousStep":
        (): ThunkAction<void> =>
        (...args) => {
            const [dispatch] = args;

            dispatch(actions.navigatedToPreviousStep());
        },
    "submit":
        (props: { formData: FormData }): ThunkAction =>
        async (...args) => {
            const { formData } = props;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState()[name];

            assert(state.stateDescription === "ready");

            assert(formData.declarationType === state.declarationType);

            dispatch(actions.submissionStarted());

            await sillApiClient.createUserOrReferent({ formData });

            dispatch(
                actions.formSubmitted({ "softwareName": state.software.softwareName })
            );
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

    const isSubmitting = createSelector(
        readyState,
        readyState => readyState?.isSubmitting ?? false
    );

    const declarationType = createSelector(
        readyState,
        readyState => readyState?.declarationType
    );

    const software = createSelector(readyState, readyState => readyState?.software);

    return { step, isSubmitting, declarationType, software };
})();

export const createEvt = ({ evtAction }: Param0<CreateEvt>) => {
    return evtAction.pipe(action =>
        action.sliceName === name && action.actionName === "formSubmitted"
            ? [
                  {
                      "action": "redirect" as const,
                      "softwareName": action.payload.softwareName
                  }
              ]
            : null
    );
};
