import { useEffect } from "react";
import { useFormValidation } from "keycloakify/login/lib/useFormValidation";
import type { I18n } from "login/i18n";
import { Input } from "@codegouvfr/react-dsfr/Input";
import type { ClassKey } from "keycloakify/login/TemplateProps";

export type UserProfileFormFieldsProps = {
    kcContext: Parameters<typeof useFormValidation>[0]["kcContext"] & {
        properties: {
            contactEmail: string;
        };
    };
    i18n: I18n;
    getClassName: (classKey: ClassKey) => string;
    onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
};

export function UserProfileFormFields({
    kcContext,
    onIsFormSubmittableValueChange,
    i18n,
    getClassName
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

    const { msgStr } = i18n;

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const contactEmail =
        kcContext.properties.contactEmail ||
        "ERROR: Need to be provided as environnement variable";

    return (
        <>
            {attributesWithPassword.map(attribute => {
                const { value, displayableErrors } =
                    fieldStateByAttributeName[attribute.name];

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
                            "onBlur": () =>
                                formValidationDispatch({
                                    "action": "focus lost",
                                    "name": attribute.name
                                })
                        }}
                        state={displayableErrors.length !== 0 ? "error" : "default"}
                        stateRelatedMessage={
                            attribute.name === "email" &&
                            displayableErrors[0]?.validatorName === "pattern" ? (
                                <span>
                                    {msgStr("you domain isn't allowed yet")}
                                    &nbsp;
                                    <a
                                        href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                                            msgStr("mail subject")
                                        )}&body=${encodeURIComponent(
                                            msgStr("mail body")
                                        )}`}
                                    >
                                        {contactEmail}
                                    </a>
                                </span>
                            ) : (
                                displayableErrors[0]?.errorMessageStr
                            )
                        }
                    />
                );
            })}
        </>
    );
}
