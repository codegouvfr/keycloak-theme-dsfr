import { readSerializedValue } from "ui/tools/getTransferableEnv";
import { addParamToUrl } from "powerhooks/tools/urlSearchParams";
import type { LocalizedString } from "ui/i18n";

const thermOfServicesUrlParamName = "THERMS_OF_SERVICES";

export const thermOfServicesPassedByClient = (() => {
    const serializedValue = readSerializedValue({ "name": thermOfServicesUrlParamName });

    if (serializedValue === "") {
        return undefined;
    }

    return JSON.parse(serializedValue) as LocalizedString;
})();

export function injectTosInSearchParams(params: {
    url: string;
    termsOfServices: LocalizedString | undefined;
}): string {
    const { url, termsOfServices } = params;

    let newUrl = url;

    if (termsOfServices !== undefined) {
        newUrl = addParamToUrl({
            url,
            "name": thermOfServicesUrlParamName,
            "value": JSON.stringify(termsOfServices),
        }).newUrl;
    }

    return newUrl;
}
