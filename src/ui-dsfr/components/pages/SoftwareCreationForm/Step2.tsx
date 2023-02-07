import { useEffect, useState } from "react";
import { SearchInput } from "ui-dsfr/components/shared/SearchInput";
import { fr } from "@codegouvfr/react-dsfr";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { CircularProgressWrapper } from "ui-dsfr/components/shared/CircularProgressWrapper";
import { core } from "./coreMock";

export type FormDataStep2 = {
    wikidataEntry: core.WikidataEntry | undefined;
    softwareName: string | undefined;
};

export function Step2(props: {
    className?: string;
    isUpdateForm: boolean;
    formData: FormDataStep2 | undefined;
    onFormDataChange: (formData: FormDataStep2) => void;
    onPrev: () => void;
}) {
    const { className, isUpdateForm, formData, onFormDataChange, onPrev } = props;

    const {
        handleSubmit,
        control,
        register,
        watch,
        formState: { errors },
        setValue
    } = useForm<FormDataStep2>({
        "defaultValues": formData
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

                const { softwareName } = await core.getAutofillData({
                    "wikidataId": wikiDataEntry.wikidataId
                });

                if (!isActive) {
                    return;
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
        <form className={className} onSubmit={handleSubmit(onFormDataChange)}>
            <Controller
                name="wikidataEntry"
                control={control}
                rules={{ "required": false }}
                render={({ field }) => (
                    <SearchInput
                        debounceDelay={400}
                        getOptions={core.getWikidataOptions}
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
                        label="Software name"
                        nativeInputProps={{
                            ...register("softwareName", { "required": true })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage={(() => {
                            switch (errors.softwareName?.type) {
                                case undefined:
                                    return undefined;
                                case "required":
                                    return "You must provide a software name";
                            }
                        })()}
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
