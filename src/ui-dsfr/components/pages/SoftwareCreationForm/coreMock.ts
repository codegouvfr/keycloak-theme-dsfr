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

    export async function getAutofillData(wikidataId: string): Promise<{
        comptoirDuLibreId: number | undefined;
        softwareName: string;
        softwareDescription: string;
        softwareLicense: string | undefined;
        softwareMinimalVersion: string | undefined;
    }> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "comptoirDuLibreId": 123,
            "softwareName": `Software ${wikidataId}`,
            "softwareDescription": `Software ${wikidataId} description`,
            "softwareLicense": `Software ${wikidataId} license`,
            "softwareMinimalVersion": `1.3.4`
        };
    }

    export async function getPrefillData(params: { softwareName: string }): Promise<{
        softwareType: "desktop" | "cloud" | "library";
        comptoirDuLibreId: number | undefined;
        wikidataEntry: WikidataEntry | undefined;
        softwareDescription: string;
        softwareLicense: string;
        softwareMinimalVersion: string;
    }> {
        const { softwareName } = params;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "softwareType": "desktop",
            "comptoirDuLibreId": 461,
            "wikidataEntry": {
                "wikidataDescription": `${softwareName} descriptions`,
                "wikidataId": "Qxxxxxx",
                "wikidataLabel": softwareName
            },
            "softwareDescription": "A data science oriented container launcher",
            "softwareLicense": "MIT",
            "softwareMinimalVersion": "1.2.3"
        };
    }
}
