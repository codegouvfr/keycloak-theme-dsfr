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
                        "id": "a",
                        "email": "b",
                        "agencyName": "c",
                        "locale": "d",
                    },
                }),
            { "promise": true },
        ),
        "getCompiledData": memoize(
            () =>
                fetch(jsonUrl)
                    .then(res => res.text())
                    .then(text => JSON.parse(text) as CompiledData),
            { "promise": true },
        ),
        "getReferentsBySoftwareId": () => Promise.reject(new Error("not implemented")),
        "declareUserReferent": () => Promise.reject(new Error("not implemented")),
        "userNoLongerReferent": () => Promise.reject(new Error("not implemented")),
        "addSoftware": () => Promise.reject(new Error("not implemented")),
        "updateSoftware": () => Promise.reject(new Error("not implemented")),
        "autoFillFormInfo": () => Promise.reject(new Error("not implemented")),
        "updateAgencyName": () => Promise.reject(new Error("not implemented")),
        "updateEmail": () => Promise.reject(new Error("not implemented")),
        "getAllowedEmailRegexp": () => Promise.reject(new Error("not implemented")),
        "getAgencyNames": () => Promise.reject(new Error("not implemented")),
        "getTags": memoize(() => Promise.reject(new Error("not implemented")), {
            "promise": true,
        }),
        "dereferenceSoftware": () => Promise.reject(new Error("not implemented")),
    };
}
