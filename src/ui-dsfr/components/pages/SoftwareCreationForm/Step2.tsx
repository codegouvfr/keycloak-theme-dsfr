import { useEffect, useState } from "react";
import { SearchInput } from "ui-dsfr/components/shared/SearchInput";
import { fr } from "@codegouvfr/react-dsfr";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { CircularProgressWrapper } from "ui-dsfr/components/shared/CircularProgressWrapper";
import { assert } from "tsafe/assert";

export type Step2Props = {
    className?: string;
    isUpdateForm: boolean;
    defaultFormData: Partial<Step2Props.FormData> | undefined;
    onFormDataChange: (formData: Step2Props.FormData) => void;
    onPrev: () => void;
    getWikidataOptions: (inputText: string) => Promise<Step2Props.WikidataEntry[]>;
    getAutofillData: (wikidataId: string) => Promise<{
        comptoirDuLibreId: number | undefined;
        softwareName: string;
        softwareDescription: string;
        softwareLicense: string | undefined;
        softwareMinimalVersion: string | undefined;
    }>;
};

export namespace Step2Props {
    export type WikidataEntry = {
        wikidataLabel: string;
        wikidataDescription: string;
        wikidataId: string;
    };

    export type FormData = {
        wikidataEntry: WikidataEntry | undefined;
        comptoirDuLibreId: number | undefined;
        softwareName: string;
        softwareDescription: string;
        softwareLicense: string;
        softwareMinimalVersion: string;
    };
}

