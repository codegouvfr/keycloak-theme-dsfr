import "minimal-polyfills/Object.fromEntries";
import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CompiledData } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { RootState } from "../setup";
import { objectKeys } from "tsafe/objectKeys";
import {
    selectors as serviceCatalogSelectors,
    thunks as serviceCatalogThunks,
} from "./serviceCatalog";
import { selectors as catalogSelector, thunks as catalogThunks } from "./catalog";

type ServiceFormData = {
    description: string;
    agencyName: string;
    serviceUrl: string;
    softwareName: string;
};

export type FieldErrorMessageKey = "mandatory field";

type FieldError =
    | { hasError: false }
    | {
          hasError: true;
          errorMessageKey: FieldErrorMessageKey;
      };

type ServiceFormState =
    | ServiceFormState.NotInitialized
    | ServiceFormState.Ready
    | ServiceFormState.Submitted;

namespace ServiceFormState {
    export type NotInitialized = {
        stateDescription: "not initialized";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "form ready";
        formData: ServiceFormData;
        defaultFormData: ServiceFormData;
        hasLostFocusAtLeastOnceByFieldName: Record<keyof ServiceFormData, boolean>;
        serviceId: number | undefined;
        isSubmitting: boolean;
        //NOTE: Sorted by most present in already existing services first
        softwares: { name: string; sillId: number }[];
    };

    export type Submitted = {
        stateDescription: "form submitted";
        //NOTE: For setting a search after submission of the form
        serviceUrl: string;
    };
}

export const name = "serviceForm";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<ServiceFormState>(
        id<ServiceFormState.NotInitialized>({
            "stateDescription": "not initialized",
            "isInitializing": false,
        }),
    ),
    "reducers": {
        "initializationStarted": () =>
            id<ServiceFormState.NotInitialized>({
                "stateDescription": "not initialized",
                "isInitializing": true,
            }),
        "initialized": (
            _state,
            {
                payload,
            }: PayloadAction<{
                formData: ServiceFormData;
                serviceId: number | undefined;
                softwares: { name: string; sillId: number }[];
            }>,
        ) => {
            const { formData, serviceId, softwares } = payload;

            return id<ServiceFormState.Ready>({
                "stateDescription": "form ready",
                formData,
                "defaultFormData": formData,
                "hasLostFocusAtLeastOnceByFieldName": Object.fromEntries(
                    objectKeys(formData).map(key => [key, false]),
                ) as any,
                serviceId,
                "isSubmitting": false,
                softwares,
            });
        },
        "focusLost": (
            state,
            { payload }: PayloadAction<{ fieldName: keyof ServiceFormData }>,
        ) => {
            const { fieldName } = payload;

            assert(state.stateDescription === "form ready");

            state.hasLostFocusAtLeastOnceByFieldName[fieldName] = true;
        },
        "serviceAddedOrUpdated": (
            _state,
            {
                payload,
            }: PayloadAction<{
                //NOTE: The extra information is not used in the reducer, but is used in the service catalog explorer.
                service: CompiledData.Service;
            }>,
        ) => {
            const { service } = payload;

            return id<ServiceFormState.Submitted>({
                "stateDescription": "form submitted",
                "serviceUrl": service.serviceUrl,
            });
        },
        "submissionStarted": state => {
            assert(state.stateDescription === "form ready");

            state.isSubmitting = true;
        },
        "fieldValueChanged": (
            state,
            {
                payload,
            }: PayloadAction<{
                fieldName: keyof ServiceFormData;
                value: ServiceFormData[keyof ServiceFormData];
            }>,
        ) => {
            const { fieldName, value } = payload;

            assert(state.stateDescription === "form ready");

            (state.formData as any)[fieldName] = value;
        },
    },
});

