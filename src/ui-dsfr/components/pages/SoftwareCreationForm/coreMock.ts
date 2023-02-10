import type { Step1Props } from "./Step1";
import type { Step2Props } from "./Step2";
import type { Step3Props } from "./Step3";

export namespace core {
    export async function getAutofillDataFromWikidata(props: {
        wikidataId: string;
    }): Promise<Step2Props.FormData> {
        const { wikidataId } = props;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            wikidataId,
            "comptoirDuLibreId": 123,
            "softwareName": `Software ${wikidataId}`,
            "softwareDescription": `Software ${wikidataId} description`,
            "softwareLicense": `Software ${wikidataId} license`,
            "softwareMinimalVersion": `1.3.4`
        };
    }

    export async function getWikidataOptions(
        inputText: string
    ): Promise<Step2Props.WikidataEntry[]> {
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

    export async function getFormDataForSoftware(params: {
        softwareName: string;
    }): Promise<{
        step1: Step1Props.FormData;
        step2: Step2Props.FormData;
        step3: Step3Props.FormData;
    }> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { softwareName: _ } = params;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "step1": {
                "softwareType": "cloud"
            },
            "step2": null as any,
            "step3": null as any
        };
    }

    export async function submit(_formData: {
        step1: Step1Props.FormData;
        step2: Step2Props.FormData;
        step3: Step3Props.FormData;
    }) {
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}
