import type { SillApi } from "../ports/SillApi";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { TrpcRouter } from "@codegouvfr/sill";
import superjson from "superjson";
import memoize from "memoizee";

export function createSillApi(params: {
    url: string;
    getOidcAccessToken: () => string | undefined;
}): SillApi {
    const { url, getOidcAccessToken } = params;

    const trpcClient = createTRPCProxyClient<TrpcRouter>({
        "transformer": superjson,
        "links": [
            loggerLink(),
            httpBatchLink({
                url,
                // You can pass any HTTP headers you wish here
                "headers": async () => {
                    const oidcAccessToken = getOidcAccessToken();

                    if (oidcAccessToken === undefined) {
                        return {};
                    }

                    return { "authorization": `Bearer ${oidcAccessToken}` };
                }
            })
        ]
    });

    return {
        "getApiVersion": memoize(() => trpcClient.getApiVersion.query(), {
            "promise": true
        }),
        "getOidcParams": memoize(() => trpcClient.getOidcParams.query(), {
            "promise": true
        }),
        "getSoftwares": memoize(() => trpcClient.getSoftwares.query(), {
            "promise": true
        }),
        "getInstances": memoize(() => trpcClient.getInstances.query(), {
            "promise": true
        }),
        "getWikidataOptions": params => trpcClient.getWikidataOptions.query(params),
        "getSoftwareFormAutoFillDataFromWikidataAndOtherSources": params =>
            trpcClient.getSoftwareFormAutoFillDataFromWikidataAndOtherSources.query(
                params
            ),
        "createSoftware": params => trpcClient.createSoftware.mutate(params),
        "updateSoftware": params => trpcClient.updateSoftware.mutate(params),
        "createUserOrReferent": params => trpcClient.createUserOrReferent.mutate(params),
        "createInstance": params => trpcClient.createInstance.mutate(params),
        "updateInstance": params => trpcClient.updateInstance.mutate(params),
        "getAgents": memoize(() => trpcClient.getAgents.query(), { "promise": true }),
        "changeAgentOrganization": params =>
            trpcClient.changeAgentOrganization.mutate(params),
        "updateEmail": params => trpcClient.updateEmail.mutate(params),
        "getAllowedEmailRegexp": memoize(() => trpcClient.getAllowedEmailRegexp.query(), {
            "promise": true
        }),
        "getAgencyNames": memoize(() => trpcClient.getAgencyNames.query(), {
            "promise": true
        }),
        "getTotalReferentCount": memoize(() => trpcClient.getTotalReferentCount.query(), {
            "promise": true
        }),
        "getRegisteredUserCount": memoize(
            () => trpcClient.getRegisteredUserCount.query(),
            { "promise": true }
        ),
        "downloadCorsProtectedTextFile": params =>
            trpcClient.downloadCorsProtectedTextFile.query(params)
    };
}
