import { kcContext } from "ui/components/KcApp/kcContext";
import {
    retrieveParamFromUrl,
    addParamToUrl,
    updateSearchBarUrl,
} from "powerhooks/tools/urlSearchParams";
import { isStorybook } from "./isStorybook";
import { capitalize } from "tsafe/capitalize";

export function getTransferableEnv<T, Name extends string>(params: {
    name: Name;
    getSerializedValueFromEnv: () => string;
    validateAndParseOrGetDefault: (serializedValue: string) => T;
}): Record<Name, T> &
    Record<`inject${Capitalize<Name>}InSearchParams`, (url: string) => string> {
    const { name, getSerializedValueFromEnv, validateAndParseOrGetDefault } = params;

    const serializedValue = readSerializedValue({ name, getSerializedValueFromEnv });

    return {
        [name]: validateAndParseOrGetDefault(serializedValue),
        [`inject${capitalize(name)}InSearchParams`]: (url: string) =>
            addParamToUrl({ url, name, "value": serializedValue }).newUrl,
    } as any;
}

export function readSerializedValue(params: {
    name: string;
    getSerializedValueFromEnv?: () => string;
}) {
    const { name, getSerializedValueFromEnv } = params;

    const isKeycloak = process.env.NODE_ENV === "production" && kcContext !== undefined;

    read_from_url: {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            name,
        });

        if (!result.wasPresent) {
            break read_from_url;
        }

        const { newUrl, value: serializedValue } = result;

        updateSearchBarUrl(newUrl);

        if (isKeycloak) {
            localStorage.setItem(name, serializedValue);
        }

        return serializedValue;
    }

    read_from_env: {
        if (getSerializedValueFromEnv === undefined || isKeycloak || isStorybook) {
            break read_from_env;
        }

        return getSerializedValueFromEnv();
    }

    read_from_local_storage: {
        if (!isKeycloak) {
            break read_from_local_storage;
        }

        const serializedValue = localStorage.getItem(name);

        if (serializedValue === null) {
            break read_from_local_storage;
        }

        return serializedValue;
    }

    return "";
}
