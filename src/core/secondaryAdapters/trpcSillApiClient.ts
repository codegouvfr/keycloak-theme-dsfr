import type { SillApiClient } from "../ports/SillApiClient";
import { createTRPCClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { TrpcRouter } from "sill-api";
import memoize from "memoizee";

export function createTrpcSillApiClient(params: {
    url: string;
    refOidcAccessToken: { current: string | undefined };
}): SillApiClient {
    const { refOidcAccessToken, url } = params;

    const trpcClient = createTRPCClient<TrpcRouter>({
        "links": [loggerLink(), httpBatchLink({ url })],
        "headers": () => ({
            ...(refOidcAccessToken.current === undefined
                ? {}
                : {
                      "authorization": `Bearer ${refOidcAccessToken.current}`,
                  }),
        }),
    });

    return {
        "getOidcParams": memoize(() => trpcClient.query("getOidcParams"), {
            "promise": true,
        }),
        "getCompiledData": () => trpcClient.query("getCompiledData"),
        "getReferentsBySoftwareId": () => trpcClient.query("getReferentsBySoftwareId"),
        "declareUserReferent": params =>
            trpcClient.mutation("declareUserReferent", params),
        "userNoLongerReferent": params =>
            trpcClient.mutation("userNoLongerReferent", params),
        "addSoftware": params => trpcClient.mutation("addSoftware", params),
        "updateSoftware": params => trpcClient.mutation("updateSoftware", params),
        "autoFillFormInfo": params => trpcClient.query("autoFillFormInfo", params),
        "updateAgencyName": params => trpcClient.mutation("updateAgencyName", params),
        "updateEmail": params => trpcClient.mutation("updateEmail", params),
        "getAllowedEmailRegexp": () => trpcClient.query("getAllowedEmailRegexp"),
        "getAgencyNames": () => trpcClient.query("getAgencyNames"),
        "getTags": memoize(() => trpcClient.query("getTags"), { "promise": true }),
    };
}
