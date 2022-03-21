import type { SillApiClient } from "../ports/SillApiClient";
import { createTRPCClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { TrpcRouter } from "sill-api";
import memoize from "memoizee";

export function createTrpcSillApiClient(params: {
    url: string;
    refGetOidcAccessToken: { current: (() => Promise<string>) | undefined };
}): SillApiClient {
    const { refGetOidcAccessToken, url } = params;

    const trpcClient = createTRPCClient<TrpcRouter>({
        "links": [loggerLink(), httpBatchLink({ url })],
        "headers": async () => ({
            ...(refGetOidcAccessToken.current === undefined
                ? {}
                : {
                      "authorization": `Bearer ${await refGetOidcAccessToken.current()}`,
                  }),
        }),
    });

    return {
        "getOidcParams": memoize(() => trpcClient.query("getOidcParams"), {
            "promise": true,
        }),
        "getCompiledData": () => trpcClient.query("getCompiledData"),
        "getIdOfSoftwareUserIsReferentOf": () =>
            trpcClient.query("getIdOfSoftwareUserIsReferentOf"),
    };
}