export function SoftwareCreationFormStep2(props: Step2Props) {
    const {
        className,
        isUpdateForm,
        defaultFormData,
        onFormDataChange,
        onPrev,
        getWikidataOptions,
        getAutofillData
    } = props;

    const {
        handleSubmit,
        control,
        register,
        watch,
        formState: { errors },
        setValue
    } = useForm<
        Omit<Step2Props.FormData, "comptoirDuLibreId"> & {
            comptoirDuLibreInputValue: string;
        }
    >({
        "defaultValues": (() => {
            const { comptoirDuLibreId, ...rest } = defaultFormData ?? {};

            return {
                ...rest,
                ...(comptoirDuLibreId === undefined
                    ? {}
                    : {
                          "comptoirDuLibreInputValue":
                              comptoirDuLibreIdToComptoirDuLibreInputValue(
                                  comptoirDuLibreId
                              )
                      })
            };
        })()
    });

    const { isAutocompleteInProgress } = (function useClosure() {
        const [isAutocompleteInProgress, setIsAutocompleteInProgress] = useState(false);

        const wikiDataEntry = watch("wikidataEntry");

        useEffect(() => {
            if (wikiDataEntry === undefined || isUpdateForm) {
                return;
            }

            let isActive = true;

            (async () => {
                setIsAutocompleteInProgress(true);

                const {
                    comptoirDuLibreId,
                    softwareName,
                    softwareDescription,
                    softwareLicense,
                    softwareMinimalVersion
                } = await getAutofillData(wikiDataEntry.wikidataId);

                if (!isActive) {
                    return;
                }

                if (comptoirDuLibreId !== undefined) {
                    setValue(
                        "comptoirDuLibreInputValue",
                        comptoirDuLibreIdToComptoirDuLibreInputValue(comptoirDuLibreId)
                    );
                }

                if (softwareDescription !== undefined) {
                    setValue("softwareDescription", softwareDescription);
                }

                if (softwareLicense !== undefined) {
                    setValue("softwareLicense", softwareLicense);
                }

                if (softwareMinimalVersion !== undefined) {
                    setValue("softwareMinimalVersion", softwareMinimalVersion);
                }

                setValue("softwareName", softwareName);

                setIsAutocompleteInProgress(false);
            })();

            return () => {
                isActive = false;
            };
        }, [wikiDataEntry]);

        return { isAutocompleteInProgress };
    })();

    return (
        <form
            className={className}
            onSubmit={handleSubmit(({ comptoirDuLibreInputValue, ...rest }) =>
                onFormDataChange({
                    ...rest,
                    "comptoirDuLibreId": comptoirDuLibreInputValueToComptoirDuLibreId(
                        comptoirDuLibreInputValue
                    )
                })
            )}
        >
            <Controller
                name="wikidataEntry"
                control={control}
                rules={{ "required": false }}
                render={({ field }) => (
                    <SearchInput
                        debounceDelay={400}
                        getOptions={getWikidataOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        getOptionLabel={wikidataEntry => wikidataEntry.wikidataLabel}
                        renderOption={(liProps, wikidataEntity) => (
                            <li {...liProps}>
                                <div>
                                    <span>{wikidataEntity.wikidataLabel}</span>
                                    <br />
                                    <span className={fr.cx("fr-text--xs")}>
                                        {wikidataEntity.wikidataDescription}
                                    </span>
                                </div>
                            </li>
                        )}
                        noOptionText={"No result"}
                        loadingText={"Loading..."}
                        dsfrInputProps={{
                            "label": "Wikidata sheet",
                            "hintText":
                                "Associer le logiciel à une fiche Wikidata déjà existante",
                            "nativeInputProps": {
                                "ref": field.ref,
                                "onBlur": field.onBlur,
                                "name": field.name
                            }
                        }}
                    />
                )}
            />
            <CircularProgressWrapper
                isInProgress={isAutocompleteInProgress}
                renderChildren={({ style }) => (
                    <Input
                        disabled={isAutocompleteInProgress}
                        style={{
                            ...style,
                            "marginTop": fr.spacing("4v")
                        }}
                        label="Identifiant Comptoir du Libre"
                        hintText="URL de la page ou identifiant numérique"
                        nativeInputProps={{
                            ...register("comptoirDuLibreInputValue", {
                                "pattern": /^[0-9]{1,5}$|^http/
                            })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage="Should be an url of an numeric identifier"
                    />
                )}
            />
            <CircularProgressWrapper
                isInProgress={isAutocompleteInProgress}
                renderChildren={({ style }) => (
                    <Input
                        disabled={isAutocompleteInProgress}
                        style={{
                            ...style,
                            "marginTop": fr.spacing("4v")
                        }}
                        label="Software name"
                        nativeInputProps={{
                            ...register("softwareName", { "required": true })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage="This field is required"
                    />
                )}
            />
            <CircularProgressWrapper
                isInProgress={isAutocompleteInProgress}
                renderChildren={({ style }) => (
                    <Input
                        disabled={isAutocompleteInProgress}
                        style={{
                            ...style,
                            "marginTop": fr.spacing("4v")
                        }}
                        label="Fonction du logiciel"
                        hintText="Decrivez en quelques mots les fonctions du logiciel"
                        nativeInputProps={{
                            ...register("softwareDescription", { "required": true })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage="Ce champ est requis"
                    />
                )}
            />
            <CircularProgressWrapper
                isInProgress={isAutocompleteInProgress}
                renderChildren={({ style }) => (
                    <Input
                        disabled={isAutocompleteInProgress}
                        style={{
                            ...style,
                            "marginTop": fr.spacing("4v")
                        }}
                        label="Licience du logiciel"
                        hintText="(GNU, GPL, BSD, ect.)"
                        nativeInputProps={{
                            ...register("softwareLicense", { "required": true })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage="Ce champ est requis"
                    />
                )}
            />
            <CircularProgressWrapper
                isInProgress={isAutocompleteInProgress}
                renderChildren={({ style }) => (
                    <Input
                        disabled={isAutocompleteInProgress}
                        style={{
                            ...style,
                            "marginTop": fr.spacing("4v")
                        }}
                        label="Minimal version"
                        hintText="Version la plus ancienne encore acceptable d'avoir en production"
                        nativeInputProps={{
                            ...register("softwareMinimalVersion", { "required": true })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage="Ce champ est requis"
                    />
                )}
            />
            <Button
                style={{
                    "marginTop": fr.spacing("4v"),
                    "marginRight": fr.spacing("4v")
                }}
                onClick={() => onPrev()}
                type="button"
            >
                Prev
            </Button>
            <Button
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                type="submit"
            >
                Next
            </Button>
        </form>
    );
}

function comptoirDuLibreIdToComptoirDuLibreInputValue(comptoirDuLibreId: number) {
    return `https://comptoir-du-libre.org/fr/softwares/${comptoirDuLibreId}`;
}

function comptoirDuLibreInputValueToComptoirDuLibreId(comptoirDuLibreInputValue: string) {
    if (comptoirDuLibreInputValue === "") {
        return undefined;
    }

    number: {
        const n = parseInt(comptoirDuLibreInputValue);

        if (isNaN(n)) {
            break number;
        }

        return n;
    }

    url: {
        if (
            !comptoirDuLibreInputValue.startsWith(
                "https://comptoir-du-libre.org/fr/softwares/"
            )
        ) {
            break url;
        }

        const n = parseInt(comptoirDuLibreInputValue.split("/").reverse()[0]);

        if (isNaN(n)) {
            break url;
        }

        return n;
    }

    assert(false);
}