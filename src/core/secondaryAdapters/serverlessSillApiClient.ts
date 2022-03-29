import type { SillApiClient } from "../ports/SillApiClient";
import type { CompiledData } from "sill-api";
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
                        "agencyName": "b",
                        "locale": "c",
                    },
                }),
            { "promise": true },
        ),
        "getCompiledData": () =>
            fetch(jsonUrl)
                .then(res => res.text())
                .then(text => JSON.parse(text) as CompiledData),
        "getReferentsBySoftwareId": () => Promise.reject(new Error("not implemented")),
    };
}
