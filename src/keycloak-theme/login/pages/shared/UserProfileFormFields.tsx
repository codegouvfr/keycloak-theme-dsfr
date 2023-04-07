import { useEffect, useState } from "react";
import { useFormValidation } from "keycloakify/login/lib/useFormValidation";
import type { I18n } from "keycloak-theme/login/i18n";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { AutocompleteInput } from "keycloak-theme/login/pages/shared/AutocompleteInput";
import { fr } from "@codegouvfr/react-dsfr";
import type { ClassKey } from "keycloakify/login/TemplateProps";
import { createSillApi } from "core/adapter/sillApi";
import { sillApiUrl } from "keycloak-theme/login/valuesTransferredOverUrl";
import { contactEmail } from "ui/shared/contactEmail";
import MuiCircularProgress from "@mui/material/CircularProgress";

export type UserProfileFormFieldsProps = {
    kcContext: Parameters<typeof useFormValidation>[0]["kcContext"];
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

    const { apiData } = (function () {
        const [apiData, setApiData] = useState<
            | {
                  organizations: string[];
                  organizationUserProfileAttributeName: string;
              }
            | undefined
        >(undefined);

        useEffect(() => {
            const sillApi = createSillApi({
                "getOidcAccessToken": () => undefined,
                "url": sillApiUrl
            });

            Promise.all([
                sillApi.getAllOrganizations(),
                sillApi.getOrganizationUserProfileAttributeName()
            ]).then(([organizations, organizationUserProfileAttributeName]) =>
                setApiData({
                    organizations,
                    organizationUserProfileAttributeName
                })
            );
        }, []);

        return { apiData };
    })();

    if (apiData === undefined) {
        return (
            <div
                style={{
                    "display": "flex",
                    "justifyContent": "center",
                    "height": "100%",
                    "alignItems": "center"
                }}
            >
                <MuiCircularProgress />
            </div>
        );
    }

    return (
        <>
            {attributesWithPassword.map(attribute => {
                const { value, displayableErrors } =
                    fieldStateByAttributeName[attribute.name];

                if (attribute.name === apiData.organizationUserProfileAttributeName) {
                    return (
                        <AutocompleteInput
                            className={fr.cx("fr-input-group")}
                            freeSolo
                            options={apiData.organizations}
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
                                    "onBlur": () =>
                                        formValidationDispatch({
                                            "action": "focus lost",
                                            "name": attribute.name
                                        })
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
                                <>
                                    {msgStr("you domain isn't allowed yet")}
                                    <a
                                        href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                                            msgStr("mail subject")
                                        )}&body=${encodeURIComponent(
                                            msgStr("mail body")
                                        )}`}
                                    >
                                        {contactEmail}
                                    </a>
                                </>
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
