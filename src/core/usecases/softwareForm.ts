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
import { thunks as catalogThunks } from "./catalog";
import { waitForDebounceFactory } from "core/tools/waitForDebounce";
import memoize from "memoizee";
import { createResolveLocalizedString } from "i18nifty";
import { same } from "evt/tools/inDepth/same";

type PartialSoftwareRow = Omit<
    Param0<SillApiClient["addSoftware"]>["partialSoftwareRow"],
    "dereferencing"
>;

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
    "tags",
    "alikeSoftware",
] as const;

assert<Equals<typeof fieldNames[number], FieldName>>();

export type FieldErrorMessageKey =
    | "mandatory field"
    | "invalid wikidata id"
    | "wikidata id already exists"
    | "name already exists"
    | "should be an integer";

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
        isAutofillInProgress: boolean;
        tags: string[];
    };

    export type Submitted = {
        stateDescription: "form submitted";
        softwareName: string;
    };
}

const newSoftwareDefaultValueByFieldName: ValueByFieldName = {
    "wikidataId": "",
    "comptoirDuLibreId": -1,
    "function": "",
    "name": "",
    "isFromFrenchPublicService": false,
    "license": "",
    "versionMin": "",
    "agentWorkstation": true,
    "tags": [],
    "alikeSoftware": [],
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
                tags: string[];
            }>,
        ) => {
            const { valueByFieldName, softwareId, tags } = payload;

            return id<SoftwareFormState.Ready>({
                "stateDescription": "form ready",
                valueByFieldName,
                "defaultValueByFieldName": valueByFieldName,
                "hasLostFocusAtLeastOnceByFieldName": Object.fromEntries(
                    fieldNames.map(
                        fieldName =>
                            [
                                fieldName,
                                fieldName === "wikidataId" ||
                                    fieldName === "comptoirDuLibreId",
                            ] as const,
                    ),
                ) as Record<FieldName, boolean>,
                softwareId,
                "isSubmitting": false,
                "isAutofillInProgress": false,
                tags,
            });
        },
        "autofillStarted": state => {
            assert(state.stateDescription === "form ready");

            state.isAutofillInProgress = true;
        },
        "autoFillCompeted": state => {
            assert(state.stateDescription === "form ready");
            state.isAutofillInProgress = false;
            objectKeys(state.hasLostFocusAtLeastOnceByFieldName).forEach(
                key => (state.hasLostFocusAtLeastOnceByFieldName[key] = true),
            );
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
        "tagCreated": (state, { payload }: PayloadAction<{ tag: string }>) => {
            const { tag } = payload;

            assert(state.stateDescription === "form ready");

            state.tags.push(tag);
        },
    },
});

