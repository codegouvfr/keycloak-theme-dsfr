import memoize from "memoizee";
import type { SillApiClient } from "../../ports/SillApiClient";
import { id } from "tsafe/id";

export function createMockSillApiClient(): SillApiClient {
    return {
        "getSoftwares": memoize(() => Promise.resolve(id<SillApiClient.Software[]>([])), {
            "promise": true,
        }),
    };
}
