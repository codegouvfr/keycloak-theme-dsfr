import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { fr } from "@codegouvfr/react-dsfr";
import { SearchMultiInput } from "ui-dsfr/components/shared/SearchMultiInput";
import type { FormData } from "core-dsfr/usecases/softwareForm";
import type { useCoreFunctions } from "core-dsfr";

export type Step4Props = {
    className?: string;
    initialFormData: FormData["step4"] | undefined;
    onSubmit: (formData: FormData["step4"]) => void;
    evtActionSubmit: NonPostableEvt<void>;
    getWikidataOptions: ReturnType<
        typeof useCoreFunctions
    >["softwareForm"]["getWikidataOptions"];
};

export function SoftwareCreationFormStep4(props: Step4Props) {
    const { className, initialFormData, onSubmit, evtActionSubmit, getWikidataOptions } =
        props;

    const { handleSubmit, control } = useForm<FormData["step4"]>({
        "defaultValues": (() => {
            if (initialFormData === undefined) {
                return {
                    "similarSoftwares": []
                };
            }

            return initialFormData;
        })()
    });

    const [submitButtonElement, setSubmitButtonElement] =
        useState<HTMLButtonElement | null>(null);

    useEvt(
        ctx => {
            if (submitButtonElement === null) {
                return;
            }

            evtActionSubmit.attach(ctx, () => submitButtonElement.click());
        },
        [evtActionSubmit, submitButtonElement]
    );

    return (
        <form
            className={className}
            onSubmit={handleSubmit(formData => onSubmit(formData))}
        >
            <Controller
                name="similarSoftwares"
                control={control}
                render={({ field }) => (
                    <SearchMultiInput
                        debounceDelay={400}
                        getOptions={inputText =>
                            getWikidataOptions({ "queryString": inputText })
                        }
                        value={field.value}
                        onValueChange={value => field.onChange(value)}
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
                        noOptionText="No result"
                        loadingText="Loading..."
                        dsfrInputProps={{
                            "label": "Logiciels similaires",
                            "hintText":
                                "Associer le logiciel a des logiciel similaire, propriétaire ou non",
                            "nativeInputProps": {
                                "ref": field.ref,
                                "onBlur": field.onBlur,
                                "name": field.name
                            }
                        }}
                    />
                )}
            />
            <button
                style={{ "display": "none" }}
                ref={setSubmitButtonElement}
                type="submit"
            />
        </form>
    );
}
