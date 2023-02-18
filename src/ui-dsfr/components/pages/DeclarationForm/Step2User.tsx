import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import type { FormData } from "core-dsfr/usecases/declarationForm";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";

type Props = {
    className?: string;
    onSubmit: (formData: FormData.User) => void;
    evtActionSubmit: NonPostableEvt<void>;
    softwareType: "desktop" | "cloud" | "other";
};

export function DeclarationFormStep2User(props: Props) {
    const { className, onSubmit, evtActionSubmit, softwareType } = props;

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<{
        usecaseDescription: string;
        osSelectValue: "windows" | "linux" | "mac" | "";
        version: string;
        serviceUrlInputValue: string;
    }>({
        "defaultValues": {
            "osSelectValue": ""
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
            onSubmit={handleSubmit(
                ({ usecaseDescription, osSelectValue, version, serviceUrlInputValue }) =>
                    onSubmit({
                        "declarationType": "user",
                        usecaseDescription,
                        "os":
                            softwareType !== "desktop"
                                ? undefined
                                : (assert(osSelectValue !== ""), osSelectValue),
                        version,
                        "serviceUrl":
                            softwareType !== "cloud" ? undefined : serviceUrlInputValue
                    })
            )}
        >
            <Input
                label="Décrivez en quelques mots votre cas d'usage"
                nativeInputProps={{
                    ...register("usecaseDescription", { "required": true })
                }}
                state={errors.usecaseDescription !== undefined ? "error" : undefined}
                stateRelatedMessage="Required"
            />
            {softwareType === "desktop" && (
                <Select
                    label="Dans quel environnement utilisez-vous ce logiciel?"
                    nativeSelectProps={{
                        ...register("osSelectValue", { "required": true })
                    }}
                    state={errors.osSelectValue !== undefined ? "error" : undefined}
                    stateRelatedMessage="Field required"
                >
                    <option value="" disabled hidden></option>
                    <option value="windows">Windows</option>
                    <option value="linux">GNU/Linux</option>
                    <option value="mac">MacOS</option>
                </Select>
            )}
            <Input
                label="Quelle version du logiciel utilisez-vous? (Optionnel)"
                nativeInputProps={{
                    ...register("version", { "pattern": /^(\d+)((\.{1}\d+)*)(\.{0})$/ })
                }}
                state={errors.version !== undefined ? "error" : undefined}
                stateRelatedMessage="Version malformed"
            />
            {softwareType === "cloud" && (
                <Input
                    label="Plus précisément, quelle instance du logiciel utilisez-vous?"
                    nativeInputProps={{
                        ...register("serviceUrlInputValue", {
                            "pattern": /^(\d+)((\.{1}\d+)*)(\.{0})$/
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