export const thunks = {
    "initialize":
        (params: { serviceId: number | undefined }): ThunkAction<void> =>
        async (...args) => {
            const { serviceId } = params;

            const [dispatch, getState, { evtAction }] = args;

            dispatch(actions.initializationStarted());

            if (getState().catalog.stateDescription === "not fetched") {
                dispatch(catalogThunks.fetchCatalog());

                await evtAction.waitFor(
                    action =>
                        action.sliceName === "catalog" &&
                        action.actionName === "catalogsFetched",
                );
            }

            const softwareNameBySoftwareId = catalogSelector.softwareNameBySoftwareId(
                getState(),
            );

            assert(softwareNameBySoftwareId !== undefined);

            if (getState().serviceCatalog.stateDescription === "not fetched") {
                dispatch(serviceCatalogThunks.fetchCatalog());

                await evtAction.waitFor(
                    action =>
                        action.sliceName === "serviceCatalog" &&
                        action.actionName === "catalogsFetched",
                );
            }

            const services = serviceCatalogSelectors.serviceWithSoftwares(getState());

            assert(services !== undefined);

            const softwares = Object.entries(softwareNameBySoftwareId)
                .map(([sillIdStr, name]) => ({
                    name,
                    "sillId": parseInt(sillIdStr),
                    "count": services.filter(
                        service =>
                            service.deployedSoftware.isInSill &&
                            service.deployedSoftware.softwareName === name,
                    ).length,
                }))
                .sort((a, b) => b.count - a.count)
                .map(({ count, ...rest }) => rest);

            const service = (() => {
                if (serviceId === undefined) {
                    return undefined;
                }

                const service = services.find(service => service.id === serviceId);

                assert(service !== undefined);

                return service;
            })();

            dispatch(
                actions.initialized({
                    "formData":
                        service === undefined
                            ? {
                                  "description": "",
                                  "agencyName": "",
                                  "serviceUrl": "",
                                  "softwareName": "",
                              }
                            : {
                                  "description": service.description,
                                  "agencyName": service.agencyName,
                                  "serviceUrl": service.serviceUrl,
                                  "softwareName": service.deployedSoftware.softwareName,
                              },
                    serviceId,
                    softwares,
                }),
            );
        },
    "focusLost":
        (params: { fieldName: keyof ServiceFormData }): ThunkAction<void> =>
        (...args) => {
            const { fieldName } = params;

            const [dispatch] = args;

            dispatch(actions.focusLost({ fieldName }));
        },
    "restoreFieldDefaultValue":
        (params: { fieldName: keyof ServiceFormData }): ThunkAction<void> =>
        (...args) => {
            const { fieldName } = params;

            const [dispatch, getState] = args;

            const state = getState().serviceForm;

            assert(state.stateDescription === "form ready");

            dispatch(
                actions.fieldValueChanged({
                    fieldName,
                    "value": state.defaultFormData[fieldName],
                }),
            );
        },
    "changeFieldValue":
        (params: {
            fieldName: keyof ServiceFormData;
            value: ServiceFormData[keyof ServiceFormData];
        }): ThunkAction =>
        async (...args) => {
            const { fieldName, value } = params;

            const [dispatch] = args;

            dispatch(actions.fieldValueChanged({ fieldName, value }));
        },
    "submit":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().serviceForm;

            assert(state.stateDescription === "form ready");

            dispatch(actions.submissionStarted());

            const serviceFormData = {
                "description": state.formData.description,
                "agencyName": state.formData.agencyName,
                "serviceUrl": state.formData.serviceUrl,
                "deployedSoftware": (() => {
                    const software = state.softwares.find(
                        ({ name }) => state.formData.softwareName === name,
                    );

                    return software !== undefined
                        ? ({
                              "isInSill": true,
                              "softwareSillId": software.sillId,
                          } as const)
                        : ({
                              "isInSill": false,
                              "softwareName": state.formData.softwareName,
                          } as const);
                })(),
            };

            const { service } = await (state.serviceId !== undefined
                ? sillApiClient.updateService({
                      "serviceId": state.serviceId,
                      serviceFormData,
                  })
                : sillApiClient.addService({
                      serviceFormData,
                  }));

            dispatch(actions.serviceAddedOrUpdated({ service }));
        },
};

export const selectors = (() => {
    const readyState = (rootState: RootState): ServiceFormState.Ready | undefined => {
        const state = rootState.serviceForm;
        switch (state.stateDescription) {
            case "form ready":
                return state;
            default:
                return undefined;
        }
    };

    const fieldErrorByFieldName = createSelector(
        readyState,
        (state): Record<keyof ServiceFormData, FieldError> | undefined => {
            if (state === undefined) {
                return undefined;
            }

            return {
                ...(() => {
                    const fieldName = "description";

                    const value: FieldError = (() => {
                        if (state.formData[fieldName] === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
                ...(() => {
                    const fieldName = "agencyName";

                    const value: FieldError = (() => {
                        if (state.formData[fieldName] === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
                ...(() => {
                    const fieldName = "serviceUrl";

                    const value: FieldError = (() => {
                        if (state.formData[fieldName] === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
                ...(() => {
                    const fieldName = "softwareName";

                    const value: FieldError = (() => {
                        if (state.formData[fieldName] === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
            };
        },
    );

    const displayableFieldErrorByFieldName = createSelector(
        readyState,
        fieldErrorByFieldName,
        (
            state,
            fieldErrorByFieldName,
        ): Record<keyof ServiceFormData, FieldError> | undefined => {
            if (state === undefined) {
                return undefined;
            }

            assert(fieldErrorByFieldName !== undefined);

            const displayableFieldErrorByFieldName = { ...fieldErrorByFieldName };

            objectKeys(displayableFieldErrorByFieldName).forEach(fieldName => {
                if (!state.hasLostFocusAtLeastOnceByFieldName[fieldName]) {
                    displayableFieldErrorByFieldName[fieldName] = { "hasError": false };
                }
            });

            return displayableFieldErrorByFieldName;
        },
    );

    const isSubmittable = createSelector(
        readyState,
        fieldErrorByFieldName,
        (state, fieldErrorByFieldName): boolean | undefined => {
            if (state === undefined) {
                return undefined;
            }

            assert(fieldErrorByFieldName !== undefined);

            if (
                Object.values(fieldErrorByFieldName).find(({ hasError }) => hasError) !==
                undefined
            ) {
                return false;
            }

            return true;
        },
    );

    return { displayableFieldErrorByFieldName, isSubmittable, fieldErrorByFieldName };
})();
