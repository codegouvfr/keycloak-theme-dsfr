/* eslint-disable react-hooks/rules-of-hooks */
import type { Action, ThunkAction as GenericThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import * as catalogExplorerUseCase from "./usecases/catalogExplorer";
import * as userAuthenticationUseCase from "./usecases/userAuthentication";
import { createJwtUserApiClient } from "./secondaryAdapters/jwtUserApiClient";
import { createKeycloakOidcClient } from "./secondaryAdapters/keycloakOidcClient";
import { createPhonyOidcClient } from "./secondaryAdapters/phonyOidcClient";
import { createSillApiClient } from "./secondaryAdapters/sillApiClient";
import type { UserApiClient } from "./ports/UserApiClient";
import type { ReturnType } from "tsafe/ReturnType";
import { Deferred } from "evt/tools/Deferred";
import { createObjectThatThrowsIfAccessed } from "./tools/createObjectThatThrowsIfAccessed";
import type { OidcClient } from "./ports/OidcClient";
import type { SillApiClient } from "./ports/SillApiClient";
import type { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import { usecasesToReducer } from "redux-clean-architecture";
import { createMiddlewareEvtActionFactory } from "redux-clean-architecture/middlewareEvtAction";
import type { getConfiguration } from "../configuration";
import type { Param0 } from "tsafe";
import type { KcLanguageTag } from "keycloakify";

export type CreateStoreParams = ReturnType<typeof getConfiguration>;

// All these assert<Equals<...>> are just here to help visualize what the type
// actually is. It's hard to tell just by looking at the definition
// with all these Omit, Pick Param0<typeof ...>.
// It could have been just a comment but comment lies. Instead here
// we are forced, if we update the types, to update the asserts statement
// or else we get red squiggly lines.
assert<
    Equals<
        CreateStoreParams,
        {
            apiUrl: string | null;
            mockAuthentication?: {
                isUserInitiallyLoggedIn: boolean;
                user: {
                    email: string;
                    familyName: string;
                    firstName: string;
                    username: string;
                    groups: string[];
                    local: KcLanguageTag;
                };
            };
        }
    >
>();

export const usecases = [catalogExplorerUseCase, userAuthenticationUseCase];

const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(usecases);

export type ThunksExtraArgument = {
    createStoreParams: CreateStoreParams;
    sillApiClient: SillApiClient;
    userApiClient: UserApiClient;
    oidcClient: OidcClient;
    evtAction: ReturnType<typeof createMiddlewareEvtAction>["evtAction"];
};

createStore.isFirstInvocation = true;

export async function createStore(params: CreateStoreParams) {
    assert(
        createStore.isFirstInvocation,
        "createStore has already been called, " +
            "only one instance of the store is supposed to" +
            "be created",
    );

    createStore.isFirstInvocation = false;

    const { apiUrl, mockAuthentication } = params;

    assert(apiUrl !== null, "TODO: We don't have a mock implementation of the API yet");

    const refGetOidcAccessToken: Param0<
        typeof createSillApiClient
    >["refGetOidcAccessToken"] = {
        "current": undefined,
    };

    const sillApiClient = await createSillApiClient({
        "url": apiUrl,
        refGetOidcAccessToken,
    });

    const { keycloakParams, jwtClaims } = await sillApiClient.query("getOidcParams");

    const oidcClient = await (() => {
        if (keycloakParams === undefined) {
            assert(
                mockAuthentication !== undefined,
                "The server doesn't have authentication enable, a mocked user should be provided",
            );

            const { user, isUserInitiallyLoggedIn } = mockAuthentication;

            return createPhonyOidcClient({
                isUserInitiallyLoggedIn,
                user,
            });
        } else {
            assert(
                mockAuthentication === undefined,
                "The server have a real authentication mechanism enable, it wont allow us to mock a specific user",
            );

            return createKeycloakOidcClient(keycloakParams);
        }
    })();

    if (oidcClient.isUserLoggedIn) {
        refGetOidcAccessToken.current = () => oidcClient.getAccessToken();
    }

    const userApiClient = oidcClient.isUserLoggedIn
        ? createJwtUserApiClient({
              jwtClaims,
              "getOidcAccessToken": () => oidcClient.getAccessToken(),
          })
        : createObjectThatThrowsIfAccessed<UserApiClient>();

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction();

    const extraArgument: ThunksExtraArgument = {
        "createStoreParams": params,
        userApiClient,
        oidcClient,
        sillApiClient,
        evtAction,
    };

    const store = configureStore({
        "reducer": usecasesToReducer(usecases),
        "middleware": getDefaultMiddleware =>
            [
                ...getDefaultMiddleware({
                    "thunk": { extraArgument },
                }),
                middlewareEvtAction,
            ] as const,
    });

    await store.dispatch(userAuthenticationUseCase.privateThunks.initialize());

    return store;
}

export type Store = ReturnType<typeof createStore>;

export type RootState = ReturnType<Store["getState"]>;

export type Dispatch = Store["dispatch"];

export type ThunkAction<ReturnType = Promise<void>> = GenericThunkAction<
    ReturnType,
    RootState,
    ThunksExtraArgument,
    Action<string>
>;

const dStoreInstance = new Deferred<Store>();

/**
 * A promise that resolve to the store instance.
 * If createStore isn't called it's pending forever.
 *
 * @deprecated: use "js/react/hooks" to interact with the store.
 */
export const { pr: prStore } = dStoreInstance;

const dOidcClient = new Deferred<OidcClient>();

/** @deprecated */
export const { pr: prOidcClient } = dOidcClient;
