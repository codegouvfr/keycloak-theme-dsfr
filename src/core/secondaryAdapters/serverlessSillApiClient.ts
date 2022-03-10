import type { SillApiClient } from "../ports/SillApiClient";
import type { Software } from "sill-api";
import memoize from "memoizee";

export function createServerlessSillApiClient(params: {
    jsonUrl: string;
}): SillApiClient {
    const { jsonUrl } = params;

    return {
        "getOidcParams": memoize(
            () =>
                Promise.resolve({
                    "keycloakParams": undefined,
                    "jwtClaims": {
                        "email": "a",
                        "familyName": "b",
                        "firstName": "c",
                        "username": "d",
                        "groups": "e",
                        "locale": "f",
                    },
                }),
            { "promise": true },
        ),
        "getSoftware": () =>
            fetch(jsonUrl)
                .then(res => res.text())
                .then(text => JSON.parse(text) as Software[]),
    };
}
