import React, { useEffect } from "react";
import type { KcProps } from "keycloakify/lib/KcProps";
import type { Attribute } from "keycloakify/lib/getKcContext/KcContextBase";
import { clsx } from "keycloakify/lib/tools/clsx";
import { useCallbackFactory } from "keycloakify/lib/tools/useCallbackFactory";
import { useFormValidationSlice } from "keycloakify/lib/useFormValidationSlice";
import type { I18n } from "ui/keycloak-theme/i18n";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useTranslation } from "ui/i18n";
import { declareComponentKeys } from "i18nifty";
import { AutocompleteInput } from "ui/keycloak-theme/pages/shared/AutocompleteInput";
import { fr } from "@codegouvfr/react-dsfr";

export type UserProfileCommonsProps = {
    kcContext: Parameters<typeof useFormValidationSlice>[0]["kcContext"];
    i18n: I18n;
} & KcProps &
    Partial<
        Record<
            "BeforeField" | "AfterField",
            (props: { attribute: Attribute }) => JSX.Element | null
        >
    > & {
        onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
    };

const contactEmail = "sill@code.gouv.fr";

export function UserProfileCommons({
    kcContext,
    onIsFormSubmittableValueChange,
    i18n,
    BeforeField,
    AfterField,
    ...props
}: UserProfileCommonsProps) {
    const { advancedMsg } = i18n;

    const { t } = useTranslation({ UserProfileCommons });

    const {
        formValidationState: { fieldStateByAttributeName, isFormSubmittable },
        formValidationReducer,
        attributesWithPassword
    } = useFormValidationSlice({
        kcContext,
        i18n
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const onChangeFactory = useCallbackFactory(
        ([name]: [string], [{ value }]: [{ value: string }]) =>
            formValidationReducer({
                "action": "update value",
                name,
                "newValue": value
            })
    );

    const onBlurFactory = useCallbackFactory(([name]: [string]) =>
        formValidationReducer({
            "action": "focus lost",
            name
        })
    );

    const organizationOptions = ["organization1", "organization2"];

    return (
        <>
            {attributesWithPassword.map(attribute => {
                console.group(attribute.displayName);
                console.log(attribute);
                console.groupEnd();

                const { value, displayableErrors } =
                    fieldStateByAttributeName[attribute.name];

                if (attribute.name === "agencyName") {
                    return (
                        <AutocompleteInput
                            className={fr.cx("fr-input-group")}
                            freeSolo
                            options={organizationOptions}
                            value={value}
                            onValueChange={value =>
                                onChangeFactory(attribute.name)({ value: value ?? "" })
                            }
                            getOptionLabel={entry => entry}
                            renderOption={(liProps, entry) => (
                                <li {...liProps}>
                                    <span>{entry}</span>
                                </li>
                            )}
                            noOptionText="No result"
                            dsfrInputProps={{
                                "label": advancedMsg(attribute.displayName ?? ""),
                                "nativeInputProps": {
                                    "type": "text",
                                    "id": attribute.name,
                                    "name": attribute.name,
                                    "value": value,
                                    "onChange": event =>
                                        onChangeFactory(attribute.name)({
                                            value: event.currentTarget.value
                                        }),
                                    "className": clsx(props.kcInputClass),
                                    "aria-invalid": displayableErrors.length !== 0,
                                    "disabled": attribute.readOnly,
                                    "autoComplete": attribute.autocomplete,
                                    "onBlur": onBlurFactory(attribute.name)
                                }
                            }}
                        />
                    );
                }

                return (
                    <Input
                        key={attribute.name}
                        label={advancedMsg(attribute.displayName ?? "")}
                        nativeInputProps={{
                            "type": (() => {
                                switch (attribute.name) {
                                    case "password-confirm":
                                    case "password":
                                        return "password";
                                    default:
                                        return "text";
                                }
                            })(),
                            "id": attribute.name,
                            "name": attribute.name,
                            "value": value,
                            "onChange": event =>
                                onChangeFactory(attribute.name)({
                                    value: event.currentTarget.value
                                }),
                            "className": clsx(props.kcInputClass),
                            "aria-invalid": displayableErrors.length !== 0,
                            "disabled": attribute.readOnly,
                            "autoComplete": attribute.autocomplete,
                            "onBlur": onBlurFactory(attribute.name)
                        }}
                        state={displayableErrors.length !== 0 ? "error" : "default"}
                        stateRelatedMessage={
                            attribute.name === "email" &&
                            displayableErrors[0]?.validatorName === "pattern"
                                ? t("you domain isn't allowed yet", {
                                      "mailtoHref": `mailto:${contactEmail}?subject=${encodeURIComponent(
                                          t("mail subject")
                                      )}&body=${encodeURIComponent(t("mail body"))}`,
                                      contactEmail
                                  })
                                : displayableErrors[0]?.errorMessageStr
                        }
                    />
                );
            })}
        </>
    );
}
export const { i18n } = declareComponentKeys<
    | {
          K: "you domain isn't allowed yet";
          P: { mailtoHref: string; contactEmail: string };
          R: JSX.Element;
      }
    | "mail subject"
    | "mail body"
>()({ UserProfileCommons });
