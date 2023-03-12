import { useState } from "react";
import { useForm } from "react-hook-form";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import type { FormData } from "core/usecases/declarationForm";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { useTranslation } from "ui/i18n";
import { declareComponentKeys } from "i18nifty";

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

    const { t } = useTranslation({ DeclarationFormStep2Referent });
    const commoni18n = useTranslation({ "App": "App" });

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
                legend={t("legend title")}
                hintText={t("legend hint")}
                options={[
                    {
                        "label": commoni18n.t("yes"),
                        "nativeInputProps": {
                            ...register("isTechnicalExpertInputValue", {
                                "required": true
                            }),
                            "value": "true"
                        }
                    },
                    {
                        "label": commoni18n.t("no"),
                        "nativeInputProps": {
                            ...register("isTechnicalExpertInputValue", {
                                "required": true
                            }),
                            "value": "false"
                        }
                    }
                ]}
                state={
                    errors.isTechnicalExpertInputValue !== undefined ? "error" : undefined
                }
                stateRelatedMessage={commoni18n.t("required")}
            />

            <Input
                label={t("useCase")}
                nativeInputProps={{
                    ...register("usecaseDescription", { "required": true })
                }}
                state={errors.usecaseDescription !== undefined ? "error" : undefined}
                stateRelatedMessage={commoni18n.t("required")}
            />
            {softwareType === "cloud" && (
                <Input
                    label={t("service")}
                    nativeInputProps={{
                        ...register("serviceUrlInputValue", {
                            "pattern": /^http/
                        })
                    }}
                    state={
                        errors.serviceUrlInputValue !== undefined ? "error" : undefined
                    }
                    stateRelatedMessage={commoni18n.t("invalid url")}
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

export const { i18n } = declareComponentKeys<
    "legend title" | "legend hint" | "useCase" | "service"
>()({
    DeclarationFormStep2Referent
});
