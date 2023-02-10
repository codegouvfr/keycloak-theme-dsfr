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

        await new Promise(resolve => setTimeout(resolve, 2000));

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
            "step2": {
                "wikidataId": "Q110492908",
                "comptoirDuLibreId": 461,
                "softwareDescription":
                    "Onyxia est une application web qui fournie un environnement de travail pour les data scientists. Onyxia est développé par l'INSEE.",
                "softwareLicense": "MIT",
                "softwareMinimalVersion": "2.13.12",
                "softwareName": "Onyxia"
            },
            "step3": {
                "instanceInfo": {
                    "instanceUrl": "https://datalab.sspcloud.fr",
                    "targetAudience": "SSM et étudiants"
                },
                "isFromFrenchPublicService": true,
                "isPresentInSupportContract": false
            }
        };
    }

    export async function submit(formData: {
        step1: Step1Props.FormData;
        step2: Step2Props.FormData;
        step3: Step3Props.FormData;
    }) {
        console.log("submitting", formData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Form submitted ${JSON.stringify(formData, null, 2)}`);
    }
}
