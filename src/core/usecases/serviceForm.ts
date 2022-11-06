import "minimal-polyfills/Object.fromEntries";
import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CompiledData } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { State as RootState } from "../setup";
import { objectKeys } from "tsafe/objectKeys";
import {
    selectors as serviceCatalogSelectors,
    thunks as serviceCatalog,
} from "./serviceCatalog";
import { selectors as catalogSelector, thunks as catalog } from "./catalog";
import { same } from "evt/tools/inDepth/same";

export type ServiceFormData = {
    description: string;
    agencyName: string;
    serviceUrl: string;
    softwareName: string;
};

export type FieldErrorMessageKey =
    | "mandatory field"
    | "not a valid url"
    | "service already referenced";

type FieldError =
    | { hasError: false }
    | {
          hasError: true;
          isErrorDisplayable: boolean;
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
        isSubmitting: boolean;
        //NOTE: Sorted by most present in already existing services first
        softwares: { name: string; sillId: number }[];
        agencyNames: string[];
        //NOTE: Urls of all services to check for duplicate
        serviceUrls: string[];

        serviceId: number | undefined;
        //NOTE: Undefined when serviceId === undefined it helps us tell if some field have been changed
        //to allow or not updating the service.
        formDataDefault: ServiceFormData | undefined;
    };

    export type Submitted = {
        stateDescription: "form submitted";
        queryString: string;
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
                agencyNames: string[];
                serviceUrls: string[];
                formDataDefault: ServiceFormData | undefined;
            }>,
        ) => {
            const {
                formData,
                serviceId,
                softwares,
                agencyNames,
                serviceUrls,
                formDataDefault,
            } = payload;

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
                agencyNames,
                serviceUrls,
                formDataDefault,
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
                "queryString": service.serviceUrl
                    .replace(/^https?:\/\//, "")
                    .replace(/^www\./, "")
                    .split("/")[0],
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

            const [dispatch, getState, { evtAction, sillApiClient }] = args;

            dispatch(actions.initializationStarted());

            if (getState().catalog.stateDescription === "not fetched") {
                dispatch(catalog.fetchCatalog());

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
                dispatch(serviceCatalog.fetchCatalog());

                await evtAction.waitFor(
                    action =>
                        action.sliceName === "serviceCatalog" &&
                        action.actionName === "catalogsFetched",
                );
            }

            const services = serviceCatalogSelectors.serviceWithSoftwares(getState());

            assert(services !== undefined);

            const serviceUrls = services.map(({ serviceUrl }) => serviceUrl);

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

            const agencyNames = await sillApiClient.getAgencyNames();

            const formData: ServiceFormData =
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
                      };

            dispatch(
                actions.initialized({
                    formData,
                    serviceId,
                    softwares,
                    agencyNames,
                    serviceUrls,
                    "formDataDefault": service === undefined ? undefined : formData,
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

    const sliceState = (
        rootState: RootState,
    ):
        | {
              stateDescription: "not initialized";
              isInitializing: boolean;
          }
        | {
              stateDescription: "form ready";
              isSubmitting: boolean;
          }
        | {
              stateDescription: "form submitted";
              queryString: string;
          } => {
        return rootState.serviceForm;
    };

    const serviceId = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }
        return state.serviceId;
    });

    const formData = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }
        return state.formData;
    });

    function toUniqUrl(url: string): string {
        let s = url.toLowerCase();

        if (s.endsWith("/")) {
            return s;
        }

        return s.replace(/\/[^.]+\.((html)|(php)|(aspx?))$/, "/");
    }

    const fieldErrorByFieldName = createSelector(
        readyState,
        serviceId,
        (state, serviceId): Record<keyof ServiceFormData, FieldError> | undefined => {
            if (state === undefined) {
                return undefined;
            }

            const { formData, hasLostFocusAtLeastOnceByFieldName, serviceUrls } = state;

            return {
                ...(() => {
                    const fieldName = "description";

                    const value: FieldError = (() => {
                        const formFieldValue = formData[fieldName];

                        const hasLostFocusAtLeastOnce =
                            hasLostFocusAtLeastOnceByFieldName[fieldName];

                        if (formFieldValue === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                                "isErrorDisplayable": hasLostFocusAtLeastOnce,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
                ...(() => {
                    const fieldName = "agencyName";

                    const value: FieldError = (() => {
                        const formFieldValue = formData[fieldName];

                        const hasLostFocusAtLeastOnce =
                            hasLostFocusAtLeastOnceByFieldName[fieldName];

                        if (formFieldValue === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                                "isErrorDisplayable": hasLostFocusAtLeastOnce,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
                ...(() => {
                    const fieldName = "serviceUrl";

                    const value: FieldError = (() => {
                        const formFieldValue = formData[fieldName];

                        const hasLostFocusAtLeastOnce =
                            hasLostFocusAtLeastOnceByFieldName[fieldName];

                        if (
                            serviceId === undefined &&
                            serviceUrls.indexOf(toUniqUrl(formFieldValue)) >= 0
                        ) {
                            return {
                                "hasError": true,
                                "errorMessageKey": "service already referenced",
                                "isErrorDisplayable": true,
                            };
                        }

                        if (!/^https?:\/\//.test(formFieldValue)) {
                            return {
                                "hasError": true,
                                "errorMessageKey": "not a valid url" as const,
                                "isErrorDisplayable": hasLostFocusAtLeastOnce,
                            };
                        }

                        if (formFieldValue === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                                "isErrorDisplayable": hasLostFocusAtLeastOnce,
                            };
                        }

                        return { "hasError": false };
                    })();

                    return { [fieldName]: value };
                })(),
                ...(() => {
                    const fieldName = "softwareName";

                    const value: FieldError = (() => {
                        const formFieldValue = formData[fieldName];

                        const hasLostFocusAtLeastOnce =
                            hasLostFocusAtLeastOnceByFieldName[fieldName];

                        if (formFieldValue === "") {
                            return {
                                "hasError": true,
                                "errorMessageKey": "mandatory field" as const,
                                "isErrorDisplayable": hasLostFocusAtLeastOnce,
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
        fieldErrorByFieldName,
        fieldErrorByFieldName => {
            if (fieldErrorByFieldName === undefined) {
                return undefined;
            }

            type FieldError =
                | { hasDisplayableError: false }
                | {
                      hasDisplayableError: true;
                      errorMessageKey: FieldErrorMessageKey;
                  };

            return Object.fromEntries(
                Object.entries(fieldErrorByFieldName).map(
                    ([key, value]) =>
                        [
                            key,
                            !value.hasError || !value.isErrorDisplayable
                                ? { "hasDisplayableError": false }
                                : {
                                      "hasDisplayableError": true,
                                      "errorMessageKey": value.errorMessageKey,
                                  },
                        ] as const,
                ),
            ) as Record<keyof ServiceFormData, FieldError>;
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

            const { defaultFormData } = state;

            if (defaultFormData !== undefined && same(state.formData, defaultFormData)) {
                return false;
            }

            return true;
        },
    );

    const sillSoftwareNames = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }
        return state.softwares.map(({ name }) => name);
    });

    const agencyNames = createSelector(readyState, state => {
        if (state === undefined) {
            return undefined;
        }
        return state.agencyNames;
    });

    const shouldSplashScreenBeShown = createSelector(sliceState, state => {
        return (
            state.stateDescription === "not initialized" ||
            (state.stateDescription === "form ready" && state.isSubmitting)
        );
    });

    return {
        displayableFieldErrorByFieldName,
        sliceState,
        serviceId,
        formData,
        isSubmittable,
        sillSoftwareNames,
        agencyNames,
        shouldSplashScreenBeShown,
    };
})();
