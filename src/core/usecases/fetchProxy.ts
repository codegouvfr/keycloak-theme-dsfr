import type { ThunkAction } from "../setup";

export const name = "fetchProxy";

export const actions = null;

export const reducer = null;

export const thunks = {
    "downloadCoreProtectedTextFile":
        (url: string): ThunkAction<Promise<string>> =>
        (...args) => {
            const [, , { sillApiClient }] = args;

            return sillApiClient.downloadCorsProtectedTextFile({ url });
        },
};