export const thunks = {
    "initialize":
        (params: { softwareId: number | undefined }): ThunkAction<void> =>
        async (...args) => {
            const { softwareId } = params;

            const [dispatch, getState, { evtAction, sillApiClient }] = args;

            dispatch(actions.initializationStarted());

            //NOTE: We need have the catalog fetched even if we don't use software here
            //(we check errors)
            const { softwares } = await (async () => {
                let catalogState = getState().catalog;

                if (catalogState.stateDescription === "not fetched") {
                    dispatch(catalogThunks.fetchCatalog());

                    await evtAction.waitFor(
                        action =>
                            action.sliceName === "catalog" &&
                            action.actionName === "catalogsFetched",
                    );

                    catalogState = getState().catalog;

                    assert(catalogState.stateDescription === "ready");
                }

                const { softwares } = catalogState;

                return { softwares };
            })();

            const tags = await sillApiClient.getTags();

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
                            ? newSoftwareDefaultValueByFieldName
                            : (Object.fromEntries(
                                  fieldNames.map(fieldName => [
                                      fieldName,
                                      (() => {
                                          const defaultValue =
                                              newSoftwareDefaultValueByFieldName[
                                                  fieldName
                                              ];

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
                                                          newSoftwareDefaultValueByFieldName[
                                                              fieldName
                                                          ],
                                                  );
                                              case "wikidataId":
                                                  return id<
                                                      ValueByFieldName[typeof fieldName]
                                                  >(
                                                      software.wikidataData?.id ??
                                                          newSoftwareDefaultValueByFieldName[
                                                              fieldName
                                                          ],
                                                  );
                                          }

                                          assert<Equals<typeof fieldName, never>>();
                                      })(),
                                  ]),
                              ) as ValueByFieldName),
                    tags,
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
    "createTag":
        (params: { tag: string }): ThunkAction<void> =>
        (...args) => {
            const { tag } = params;

            const [dispatch] = args;

            dispatch(actions.tagCreated({ tag }));
        },
    "restoreFieldDefaultValue":
        (params: { fieldName: FieldName }): ThunkAction<void> =>
        (...args) => {
            const { fieldName } = params;

            const [dispatch, getState] = args;

            const state = getState().softwareForm;

            assert(state.stateDescription === "form ready");

            dispatch(
                actions.fieldValueChanged({
                    fieldName,
                    "value": state.defaultValueByFieldName[fieldName],
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

                const state = getState().softwareForm;

                assert(state.stateDescription === "form ready");

                if (state.softwareId !== undefined) {
                    //NOTE: We don't autofill wikidataId if we are updating an existing software.
                    break autofill_wikidata;
                }

                const fieldErrorByFieldName = selectors.fieldErrorByFieldName(getState());

                assert(fieldErrorByFieldName !== undefined);

                if (
                    value === state.defaultValueByFieldName[fieldName] ||
                    fieldErrorByFieldName.wikidataId.hasError
                ) {
                    break autofill_wikidata;
                }

                assert(typeof value === "string");

                const { fetchWikiDataDebounce } = getSliceContext(extraArg);

                await fetchWikiDataDebounce();

                const { sillApiClient } = extraArg;

                dispatch(actions.autofillStarted());

                const autofillResult = await sillApiClient
                    .autoFillFormInfo({ "wikidataId": value })
                    .catch(() => undefined);

                dispatch(actions.autoFillCompeted());

                if (autofillResult === undefined) {
                    break autofill_wikidata;
                }

                const { wikidataData, latestSemVersionedTag, comptoirDuLibreId } =
                    autofillResult;

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

                comptoir: {
                    if (comptoirDuLibreId === undefined) {
                        break comptoir;
                    }

                    dispatch(
                        actions.fieldValueChanged({
                            "fieldName": "comptoirDuLibreId",
                            "value": comptoirDuLibreId,
                        }),
                    );
                }
            }
        },
    "submit":
        (params: {
            createReferentParams:
                | {
                      isExpert: boolean;
                      useCaseDescription: string;
                      isPersonalUse: boolean;
                  }
                | undefined;
        }): ThunkAction =>
        async (...args) => {
            const { createReferentParams } = params;

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
                    assert(createReferentParams !== undefined);

                    const { isExpert, isPersonalUse, useCaseDescription } =
                        createReferentParams;

                    return sillApiClient.addSoftware({
                        partialSoftwareRow,
                        isExpert,
                        useCaseDescription,
                        isPersonalUse,
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
                fieldValue === newSoftwareDefaultValueByFieldName[fieldName]
            ) {
                return {
                    "hasError": true,
                    "errorMessageKey": "mandatory field",
                };
            }
            if (fieldValue === newSoftwareDefaultValueByFieldName[fieldName]) {
                return {
                    "hasError": false,
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
                case "comptoirDuLibreId":
                    assert(is<ValueByFieldName[typeof fieldName]>(fieldValue));

                    if (isNaN(fieldValue)) {
                        return {
                            "hasError": true,
                            "errorMessageKey": "should be an integer",
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

            const catalogState = rootState.catalog;

            assert(catalogState.stateDescription === "ready");

            return Object.fromEntries(
                fieldNames.map(fieldName => [
                    fieldName,
                    (() =>
                        getFieldError({
                            fieldName,
                            "fieldValue": state.valueByFieldName[fieldName],
                            "softwares": catalogState.softwares,
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
    const { waitForDebounce } = waitForDebounceFactory({ "delay": 300 });
    return {
        "fetchWikiDataDebounce": waitForDebounce,
    };
});

export const pure = (() => {
    const { getIsOptionalField } = (() => {
        const optionalFields = [
            "wikidataId",
            "comptoirDuLibreId",
            "tags",
            "alikeSoftware",
        ] as const;

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
