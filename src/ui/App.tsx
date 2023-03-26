import { Suspense } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { useRoute } from "ui/routes";
import { Header } from "./shared/Header";
import { Footer } from "./shared/Footer";
import { declareComponentKeys } from "i18nifty";
import { useCoreFunctions } from "core";
import { RouteProvider } from "ui/routes";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { evtLang } from "ui/i18n";
import {
    addSillApiUrlToQueryParams,
    addTermsOfServiceUrlToQueryParams
} from "keycloak-theme/login/valuesTransferredOverUrl";
import { createCoreProvider } from "core";
import { getEnv } from "../env";
import { pages, page404 } from "ui/pages";
import { useConst } from "powerhooks/useConst";
import { objectKeys } from "tsafe/objectKeys";

const apiUrl = getEnv().API_URL ?? `${window.location.origin}/api`;

const { CoreProvider } = createCoreProvider({
    apiUrl,
    "transformUrlBeforeRedirectToLogin": ({ url, termsOfServiceUrl }) =>
        [url]
            .map(injectGlobalStatesInSearchParams)
            .map(url => addSillApiUrlToQueryParams({ url, "value": apiUrl }))
            .map(url =>
                addTermsOfServiceUrlToQueryParams({ url, "value": termsOfServiceUrl })
            )[0],
    "getCurrentLang": () => evtLang.state
});

export default function App() {
    return (
        <CoreProvider fallback={null}>
            <RouteProvider>
                <ContextualizedApp />
            </RouteProvider>
        </CoreProvider>
    );
}

function ContextualizedApp() {
    const route = useRoute();

    const { userAuthentication } = useCoreFunctions();

    const headerUserAuthenticationApi = useConst(() =>
        userAuthentication.getIsUserLoggedIn()
            ? {
                  "isUserLoggedIn": true as const,
                  "logout": () => userAuthentication.logout({ "redirectTo": "home" })
              }
            : {
                  "isUserLoggedIn": false as const,
                  "login": () =>
                      userAuthentication.login({ "doesCurrentHrefRequiresAuth": false })
              }
    );

    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Header
                routeName={route.name}
                userAuthenticationApi={headerUserAuthenticationApi}
            />
            <main className={classes.main}>
                <Suspense>
                    {(() => {
                        for (const pageName of objectKeys(pages)) {
                            //You must be able to replace "homepage" by any other page and get no type error.
                            const page = pages[pageName as "homepage"];

                            if (page.routeGroup.has(route)) {
                                if (
                                    page.getDoRequireUserLoggedIn(route) &&
                                    !userAuthentication.getIsUserLoggedIn()
                                ) {
                                    userAuthentication.login({
                                        "doesCurrentHrefRequiresAuth": true
                                    });
                                    return null;
                                }

                                return <page.LazyComponent route={route} />;
                            }
                        }

                        return <page404.LazyComponent />;
                    })()}
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

const useStyles = makeStyles({
    "name": { App }
})({
    "root": {
        "display": "flex",
        "flexDirection": "column",
        "height": "100vh"
    },
    "main": {
        "flex": 1
    }
});

/**
 * "App" key is used for common translation keys
 */
export const { i18n } = declareComponentKeys<
    | "yes"
    | "no"
    | "previous"
    | "next"
    | "add software"
    | "update software"
    | "add software or service"
    | "add instance"
    | "required"
    | "invalid url"
    | "invalid version"
    | "all"
    | "allFeminine"
    | "loading"
    | "no result"
    | "search"
>()({ "App": null });
