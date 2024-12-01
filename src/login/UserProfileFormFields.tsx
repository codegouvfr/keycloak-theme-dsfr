import { useEffect, Fragment } from "react";
import { assert } from "keycloakify/tools/assert";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    useUserProfileForm,
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                return (
                    <Fragment key={attribute.name}>
                        <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                        <div
                            className={kcClsx("kcFormGroupClass")}
                            style={{
                                display: attribute.name === "password-confirm" && !doMakeUserConfirmPassword ? "none" : undefined
                            }}
                        >
                            <div className={kcClsx("kcInputWrapperClass")}>
                                <InputFieldByType
                                    required={attribute.required}
                                    label={advancedMsg(attribute.displayName ?? "")}
                                    hint={
                                        attribute.annotations.inputHelperTextBefore !== undefined
                                            ? advancedMsg(attribute.annotations.inputHelperTextBefore)
                                            : undefined
                                    }
                                    infoAfter={
                                        attribute.annotations.inputHelperTextAfter !== undefined
                                            ? advancedMsg(attribute.annotations.inputHelperTextAfter)
                                            : undefined
                                    }
                                    attribute={attribute}
                                    valueOrValues={valueOrValues}
                                    displayableErrors={displayableErrors}
                                    dispatchFormAction={dispatchFormAction}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                />

                                {AfterField !== undefined && (
                                    <AfterField
                                        attribute={attribute}
                                        dispatchFormAction={dispatchFormAction}
                                        displayableErrors={displayableErrors}
                                        valueOrValues={valueOrValues}
                                        kcClsx={kcClsx}
                                        i18n={i18n}
                                    />
                                )}
                                {/* NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook */}
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, groupNameRef, i18n, kcClsx } = props;

    const { advancedMsg } = i18n;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);

            return (
                <div
                    className={kcClsx("kcFormGroupClass")}
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    {(() => {
                        const groupDisplayHeader = attribute.group.displayHeader ?? "";
                        const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

                        return (
                            <div className={kcClsx("kcContentWrapperClass")}>
                                <label id={`header-${attribute.group.name}`} className={kcClsx("kcFormGroupHeader")}>
                                    {groupHeaderText}
                                </label>
                            </div>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = attribute.group.displayDescription ?? "";

                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = advancedMsg(groupDisplayDescription);

                            return (
                                <div className={kcClsx("kcLabelWrapperClass")}>
                                    <label id={`description-${attribute.group.name}`} className={kcClsx("kcLabelClass")}>
                                        {groupDescriptionText}
                                    </label>
                                </div>
                            );
                        }

                        return null;
                    })()}
                </div>
            );
        }
    }

    return null;
}

type InputFieldByTypeProps = {
    required: boolean | undefined;
    label: JSX.Element | undefined;
    hint: JSX.Element | undefined;
    infoAfter: JSX.Element | undefined;
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
};

