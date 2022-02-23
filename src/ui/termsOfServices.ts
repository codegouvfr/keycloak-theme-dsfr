import type { KcLanguageTag } from "keycloakify";
import { readSerializedValue } from "ui/tools/getTransferableEnv";
import { addParamToUrl } from "powerhooks/tools/urlSearchParams";

const thermOfServicesUrlParamName = "THERMS_OF_SERVICES";

export function readThermOfServicesPassedByClient() {
    const serializedValue = readSerializedValue({ "name": thermOfServicesUrlParamName });

    if (serializedValue === undefined) {
        return undefined;
    }

    return JSON.parse(serializedValue) as string | Partial<Record<KcLanguageTag, string>>;
}

export function injectTosInSearchParams(params: {
    url: string;
    termsOfServices: string | Partial<Record<KcLanguageTag, string>> | undefined;
}): string {
    const { url, termsOfServices } = params;

    let newUrl = url;

    if (termsOfServices !== undefined) {
        newUrl = addParamToUrl({
            url,
            "name": "THERMS_OF_SERVICES",
            "value": JSON.stringify(termsOfServices),
        }).newUrl;
    }

    return newUrl;
}
