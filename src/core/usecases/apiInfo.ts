import type { ThunkAction } from "../setup";
import { createUsecaseContextApi } from "redux-clean-architecture";

export const name = "apiInfo";

export const reducer = null;

export const thunks = {
    "getApiVersion":
        (): ThunkAction<string> =>
        (...args) => {
            const [, , extraArgs] = args;

            const { apiVersion } = getContext(extraArgs);

            return apiVersion;
        },
};

const { getContext, setContext } = createUsecaseContextApi<{ apiVersion: string }>();

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [, , extraArg] = args;

            const { sillApiClient } = extraArg;

            setContext(extraArg, {
                "apiVersion": await sillApiClient.getVersion(),
            });
        },
};
