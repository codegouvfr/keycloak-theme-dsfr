import type { ThunkAction, State as RootState, CreateEvt } from "../setup";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { SillApiClient } from "../ports/SillApiClient";
import type { Param0 } from "tsafe";

type SoftwareFormState = SoftwareFormState.NotInitialized | SoftwareFormState.Ready;

namespace SoftwareFormState {
    export type NotInitialized = {
        stateDescription: "not initialized";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        step: number;
        formData: Partial<SillApiClient.FormData>;
        softwareSillId?: number;
        isSubmitting: boolean;
    };
}

export const name = "softwareForm" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<SoftwareFormState>({
        "stateDescription": "not initialized",
        "isInitializing": false
    }),
    "reducers": {
        "initializedForCreate": () =>
            id<SoftwareFormState.Ready>({
                "stateDescription": "ready",
                "formData": {},
                "softwareSillId": undefined,
                "step": 1,
                "isSubmitting": false
            }),
        "initializationStarted": state => {
            assert(state.stateDescription === "not initialized");
            state.isInitializing = true;
        },
        "initializeForUpdate": (
            _state,
            {
                payload
            }: PayloadAction<{
                softwareSillId: number;
                formData: SillApiClient.FormData;
            }>
        ) => {
            const { formData, softwareSillId } = payload;

            return {
                "stateDescription": "ready",
                "step": 1,
                softwareSillId,
                formData,
                "isSubmitting": false
            };
        },
        "step1DataSet": (
            state,
            {
                payload
            }: PayloadAction<{
                formDataStep1: SillApiClient.FormData["step1"];
            }>
        ) => {
            const { formDataStep1 } = payload;

            assert(state.stateDescription === "ready");

            state.formData.step1 = formDataStep1;
            state.step++;
        },
        "step2DataSet": (
            state,
            {
                payload
            }: PayloadAction<{
                formDataStep2: SillApiClient.FormData["step2"];
            }>
        ) => {
            const { formDataStep2 } = payload;

            assert(state.stateDescription === "ready");

            state.formData.step2 = formDataStep2;
            state.step++;
        },
        "step3DataSet": (
            state,
            {
                payload
            }: PayloadAction<{
                formDataStep3: SillApiClient.FormData["step3"];
            }>
        ) => {
            const { formDataStep3 } = payload;

            assert(state.stateDescription === "ready");

            state.formData.step3 = formDataStep3;
            state.step++;
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
                softwareName: string;
            }>
        ) => {
            return {
                "stateDescription": "not initialized",
                "isInitializing": false
            };
        }
    }
});

export const thunks = {
    "initialize":
        (params: { softwareName: string | undefined }): ThunkAction =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().softwareForm;

            if (state.stateDescription === "ready" || state.isInitializing) {
                return;
            }

            if (softwareName === undefined) {
                dispatch(actions.initializedForCreate());
                return;
            }

            dispatch(actions.initializationStarted());

            const software = (await sillApiClient.getSoftwares()).find(
                software => software.softwareName === softwareName
            );

            assert(software !== undefined);

            dispatch(
                actions.initializeForUpdate({
                    "softwareSillId": software.softwareId,
                    "formData": {
                        "step1":
                            software.softwareType.type === "desktop"
                                ? {
                                      "softwareType": "desktop",
                                      "os": software.softwareType.os
                                  }
                                : {
                                      "softwareType": software.softwareType.type
                                  },
                        "step2": {
                            "wikidataId": software.wikidataId,
                            "comptoirDuLibreId": software.compotoirDuLibreId,
                            "softwareDescription": software.softwareDescription,
                            "softwareLicense": software.license,
                            "softwareMinimalVersion": software.versionMin,
                            "softwareName": software.softwareName
                        },
                        "step3": {
                            "isPresentInSupportContract":
                                software.prerogatives.isPresentInSupportContract,
                            "isFromFrenchPublicService":
                                software.prerogatives.isFromFrenchPublicServices
                        },
                        "step4": {
                            "similarSoftwares": software.similarSoftwares
                        }
                    }
                })
            );
        },
    "setStep1Data":
        (props: { formDataStep1: SillApiClient.FormData["step1"] }): ThunkAction<void> =>
        (...args) => {
            const { formDataStep1 } = props;

            const [dispatch] = args;

            dispatch(actions.step1DataSet({ formDataStep1 }));
        },
    "setStep2Data":
        (props: { formDataStep2: SillApiClient.FormData["step2"] }): ThunkAction<void> =>
        (...args) => {
            const { formDataStep2 } = props;

            const [dispatch] = args;

            dispatch(actions.step2DataSet({ formDataStep2 }));
        },
    "setStep3Data":
        (props: { formDataStep3: SillApiClient.FormData["step3"] }): ThunkAction<void> =>
        (...args) => {
            const { formDataStep3 } = props;

            const [dispatch] = args;

            dispatch(actions.step3DataSet({ formDataStep3 }));
        },
    "setStep4DataAndSubmit":
        (props: { formDataStep4: SillApiClient.FormData["step4"] }): ThunkAction =>
        async (...args) => {
            const { formDataStep4 } = props;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().softwareForm;

            assert(state.stateDescription === "ready");

            const { step1, step2, step3 } = state.formData;

            assert(step1 !== undefined);
            assert(step2 !== undefined);
            assert(step3 !== undefined);

            const formData = {
                step1,
                step2,
                step3,
                "step4": formDataStep4
            };

            if (state.softwareSillId !== undefined) {
                await sillApiClient.updateSoftware({
                    "softwareSillId": state.softwareSillId,
                    formData
                });
            } else {
                await sillApiClient.createSoftware({
                    formData
                });
            }

            dispatch(
                actions.formSubmitted({
                    "softwareName": step2.softwareName
                })
            );
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
        },
    "getAutofillData":
        (props: {
            wikidataId: string;
        }): ThunkAction<
            ReturnType<
                SillApiClient["getSoftwareFormAutoFillDataFromWikidataAndOtherSources"]
            >
        > =>
        (...args) => {
            const { wikidataId } = props;

            const [, , extraArg] = args;

            return extraArg.sillApiClient.getSoftwareFormAutoFillDataFromWikidataAndOtherSources(
                { wikidataId }
            );
        }
};

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState.softwareForm;

        if (state.stateDescription === "not initialized") {
            return undefined;
        }

        return state;
    };

    const step = createSelector(readyState, readyState => readyState?.step);

    const formData = createSelector(readyState, readyState => readyState?.formData);

    const isSubmitting = createSelector(
        readyState,
        readyState => readyState?.isSubmitting ?? false
    );

    const isLastStep = createSelector(readyState, readyState => readyState?.step === 4);

    return { step, formData, isSubmitting, isLastStep };
})();

export const createEvt = ({ evtAction }: Param0<CreateEvt>) => {
    return evtAction.pipe(action =>
        action.sliceName === "softwareForm" && action.actionName === "formSubmitted"
            ? [
                  {
                      "action": "redirect" as const,
                      "softwareName": action.payload.softwareName
                  }
              ]
            : null
    );
};
