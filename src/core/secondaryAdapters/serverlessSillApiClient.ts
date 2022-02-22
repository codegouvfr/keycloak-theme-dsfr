import type { SillApiClient } from "../ports/SillApiClient";
import type { Software } from "sill-api";

export function createServerlessSillApiClient(params: {
    jsonUrl: string;
}): SillApiClient {
    const { jsonUrl } = params;

    return {
        "getOidcParams": () =>
            Promise.resolve({
                "keycloakParams": undefined,
                "jwtClaims": {
                    "email": "a",
                    "familyName": "b",
                    "firstName": "c",
                    "username": "d",
                    "groups": "e",
                    "local": "f",
                },
            }),
        "getSoftware": () =>
            fetch(jsonUrl)
                .then(res => res.text())
                .then(text => JSON.parse(text) as Software[]),
    };
}
