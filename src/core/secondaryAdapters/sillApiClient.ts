import type { SillApiClient } from "../ports/SillApiClient";
import { createTRPCClient } from "@trpc/client";
import type { UnpackTrpcRouter } from "core/tools/UnpackTrpcRouter";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

export async function createSillApiClient(params: {
    url: string;
    refGetOidcAccessToken: { current: (() => Promise<string>) | undefined };
}): Promise<SillApiClient> {
    const { refGetOidcAccessToken, url } = params;

    return createTRPCClient<UnpackTrpcRouter<SillApiClient>>({
        "links": [loggerLink(), httpBatchLink({ url })],
        "headers": async () => ({
            ...(refGetOidcAccessToken.current === undefined
                ? {}
                : {
                      "authorization": `Bearer ${await refGetOidcAccessToken.current()}`,
                  }),
        }),
    });
}
