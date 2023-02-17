import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import type { FormData } from "core-dsfr/usecases/declarationForm";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";

export type DeclareUserProps = {
    className?: string;
    initialFormData: FormData.User | undefined;
    onSubmit: (formData: FormData.User) => void;
    evtActionSubmit: NonPostableEvt<void>;
    softwareType: "desktop" | "cloud" | "other";
};

export function DeclareUser(props: DeclareUserProps) {
    const { className, initialFormData, onSubmit, evtActionSubmit, softwareType } = props;

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
        "defaultValues": (() => {
            if (initialFormData === undefined) {
                return undefined;
            }

            return {
                "usecaseDescription": initialFormData.usecaseDescription,
                "os": initialFormData.os === undefined ? "" : initialFormData.os,
                "version": initialFormData.version,
                "serviceUrlInputValue": initialFormData.serviceUrl ?? ""
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
                    label="Label"
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
                    stateRelatedMessage="Field required"
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
