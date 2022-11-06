import { createCoreFromUsecases, createUsecasesApi } from "redux-clean-architecture";
import type { GenericCreateEvt } from "redux-clean-architecture";
import type { Action, ThunkAction as ReduxGenericThunkAction } from "@reduxjs/toolkit";
import * as catalogUsecase from "./usecases/catalog";
import * as serviceCatalogUsecase from "./usecases/serviceCatalog";
import * as userAuthenticationUsecase from "./usecases/userAuthentication";
import * as softwareFormUsecase from "./usecases/softwareForm";
import * as apiInfo from "./usecases/apiInfo";
import * as fetchProxy from "./usecases/fetchProxy";
import * as serviceForm from "./usecases/serviceForm";
import { createJwtUserApiClient } from "./secondaryAdapters/jwtUserApiClient";
import { createKeycloakOidcClient } from "./secondaryAdapters/keycloakOidcClient";
import { createPhonyOidcClient } from "./secondaryAdapters/phonyOidcClient";
import { createTrpcSillApiClient } from "./secondaryAdapters/trpcSillApiClient";
import { createServerlessSillApiClient } from "./secondaryAdapters/serverlessSillApiClient";
import type { UserApiClient } from "./ports/UserApiClient";
import type { ReturnType } from "tsafe/ReturnType";
import { createObjectThatThrowsIfAccessed } from "./tools/createObjectThatThrowsIfAccessed";
import type { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import type { getConfiguration } from "../configuration";
import type { Param0 } from "tsafe";
import { id } from "tsafe/id";
import type { NonPostableEvt } from "evt";
import type { Language } from "sill-api";
import type { LocalizedString } from "i18nifty";

export const usecases = [
    catalogUsecase,
    userAuthenticationUsecase,
    softwareFormUsecase,
    apiInfo,
    fetchProxy,
    serviceCatalogUsecase,
    serviceForm,
];

export const usecasesApi = createUsecasesApi(usecases);

export type CoreParams = Omit<ReturnType<typeof getConfiguration>, "headerLinks"> &
    Pick<Param0<typeof createKeycloakOidcClient>, "evtUserActivity"> & {
        transformUrlBeforeRedirectToLogin: (params: {
            url: string;
            termsOfServices: LocalizedString<Language> | undefined;
        }) => string;
    };

// All these assert<Equals<...>> are just here to help visualize what the type
// actually is. It's hard to tell just by looking at the definition
// with all these Omit, Pick Param0<typeof ...>.
// It could have been just a comment but comment lies. Instead here
// we are forced, if we update the types, to update the asserts statement
// or else we get red squiggly lines.
assert<
    Equals<
        CoreParams,
        {
            apiUrl: string;
            mockAuthentication?: {
                isUserInitiallyLoggedIn: boolean;
                user: {
                    id: string;
                    email: string;
                    agencyName: string;
                    locale: string;
                };
            };
            transformUrlBeforeRedirectToLogin: (params: {
                url: string;
                termsOfServices: LocalizedString<Language> | undefined;
            }) => string;
            evtUserActivity: NonPostableEvt<void>;
        }
    >
>();

export async function createCore(params: CoreParams) {
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
                  "transformUrlBeforeRedirect": url =>
                      transformUrlBeforeRedirectToLogin({
                          url,
                          "termsOfServices": keycloakParams.termsOfServices,
                      }),
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

    const core = createCoreFromUsecases({
        usecases,
        "thunksExtraArgument": {
            "coreParams": params,
            userApiClient,
            oidcClient,
            sillApiClient,
        },
    });

    await core.dispatch(userAuthenticationUsecase.privateThunks.initialize());

    await core.dispatch(apiInfo.privateThunks.initialize());

    core.dispatch(catalogUsecase.privateThunks.initialize());
    core.dispatch(serviceCatalogUsecase.privateThunks.initialize());

    return core;
}

type Core = Awaited<ReturnType<typeof createCore>>;

export type State = ReturnType<Core["getState"]>;

/** @deprecated: Use Thunks as soon as we cas use 'satisfy' from TS 4.9 */
export type ThunkAction<RtnType = Promise<void>> = ReduxGenericThunkAction<
    RtnType,
    State,
    Core["thunksExtraArgument"],
    Action<string>
>;

export type CreateEvt = GenericCreateEvt<Core>;
