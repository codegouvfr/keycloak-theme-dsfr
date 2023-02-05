import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { SearchInput } from "ui-dsfr/components/shared/SearchInput";
import { fr } from "@codegouvfr/react-dsfr";
import { useForm, Controller } from "react-hook-form";
import { id } from "tsafe/id";
import { Button } from "@codegouvfr/react-dsfr/Button";

SoftwareCreationForm.routeGroup = createGroup([routes.softwareCreationForm]);

type PageRoute = Route<typeof SoftwareCreationForm.routeGroup>;

SoftwareCreationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

type WikidataEntry = {
    wikidataLabel: string;
    wikidataDescription: string;
    wikidataId: string;
};

async function getWikidataOptions(inputText: string): Promise<WikidataEntry[]> {
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

export function SoftwareCreationForm(props: Props) {
    const { className } = props;

    const { handleSubmit, control, watch } = useForm({
        "defaultValues": {
            "wikidataEntry": id<WikidataEntry | undefined>(undefined)
        }
    });

    console.log(watch("wikidataEntry"));

    return (
        <form className={className} onSubmit={handleSubmit(data => console.log(data))}>
            <Controller
                name="wikidataEntry"
                control={control}
                rules={{ "required": false }}
                render={({ field }) => (
                    <SearchInput
                        debounceDelay={400}
                        getOptions={getWikidataOptions}
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
    );
}
