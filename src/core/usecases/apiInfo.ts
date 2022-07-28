import { assert } from "tsafe/assert";
import type { ThunkAction, ThunksExtraArgument } from "../setup";

export const name = "apiInfo";

export const actions = null;

export const reducer = null;

export const thunks = {
    "getApiVersion":
        (): ThunkAction<string> =>
        (...args) => {
            const [, , extraArgs] = args;

            const { apiVersion } = getSliceContexts(extraArgs);

            return apiVersion;
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [, , extraArg] = args;

            const { sillApiClient } = extraArg;

            setSliceContext(extraArg, {
                "apiVersion": await sillApiClient.getVersion(),
            });
        },
};

type SliceContext = {
    apiVersion: string;
};

const { getSliceContexts, setSliceContext } = (() => {
    const weakMap = new WeakMap<ThunksExtraArgument, SliceContext>();

    function getSliceContexts(extraArg: ThunksExtraArgument): SliceContext {
        const sliceContext = weakMap.get(extraArg);

        assert(sliceContext !== undefined, "Slice context not initialized");

        return sliceContext;
    }

    function setSliceContext(
        extraArg: ThunksExtraArgument,
        sliceContext: SliceContext,
    ): void {
        weakMap.set(extraArg, sliceContext);
    }

    return { getSliceContexts, setSliceContext };
})();
