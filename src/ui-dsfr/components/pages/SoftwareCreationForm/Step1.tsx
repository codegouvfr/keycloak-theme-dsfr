import { useState } from "react";
import { useForm } from "react-hook-form";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";

export type Step1Props = {
    className?: string;
    defaultFormData: Partial<Step1Props.FormData> | undefined;
    onSubmit: (formData: Step1Props.FormData) => void;
    evtActionSubmit: NonPostableEvt<void>;
};

export namespace Step1Props {
    export type FormData = {
        softwareType: "desktop" | "cloud" | "library";
    };
}

export function SoftwareCreationFormStep1(props: Step1Props) {
    const { className, defaultFormData, onSubmit, evtActionSubmit } = props;

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<Step1Props.FormData>({
        "defaultValues": defaultFormData
    });

    const [formElement, setFormElement] = useState<HTMLFormElement | null>(null);

    useEvt(
        ctx => {
            if (formElement === null) {
                return;
            }

            evtActionSubmit.attach(ctx, () => formElement.submit());
        },
        [evtActionSubmit, formElement]
    );

    return (
        <form
            ref={setFormElement}
            className={className}
            onSubmit={handleSubmit(onSubmit)}
        >
            <RadioButtons
                legend=""
                state={errors.softwareType !== undefined ? "error" : undefined}
                stateRelatedMessage="This is field is required"
                options={[
                    {
                        "label": "Logiciel installable sur poste de travail",
                        "nativeInputProps": {
                            ...register("softwareType", { "required": true }),
                            "value": "desktop"
                        }
                    },
                    {
                        "label": "Solution logicielle applicative hébergée dans le cloud",
                        "hintText": "Cloud public ou cloud de votre organisation",
                        "nativeInputProps": {
                            ...register("softwareType", { "required": true }),
                            "value": "cloud"
                        }
                    },
                    {
                        "label": "Briques ou modules techniques ",
                        "hintText": "Par exemple des proxy, serveurs HTTP ou plugins",
                        "nativeInputProps": {
                            ...register("softwareType", { "required": true }),
                            "value": "library"
                        }
                    }
                ]}
            />
        </form>
    );
}
