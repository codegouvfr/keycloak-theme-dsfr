import "minimal-polyfills/Object.fromEntries";
import { id } from "tsafe/id";
import { encodeJwt } from "core/tools/jwt";
import { addParamToUrl, retrieveParamFromUrl } from "powerhooks/tools/urlSearchParams";
import { objectKeys } from "tsafe/objectKeys";
import type { OidcClient } from "../../ports/OidcClient";
import type { User } from "../../ports/UserApiClient";

export function createPhonyOidcClient(params: {
    isUserInitiallyLoggedIn: boolean;
    jwtClaims: Record<keyof User, string>;
    user: User;
}): OidcClient {
    const isUserLoggedIn = (() => {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            "name": urlParamName
        });

        return result.wasPresent
            ? result.value === "true"
            : params.isUserInitiallyLoggedIn;
    })();

    if (!isUserLoggedIn) {
        return id<OidcClient.NotLoggedIn>({
            "isUserLoggedIn": false,
            "login": async () => {
                const { newUrl } = addParamToUrl({
                    "url": window.location.href,
                    "name": urlParamName,
                    "value": "true"
                });

                window.location.href = newUrl;

                return new Promise<never>(() => {});
            }
        });
    }

    return id<OidcClient.LoggedIn>({
        "isUserLoggedIn": true,
        ...(() => {
            const { jwtClaims, user } = params;

            const accessToken = encodeJwt(
                Object.fromEntries(
                    objectKeys(jwtClaims).map(key => [jwtClaims[key], user[key]])
                )
            );

            return { accessToken };
        })(),
        "logout": () => {
            const { newUrl } = addParamToUrl({
                "url": window.location.href,
                "name": urlParamName,
                "value": "false"
            });

            window.location.href = newUrl;

            return new Promise<never>(() => {});
        },
        "updateTokenInfo": () => Promise.reject("Not implemented")
    });
}

const urlParamName = "isUserAuthenticated";
