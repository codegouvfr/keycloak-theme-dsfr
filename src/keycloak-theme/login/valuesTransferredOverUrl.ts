import { kcContext } from "./kcContext";
import {
    retrieveParamFromUrl,
    addParamToUrl,
    updateSearchBarUrl
} from "powerhooks/tools/urlSearchParams";
import type { LocalizedString } from "ui/i18n";
import { capitalize } from "tsafe/capitalize";
import { assert } from "tsafe/assert";

//This file must be imported in KcApp!

export const { getTermsOfServiceUrl, addTermsOfServiceUrlToQueryParams } = (() => {
    const queryParamName = "termsOfServiceUrl";

    type Type = LocalizedString;

    const value = (() => {
        const unparsedValue = read({ queryParamName });

        if (unparsedValue === undefined) {
            return undefined;
        }

        return JSON.parse(unparsedValue) as Type;
    })();

    function addToUrlQueryParams(params: { url: string; value: Type }): string {
        const { url, value } = params;

        return addParamToUrl({
            url,
            "name": queryParamName,
            "value": JSON.stringify(value)
        }).newUrl;
    }

    const out = {
        [`get${capitalize(queryParamName)}` as const]: () => {
            assert(value !== undefined);
            return value;
        },
        [`add${capitalize(queryParamName)}ToQueryParams` as const]: addToUrlQueryParams
    } as const;

    return out;
})();

export const { getSillApiUrl, addSillApiUrlToQueryParams } = (() => {
    const queryParamName = "sillApiUrl";

    type Type = string;

    const value = (() => {
        const unparsedValue = read({ queryParamName });

        if (unparsedValue === undefined) {
            return undefined;
        }

        return JSON.parse(unparsedValue) as Type;
    })();

    function addToUrlQueryParams(params: { url: string; value: Type }): string {
        const { url, value } = params;

        return addParamToUrl({
            url,
            "name": queryParamName,
            "value": JSON.stringify(value)
        }).newUrl;
    }

    const out = {
        [`get${capitalize(queryParamName)}` as const]: () => {
            assert(value !== undefined);
            return value;
        },
        [`add${capitalize(queryParamName)}ToQueryParams` as const]: addToUrlQueryParams
    } as const;

    return out;
})();

function read(params: { queryParamName: string }): string | undefined {
    if (kcContext === undefined || process.env.NODE_ENV !== "production") {
        //NOTE: We do something only if we are really in Keycloak
        return undefined;
    }

    const { queryParamName } = params;

    read_from_url: {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            "name": queryParamName
        });

        if (!result.wasPresent) {
            break read_from_url;
        }

        const { newUrl, value: serializedValue } = result;

        updateSearchBarUrl(newUrl);

        localStorage.setItem(queryParamName, serializedValue);

        return serializedValue;
    }

    //Reading from local storage
    const serializedValue = localStorage.getItem(queryParamName);

    if (serializedValue === null) {
        throw new Error(
            `Missing ${queryParamName} in URL when redirecting to login page`
        );
    }

    return serializedValue;
}
