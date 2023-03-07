import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import type { WikidataEntry } from "core-dsfr/usecases/instanceForm";
import { AutocompleteInput } from "ui-dsfr/shared/AutocompleteInput";
import { SearchMultiInput } from "ui-dsfr/shared/SearchMultiInput";
import type { useCoreFunctions } from "core-dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../../i18n";

export type Step1Props = {
    className?: string;
    initialFormData: {
        mainSoftwareSillId: number | undefined;
        otherSoftwares: WikidataEntry[];
    };
    onSubmit: (formData: {
        mainSoftwareSillId: number;
        otherSoftwares: WikidataEntry[];
    }) => void;
    allSillSoftwares: {
        softwareName: string;
        softwareSillId: number;
        softwareDescription: string;
    }[];
    evtActionSubmit: NonPostableEvt<void>;
    getWikidataOptions: ReturnType<
        typeof useCoreFunctions
    >["softwareForm"]["getWikidataOptions"];
};

export function InstanceFormStep1(props: Step1Props) {
    const {
        className,
        initialFormData,
        onSubmit,
        evtActionSubmit,
        getWikidataOptions,
        allSillSoftwares
    } = props;

    const { t } = useTranslation({ InstanceFormStep1 });
    const commoni18n = useTranslation({ "App": null });

    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<{
        mainSoftware: {
            softwareName: string;
            softwareSillId: number;
            softwareDescription: string;
        };
        otherSoftwares: WikidataEntry[];
    }>({
        "defaultValues": {
            "mainSoftware": (() => {
                const { mainSoftwareSillId } = initialFormData;

                if (mainSoftwareSillId === undefined) {
                    return undefined;
                }

                const mainSoftware = allSillSoftwares.find(
                    ({ softwareSillId }) =>
                        softwareSillId === initialFormData.mainSoftwareSillId
                );

                assert(mainSoftware !== undefined);

                return mainSoftware;
            })(),
            "otherSoftwares": initialFormData.otherSoftwares
        }
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
            onSubmit={handleSubmit(data =>
                onSubmit({
                    "mainSoftwareSillId": data.mainSoftware.softwareSillId,
                    "otherSoftwares": data.otherSoftwares
                })
            )}
        >
            <Controller
                name="mainSoftware"
                rules={{ "required": true }}
                control={control}
                render={({ field }) => (
                    <AutocompleteInput
                        options={allSillSoftwares}
                        value={field.value}
                        onValueChange={value => field.onChange(value)}
                        getOptionLabel={entry => entry.softwareName}
                        renderOption={(liProps, entry) => (
                            <li {...liProps}>
                                <div>
                                    <span>{entry.softwareName}</span>
                                    <br />
                                    <span className={fr.cx("fr-text--xs")}>
                                        {entry.softwareDescription}
                                    </span>
                                </div>
                            </li>
                        )}
                        noOptionText="No result"
                        dsfrInputProps={{
                            "label": t("software instance"),
                            "nativeInputProps": {
                                "ref": field.ref,
                                "onBlur": field.onBlur,
                                "name": field.name
                            },
                            "state":
                                errors.mainSoftware === undefined ? undefined : "error",
                            "stateRelatedMessage": commoni18n.t("required")
                        }}
                    />
                )}
            />

            <Controller
                name="otherSoftwares"
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
                        noOptionText={commoni18n.t("no result")}
                        loadingText={commoni18n.t("loading")}
                        dsfrInputProps={{
                            "label": t("other software"),
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

export const { i18n } = declareComponentKeys<"software instance" | "other software">()({
    InstanceFormStep1
});
