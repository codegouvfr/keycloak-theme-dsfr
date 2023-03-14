import { Suspense } from "react";
import { makeStyles } from "tss-react/dsfr";
import { useRoute } from "ui/routes";
import { Header } from "./shared/Header";
import { Footer } from "./shared/Footer";
import { declareComponentKeys } from "i18nifty";
import { useCoreFunctions } from "core";
import { RouteProvider } from "ui/routes";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { Evt } from "evt";
import { evtLang } from "ui/i18n";
import {
    addSillApiUrlToQueryParams,
    addTermsOfServicesUrlToQueryParams
} from "ui/keycloak-theme/valuesTransferredOverUrl";
import { createCoreProvider } from "core";
import { getEnv } from "../env";
import { pages, page404 } from "ui/pages";

const apiUrl = getEnv().API_URL ?? `${window.location.origin}/api`;

const { CoreProvider } = createCoreProvider({
    apiUrl,
    "evtUserActivity": Evt.merge([
        Evt.from(document, "mousemove"),
        Evt.from(document, "keydown")
    ]).pipe(() => [id<void>(undefined)]),
    "transformUrlBeforeRedirectToLogin": ({ url, termsOfServicesUrl }) =>
        [url]
            .map(injectGlobalStatesInSearchParams)
            .map(url => addSillApiUrlToQueryParams({ url, "value": apiUrl }))
            .map(url =>
                addTermsOfServicesUrlToQueryParams({ url, "value": termsOfServicesUrl })
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

    const { classes, cx } = useStyles();

    const { userAuthentication } = useCoreFunctions();

    return (
        <div className={cx(classes.root)}>
            <Header
                routeName={route.name}
                authentication={
                    userAuthentication.getIsUserLoggedIn()
                        ? {
                              "isUserLoggedIn": true,
                              "logout": () =>
                                  userAuthentication.logout({
                                      redirectTo: "home"
                                  })
                          }
                        : {
                              "isUserLoggedIn": false,
                              "login": () =>
                                  userAuthentication.login({
                                      "doesCurrentHrefRequiresAuth": false
                                  })
                          }
                }
            />
            <main className={classes.main}>
                <Suspense>
                    <Page route={route} />
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

function Page(props: { route: ReturnType<typeof useRoute> }) {
    const { route } = props;

    const { userAuthentication } = useCoreFunctions();

    const isUserLoggedIn = userAuthentication.getIsUserLoggedIn();

    const login = () => {
        userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
        return null;
    };

    /*
    Here is one of the few places in the codebase where we tolerate code duplication.
    We sacrifice dryness for the sake of type safety and flexibility.
    */
    {
        const page = pages.account;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.addSoftwareLanding;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.declarationForm;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.homepage;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.instanceForm;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.readme;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.softwareCatalog;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.softwareDetails;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.softwareForm;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.softwareUserAndReferent;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    {
        const page = pages.terms;

        if (page.routeGroup.has(route)) {
            if (page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                return login();
            }

            return <page.LazyComponent route={route} />;
        }
    }

    return <page404.LazyComponent />;
}
