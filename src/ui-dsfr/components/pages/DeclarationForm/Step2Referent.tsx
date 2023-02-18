import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import type { FormData } from "core-dsfr/usecases/declarationForm";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { useTranslation } from "ui-dsfr/i18n";

type Props = {
    className?: string;
    onSubmit: (formData: FormData.Referent) => void;
    evtActionSubmit: NonPostableEvt<void>;
    softwareType: "cloud" | "other";
};

export function DeclarationFormStep2Referent(props: Props) {
    const { className, onSubmit, evtActionSubmit, softwareType } = props;

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<{
        usecaseDescription: string;
        isTechnicalExpertInputValue: "true" | "false";
        serviceUrlInputValue: string;
    }>();

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

    const { t: tCommon } = useTranslation({ "App": null });

    return (
        <form
            className={className}
            onSubmit={handleSubmit(
                ({
                    usecaseDescription,
                    isTechnicalExpertInputValue,
                    serviceUrlInputValue
                }) =>
                    onSubmit({
                        "declarationType": "referent",
                        "isTechnicalExpert": (() => {
                            switch (isTechnicalExpertInputValue) {
                                case "true":
                                    return true;
                                case "false":
                                    return false;
                            }
                        })(),
                        usecaseDescription,
                        "serviceUrl":
                            softwareType !== "cloud" ? undefined : serviceUrlInputValue
                    })
            )}
        >
            <RadioButtons
                legend="Êtes-vous expert technique concernant ce logiciel?"
                hintText="Vous pouvez répondre à questions techniques d’agents et de DSI"
                options={[
                    {
                        "label": tCommon("yes"),
                        "nativeInputProps": {
                            ...register("isTechnicalExpertInputValue", {
                                "required": true
                            }),
                            "value": "true"
                        }
                    },
                    {
                        "label": tCommon("no"),
                        "nativeInputProps": {
                            ...register("isTechnicalExpertInputValue", {
                                "required": true
                            }),
                            "value": "false"
                        }
                    }
                ]}
            />

            <Input
                label="Décrivez en quelques mots votre cas d'usage"
                nativeInputProps={{
                    ...register("usecaseDescription", { "required": true })
                }}
                state={errors.usecaseDescription !== undefined ? "error" : undefined}
                stateRelatedMessage="Required"
            />
            {softwareType === "cloud" && (
                <Input
                    label="Plus précisément, quelle instance du logiciel utilisez-vous?"
                    nativeInputProps={{
                        ...register("serviceUrlInputValue", {
                            "pattern": /^http/
                        })
                    }}
                    state={
                        errors.serviceUrlInputValue !== undefined ? "error" : undefined
                    }
                    stateRelatedMessage="Not a valid url"
                />
            )}
            <button
                style={{ "display": "none" }}
                ref={setSubmitButtonElement}
                type="submit"
            />
        </form>
    );
}
