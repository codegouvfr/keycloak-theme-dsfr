import { useEffect, useState, useReducer } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { SearchInput } from "ui-dsfr/components/shared/SearchInput";
import { fr } from "@codegouvfr/react-dsfr";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { CircularProgressWrapper } from "ui-dsfr/components/shared/CircularProgressWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { assert } from "tsafe/assert";

SoftwareCreationForm.routeGroup = createGroup([
    routes.softwareCreationForm,
    routes.softwareUpdateForm
]);

type PageRoute = Route<typeof SoftwareCreationForm.routeGroup>;

SoftwareCreationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: PageRoute;
};

namespace core {
    export type WikidataEntry = {
        wikidataLabel: string;
        wikidataDescription: string;
        wikidataId: string;
    };

    export async function getWikidataOptions(
        inputText: string
    ): Promise<WikidataEntry[]> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (inputText === "") {
            return [];
        }

        return new Array(4)
            .fill(0)
            .map((_, i) => i)
            .map(i => ({
                "wikidataLabel": `${inputText} software ${i}`,
                "wikidataId": `Q${inputText}${i}`,
                "wikidataDescription": `Description of software ${i}`
            }));
    }

    export async function getAutofillData(params: { wikidataId: string }): Promise<{
        softwareName: string;
        comptoirDuLibreId?: number;
    }> {
        const { wikidataId } = params;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "softwareName": `Software ${wikidataId}`,
            "comptoirDuLibreId": undefined
        };
    }

    export async function getPrefillData(params: { softwareName: string }): Promise<{
        softwareType: "desktop" | "cloud" | "library";
        wikidataEntry: WikidataEntry | undefined;
        softwareName: string;
    }> {
        const { softwareName } = params;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "softwareType": "desktop",
            "wikidataEntry": {
                "wikidataDescription": `${softwareName} descriptions`,
                "wikidataId": "Qxxxxxx",
                "wikidataLabel": softwareName
            },
            "softwareName": "Onyxia"
        };
    }
}

type FormDataStep1 = {
    softwareType: "desktop" | "cloud" | "library";
};

function Step1(props: {
    formData: FormDataStep1 | undefined;
    onFormDataChange: (formData: FormDataStep1) => void;
}) {
    const { formData, onFormDataChange } = props;

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormDataStep1>({
        "defaultValues": formData
    });

    return (
        <form onSubmit={handleSubmit(onFormDataChange)}>
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
            <Button
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                nativeButtonProps={{
                    "type": "submit"
                }}
            >
                Next
            </Button>
        </form>
    );
}

type FormDataStep2 = {
    wikidataEntry: core.WikidataEntry | undefined;
    softwareName: string | undefined;
};

