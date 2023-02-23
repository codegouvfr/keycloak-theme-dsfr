import { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";

export type Step2Props = {
    className?: string;
    initialFormData: Partial<Step3Props.FormData> | undefined;
    isCloudNativeSoftware: boolean;
    onSubmit: (formData: Step3Props.FormData) => void;
    evtActionSubmit: NonPostableEvt<void>;
};

export namespace Step3Props {
    export type FormData = {
        isPresentInSupportContract: boolean | undefined;
        isFromFrenchPublicService: boolean;
        instanceInfo:
            | {
                  instanceUrl: string | undefined;
                  targetAudience: string;
              }
            | undefined;
    };
}

export function SoftwareFormStep3(props: Step2Props) {
    const {
        className,
        initialFormData,
        isCloudNativeSoftware,
        onSubmit,
        evtActionSubmit
    } = props;

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm<{
        isPresentInSupportContractInputValue: "true" | "false" | undefined;
        isFromFrenchPublicServiceInputValue: "true" | "false";
        isPublicInstanceInputValue: "true" | "false";
        instanceUrl: string | undefined;
        targetAudience: string;
    }>({
        "defaultValues": (() => {
            if (initialFormData === undefined) {
                return undefined;
            }

            const {
                isFromFrenchPublicService,
                isPresentInSupportContract,
                instanceInfo
            } = initialFormData;

            const { instanceUrl, targetAudience } = instanceInfo ?? {};

            return {
                "isPresentInSupportContractInputValue":
                    isPresentInSupportContract === undefined
                        ? undefined
                        : isPresentInSupportContract
                        ? "true"
                        : "false",
                "isFromFrenchPublicServiceInputValue":
                    isFromFrenchPublicService === undefined
                        ? undefined
                        : isFromFrenchPublicService
                        ? "true"
                        : "false",
                "isPublicInstanceInputValue":
                    instanceInfo !== undefined ? "true" : "false",
                instanceUrl,
                targetAudience
            };
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
            onSubmit={handleSubmit(
                ({
                    instanceUrl,
                    isPresentInSupportContractInputValue,
                    isFromFrenchPublicServiceInputValue,
                    targetAudience
                }) =>
                    onSubmit({
                        "isPresentInSupportContract": (() => {
                            switch (isPresentInSupportContractInputValue) {
                                case undefined:
                                    return undefined;
                                case "true":
                                    return true;
                                case "false":
                                    return false;
                            }
                        })(),
                        "isFromFrenchPublicService": (() => {
                            switch (isFromFrenchPublicServiceInputValue) {
                                case "true":
                                    return true;
                                case "false":
                                    return false;
                            }
                        })(),
                        "instanceInfo":
                            targetAudience === undefined
                                ? undefined
                                : {
                                      instanceUrl,
                                      targetAudience
                                  }
                    })
            )}
        >
            <RadioButtons
                legend="Le logiciel est-il présent sur le marché support?"
                options={[
                    {
                        "label": "Oui",
                        "nativeInputProps": {
                            ...register("isPresentInSupportContractInputValue"),
                            "value": "true"
                        }
                    },
                    {
                        "label": "Non",
                        "nativeInputProps": {
                            ...register("isPresentInSupportContractInputValue"),
                            "value": "false"
                        }
                    }
                ]}
            />
            <RadioButtons
                legend="Le logiciel est-il développé par le service public français ?*"
                options={[
                    {
                        "label": "Oui",
                        "nativeInputProps": {
                            ...register("isFromFrenchPublicServiceInputValue", {
                                "required": true
                            }),
                            "value": "true"
                        }
                    },
                    {
                        "label": "Non",
                        "nativeInputProps": {
                            ...register("isFromFrenchPublicServiceInputValue", {
                                "required": true
                            }),
                            "value": "false"
                        }
                    }
                ]}
                state={
                    errors.isFromFrenchPublicServiceInputValue !== undefined
                        ? "error"
                        : undefined
                }
                stateRelatedMessage="This field is mandatory"
            />
            {isCloudNativeSoftware && (
                <>
                    <h3>À propos de l’instance du logiciel</h3>
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
                            errors.isPublicInstanceInputValue !== undefined
                                ? "error"
                                : undefined
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
                                ...register("instanceUrl", {
                                    "required": true,
                                    "pattern": /^http/
                                })
                            }}
                            state={errors.instanceUrl !== undefined ? "error" : undefined}
                            stateRelatedMessage={
                                errors.instanceUrl
                                    ? "Malformed"
                                    : "This field is required"
                            }
                        />
                    )}
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
                </>
            )}
            <button
                style={{ "display": "none" }}
                ref={setSubmitButtonElement}
                type="submit"
            />
        </form>
    );
}
