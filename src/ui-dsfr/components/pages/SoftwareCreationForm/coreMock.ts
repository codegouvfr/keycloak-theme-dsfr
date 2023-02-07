export namespace core {
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