function InputFieldByType(props: InputFieldByTypeProps) {
    const {
        attribute,
        valueOrValues,
        i18n: { advancedMsgStr }
    } = props;

    switch (attribute.annotations.inputType) {
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
            return <SelectTag {...props} />;
        case "multiselect":
        case "multiselect-checkboxes":
            return <CheckboxesTag {...props} />;
        case "select-radiobuttons":
            return <RadiButtonsTag {...props} />;
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            if (attribute.name === "password" || attribute.name === "password-confirm") {
                const { label, required, dispatchFormAction, displayableErrors } = props;
                return (
                    <PasswordInput
                        label={formatLabel(label, required)}
                        disabled={attribute.readOnly}
                        messages={displayableErrors.map(error => ({
                            message: advancedMsgStr(error.errorMessageStr),
                            severity: "error"
                        }))}
                        nativeInputProps={{
                            name: attribute.name,
                            value: valueOrValues,
                            autoComplete: attribute.autocomplete,
                            placeholder:
                                attribute.annotations.inputTypePlaceholder === undefined
                                    ? undefined
                                    : advancedMsgStr(attribute.annotations.inputTypePlaceholder),
                            pattern: attribute.annotations.inputTypePattern,
                            size: attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`),
                            maxLength:
                                attribute.annotations.inputTypeMaxlength === undefined
                                    ? undefined
                                    : parseInt(`${attribute.annotations.inputTypeMaxlength}`),
                            minLength:
                                attribute.annotations.inputTypeMinlength === undefined
                                    ? undefined
                                    : parseInt(`${attribute.annotations.inputTypeMinlength}`),
                            max: attribute.annotations.inputTypeMax,
                            min: attribute.annotations.inputTypeMin,
                            step: attribute.annotations.inputTypeStep,
                            onChange: event =>
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: event.target.value
                                }),
                            onBlur: () =>
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: undefined
                                })
                        }}
                    />
                );
            }

            return <InputTag {...props} fieldIndex={undefined} />;
        }
    }
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors, label, hint, infoAfter, required } = props;

    const { advancedMsgStr } = i18n;

    const getState = (): { state: "error" | "info" | "default"; stateRelatedMessage: JSX.Element | undefined } => {
        if (displayableErrors.length > 0) {
            if (fieldIndex === undefined)
                return {
                    state: "error",
                    stateRelatedMessage: displayableErrors[0].errorMessage
                };

            const error = displayableErrors.find(error => error.fieldIndex === fieldIndex);

            if (error)
                return {
                    state: "error",
                    stateRelatedMessage: error.errorMessage
                };

            return {
                state: "default",
                stateRelatedMessage: undefined
            };
        }

        if (infoAfter)
            return {
                state: "info",
                stateRelatedMessage: infoAfter
            };

        return {
            state: "default",
            stateRelatedMessage: undefined
        };
    };

    return (
        <>
            <Input
                label={formatLabel(label, required)}
                hintText={hint}
                disabled={attribute.readOnly}
                {...getState()}
                nativeInputProps={{
                    type: (() => {
                        const { inputType } = attribute.annotations;

                        if (inputType?.startsWith("html5-")) {
                            return inputType.slice(6);
                        }

                        return inputType ?? "text";
                    })(),
                    name: attribute.name,
                    value: (() => {
                        if (fieldIndex !== undefined) {
                            assert(valueOrValues instanceof Array);
                            return valueOrValues[fieldIndex];
                        }

                        assert(typeof valueOrValues === "string");

                        return valueOrValues;
                    })(),
                    autoComplete: attribute.autocomplete,
                    placeholder:
                        attribute.annotations.inputTypePlaceholder === undefined
                            ? undefined
                            : advancedMsgStr(attribute.annotations.inputTypePlaceholder),
                    pattern: attribute.annotations.inputTypePattern,
                    size: attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`),
                    maxLength:
                        attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`),
                    minLength:
                        attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`),
                    max: attribute.annotations.inputTypeMax,
                    min: attribute.annotations.inputTypeMin,
                    step: attribute.annotations.inputTypeStep,
                    onChange: event =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: (() => {
                                if (fieldIndex !== undefined) {
                                    assert(valueOrValues instanceof Array);

                                    return valueOrValues.map((value, i) => {
                                        if (i === fieldIndex) {
                                            return event.target.value;
                                        }

                                        return value;
                                    });
                                }

                                return event.target.value;
                            })()
                        }),
                    onBlur: () =>
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: fieldIndex
                        })
                }}
            />
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }

                assert(valueOrValues instanceof Array);

                const values = valueOrValues;

                return (
                    <>
                        <AddRemoveButtonsMultiValuedAttribute
                            attribute={attribute}
                            values={values}
                            fieldIndex={fieldIndex}
                            dispatchFormAction={dispatchFormAction}
                            i18n={i18n}
                        />
                    </>
                );
            })()}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

    const { msg } = i18n;

    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

    const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

    return (
        <>
            {hasRemove && (
                <>
                    <button
                        id={`kc-remove${idPostfix}`}
                        type="button"
                        className="pf-c-button pf-m-inline pf-m-link"
                        onClick={() =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: values.filter((_, i) => i !== fieldIndex)
                            })
                        }
                    >
                        {msg("remove")}
                    </button>
                    {hasAdd ? <>&nbsp;|&nbsp;</> : null}
                </>
            )}
            {hasAdd && (
                <button
                    id={`kc-add${idPostfix}`}
                    type="button"
                    className="pf-c-button pf-m-inline pf-m-link"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    {msg("addValue")}
                </button>
            )}
        </>
    );
}

function RadiButtonsTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues, required, label, hint } = props;

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    return (
        <RadioButtons
            {...getStateForSingleValue(displayableErrors)}
            legend={formatLabel(label, required)}
            hintText={hint}
            disabled={attribute.readOnly}
            options={options.map(option => ({
                label: inputLabel(i18n, attribute, option),
                nativeInputProps: {
                    name: attribute.name,
                    value: option,
                    checked: valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option,
                    onChange: event =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: (() => {
                                const isChecked = event.target.checked;

                                if (valueOrValues instanceof Array) {
                                    const newValues = [...valueOrValues];

                                    if (isChecked) {
                                        newValues.push(option);
                                    } else {
                                        newValues.splice(newValues.indexOf(option), 1);
                                    }

                                    return newValues;
                                }

                                return event.target.checked ? option : "";
                            })()
                        }),
                    onBlur: () =>
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: undefined
                        })
                }
            }))}
        />
    )
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, displayableErrors, valueOrValues, label, required } = props;

    assert(typeof valueOrValues === "string");

    const value = valueOrValues;

    return (
        <Input
            textArea
            label={formatLabel(label, required)}
            {...getStateForSingleValue(displayableErrors)}
            disabled={attribute.readOnly}
            nativeTextAreaProps={{
                id: attribute.name,
                name: attribute.name,
                className: kcClsx("kcInputClass"),
                cols: attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`),
                rows: attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`),
                maxLength:
                    attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`),
                value: value,
                onChange: event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: event.target.value
                    }),
                onBlur: () =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
            }}
        />
    );
}

function CheckboxesTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues, required, label, hint } = props;

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    return (
        <Checkbox
            {...getStateForSingleValue(displayableErrors)}
            legend={formatLabel(label, required)}
            hintText={hint}
            disabled={attribute.readOnly}
            options={options.map(option => ({
                label: inputLabel(i18n, attribute, option),
                nativeInputProps: {
                    name: attribute.name,
                    value: option,
                    checked: valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option,
                    onChange: event =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: (() => {
                                const isChecked = event.target.checked;

                                if (valueOrValues instanceof Array) {
                                    const newValues = [...valueOrValues];

                                    if (isChecked) {
                                        newValues.push(option);
                                    } else {
                                        newValues.splice(newValues.indexOf(option), 1);
                                    }

                                    return newValues;
                                }

                                return event.target.checked ? option : "";
                            })()
                        }),
                    onBlur: () =>
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: undefined
                        })
                }
            }))}
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues, required, label } = props;

    return (
        <Select
            label={formatLabel(label, required)}
            {...getStateForSingleValue(displayableErrors)}
            nativeSelectProps={{
                id: attribute.name,
                name: attribute.name,
                disabled: attribute.readOnly,
                size: attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`),
                value: valueOrValues,
                onChange: event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: event.target.value
                    }),
                onBlur: () =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
            }}
        >
            <option value=""></option>
            {(() => {
                const options = (() => {
                    walk: {
                        const { inputOptionsFromValidation } = attribute.annotations;

                        if (inputOptionsFromValidation === undefined) {
                            break walk;
                        }

                        assert(typeof inputOptionsFromValidation === "string");

                        const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

                        if (validator === undefined) {
                            break walk;
                        }

                        if (validator.options === undefined) {
                            break walk;
                        }

                        return validator.options;
                    }

                    return attribute.validators.options?.options ?? [];
                })();

                return options.map(option => (
                    <option key={option} value={option}>
                        {inputLabel(i18n, attribute, option)}
                    </option>
                ));
            })()}
        </Select>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;

        return advancedMsg(inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}

function getStateForSingleValue(displayableErrors: FormFieldError[]): { state: "error" | "default"; stateRelatedMessage: JSX.Element | undefined } {
    if (displayableErrors.length === 0) return { state: "default", stateRelatedMessage: undefined };
    return { state: "error", stateRelatedMessage: displayableErrors[0].errorMessage };
}

function formatLabel(label: JSX.Element | undefined, required: boolean | undefined) {
    return required && label ? <>{label} *</> : label;
}
