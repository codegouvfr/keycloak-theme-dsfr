import "minimal-polyfills/Object.fromEntries";
import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CompiledData } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { RootState } from "../setup";
import type { SillApiClient } from "../ports/SillApiClient";
import type { Param0, Equals, PickOptionals } from "tsafe";
import { is } from "tsafe/is";
import { objectKeys } from "tsafe/objectKeys";
import { typeGuard } from "tsafe/typeGuard";
import { same } from "evt/tools/inDepth/same";

type PartialSoftwareRow = Param0<SillApiClient["addSoftware"]>["partialSoftwareRow"];

type ValueByFieldName = {
    [K in keyof PartialSoftwareRow]-?: PartialSoftwareRow[K];
};

export type FieldName = keyof ValueByFieldName;

const fieldNames = [
    "wikidataId",
    "comptoirDuLibreId",
    "function",
    "name",
    "isFromFrenchPublicService",
    "license",
    "versionMin",
    "agentWorkstation",
] as const;

assert<Equals<typeof fieldNames[number], FieldName>>();

export type FieldErrorMessageKey =
    | "mandatory field"
    | "invalid wikidata id"
    | "wikidata id already exists"
    | "name already exists";

type FieldError =
    | {
          hasError: false;
      }
    | {
          hasError: true;
          errorMessageKey: FieldErrorMessageKey;
      };

type SoftwareFormState =
    | SoftwareFormState.NotInitialized
    | SoftwareFormState.Ready
    | SoftwareFormState.Submitted;

namespace SoftwareFormState {
    export type NotInitialized = {
        stateDescription: "not initialized";
        isInitializing: boolean;
    };

    export type Ready = {
        stateDescription: "form ready";
        valueByFieldName: ValueByFieldName;
        hasLostFocusAtLeastOnceByFieldName: Record<FieldName, boolean>;
        defaultValueByFieldName: ValueByFieldName;
        softwareId: number | undefined;
        isSubmitting: boolean;
        catalog: CompiledData.Software[];
    };

    export type Submitted = {
        stateDescription: "form submitted";
        softwareName: string;
    };
}

const defaultValueByFieldName: ValueByFieldName = {
    "wikidataId": "",
    "comptoirDuLibreId": 0,
    "function": "",
    "name": "",
    "isFromFrenchPublicService": false,
    "license": "",
    "versionMin": "",
    "agentWorkstation": true,
};

