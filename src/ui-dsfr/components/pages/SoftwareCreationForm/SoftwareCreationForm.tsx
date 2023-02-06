import { useEffect, useState } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { SearchInput } from "ui-dsfr/components/shared/SearchInput";
import { fr } from "@codegouvfr/react-dsfr";
import { useForm, Controller } from "react-hook-form";
import { id } from "tsafe/id";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { CircularProgressWrapper } from "ui-dsfr/components/shared/CircularProgressWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

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
        wikidataEntry: WikidataEntry | undefined;
        softwareName: string;
    }> {
        const { softwareName } = params;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "wikidataEntry": {
                "wikidataDescription": `${softwareName} descriptions`,
                "wikidataId": "Qxxxxxx",
                "wikidataLabel": softwareName
            },
            "softwareName": "Onyxia"
        };
    }
}

export function SoftwareCreationForm(props: Props) {
    const { className, route } = props;

    const {
        handleSubmit,
        control,
        watch,
        register,
        formState: { errors },
        setValue
    } = useForm({
        "defaultValues": {
            "wikidataEntry": id<core.WikidataEntry | undefined>(undefined),
            "softwareName": id<string | undefined>(undefined),
            "softwareType": id<"desktop" | "cloud" | "library">(undefined as any)
        }
    });

    const { isAutocompleteInProgress } = (function useClosure() {
        const [isAutocompleteInProgress, setIsAutocompleteInProgress] = useState(false);

        const wikiDataEntry = watch("wikidataEntry");

        useEffect(() => {
            if (wikiDataEntry === undefined || route.name === "softwareUpdateForm") {
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

                const { wikidataEntry } = await core.getPrefillData({ softwareName });

                if (!isActive) {
                    return;
                }

                setValue("wikidataEntry", wikidataEntry);
                setValue("softwareName", softwareName);
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
        <>
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
            <form
                className={className}
                onSubmit={handleSubmit(data => console.log(data))}
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
                            "label":
                                "Solution logicielle applicative hébergée dans le cloud",
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
                            state={
                                errors.softwareName !== undefined ? "error" : undefined
                            }
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
                        "marginTop": fr.spacing("4v")
                    }}
                    nativeButtonProps={{
                        "type": "submit"
                    }}
                >
                    Submit
                </Button>
            </form>
        </>
    );
}
