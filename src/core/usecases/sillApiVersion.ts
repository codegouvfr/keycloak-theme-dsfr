import type { ThunkAction } from "../core";
import { createUsecaseContextApi } from "redux-clean-architecture";

export const name = "sillApiVersion";

export const reducer = null;

export const thunks = {
    "getSillApiVersion":
        (): ThunkAction<string> =>
        (...args) => {
            const [, , extraArgs] = args;

            const { version } = getContext(extraArgs);

            return version;
        }
};

const { getContext, setContext } = createUsecaseContextApi<{ version: string }>();

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [, , extraArg] = args;

            const { sillApi } = extraArg;

            setContext(extraArg, {
                "version": await sillApi.getApiVersion()
            });
        }
};
