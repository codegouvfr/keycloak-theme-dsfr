/**
 * Here are the envs that are both accessible in the regular app and on
 * the Keycloak pages.
 * When redirecting to the login page we transfer those values as url
 * query parameters.
 * In the pages served by Keycloak we can't use getEnv()
 * so we need to pass the params as url query parameters.
 *
 * BE MINDFUL: This module should be evaluated as soon as possible
 * to cleanup the url query parameter.
 */

import { getEnv } from "env";
import { assert } from "tsafe/assert";
import { typeGuard } from "tsafe/typeGuard";
import { id } from "tsafe/id";
import { getTransferableEnv } from "ui/tools/getTransferableEnv";
import { getConfiguration } from "configuration";

const paletteIds = ["onyxia", "france", "ultraviolet"] as const;

export type PaletteId = (typeof paletteIds)[number];

const { API_URL, injectAPI_URLInSearchParams } = getTransferableEnv({
    "name": "API_URL" as const,
    "getSerializedValueFromEnv": () => getConfiguration().apiUrl,
    "validateAndParseOrGetDefault": (valueStr): string => valueStr
});

export { API_URL };

const { THEME_ID, injectTHEME_IDInSearchParams } = getTransferableEnv({
    "name": "THEME_ID" as const,
    "getSerializedValueFromEnv": () => getEnv().THEME_ID,
    "validateAndParseOrGetDefault": (valueStr): PaletteId =>
        valueStr === ""
            ? "onyxia"
            : (() => {
                  assert(
                      typeGuard<PaletteId>(
                          valueStr,
                          id<readonly string[]>(paletteIds).includes(valueStr)
                      ),
                      `${valueStr} is not a valid palette. Available are: ${paletteIds.join(
                          ", "
                      )}`
                  );

                  return valueStr;
              })()
});

export { THEME_ID };

const { HEADER_ORGANIZATION, injectHEADER_ORGANIZATIONInSearchParams } =
    getTransferableEnv({
        "name": "HEADER_ORGANIZATION" as const,
        "getSerializedValueFromEnv": () => getEnv().HEADER_ORGANIZATION,
        "validateAndParseOrGetDefault": (valueStr): string => valueStr
    });

export { HEADER_ORGANIZATION };

const { HEADER_USECASE_DESCRIPTION, injectHEADER_USECASE_DESCRIPTIONInSearchParams } =
    getTransferableEnv({
        "name": "HEADER_USECASE_DESCRIPTION" as const,
        "getSerializedValueFromEnv": () => getEnv().HEADER_USECASE_DESCRIPTION,
        "validateAndParseOrGetDefault": (valueStr): string => valueStr
    });

export { HEADER_USECASE_DESCRIPTION };

export function injectTransferableEnvsInSearchParams(url: string): string {
    let newUrl = url;

    for (const inject of [
        injectTHEME_IDInSearchParams,
        injectHEADER_ORGANIZATIONInSearchParams,
        injectHEADER_USECASE_DESCRIPTIONInSearchParams,
        injectAPI_URLInSearchParams
    ]) {
        newUrl = inject(newUrl);
    }

    return newUrl;
}