export const { name, reducer, actions } = createSlice({
    "name": "softwareForm",
    "initialState": id<SoftwareFormState>(
        id<SoftwareFormState.NotInitialized>({
            "stateDescription": "not initialized",
            "isInitializing": false,
        }),
    ),
    "reducers": {
        "initializationStarted": () =>
            id<SoftwareFormState.NotInitialized>({
                "stateDescription": "not initialized",
                "isInitializing": true,
            }),
        "initialized": (
            _state,
            {
                payload,
            }: PayloadAction<{
                valueByFieldName: ValueByFieldName;
                softwareId: number | undefined;
                catalog: CompiledData.Software[];
            }>,
        ) => {
            const { valueByFieldName, softwareId, catalog } = payload;

            return id<SoftwareFormState.Ready>({
                "stateDescription": "form ready",
                valueByFieldName,
                "defaultValueByFieldName": valueByFieldName,
                "hasLostFocusAtLeastOnceByFieldName": Object.fromEntries(
                    fieldNames.map(fieldName => [fieldName, false] as const),
                ) as Record<FieldName, boolean>,
                softwareId,
                "isSubmitting": false,
                catalog,
            });
        },
        "focusLost": (state, { payload }: PayloadAction<{ fieldName: FieldName }>) => {
            const { fieldName } = payload;

            assert(state.stateDescription === "form ready");

            state.hasLostFocusAtLeastOnceByFieldName[fieldName] = true;
        },
        "softwareAddedOrUpdated": (
            _state,
            {
                payload,
            }: PayloadAction<{
                //NOTE: The extra information is not used in the reducer, but is used in catalog explorer.
                software: CompiledData.Software<"with referents">;
            }>,
        ) => {
            const { software } = payload;

            return id<SoftwareFormState.Submitted>({
                "stateDescription": "form submitted",
                "softwareName": software.name,
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
                fieldName: FieldName;
                value: ValueByFieldName[FieldName];
            }>,
        ) => {
            const { fieldName, value } = payload;

            assert(state.stateDescription === "form ready");

            (state.valueByFieldName as any)[fieldName] = value;
        },
    },
});

export const thunks = {
    "initialize":
        (params: { softwareId: number | undefined }): ThunkAction<void> =>
        async (...args) => {
            const { softwareId } = params;

            const [dispatch, , { sillApiClient }] = args;

            dispatch(actions.initializationStarted());

            const { catalog } = await sillApiClient.getCompiledData();

            const software =
                softwareId === undefined
                    ? undefined
                    : (() => {
                          const software = catalog.find(
                              software => software.id === softwareId,
                          );

                          assert(software !== undefined);

                          return software;
                      })();

            dispatch(
                actions.initialized({
                    softwareId,
                    "valueByFieldName":
                        software === undefined
                            ? defaultValueByFieldName
                            : (Object.fromEntries(
                                  fieldNames.map(fieldName => [
                                      fieldName,
                                      (() => {
                                          const defaultValue =
                                              defaultValueByFieldName[fieldName];

                                          if (
                                              typeGuard<
                                                  keyof typeof software & typeof fieldName
                                              >(fieldName, fieldName in software)
                                          ) {
                                              const value = software[fieldName];

                                              return typeof value === typeof defaultValue
                                                  ? value
                                                  : defaultValue;
                                          }

                                          switch (fieldName) {
                                              case "comptoirDuLibreId":
                                                  return id<
                                                      ValueByFieldName[typeof fieldName]
                                                  >(
                                                      software.comptoirDuLibreSoftware
                                                          ?.id ??
                                                          defaultValueByFieldName[
                                                              fieldName
                                                          ],
                                                  );
                                              case "wikidataId":
                                                  return id<
                                                      ValueByFieldName[typeof fieldName]
                                                  >(
                                                      software.wikidataData?.id ??
                                                          defaultValueByFieldName[
                                                              fieldName
                                                          ],
                                                  );
                                          }

                                          assert<Equals<typeof fieldName, never>>();
                                      })(),
                                  ]),
                              ) as ValueByFieldName),
                    catalog,
                }),
            );
        },
    "focusLost":
        (params: { fieldName: FieldName }): ThunkAction<void> =>
        (...args) => {
            const { fieldName } = params;

            const [dispatch] = args;

            dispatch(actions.focusLost({ fieldName }));
        },
    "restoreFieldDefaultValue":
        (params: { fieldName: FieldName }): ThunkAction<void> =>
        (...args) => {
            const { fieldName } = params;

            const [dispatch] = args;

            dispatch(
                actions.fieldValueChanged({
                    fieldName,
                    "value": defaultValueByFieldName[fieldName],
                }),
            );
        },
    "changeFieldValue":
        (params: {
            fieldName: FieldName;
            value: ValueByFieldName[FieldName];
        }): ThunkAction<void> =>
        (...args) => {
            const { fieldName, value } = params;

            const [dispatch] = args;

            dispatch(actions.fieldValueChanged({ fieldName, value }));
        },
    "submit":
        (params: { isExpert: boolean | undefined }): ThunkAction =>
        async (...args) => {
            const { isExpert } = params;

            const [dispatch, getState, { sillApiClient }] = args;

            const state = getState().softwareForm;

            assert(state.stateDescription === "form ready");

            const { valueByFieldName, defaultValueByFieldName } = state;

            const partialSoftwareRow = Object.fromEntries(
                objectKeys(valueByFieldName)
                    .map(fieldName => [fieldName, valueByFieldName[fieldName]] as const)
                    .map(
                        ([fieldName, value]) =>
                            [
                                fieldName,
                                pure.getIsOptionalField(fieldName) &&
                                value === defaultValueByFieldName[fieldName]
                                    ? undefined
                                    : value,
                            ] as const,
                    ),
            ) as PartialSoftwareRow;

            dispatch(actions.submissionStarted());

            const { software } = await (() => {
                const { softwareId } = state;

                if (softwareId === undefined) {
                    assert(isExpert !== undefined);

                    return sillApiClient.addSoftware({
                        partialSoftwareRow,
                        isExpert,
                    });
                } else {
                    return sillApiClient.updateSoftware({
                        partialSoftwareRow,
                        softwareId,
                    });
                }
            })();

            dispatch(actions.softwareAddedOrUpdated({ software }));
        },
};

export const selectors = (() => {
    const readyState = (rootState: RootState): SoftwareFormState.Ready | undefined => {
        const state = rootState.softwareForm;
        switch (state.stateDescription) {
            case "form ready":
                return state;
            default:
                return undefined;
        }
    };

    const { fieldErrorByFieldName } = (() => {
        function getFieldError<Field extends keyof ValueByFieldName>(params: {
            catalog: CompiledData.Software[];
            fieldName: Field;
            fieldValue: ValueByFieldName[Field];
            isCreation: boolean;
        }): FieldError {
            const { fieldValue, catalog, isCreation } = params;
            const fieldName: keyof ValueByFieldName = params.fieldName;

            if (
                !pure.getIsOptionalField(fieldName) &&
                typeof fieldValue !== "boolean" &&
                fieldValue === defaultValueByFieldName[fieldName]
            ) {
                return {
                    "hasError": true,
                    "errorMessageKey": "mandatory field",
                };
            }

            switch (fieldName) {
                case "wikidataId": {
                    assert(is<ValueByFieldName[typeof fieldName]>(fieldValue));

                    if (!/^Q\d+$/.test(fieldValue)) {
                        return {
                            "hasError": true,
                            "errorMessageKey": "invalid wikidata id",
                        };
                    }

                    if (
                        isCreation &&
                        catalog.find(
                            software => software.wikidataData?.id === fieldValue,
                        ) !== undefined
                    ) {
                        return {
                            "hasError": true,
                            "errorMessageKey": "wikidata id already exists",
                        };
                    }
                    break;
                }
                case "name":
                    assert(is<ValueByFieldName[typeof fieldName]>(fieldValue));

                    if (
                        isCreation &&
                        catalog.find(software => {
                            const tr = (s: string) => s.toLowerCase().replace(/ /g, "-");

                            return tr(software.name) === tr(fieldValue);
                        }) !== undefined
                    ) {
                        return {
                            "hasError": true,
                            "errorMessageKey": "name already exists",
                        };
                    }
                    break;
            }

            return { "hasError": false };
        }

        const fieldErrorByFieldName = createSelector(
            readyState,
            (state): Record<FieldName, FieldError> | undefined => {
                if (state === undefined) {
                    return undefined;
                }

                return Object.fromEntries(
                    fieldNames.map(fieldName => [
                        fieldName,
                        (() =>
                            getFieldError({
                                fieldName,
                                "fieldValue": state.valueByFieldName[fieldName],
                                "catalog": state.catalog,
                                "isCreation": state.softwareId === undefined,
                            }))(),
                    ]),
                ) as Record<FieldName, FieldError>;
            },
        );

        return { fieldErrorByFieldName };
    })();

    const displayableFieldErrorByFieldName = createSelector(
        readyState,
        fieldErrorByFieldName,
        (state, fieldErrorByFieldName): Record<FieldName, FieldError> | undefined => {
            if (state === undefined) {
                return undefined;
            }

            assert(fieldErrorByFieldName !== undefined);

            return Object.fromEntries(
                fieldNames.map(fieldName => [
                    fieldName,
                    ((): FieldError => {
                        if (!state.hasLostFocusAtLeastOnceByFieldName[fieldName]) {
                            return {
                                "hasError": false,
                            };
                        }

                        return fieldErrorByFieldName[fieldName];
                    })(),
                ]),
            ) as Record<FieldName, FieldError>;
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

            if (same(state.defaultValueByFieldName, state.valueByFieldName)) {
                return false;
            }

            if (
                Object.values(fieldErrorByFieldName).find(({ hasError }) => hasError) !==
                undefined
            ) {
                return false;
            }

            return true;
        },
    );

    return { displayableFieldErrorByFieldName, isSubmittable };
})();

export const pure = (() => {
    const { getIsOptionalField } = (() => {
        const optionalFields = ["wikidataId", "comptoirDuLibreId"] as const;

        assert<
            Equals<typeof optionalFields[number], keyof PickOptionals<PartialSoftwareRow>>
        >();

        function getIsOptionalField(fieldName: FieldName): boolean {
            return id<readonly string[]>(optionalFields).indexOf(fieldName) !== -1;
        }

        return { getIsOptionalField };
    })();

    return {
        getIsOptionalField,
    };
})();
