import { createGroup } from "type-route";
import type { Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { SearchInput } from "ui-dsfr/components/shared/SearchInput";
import { fr } from "@codegouvfr/react-dsfr";

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

async function getOptions(inputText: string): Promise<WikidataEntry[]> {
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
            "wikidataDescription": `Description of software ${i}`,
        }));
}

export function SoftwareCreationForm(props: Props) {
    const { className } = props;

    return (
        <div className={className}>
            <SearchInput
                debounceDelay={400}
                getOptions={getOptions}
                /*
                defaultValue={{
                    "wikidataId": "Qxxxxxx",
                    "wikidataLabel": "Gimp",
                    "wikidataDescription": "Logiciel de traitement d'image"
                }}
                */
                onValueChange={wikidataEntry => console.log({ wikidataEntry })}
                getOptionLabel={wikidataEntry => wikidataEntry.wikidataLabel}
                renderOption={(liProps, wikidataEntity) => (
                    <li {...liProps}>
                        <span className={fr.cx("fr-text--bold")}>
                            {wikidataEntity.wikidataLabel}
                        </span>
                        <br />
                        <span className={fr.cx("fr-text--xs")}>
                            {wikidataEntity.wikidataDescription}
                        </span>
                    </li>
                )}
                noOptionText={"No result"}
                loadingText={"Loading..."}
                dsfrInputProps={{
                    "label": "Wikidata sheet",
                }}
            />
        </div>
    );
}
