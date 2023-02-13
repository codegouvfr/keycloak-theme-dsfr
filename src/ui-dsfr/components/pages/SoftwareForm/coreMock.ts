import { Fzf } from "fzf";
import type { Step1Props } from "./Step1";
import type { Step2Props } from "./Step2";
import type { Step3Props } from "./Step3";
import type { Step4Props } from "./Step4";

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

    const options: Step2Props.WikidataEntry[] = [
        {
            "wikidataId": "Q110492908",
            "wikidataLabel": "Onyxia",
            "wikidataDescription": "A data science oriented container launcher"
        },
        {
            "wikidataId": "Q107693197",
            "wikidataLabel": "Keycloakify",
            "wikidataDescription": "Build tool for creating Keycloak themes using React"
        },
        {
            "wikidataId": "Q8038",
            "wikidataDescription": "image retouching and editing tool",
            "wikidataLabel": "GIMP"
        },
        {
            "wikidataId": "Q10135",
            "wikidataDescription":
                "office suite supported by the free software community",
            "wikidataLabel": "LibreOffice"
        },
        {
            "wikidataId": "Q19841877",
            "wikidataDescription": "source code editor developed by Microsoft",
            "wikidataLabel": "Visual Studio Code"
        },
        {
            "wikidataId": "Q50938515",
            "wikidataDescription":
                "decentralized video hosting network, based on free/libre software",
            "wikidataLabel": "PeerTube"
        }
    ];

    const fzf = new Fzf(options, {
        "selector": item =>
            `${item.wikidataLabel} ${item.wikidataDescription} ${item.wikidataId}`
    });

    export async function getWikidataOptions(
        inputText: string
    ): Promise<Step2Props.WikidataEntry[]> {
        if (inputText === "") {
            return [];
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const entries = fzf.find("cd");

        return entries.map(({ item }) => item);
    }

    export async function getSoftwareUpdateData(params: {
        softwareName: string;
    }): Promise<{
        softwareSillId: number;
        formData: {
            step1: Step1Props.FormData;
            step2: Step2Props.FormData;
            step3: Step3Props.FormData;
        };
    }> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { softwareName: _ } = params;

        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            "softwareSillId": 233,
            "formData": {
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
            }
        };
    }

    export async function createSoftware(params: {
        formData: {
            step1: Step1Props.FormData;
            step2: Step2Props.FormData;
            step3: Step3Props.FormData;
            step4: Step4Props.FormData;
        };
    }) {
        const { formData } = params;

        console.log("submitting", formData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Form submitted ${JSON.stringify(formData, null, 2)}`);
    }

    export async function updateSoftware(params: {
        softwareSillId: number;
        formData: {
            step1: Step1Props.FormData;
            step2: Step2Props.FormData;
            step3: Step3Props.FormData;
            step4: Step4Props.FormData;
        };
    }) {
        const { softwareSillId, formData } = params;

        console.log("submitting", softwareSillId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Form submitted ${JSON.stringify(formData, null, 2)}`);
    }
}
