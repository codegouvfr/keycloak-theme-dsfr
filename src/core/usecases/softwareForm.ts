import type { ThunkAction, State as RootState, CreateEvt } from "../core";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { SillApi } from "../ports/SillApi";
import type { Param0 } from "tsafe";
import type { ApiTypes } from "@codegouvfr/sill";

type SoftwareFormState = SoftwareFormState.NotInitialized | SoftwareFormState.Ready;

namespace SoftwareFormState {
    export type NotInitialized = {
        stateDescription: "not ready";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "ready";
        step: number;
        formData: Partial<FormData>;
        softwareSillId?: number;
        isSubmitting: boolean;
    };
}

export type FormData = {
    step1: {
        softwareType: ApiTypes.SoftwareType;
    };
    step2: {
        wikidataId: string | undefined;
        comptoirDuLibreId: number | undefined;
        softwareName: string;
        softwareDescription: string;
        softwareLicense: string;
        softwareMinimalVersion: string;
    };
    step3: {
        isPresentInSupportContract: boolean | undefined;
        isFromFrenchPublicService: boolean;
    };
    step4: {
        similarSoftwares: {
            wikidataLabel: string;
            wikidataDescription: string;
            wikidataId: string;
        }[];
    };
};

export const name = "softwareForm" as const;

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<SoftwareFormState>({
        "stateDescription": "not ready",
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
        "initializedForUpdate": (
            _state,
            {
                payload
            }: PayloadAction<{
                softwareSillId: number;
                formData: FormData;
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
        "initializationStarted": state => {
            assert(state.stateDescription === "not ready");
            state.isInitializing = true;
        },
        "step1DataSet": (
            state,
            {
                payload
            }: PayloadAction<{
                formDataStep1: FormData["step1"];
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
                formDataStep2: FormData["step2"];
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
                formDataStep3: FormData["step3"];
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
                //NOTE: To be registered by SoftwareCatalog
                payload: _payload
            }: PayloadAction<{
                softwareName: string;
            }>
        ) => {
            return {
                "stateDescription": "not ready",
                "isInitializing": false
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
        (params: { softwareName: string | undefined }): ThunkAction =>
        async (...args) => {
            const { softwareName } = params;

            const [dispatch, getState, { sillApi }] = args;

            {
                const state = getState()[name];

                assert(
                    state.stateDescription === "not ready",
                    "The clear function should have been called"
                );

                if (state.isInitializing) {
                    return;
                }
            }

            if (softwareName === undefined) {
                dispatch(actions.initializedForCreate());
                return;
            }

            dispatch(actions.initializationStarted());

            const software = (await sillApi.getSoftwares()).find(
                software => software.softwareName === softwareName
            );

            assert(software !== undefined);

            dispatch(
                actions.initializedForUpdate({
                    "softwareSillId": software.softwareId,
                    "formData": {
                        "step1": {
                            "softwareType": software.softwareType
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
        },
    "setStep1Data":
        (props: { formDataStep1: FormData["step1"] }): ThunkAction<void> =>
        (...args) => {
            const { formDataStep1 } = props;

            const [dispatch] = args;

            dispatch(actions.step1DataSet({ formDataStep1 }));
        },
    "setStep2Data":
        (props: { formDataStep2: FormData["step2"] }): ThunkAction<void> =>
        (...args) => {
            const { formDataStep2 } = props;

            const [dispatch] = args;

            dispatch(actions.step2DataSet({ formDataStep2 }));
        },
    "setStep3Data":
        (props: { formDataStep3: FormData["step3"] }): ThunkAction<void> =>
        (...args) => {
            const { formDataStep3 } = props;

            const [dispatch] = args;

            dispatch(actions.step3DataSet({ formDataStep3 }));
        },
    "setStep4DataAndSubmit":
        (props: { formDataStep4: FormData["step4"] }): ThunkAction =>
        async (...args) => {
            const { formDataStep4 } = props;

            const [dispatch, getState, { sillApi }] = args;

            const state = getState()[name];

            assert(state.stateDescription === "ready");

            const { step1, step2, step3 } = state.formData;

            assert(step1 !== undefined);
            assert(step2 !== undefined);
            assert(step3 !== undefined);

            const formData: ApiTypes.SoftwareFormData = {
                "softwareType": step1.softwareType,
                "wikidataId": step2.wikidataId,
                "comptoirDuLibreId": step2.comptoirDuLibreId,
                "softwareName": step2.softwareName,
                "softwareDescription": step2.softwareDescription,
                "softwareLicense": step2.softwareLicense,
                "softwareMinimalVersion": step2.softwareMinimalVersion,
                "isPresentInSupportContract": step3.isPresentInSupportContract ?? false,
                "isFromFrenchPublicService": step3.isFromFrenchPublicService,
                "similarSoftwares": formDataStep4.similarSoftwares
            };

            await (state.softwareSillId !== undefined
                ? sillApi.updateSoftware({
                      "softwareSillId": state.softwareSillId,
                      formData
                  })
                : sillApi.createSoftware({
                      formData
                  }));

            sillApi.getSoftwares.clear();

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
    /** Can be used even if the usecase isn't instantiated */
    "getWikidataOptions":
        (props: {
            queryString: string;
        }): ThunkAction<ReturnType<SillApi["getWikidataOptions"]>> =>
        (...args) => {
            const { queryString } = props;

            const [, , { sillApi }] = args;

            return sillApi.getWikidataOptions({ queryString });
        },
    "getAutofillData":
        (props: {
            wikidataId: string;
        }): ThunkAction<
            ReturnType<SillApi["getSoftwareFormAutoFillDataFromWikidataAndOtherSources"]>
        > =>
        (...args) => {
            const { wikidataId } = props;

            const [, , extraArg] = args;

            return extraArg.sillApi.getSoftwareFormAutoFillDataFromWikidataAndOtherSources(
                { wikidataId }
            );
        }
};

export const selectors = (() => {
    const readyState = (rootState: RootState) => {
        const state = rootState[name];

        if (state.stateDescription !== "ready") {
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
