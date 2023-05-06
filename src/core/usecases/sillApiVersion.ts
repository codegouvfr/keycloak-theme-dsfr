import type { Thunks } from "../core";
import { createUsecaseContextApi } from "redux-clean-architecture";

export const name = "sillApiVersion";

export const reducer = null;

export const thunks = {
    "getSillApiVersion":
        () =>
        (...args): string => {
            const [, , extraArgs] = args;

            const { version } = getContext(extraArgs);

            return version;
        }
} satisfies Thunks;

const { getContext, setContext } = createUsecaseContextApi<{ version: string }>();

export const privateThunks = {
    "initialize":
        () =>
        async (...args) => {
            const [, , extraArg] = args;

            const { sillApi } = extraArg;

            setContext(extraArg, {
                "version": await sillApi.getApiVersion()
            });
        }
} satisfies Thunks;
