/* eslint-disable react-hooks/rules-of-hooks */
import type { Action, ThunkAction as GenericThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import * as catalogExplorerUsecase from "./usecases/catalogExplorer";
import * as userAuthenticationUsecase from "./usecases/userAuthentication";
import * as softwareFormUsecase from "./usecases/softwareForm";
import { createJwtUserApiClient } from "./secondaryAdapters/jwtUserApiClient";
import { createKeycloakOidcClient } from "./secondaryAdapters/keycloakOidcClient";
import { createPhonyOidcClient } from "./secondaryAdapters/phonyOidcClient";
import { createTrpcSillApiClient } from "./secondaryAdapters/trpcSillApiClient";
import { createServerlessSillApiClient } from "./secondaryAdapters/serverlessSillApiClient";
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
import { id } from "tsafe/id";
import type { NonPostableEvt } from "evt";

export type CreateStoreParams = Omit<ReturnType<typeof getConfiguration>, "headerLinks"> &
    Pick<
        Param0<typeof createKeycloakOidcClient>,
        "transformUrlBeforeRedirectToLogin" | "evtUserActivity"
    >;

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
            apiUrl: string;
            mockAuthentication?: {
                isUserInitiallyLoggedIn: boolean;
                user: {
                    email: string;
                    agencyName: string;
                    locale: KcLanguageTag;
                };
            };
            transformUrlBeforeRedirectToLogin: (params: {
                url: string;
                termsOfServices:
                    | string
                    | Partial<Record<KcLanguageTag, string>>
                    | undefined;
            }) => string;
            evtUserActivity: NonPostableEvt<void>;
        }
    >
>();

export const usecases = [
    catalogExplorerUsecase,
    userAuthenticationUsecase,
    softwareFormUsecase,
];

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

    const {
        apiUrl,
        mockAuthentication,
        transformUrlBeforeRedirectToLogin,
        evtUserActivity,
    } = params;

    let refOidcAccessToken:
        | Param0<typeof createTrpcSillApiClient>["refOidcAccessToken"]
        | undefined = undefined;

    const sillApiClient = apiUrl.endsWith(".json")
        ? createServerlessSillApiClient({ "jsonUrl": apiUrl })
        : createTrpcSillApiClient({
              "url": apiUrl,
              "refOidcAccessToken": (refOidcAccessToken = {
                  "current": undefined,
              }),
          });

    const { keycloakParams, jwtClaims } = await sillApiClient.getOidcParams();

    const oidcClient = await (keycloakParams === undefined
        ? createPhonyOidcClient(
              (assert(
                  mockAuthentication !== undefined,
                  "The server doesn't have authentication enable, a mocked user should be provided",
              ),
              {
                  jwtClaims,
                  ...mockAuthentication,
              }),
          )
        : createKeycloakOidcClient(
              (assert(
                  mockAuthentication === undefined,
                  "The server have a real authentication mechanism enable, it wont allow us to mock a specific user",
              ),
              {
                  ...keycloakParams,
                  transformUrlBeforeRedirectToLogin,
                  evtUserActivity,
              }),
          ));
    if (oidcClient.isUserLoggedIn && refOidcAccessToken !== undefined) {
        const prop = "current";
        Object.defineProperty(refOidcAccessToken, prop, {
            "get": () =>
                id<NonNullable<typeof refOidcAccessToken>[typeof prop]>(
                    oidcClient.accessToken,
                ),
        });
    }

    const userApiClient = oidcClient.isUserLoggedIn
        ? createJwtUserApiClient({
              jwtClaims,
              "getOidcAccessToken": () => oidcClient.accessToken,
          })
        : createObjectThatThrowsIfAccessed<UserApiClient>();

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction();

    const store = configureStore({
        "reducer": usecasesToReducer(usecases),
        "middleware": getDefaultMiddleware =>
            getDefaultMiddleware({
                "thunk": {
                    "extraArgument": id<ThunksExtraArgument>({
                        "createStoreParams": params,
                        userApiClient,
                        oidcClient,
                        sillApiClient,
                        evtAction,
                    }),
                },
            }).concat(middlewareEvtAction),
    });

    await store.dispatch(userAuthenticationUsecase.privateThunks.initialize());

    store.dispatch(catalogExplorerUsecase.privateThunks.initialize());

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
