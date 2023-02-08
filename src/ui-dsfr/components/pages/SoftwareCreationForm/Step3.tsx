import { fr } from "@codegouvfr/react-dsfr";
import { useForm } from "react-hook-form";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

export type Step2Props = {
    className?: string;
    defaultFormData: Partial<Step3Props.FormData> | undefined;
    isCloudNativeSoftware: boolean;
    onFormDataChange: (formData: Step3Props.FormData) => void;
    onPrev: () => void;
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

export function SoftwareCreationFormStep3(props: Step2Props) {
    const {
        className,
        defaultFormData,
        isCloudNativeSoftware,
        onFormDataChange,
        onPrev
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
            const {
                isFromFrenchPublicService,
                isPresentInSupportContract,
                instanceInfo
            } = defaultFormData ?? {};

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
                instanceUrl,
                targetAudience
            };
        })()
    });

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
                    onFormDataChange({
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
                    />
                    {watch("isPublicInstanceInputValue") === "true" && (
                        <Input
                            style={{
                                "marginTop": fr.spacing("4v")
                            }}
                            label="Quel est l’URL de l’instance?"
                            hintText="Afin de proposer un accès rapide au service proposé"
                            nativeInputProps={{
                                ...register("instanceUrl", { "required": true })
                            }}
                            state={errors.instanceUrl !== undefined ? "error" : undefined}
                            stateRelatedMessage="This field is required"
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
                        state={errors.instanceUrl !== undefined ? "error" : undefined}
                        stateRelatedMessage="This field is required"
                    />
                </>
            )}
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
