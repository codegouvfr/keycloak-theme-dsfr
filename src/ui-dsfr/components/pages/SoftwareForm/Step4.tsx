import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { fr } from "@codegouvfr/react-dsfr";
import { SearchMultiInput } from "ui-dsfr/components/shared/SearchMultiInput";
import type { FormData } from "core-dsfr/usecases/softwareForm";
import type { useCoreFunctions } from "core-dsfr";
import { declareComponentKeys } from "i18nifty";
import { SoftwareFormStep2 } from "./Step2";
import { useTranslation } from "../../../i18n";

export type Step4Props = {
    className?: string;
    initialFormData: FormData["step4"] | undefined;
    onSubmit: (formData: FormData["step4"]) => void;
    evtActionSubmit: NonPostableEvt<void>;
    getWikidataOptions: ReturnType<
        typeof useCoreFunctions
    >["softwareForm"]["getWikidataOptions"];
};

export function SoftwareFormStep4(props: Step4Props) {
    const { className, initialFormData, onSubmit, evtActionSubmit, getWikidataOptions } =
        props;

    const { t } = useTranslation({ SoftwareFormStep4 });
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
                            "label": t("similar software"),
                            "hintText": t("similar software hint"),
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

export const { i18n } = declareComponentKeys<
    "similar software" | "similar software hint"
>()({ SoftwareFormStep4 });