function Step2(props: {
    isUpdateForm: boolean;
    formData: FormDataStep2 | undefined;
    onFormDataChange: (formData: FormDataStep2) => void;
    onPrev: () => void;
}) {
    const { isUpdateForm, formData, onFormDataChange, onPrev } = props;

    const {
        handleSubmit,
        control,
        register,
        watch,
        formState: { errors },
        setValue
    } = useForm<FormDataStep2>({
        "defaultValues": formData
    });

    const { isAutocompleteInProgress } = (function useClosure() {
        const [isAutocompleteInProgress, setIsAutocompleteInProgress] = useState(false);

        const wikiDataEntry = watch("wikidataEntry");

        useEffect(() => {
            if (wikiDataEntry === undefined || isUpdateForm) {
                return;
            }

            let isActive = true;

            (async () => {
                setIsAutocompleteInProgress(true);

                const { softwareName } = await core.getAutofillData({
                    "wikidataId": wikiDataEntry.wikidataId
                });

                if (!isActive) {
                    return;
                }

                setValue("softwareName", softwareName);

                setIsAutocompleteInProgress(false);
            })();

            return () => {
                isActive = false;
            };
        }, [wikiDataEntry]);

        return { isAutocompleteInProgress };
    })();

    return (
        <form onSubmit={handleSubmit(onFormDataChange)}>
            <Controller
                name="wikidataEntry"
                control={control}
                rules={{ "required": false }}
                render={({ field }) => (
                    <SearchInput
                        debounceDelay={400}
                        getOptions={core.getWikidataOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        getOptionLabel={wikidataEntry => wikidataEntry.wikidataLabel}
                        renderOption={(liProps, wikidataEntity) => (
                            <li {...liProps}>
                                <div>
                                    <span>{wikidataEntity.wikidataLabel}</span>
                                    <br />
                                    <span className={fr.cx("fr-text--xs")}>
                                        {wikidataEntity.wikidataDescription}
                                    </span>
                                </div>
                            </li>
                        )}
                        noOptionText={"No result"}
                        loadingText={"Loading..."}
                        dsfrInputProps={{
                            "label": "Wikidata sheet",
                            "hintText":
                                "Associer le logiciel à une fiche Wikidata déjà existante",
                            "nativeInputProps": {
                                "ref": field.ref,
                                "onBlur": field.onBlur,
                                "name": field.name
                            }
                        }}
                    />
                )}
            />
            <CircularProgressWrapper
                isInProgress={isAutocompleteInProgress}
                renderChildren={({ style }) => (
                    <Input
                        disabled={isAutocompleteInProgress}
                        style={{
                            ...style,
                            "marginTop": fr.spacing("4v")
                        }}
                        label="Software name"
                        nativeInputProps={{
                            ...register("softwareName", { "required": true })
                        }}
                        state={errors.softwareName !== undefined ? "error" : undefined}
                        stateRelatedMessage={(() => {
                            switch (errors.softwareName?.type) {
                                case undefined:
                                    return undefined;
                                case "required":
                                    return "You must provide a software name";
                            }
                        })()}
                    />
                )}
            />
            <Button
                style={{
                    "marginTop": fr.spacing("4v"),
                    "marginRight": fr.spacing("4v")
                }}
                onClick={() => onPrev()}
            >
                Prev
            </Button>
            <Button
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                nativeButtonProps={{
                    "type": "submit"
                }}
            >
                Next
            </Button>
        </form>
    );
}

export function SoftwareCreationForm(props: Props) {
    const { className, route } = props;

    const [step, dispatchState] = useReducer(
        (state: 1 | 2 | 3, action: "next" | "previous") => {
            switch (state) {
                case 1:
                    assert(action === "next");
                    return 2;
                case 2:
                    switch (action) {
                        case "next":
                            return 3;
                        case "previous":
                            return 1;
                    }
                    break;
                case 3:
                    assert(action === "previous");
                    return 1;
            }
        },
        1
    );

    const [formDataStep1, setFormDataStep1] = useState<FormDataStep1 | undefined>(
        undefined
    );
    const [formDataStep2, setFormDataStep2] = useState<FormDataStep2 | undefined>(
        undefined
    );

    const { isPrefillingForSoftwareUpdate } = (() => {
        const softwareName =
            route.name === "softwareUpdateForm" ? route.params.name : undefined;

        const [isPrefillingForSoftwareUpdate, setIsPrefillingForSoftwareUpdate] =
            useState(softwareName !== undefined ? true : false);

        useEffect(() => {
            if (softwareName === undefined) {
                return;
            }

            let isActive = true;

            (async () => {
                setIsPrefillingForSoftwareUpdate(true);

                const { softwareType, wikidataEntry } = await core.getPrefillData({
                    softwareName
                });

                if (!isActive) {
                    return;
                }

                setFormDataStep1({ softwareType });
                setFormDataStep2({ softwareName, wikidataEntry });

                setIsPrefillingForSoftwareUpdate(false);
            })();

            return () => {
                isActive = false;
            };
        }, []);

        return { isPrefillingForSoftwareUpdate };
    })();

    if (isPrefillingForSoftwareUpdate) {
        return <CircularProgress />;
    }

    return (
        <div className={className}>
            <h1>
                {(() => {
                    switch (route.name) {
                        case "softwareCreationForm":
                            return "Ajouter un logiciel";
                        case "softwareUpdateForm":
                            return "Mettre a jour un logiciel";
                    }
                })()}
            </h1>
            {(() => {
                switch (step) {
                    case 1:
                        return (
                            <Step1
                                formData={formDataStep1}
                                onFormDataChange={formData => {
                                    setFormDataStep1(formData);
                                    dispatchState("next");
                                }}
                            />
                        );
                    case 2:
                        return (
                            <Step2
                                isUpdateForm={route.name === "softwareUpdateForm"}
                                formData={formDataStep2}
                                onFormDataChange={formData => {
                                    setFormDataStep2(formData);
                                    dispatchState("next");
                                }}
                                onPrev={() => dispatchState("previous")}
                            />
                        );
                }
            })()}
        </div>
    );
}
