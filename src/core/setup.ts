/* eslint-disable react-hooks/rules-of-hooks */
import type { Action, ThunkAction as GenericThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import * as catalogExplorerUseCase from "./usecases/catalogExplorer";
import * as userAuthenticationUseCase from "./usecases/userAuthentication";
import { createJwtUserApiClient } from "./secondaryAdapters/jwtUserApiClient";
import { createKeycloakOidcClient } from "./secondaryAdapters/keycloakOidcClient";
import {
    createPhonyOidcClient,
    phonyJwtClaims,
} from "./secondaryAdapters/phonyOidcClient";
import { createSillApiClient } from "./secondaryAdapters/sillApiClient";
import type { UserApiClient } from "./ports/UserApiClient";
import type { ReturnType } from "tsafe/ReturnType";
import { Deferred } from "evt/tools/Deferred";
import { createObjectThatThrowsIfAccessed } from "./tools/createObjectThatThrowsIfAccessed";
import type { OidcClient } from "./ports/OidcClient";
import type { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import { usecasesToReducer } from "redux-clean-architecture";
import { createMiddlewareEvtActionFactory } from "redux-clean-architecture/middlewareEvtAction";
import type { getConfiguration } from "../configuration";

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
                    groups: string;
                    local: string;
                };
            };
        }
    >
>();

export const usecases = [catalogExplorerUseCase, userAuthenticationUseCase];

const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(usecases);

export type ThunksExtraArgument = {
    createStoreParams: CreateStoreParams;
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

    createSillApiClient({});

    const oidcClient = await (() => {
        switch (oidcClientConfig.implementation) {
            case "PHONY":
                return createPhonyOidcClient({
                    "isUserLoggedIn": oidcClientConfig.isUserLoggedIn,
                    "user": (() => {
                        const { userApiClientConfig } = params;

                        assert(
                            userApiClientConfig.implementation === "MOCK",
                            [
                                "if oidcClientConfig.implementation is 'PHONY' then",
                                "userApiClientConfig.implementation should be 'MOCK'",
                            ].join(" "),
                        );

                        return userApiClientConfig.user;
                    })(),
                });
            case "KEYCLOAK":
                return createKeycloakOidcClient(oidcClientConfig);
        }
    })();

    dOidcClient.resolve(oidcClient);

    let getCurrentlySelectedDeployRegionId: (() => string) | undefined = undefined;
    let getCurrentlySelectedProjectId: (() => string) | undefined = undefined;

    const onyxiaApiClient = (() => {
        const { onyxiaApiClientConfig } = params;
        switch (onyxiaApiClientConfig.implementation) {
            case "MOCK":
                return createMockOnyxiaApiClient(onyxiaApiClientConfig);
            case "OFFICIAL":
                return createOfficialOnyxiaApiClient({
                    "url": onyxiaApiClientConfig.url,
                    "getCurrentlySelectedDeployRegionId": () =>
                        getCurrentlySelectedDeployRegionId?.(),
                    "getOidcAccessToken": !oidcClient.isUserLoggedIn
                        ? undefined
                        : oidcClient.getAccessToken,
                    "getCurrentlySelectedProjectId": () =>
                        getCurrentlySelectedProjectId?.(),
                });
        }
    })();

    const secretsManagerClient = oidcClient.isUserLoggedIn
        ? await (async () => {
              const { secretsManagerClientConfig } = params;
              switch (secretsManagerClientConfig.implementation) {
                  case "LOCAL STORAGE":
                      return createLocalStorageSecretManagerClient(
                          secretsManagerClientConfig,
                      );
                  case "VAULT":
                      return createVaultSecretsManagerClient(secretsManagerClientConfig);
              }
          })()
        : createObjectThatThrowsIfAccessed<SecretsManagerClient>();

    const userApiClient = oidcClient.isUserLoggedIn
        ? createJwtUserApiClient({
              "oidcClaims": (() => {
                  const { userApiClientConfig } = params;

                  switch (userApiClientConfig.implementation) {
                      case "JWT":
                          return userApiClientConfig.oidcClaims;
                      case "MOCK":
                          return phonyJwtClaims;
                  }
              })(),
              "getOidcAccessToken": oidcClient.getAccessToken,
          })
        : createObjectThatThrowsIfAccessed<UserApiClient>();

    const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction();

    const extraArgument: ThunksExtraArgument = {
        "createStoreParams": params,
        oidcClient,
        onyxiaApiClient,
        secretsManagerClient,
        userApiClient,
        "s3Client": createObjectThatThrowsIfAccessed<S3Client>({
            "debugMessage": "s3 client is not yet initialized",
        }),
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

    dStoreInstance.resolve(store);

    if (oidcClient.isUserLoggedIn) {
        store.dispatch(secretExplorerUseCase.privateThunks.initialize());
    }

    await store.dispatch(userAuthenticationUseCase.privateThunks.initialize());
    if (oidcClient.isUserLoggedIn) {
        await store.dispatch(userConfigsUseCase.privateThunks.initialize());
    }

    if (oidcClient.isUserLoggedIn) {
        store.dispatch(restorablePackageConfigsUseCase.privateThunks.initialize());
    }

    await store.dispatch(deploymentRegionUseCase.privateThunks.initialize());
    getCurrentlySelectedDeployRegionId = () =>
        store.getState().deploymentRegion.selectedDeploymentRegionId;

    if (oidcClient.isUserLoggedIn) {
        const { s3: regionS3 } =
            deploymentRegionUseCase.selectors.selectedDeploymentRegion(store.getState());

        extraArgument.s3Client = await (async () => {
            if (regionS3 === undefined) {
                return createDummyS3Client();
            }

            return createS3Client(
                getCreateS3ClientParams({
                    regionS3,
                    "fallbackKeycloakParams":
                        oidcClientConfig.implementation === "KEYCLOAK"
                            ? oidcClientConfig
                            : undefined,
                }),
            );
        })();
    }

    if (oidcClient.isUserLoggedIn) {
        await store.dispatch(projectSelectionUseCase.privateThunks.initialize());
        getCurrentlySelectedProjectId = () =>
            store.getState().projectSelection.selectedProjectId;
    }

    store.dispatch(runningServiceUseCase.privateThunks.initialize());

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
