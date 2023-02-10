import { useState } from "react";
import { useForm } from "react-hook-form";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { FixedTags } from "ui-dsfr/components/shared/SearchMultiInput";

export type Step1Props = {
    className?: string;
    initialFormData: Step1Props.FormData | undefined;
    onSubmit: (formData: Step1Props.FormData) => void;
    evtActionSubmit: NonPostableEvt<void>;
};

export namespace Step1Props {
    export type FormData =
        | {
              softwareType: "cloud" | "library";
          }
        | {
              softwareType: "desktop";
              os: {
                  window: boolean;
                  mac: boolean;
                  linux: boolean;
                  android: boolean;
                  ios: boolean;
              };
          };
}

export function SoftwareCreationFormStep1(props: Step1Props) {
    const { className, initialFormData, onSubmit, evtActionSubmit } = props;

    const {
        handleSubmit,
        register,
        formState: { errors },
        watch
    } = useForm<{
        softwareType: "desktop" | "cloud" | "library" | "desktop";
        osCheckboxValues: string[] | undefined;
    }>({
        "defaultValues": (() => {
            if (initialFormData === undefined) {
                return undefined;
            }

            return {
                "softwareType": initialFormData?.softwareType,
                "osCheckboxValues":
                    initialFormData.softwareType === "desktop"
                        ? Object.entries(initialFormData.os)
                              .filter(([, value]) => value)
                              .map(([key]) => key)
                        : undefined
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
            onSubmit={handleSubmit(({ softwareType, osCheckboxValues }) =>
                onSubmit(
                    softwareType === "desktop"
                        ? (() => {
                              assert(osCheckboxValues !== undefined);

                              return {
                                  softwareType,
                                  "os": {
                                      "window": osCheckboxValues?.includes("windows"),
                                      "mac": osCheckboxValues?.includes("mac"),
                                      "linux": osCheckboxValues?.includes("linux"),
                                      "android": osCheckboxValues?.includes("android"),
                                      "ios": osCheckboxValues?.includes("ios")
                                  }
                              };
                          })()
                        : {
                              softwareType
                          }
                )
            )}
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
            {watch("softwareType") === "desktop" && (
                <Checkbox
                    legend="OS sur le quelle se logiciel peut être installer"
                    options={[
                        {
                            "label": "Windows",
                            "nativeInputProps": {
                                ...register("osCheckboxValues", { "required": true }),
                                "value": "windows"
                            }
                        },
                        {
                            "label": "GNU/Linux",
                            "nativeInputProps": {
                                ...register("osCheckboxValues", { "required": true }),
                                "value": "linux"
                            }
                        },
                        {
                            "label": "MacOS",
                            "nativeInputProps": {
                                ...register("osCheckboxValues", { "required": true }),
                                "value": "mac"
                            }
                        },
                        {
                            "label": "Android",
                            "nativeInputProps": {
                                ...register("osCheckboxValues", { "required": true }),
                                "value": "android"
                            }
                        },
                        {
                            "label": "iOS",
                            "nativeInputProps": {
                                ...register("osCheckboxValues", { "required": true }),
                                "value": "ios"
                            }
                        }
                    ]}
                />
            )}
            <FixedTags />
            <button
                style={{ "display": "none" }}
                ref={setSubmitButtonElement}
                type="submit"
            />
        </form>
    );
}
