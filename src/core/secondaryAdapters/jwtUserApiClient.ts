import type { UserApiClient, User } from "../ports/UserApiClient";
import { createDecodeJwtNoVerify } from "sill-api/tools/decodeJwt/adapter/noVerify";
import { symToStr } from "tsafe/symToStr";
import { assert } from "tsafe/assert";
import { id } from "tsafe/id";
import { kcLanguageTags } from "keycloakify/lib/i18n/KcLanguageTag";
import { typeGuard } from "tsafe/typeGuard";
import type { KcLanguageTag } from "keycloakify";

export function createJwtUserApiClient(params: {
    jwtClaims: Record<keyof User, string>;
    getOidcAccessToken: () => string;
}): UserApiClient {
    const { jwtClaims, getOidcAccessToken } = params;

    const { decodeJwt } = createDecodeJwtNoVerify({ jwtClaims });

    return {
        "getUser": async () => {
            const { email, agencyName, locale } = await decodeJwt({
                "jwtToken": getOidcAccessToken(),
            });

            const m = (reason: string) =>
                `The JWT token do not have the expected format: ${reason}`;

            assert(locale !== undefined, m(`${symToStr({ locale })} missing`));
            assert(
                typeGuard<KcLanguageTag>(
                    locale,
                    id<readonly string[]>(kcLanguageTags).indexOf(locale) >= 0,
                ),
                m(`${symToStr({ locale })} must be one of: ${kcLanguageTags.join(", ")}`),
            );

            for (const [propertyName, propertyValue] of [
                [symToStr({ email }), email],
                [symToStr({ agencyName }), agencyName],
            ] as const) {
                assert(propertyValue !== undefined, m(`${propertyName} missing`));
                assert(
                    typeof propertyValue === "string",
                    m(`${propertyName} is supposed to be a string`),
                );
                assert(
                    propertyValue !== "",
                    m(`${propertyName} is supposed to be a non empty string`),
                );
            }

            return { email, agencyName, locale };
        },
    };
}
