import { assert } from "tsafe/assert";
import type { User } from "../ports/GetUser";
import type { ThunkAction } from "../core";
import { createUsecaseContextApi } from "redux-clean-architecture";
import { createSlice } from "@reduxjs/toolkit";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LocalizedString } from "@codegouvfr/sill";

export type UserAuthenticationState = {
    agencyName: {
        value: string;
        isBeingUpdated: boolean;
    };
    email: {
        value: string;
        isBeingUpdated: boolean;
    };
};

export const name = "userAuthentication";

export const { reducer, actions } = createSlice({
    name,
    "initialState": createObjectThatThrowsIfAccessed<UserAuthenticationState>({
        "debugMessage": "Slice not initialized"
    }),
    "reducers": {
        "initialized": (
            _state,
            {
                payload
            }: PayloadAction<{
                agencyName: string;
                email: string;
            }>
        ) => {
            const { agencyName, email } = payload;

            return {
                "agencyName": {
                    "value": agencyName,
                    "isBeingUpdated": false
                },
                "email": {
                    "value": email,
                    "isBeingUpdated": false
                }
            };
        },
        "updateFieldStarted": (
            state,
            {
                payload
            }: PayloadAction<{
                fieldName: "agencyName" | "email";
                value: string;
            }>
        ) => {
            const { fieldName, value } = payload;

            state[fieldName] = {
                value,
                "isBeingUpdated": true
            };
        },
        "updateFieldCompleted": (
            state,
            {
                payload
            }: PayloadAction<{
                fieldName: "agencyName" | "email";
            }>
        ) => {
            const { fieldName } = payload;

            state[fieldName].isBeingUpdated = false;
        }
    }
});

export const thunks = {
    "getImmutableUserFields":
        (): ThunkAction<Omit<User, "agencyName" | "email">> =>
        (...args) => {
            const [, , extraArg] = args;

            const { immutableUserFields } = getContext(extraArg);

            assert(
                immutableUserFields !== undefined,
                "Can't use getUser when not authenticated"
            );

            return immutableUserFields;
        },
    "getIsUserLoggedIn":
        (): ThunkAction<boolean> =>
        (...args) => {
            const [, , { oidc }] = args;

            return oidc.isUserLoggedIn;
        },
    "login":
        (params: { doesCurrentHrefRequiresAuth: boolean }): ThunkAction<Promise<never>> =>
        (...args) => {
            const { doesCurrentHrefRequiresAuth } = params;

            const [, , { oidc }] = args;

            assert(!oidc.isUserLoggedIn);

            return oidc.login({ doesCurrentHrefRequiresAuth });
        },
    "logout":
        (params: { redirectTo: "home" | "current page" }): ThunkAction<Promise<never>> =>
        (...args) => {
            const { redirectTo } = params;

            const [, , { oidc }] = args;

            assert(oidc.isUserLoggedIn);

            return oidc.logout({ redirectTo });
        },
    "getTermsOfServiceUrl":
        (): ThunkAction<LocalizedString> =>
        (...args) => {
            const [, , extraArgs] = args;

            return getContext(extraArgs).termsOfServiceUrl;
        },
    "getKeycloakAccountConfigurationUrl":
        (): ThunkAction<string | undefined> =>
        (...args) => {
            const [, , extraArgs] = args;

            return getContext(extraArgs).keycloakAccountConfigurationUrl;
        },
    "updateField":
        (params: { fieldName: "agencyName" | "email"; value: string }): ThunkAction =>
        async (...args) => {
            const { fieldName, value } = params;
            const [dispatch, , { sillApi, oidc }] = args;

            dispatch(actions.updateFieldStarted({ fieldName, value }));

            switch (fieldName) {
                case "agencyName":
                    await sillApi.changeAgentOrganization({ "newOrganization": value });
                    break;
                case "email":
                    await sillApi.updateEmail({ "newEmail": value });
                    break;
            }

            assert(oidc.isUserLoggedIn);

            await oidc.updateTokenInfo();

            dispatch(actions.updateFieldCompleted({ fieldName }));
        },
    "getAllowedEmailRegexp":
        (): ThunkAction<Promise<RegExp>> =>
        async (...args) => {
            const [, , { sillApi }] = args;

            const allowedEmailRegexpString = await sillApi.getAllowedEmailRegexp();

            return new RegExp(allowedEmailRegexpString);
        },
    "getAgencyNames":
        (): ThunkAction<Promise<string[]>> =>
        (...args) => {
            const [, , { sillApi }] = args;

            return sillApi.getAgencyNames();
        }
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...[dispatch, , extraArg]) => {
            const user = !extraArg.oidc.isUserLoggedIn
                ? undefined
                : await extraArg.getUser();

            if (user !== undefined) {
                dispatch(
                    actions.initialized({
                        "agencyName": user.agencyName,
                        "email": user.email
                    })
                );
            }

            const { termsOfServiceUrl, keycloakParams } =
                await extraArg.sillApi.getOidcParams();

            const keycloakAccountConfigurationUrl =
                keycloakParams === undefined
                    ? undefined
                    : [
                          keycloakParams.url.replace(/\/$/, ""),
                          "realms",
                          keycloakParams.realm,
                          "account"
                      ].join("/");

            setContext(extraArg, {
                "immutableUserFields":
                    user === undefined
                        ? undefined
                        : {
                              "id": user.id,
                              "locale": user.locale
                          },
                termsOfServiceUrl,
                keycloakAccountConfigurationUrl
            });
        }
};

const { getContext, setContext } = createUsecaseContextApi<{
    /** undefined when not authenticated */
    immutableUserFields: Pick<User, "id" | "locale"> | undefined;
    termsOfServiceUrl: LocalizedString;
    /** Undefined it authentication is not keycloak */
    keycloakAccountConfigurationUrl: string | undefined;
}>();
