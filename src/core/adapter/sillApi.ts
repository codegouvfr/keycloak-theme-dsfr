import type { SillApi } from "../ports/SillApi";
import { createTRPCClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { TrpcRouter } from "sill-api";
//import memoize from "memoizee";

export function createSillApi(params: {
    url: string;
    getOidcAccessToken: () => string | undefined;
}): SillApi {
    const { url, getOidcAccessToken } = params;

    const trpcClient = createTRPCClient<TrpcRouter>({
        "links": [loggerLink(), httpBatchLink({ url })],
        "headers": () => {
            const oidcAccessToken = getOidcAccessToken();

            if (oidcAccessToken === undefined) {
                return {};
            }

            return {
                "authorization": `Bearer ${oidcAccessToken}`
            };
        }
    });

    console.log(trpcClient, "TODO");

    return null as any;

    /*
	return {
		"getVersion": memoize(() => trpcClient.query("getVersion"), { "promise": true }),
		"getOidcParams": memoize(() => trpcClient.query("getOidcParams"), {
			"promise": true
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
		"dereferenceSoftware": params =>
			trpcClient.mutation("dereferenceSoftware", params),
		"downloadCorsProtectedTextFile": params =>
			trpcClient.query("downloadCorsProtectedTextFile", params),
		"deleteService": params => trpcClient.mutation("deleteService", params),
		"addService": params => trpcClient.mutation("addService", params),
		"updateService": params => trpcClient.mutation("updateService", params)
	};
	*/
}
