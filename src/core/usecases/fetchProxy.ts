import type { ThunkAction } from "../core";

export const name = "fetchProxy";

export const reducer = null;

export const thunks = {
    "downloadCoreProtectedTextFile":
        (url: string): ThunkAction<Promise<string>> =>
        (...args) => {
            const [, , { sillApi }] = args;

            return sillApi.downloadCorsProtectedTextFile({ url });
        }
};
