import { useState } from "react";
import { useForm } from "react-hook-form";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";

type Props = {
    className?: string;
    onSubmit: (formData: { declarationType: "user" | "referent" }) => void;
    evtActionSubmit: NonPostableEvt<void>;
};

export function DeclarationFormStep1(props: Props) {
    const { className, onSubmit, evtActionSubmit } = props;

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<{
        declarationType: "user" | "referent" | undefined;
    }>({
        "defaultValues": {
            "declarationType": undefined
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
            onSubmit={handleSubmit(({ declarationType }) => {
                assert(declarationType !== undefined);

                onSubmit({ declarationType });
            })}
        >
            <RadioButtons
                legend="Comment souhaitez-vous déclarer ?"
                name="radio"
                options={[
                    {
                        "label": "Je suis un utilisateur de ce logiciel",
                        "hintText": "Au sein de mon établissement",
                        "nativeInputProps": {
                            ...register("declarationType", { "required": true }),
                            "value": "user"
                        }
                    },
                    {
                        "label": "Je souhaite devenir référent de ce logiciel",
                        "hintText":
                            "Comme garant et référence de l’utilisation du logiciel au sein de mon établissement",
                        "nativeInputProps": {
                            ...register("declarationType", { "required": true }),
                            "value": "referent"
                        }
                    }
                ]}
                state={errors.declarationType !== undefined ? "error" : undefined}
                stateRelatedMessage="This is field is required"
            />
            <button
                style={{ "display": "none" }}
                ref={setSubmitButtonElement}
                type="submit"
            />
        </form>
    );
}
