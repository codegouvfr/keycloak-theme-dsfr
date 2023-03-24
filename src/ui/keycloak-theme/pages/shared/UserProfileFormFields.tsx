import { useEffect } from "react";
import type { Attribute } from "keycloakify/login/kcContext/KcContext";
import { useCallbackFactory } from "keycloakify/lib/tools/useCallbackFactory";
import { useFormValidation } from "keycloakify/login/lib/useFormValidation";
import type { I18n } from "ui/keycloak-theme/i18n";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useTranslation } from "ui/i18n";
import { declareComponentKeys } from "i18nifty";
import { AutocompleteInput } from "ui/keycloak-theme/pages/shared/AutocompleteInput";
import { fr } from "@codegouvfr/react-dsfr";
import type { ClassKey } from "keycloakify/login/TemplateProps";

export type UserProfileFormFieldsProps = {
    kcContext: Parameters<typeof useFormValidation>[0]["kcContext"];
    i18n: I18n;
    getClassName: (classKey: ClassKey) => string;
    onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
    BeforeField?: (props: { attribute: Attribute }) => JSX.Element | null;
    AfterField?: (props: { attribute: Attribute }) => JSX.Element | null;
};

const contactEmail = "sill@code.gouv.fr";

export function UserProfileFormFields({
    kcContext,
    onIsFormSubmittableValueChange,
    i18n,
    BeforeField,
    AfterField,
    getClassName,
    ...props
}: UserProfileFormFieldsProps) {
    const { advancedMsg } = i18n;

    const {
        formValidationState: { fieldStateByAttributeName, isFormSubmittable },
        formValidationDispatch,
        attributesWithPassword
    } = useFormValidation({
        kcContext,
        i18n
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const onBlurFactory = useCallbackFactory(([name]: [string]) =>
        formValidationDispatch({
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
                                formValidationDispatch({
                                    "action": "update value",
                                    "name": attribute.name,
                                    "newValue": value ?? ""
                                })
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
                                        formValidationDispatch({
                                            "action": "update value",
                                            "name": attribute.name,
                                            "newValue": event.currentTarget.value
                                        }),
                                    "className": getClassName("kcInputClass"),
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
                                formValidationDispatch({
                                    "action": "update value",
                                    "name": attribute.name,
                                    "newValue": event.currentTarget.value
                                }),
                            "className": getClassName("kcInputClass"),
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
