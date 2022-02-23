import { assert } from "tsafe/assert";
import type { User } from "../ports/UserApiClient";
import type { ThunkAction, ThunksExtraArgument } from "../setup";
import type { KcLanguageTag } from "keycloakify";

export const name = "userAuthentication";

export const reducer = null;

export const thunks = {
    "getUser":
        (): ThunkAction<User> =>
        (...args) => {
            const [, , extraArg] = args;

            const { user } = getSliceContexts(extraArg);

            assert(user !== undefined, "Can't use getUser when not authenticated");

            return user;
        },
    "getIsUserLoggedIn":
        (): ThunkAction<boolean> =>
        (...args) => {
            const [, , { oidcClient }] = args;

            return oidcClient.isUserLoggedIn;
        },
    "login":
        (): ThunkAction<Promise<never>> =>
        (...args) => {
            const [, , { oidcClient }] = args;

            assert(!oidcClient.isUserLoggedIn);

            return oidcClient.login();
        },
    "logout":
        (params: { redirectTo: "home" | "current page" }): ThunkAction<Promise<never>> =>
        (...args) => {
            const { redirectTo } = params;

            const [, , { oidcClient }] = args;

            assert(oidcClient.isUserLoggedIn);

            return oidcClient.logout({ redirectTo });
        },
    "getTermsOfServices":
        (): ThunkAction<string | Partial<Record<KcLanguageTag, string>> | undefined> =>
        (...args) => {
            const [, , extraArgs] = args;

            return getSliceContexts(extraArgs).thermsOfServices;
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [, , extraArg] = args;

            setSliceContext(extraArg, {
                "user": !extraArg.oidcClient.isUserLoggedIn
                    ? undefined
                    : await extraArg.userApiClient.getUser(),
                "thermsOfServices": (await extraArg.sillApiClient.getOidcParams())
                    .keycloakParams?.termsOfServices,
            });
        },
};

type SliceContext = {
    /** undefined when not authentificated */
    user: User | undefined;
    thermsOfServices: string | Partial<Record<KcLanguageTag, string>> | undefined;
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
