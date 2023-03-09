import type { Action, ThunkAction as ReduxGenericThunkAction } from "@reduxjs/toolkit";
import { createCoreFromUsecases } from "redux-clean-architecture";
import type { GenericCreateEvt, GenericThunks } from "redux-clean-architecture";
import { usecases } from "./usecases";
import type { ReturnType } from "tsafe/ReturnType";
import {
    createTrpcSillApiClient,
    createMockSillApiClient
} from "./adapter/SillApiClient";
import { createKeycloakOidcClient, createPhonyOidcClient } from "./adapter/OidcClient";
import { createJwtUserApiClient } from "./adapter/UserApiClient/jwt";
import { assert } from "tsafe/assert";
import type { LocalizedString } from "i18nifty";
import type { Language } from "sill-api";
import type { NonPostableEvt } from "evt";
import type { OidcClient } from "./ports/OidcClient";
import type { UserApiClient } from "./ports/UserApiClient";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture";

export async function createCore(params: {
    /** Empty string for using mock */
    apiUrl: string;
    /** Default: false, only considered if using mocks */
    isUserInitiallyLoggedIn?: boolean;
    evtUserActivity: NonPostableEvt<void>;
    transformUrlBeforeRedirectToLogin: (params: {
        url: string;
        termsOfServicesUrl: LocalizedString<Language>;
    }) => string;
    getCurrentLang: () => Language;
}) {
    const {
        apiUrl,
        isUserInitiallyLoggedIn = false,
        transformUrlBeforeRedirectToLogin,
        evtUserActivity,
        getCurrentLang
    } = params;

    let oidcClient: OidcClient | undefined = undefined;

    const sillApiClient =
        apiUrl === ""
            ? createMockSillApiClient()
            : createTrpcSillApiClient({
                  "url": apiUrl,
                  "getOidcAccessToken": () => {
                      if (oidcClient === undefined) {
                          return undefined;
                      }
                      if (!oidcClient.isUserLoggedIn) {
                          return undefined;
                      }
                      return oidcClient.accessToken;
                  }
              });

    const { keycloakParams, jwtClaims, termsOfServicesUrl } =
        await sillApiClient.getOidcParams();

    oidcClient =
        keycloakParams === undefined
            ? createPhonyOidcClient({
                  isUserInitiallyLoggedIn,
                  jwtClaims,
                  "user": {
                      "agencyName": "DINUM",
                      "email": "joseph.garrone@code.gouv.fr",
                      "id": "xxxxx",
                      "locale": "fr"
                  }
              })
            : await createKeycloakOidcClient({
                  ...keycloakParams,
                  evtUserActivity,
                  "transformUrlBeforeRedirect": url =>
                      transformUrlBeforeRedirectToLogin({
                          url,
                          termsOfServicesUrl
                      }),
                  "getUiLocales": getCurrentLang
              });

    const userApiClient = oidcClient.isUserLoggedIn
        ? createJwtUserApiClient({
              jwtClaims,
              "getOidcAccessToken": () => {
                  assert(oidcClient !== undefined);
                  assert(oidcClient.isUserLoggedIn);
                  return oidcClient.accessToken;
              }
          })
        : createObjectThatThrowsIfAccessed<UserApiClient>();

    const core = createCoreFromUsecases({
        usecases,
        "thunksExtraArgument": {
            "coreParams": params,
            userApiClient,
            oidcClient,
            sillApiClient
        }
    });

    await Promise.all([
        core.dispatch(usecases.sillApiVersion.privateThunks.initialize()),
        core.dispatch(usecases.userAuthentication.privateThunks.initialize()),
        core.dispatch(usecases.softwareCatalog.privateThunks.initialize()),
        core.dispatch(usecases.generalStats.privateThunks.initialize())
    ]);

    return core;
}

type Core = ReturnType<typeof createCore>;

export type State = ReturnType<Core["getState"]>;

/** @deprecated: Use Thunks as soon as we cas use 'satisfy' from TS 4.9 */
export type ThunkAction<RtnType = Promise<void>> = ReduxGenericThunkAction<
    RtnType,
    State,
    Core["thunksExtraArgument"],
    Action<string>
>;

export type Thunks = GenericThunks<Core>;

export type CreateEvt = GenericCreateEvt<Core>;
