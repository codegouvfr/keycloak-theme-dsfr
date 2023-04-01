import { useEffect, Suspense } from "react";
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
    addTermsOfServiceUrlToQueryParams,
    addIsDarkToQueryParams
} from "keycloak-theme/login/valuesTransferredOverUrl";
import { createCoreProvider } from "core";
import { pages, page404 } from "ui/pages";
import { useConst } from "powerhooks/useConst";
import { objectKeys } from "tsafe/objectKeys";
import { useLang } from "ui/i18n";
import { assert } from "tsafe/assert";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { CircularProgress } from "ui/shared/CircularProgress";

let isDark: boolean;

const apiUrl = process.env["REACT_APP_API_URL"] ?? "/api";

const { CoreProvider } = createCoreProvider({
    apiUrl,
    "transformUrlBeforeRedirectToLogin": ({ url, termsOfServiceUrl }) =>
        [url]
            .map(injectGlobalStatesInSearchParams)
            .map(url => addSillApiUrlToQueryParams({ url, "value": apiUrl }))
            .map(url => addIsDarkToQueryParams({ url, "value": isDark }))
            .map(url =>
                addTermsOfServiceUrlToQueryParams({ url, "value": termsOfServiceUrl })
            )[0],
    "getCurrentLang": () => evtLang.state
});

export default function App() {
    return (
        <CoreProvider fallback={<CircularProgress fullPage />}>
            <RouteProvider>
                <ContextualizedApp />
            </RouteProvider>
        </CoreProvider>
    );
}

function ContextualizedApp() {
    {
        const { isDark: isDark_ } = useIsDark();

        useEffect(() => {
            isDark = isDark_;
        }, [isDark_]);
    }

    const route = useRoute();

    const { userAuthentication, sillApiVersion } = useCoreFunctions();

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

    const i18nApi = useLang();

    return (
        <div className={classes.root}>
            <Header
                routeName={route.name}
                userAuthenticationApi={headerUserAuthenticationApi}
                i18nApi={i18nApi}
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
            <Footer
                webVersion={(() => {
                    const webVersion = process.env.VERSION;
                    assert(webVersion !== undefined);
                    return webVersion;
                })()}
                apiVersion={sillApiVersion.getSillApiVersion()}
            />
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
    | "validate"
>()({ "App": null });
