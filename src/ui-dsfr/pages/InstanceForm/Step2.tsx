import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { fr } from "@codegouvfr/react-dsfr";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Input } from "@codegouvfr/react-dsfr/Input";

export type Step1Props = {
    className?: string;
    initialFormData: {
        organization: string | undefined;
        publicUrl: string | undefined;
        targetAudience: string | undefined;
    };
    onSubmit: (formData: {
        organization: string;
        publicUrl: string | undefined;
        targetAudience: string;
    }) => void;
    evtActionSubmit: NonPostableEvt<void>;
};

export function InstanceFormStep2(props: Step1Props) {
    const { className, initialFormData, onSubmit, evtActionSubmit } = props;

    const {
        handleSubmit,
        formState: { errors },
        register,
        watch
    } = useForm<{
        organization: string;
        isPublicInstanceInputValue: "true" | "false" | null;
        publicUrl: string | undefined;
        targetAudience: string;
    }>({
        "defaultValues": {
            "organization": initialFormData.organization,
            "isPublicInstanceInputValue":
                initialFormData.organization === undefined
                    ? null
                    : initialFormData.publicUrl !== undefined
                    ? "true"
                    : "false",
            "publicUrl": initialFormData.publicUrl,
            "targetAudience": initialFormData.targetAudience
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
            onSubmit={handleSubmit(({ organization, publicUrl, targetAudience }) =>
                onSubmit({
                    organization,
                    "publicUrl": publicUrl || undefined,
                    targetAudience
                })
            )}
        >
            <RadioButtons
                legend="Votre instance est-elle accessible publiquement* ?"
                options={[
                    {
                        "label": "Oui",
                        "nativeInputProps": {
                            ...register("isPublicInstanceInputValue", {
                                "required": true
                            }),
                            "value": "true"
                        }
                    },
                    {
                        "label": "Non",
                        "nativeInputProps": {
                            ...register("isPublicInstanceInputValue", {
                                "required": true
                            }),
                            "value": "false"
                        }
                    }
                ]}
                state={
                    errors.isPublicInstanceInputValue !== undefined ? "error" : undefined
                }
                stateRelatedMessage="This field is required"
            />
            {watch("isPublicInstanceInputValue") === "true" && (
                <Input
                    style={{
                        "marginTop": fr.spacing("4v")
                    }}
                    label="Quel est l’URL de l’instance?"
                    hintText="Afin de proposer un accès rapide au service proposé"
                    nativeInputProps={{
                        ...register("publicUrl", {
                            "required": true,
                            "pattern": /^http/
                        })
                    }}
                    state={errors.publicUrl !== undefined ? "error" : undefined}
                    stateRelatedMessage={
                        errors.publicUrl ? "Malformed" : "This field is required"
                    }
                />
            )}

            <Input
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                label="Organization?"
                hintText="Quelle est l'organization étatique qui maintien cette instance"
                nativeInputProps={{
                    ...register("organization", { "required": true })
                }}
                state={errors.organization !== undefined ? "error" : undefined}
                stateRelatedMessage="This field is required"
            />
            <Input
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                label="Quel est le public concerné?"
                hintText="Décrivez en quelques mots à qui l’offre de service est proposé"
                nativeInputProps={{
                    ...register("targetAudience", { "required": true })
                }}
                state={errors.targetAudience !== undefined ? "error" : undefined}
                stateRelatedMessage="This field is required"
            />
            <button
                style={{ "display": "none" }}
                ref={setSubmitButtonElement}
                type="submit"
            />
        </form>
    );
}
