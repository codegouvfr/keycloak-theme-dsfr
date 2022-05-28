import { assert } from "tsafe/assert";
import type { User } from "../ports/UserApiClient";
import type { ThunkAction, ThunksExtraArgument } from "../setup";
import type { KcLanguageTag } from "keycloakify";
import { urlJoin } from "url-join-ts";
import { createSlice } from "@reduxjs/toolkit";
import {
    createObjectThatThrowsIfAccessed,
    isPropertyAccessedByReduxOrStorybook,
} from "../tools/createObjectThatThrowsIfAccessed";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserAuthenticationState = {
    agencyName: {
        value: string;
        isBeingUpdated: boolean;
    };
    email: {
        value: string;
        isBeingUpdated: boolean;
    };
};

export const { name, reducer, actions } = createSlice({
    "name": "userAuthentication",
    "initialState": createObjectThatThrowsIfAccessed<UserAuthenticationState>({
        "isPropertyWhitelisted": isPropertyAccessedByReduxOrStorybook,
        "debugMessage": "Slice not initialized",
    }),
    "reducers": {
        "initialized": (
            _state,
            {
                payload,
            }: PayloadAction<{
                agencyName: string;
                email: string;
            }>,
        ) => {
            const { agencyName, email } = payload;

            return {
                "agencyName": {
                    "value": agencyName,
                    "isBeingUpdated": false,
                },
                "email": {
                    "value": email,
                    "isBeingUpdated": false,
                },
            };
        },
        "updateFieldStarted": (
            state,
            {
                payload,
            }: PayloadAction<{
                fieldName: "agencyName" | "email";
                value: string;
            }>,
        ) => {
            const { fieldName, value } = payload;

            state[fieldName] = {
                value,
                "isBeingUpdated": true,
            };
        },
        "updateFieldCompleted": (
            state,
            {
                payload,
            }: PayloadAction<{
                fieldName: "agencyName" | "email";
            }>,
        ) => {
            const { fieldName } = payload;

            state[fieldName].isBeingUpdated = false;
        },
    },
});

export const thunks = {
    "getImmutableUserFields":
        (): ThunkAction<Omit<User, "agencyName" | "email">> =>
        (...args) => {
            const [, , extraArg] = args;

            const { immutableUserFields } = getSliceContexts(extraArg);

            assert(
                immutableUserFields !== undefined,
                "Can't use getUser when not authenticated",
            );

            return immutableUserFields;
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
    "getKeycloakAccountConfigurationUrl":
        (): ThunkAction<string | undefined> =>
        (...args) => {
            const [, , extraArgs] = args;

            return getSliceContexts(extraArgs).keycloakAccountConfigurationUrl;
        },
    "updateField":
        (params: { fieldName: "agencyName" | "email"; value: string }): ThunkAction =>
        async (...args) => {
            const { fieldName, value } = params;
            const [dispatch, , { sillApiClient }] = args;

            dispatch(actions.updateFieldStarted({ fieldName, value }));

            switch (fieldName) {
                case "agencyName":
                    await sillApiClient.updateAgencyName({ "newAgencyName": value });
                    break;
                case "email":
                    await sillApiClient.updateEmail({ "newEmail": value });
                    break;
            }

            dispatch(actions.updateFieldCompleted({ fieldName }));
        },
    "getAllowedEmailRegexp":
        (): ThunkAction<Promise<RegExp>> =>
        async (...args) => {
            const [, , { sillApiClient }] = args;

            const allowedEmailRegexpString = await sillApiClient.getAllowedEmailRegexp();

            return new RegExp(allowedEmailRegexpString);
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...[dispatch, , extraArg]) => {
            const user = !extraArg.oidcClient.isUserLoggedIn
                ? undefined
                : await extraArg.userApiClient.getUser();

            if (user !== undefined) {
                dispatch(
                    actions.initialized({
                        "agencyName": user.agencyName,
                        "email": user.email,
                    }),
                );
            }

            setSliceContext(extraArg, {
                "immutableUserFields": user,
                ...(await (async () => {
                    const { keycloakParams } =
                        await extraArg.sillApiClient.getOidcParams();

                    return {
                        "thermsOfServices": keycloakParams?.termsOfServices,
                        "keycloakAccountConfigurationUrl":
                            keycloakParams === undefined
                                ? undefined
                                : urlJoin(
                                      keycloakParams.url,
                                      "realms",
                                      keycloakParams.realm,
                                      "account",
                                  ),
                    };
                })()),
            });
        },
};

type SliceContext = {
    /** undefined when not authenticated */
    immutableUserFields: Omit<User, "agencyName" | "email"> | undefined;
    thermsOfServices: string | Partial<Record<KcLanguageTag, string>> | undefined;
    /** Undefined it authentication is not keycloak */
    keycloakAccountConfigurationUrl: string | undefined;
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
