import "minimal-polyfills/Object.fromEntries";
import type { ThunkAction } from "../setup";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CompiledData } from "sill-api";
import { id } from "tsafe/id";
import { assert } from "tsafe/assert";
import type { ThunksExtraArgument, RootState } from "../setup";
import type { SillApiClient } from "../ports/SillApiClient";
import type { Param0, Equals, PickOptionals } from "tsafe";
import { is } from "tsafe/is";
import { objectKeys } from "tsafe/objectKeys";
import { typeGuard } from "tsafe/typeGuard";
import { same } from "evt/tools/inDepth/same";
import { thunks as catalogExplorerThunks } from "./catalogExplorer";
import { waitForDebounceFactory } from "core/tools/waitForDebounce";
import memoize from "memoizee";
import { createResolveLocalizedString } from "core/tools/resolveLocalizedString";

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
            }>,
        ) => {
            const { valueByFieldName, softwareId } = payload;

            return id<SoftwareFormState.Ready>({
                "stateDescription": "form ready",
                valueByFieldName,
                "defaultValueByFieldName": valueByFieldName,
                "hasLostFocusAtLeastOnceByFieldName": Object.fromEntries(
                    fieldNames.map(fieldName => [fieldName, false] as const),
                ) as Record<FieldName, boolean>,
                softwareId,
                "isSubmitting": false,
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

            const [dispatch, getState, { evtAction }] = args;

            dispatch(actions.initializationStarted());

            //NOTE: We need have the catalog fetched even if we don't use software here
            //(we check errors)
            const { softwares } = await (async () => {
                let catalogExplorerState = getState().catalogExplorer;

                if (catalogExplorerState.stateDescription === "not fetched") {
                    dispatch(catalogExplorerThunks.fetchCatalog());

                    await evtAction.waitFor(
                        action =>
                            action.sliceName === "catalogExplorer" &&
                            action.actionName === "catalogsFetched",
                    );

                    catalogExplorerState = getState().catalogExplorer;

                    assert(catalogExplorerState.stateDescription === "ready");
                }

                const { softwares } = catalogExplorerState["~internal"];

                return { softwares };
            })();

            const software =
                softwareId === undefined
                    ? undefined
                    : await (async () => {
                          const software = softwares.find(
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
        }): ThunkAction =>
        async (...args) => {
            const { fieldName, value } = params;

            const [dispatch, getState, extraArg] = args;

            dispatch(actions.fieldValueChanged({ fieldName, value }));

            autofill_wikidata: {
                if (fieldName !== "wikidataId") {
                    break autofill_wikidata;
                }

                const fieldErrorByFieldName = selectors.fieldErrorByFieldName(getState());

                assert(fieldErrorByFieldName !== undefined);

                if (fieldErrorByFieldName[fieldName].hasError) {
                    break autofill_wikidata;
                }

                assert(typeof value === "string");

                const { fetchWikiDataDebounce } = getSliceContext(extraArg);

                await fetchWikiDataDebounce();

                const { sillApiClient } = extraArg;

                const resultOfFetch = await sillApiClient
                    .fetchWikiDataData({ "wikidataId": value })
                    .catch(() => undefined);

                if (resultOfFetch === undefined) {
                    break autofill_wikidata;
                }

                const { wikidataData, latestSemVersionedTag } = resultOfFetch;

                function_: {
                    const { description } = wikidataData;

                    if (description === undefined) {
                        break function_;
                    }

                    dispatch(
                        actions.fieldValueChanged({
                            "fieldName": "function",
                            "value": resolveLocalizedString(description),
                        }),
                    );
                }

                // eslint-disable-next-line no-label-var
                name: {
                    const { label } = wikidataData;

                    if (label === undefined) {
                        break name;
                    }

                    dispatch(
                        actions.fieldValueChanged({
                            "fieldName": "name",
                            "value": resolveLocalizedString(label),
                        }),
                    );
                }

                license: {
                    const { license } = wikidataData;

                    if (license === undefined) {
                        break license;
                    }

                    dispatch(
                        actions.fieldValueChanged({
                            "fieldName": "license",
                            "value": license,
                        }),
                    );
                }

                versionMin: {
                    if (latestSemVersionedTag === undefined) {
                        break versionMin;
                    }

                    dispatch(
                        actions.fieldValueChanged({
                            "fieldName": "versionMin",
                            "value": latestSemVersionedTag,
                        }),
                    );
                }
            }
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
            softwares: CompiledData.Software[];
            fieldName: Field;
            fieldValue: ValueByFieldName[Field];
            isCreation: boolean;
        }): FieldError {
            const { fieldValue, softwares, isCreation } = params;
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
                        softwares.find(
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
                        softwares.find(software => {
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

        const fieldErrorByFieldName = (
            rootState: RootState,
        ): Record<FieldName, FieldError> | undefined => {
            const state = rootState.softwareForm;

            if (state.stateDescription !== "form ready") {
                return undefined;
            }

            const catalogExplorerState = rootState.catalogExplorer;

            assert(catalogExplorerState.stateDescription === "ready");

            return Object.fromEntries(
                fieldNames.map(fieldName => [
                    fieldName,
                    (() =>
                        getFieldError({
                            fieldName,
                            "fieldValue": state.valueByFieldName[fieldName],
                            "softwares": catalogExplorerState["~internal"].softwares,
                            "isCreation": state.softwareId === undefined,
                        }))(),
                ]),
            ) as Record<FieldName, FieldError>;
        };

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

    return { displayableFieldErrorByFieldName, isSubmittable, fieldErrorByFieldName };
})();

const getSliceContext = memoize((_: ThunksExtraArgument) => {
    const { waitForDebounce } = waitForDebounceFactory({ "delay": 1000 });
    return {
        "fetchWikiDataDebounce": waitForDebounce,
    };
});

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

const { resolveLocalizedString } = createResolveLocalizedString({
    "currentLanguage": "fr",
    "fallbackLanguage": "en",
});
