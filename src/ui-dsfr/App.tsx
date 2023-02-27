import { makeStyles } from "tss-react/dsfr";
import { useRoute } from "ui-dsfr/routes";
import { SoftwareCatalog } from "./pages/SoftwareCatalog";
import { Homepage } from "./pages/Homepage";
import { Header } from "./shared/Header";
import { Footer } from "./shared/Footer";
import { Terms } from "./pages/Terms";
import { Readme } from "./pages/Readme";
import { FourOhFour } from "./pages/FourOhFour";
import { AddSoftwareLanding } from "./pages/AddSoftwareLanding/AddSoftwareLanding";
import { SoftwareDetails } from "./pages/SoftwareDetails";
import { declareComponentKeys } from "i18nifty";
import { SoftwareUserAndReferent } from "./pages/SoftwareUserAndReferent";
import { DeclarationForm } from "./pages/DeclarationForm";
import { useCoreFunctions } from "core-dsfr";
import { SoftwareForm } from "./pages/SoftwareForm";
import { Account } from "./pages/Account";
import { RouteProvider } from "ui-dsfr/routes";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { Evt } from "evt";
import { evtLang } from "ui-dsfr/i18n";
import {
    addSillApiUrlToQueryParams,
    addTermsOfServicesUrlToQueryParams
} from "ui-dsfr/keycloak-theme/valuesTransferredOverUrl";
import { createCoreProvider } from "core-dsfr";
import { getConfiguration } from "configuration-dsfr";

const { CoreProvider } = createCoreProvider({
    "apiUrl": getConfiguration().apiUrl,
    "evtUserActivity": Evt.merge([
        Evt.from(document, "mousemove"),
        Evt.from(document, "keydown")
    ]).pipe(() => [id<void>(undefined)]),
    "transformUrlBeforeRedirectToLogin": ({ url, termsOfServicesUrl }) =>
        [url]
            .map(injectGlobalStatesInSearchParams)
            .map(url =>
                addSillApiUrlToQueryParams({ url, "value": getConfiguration().apiUrl })
            )
            .map(url =>
                addTermsOfServicesUrlToQueryParams({ url, "value": termsOfServicesUrl })
            )[0],
    "getCurrentLang": () => evtLang.state
});

export default function App() {
    return (
        <CoreProvider>
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
                <Page route={route} />
            </main>
            <Footer />
        </div>
    );
}

function Page(props: { route: ReturnType<typeof useRoute> }) {
    const { route } = props;

    const { userAuthentication } = useCoreFunctions();

    const isUserLoggedIn = userAuthentication.getIsUserLoggedIn();

    /*
    Here is one of the few places in the codebase where we tolerate code duplication.
    We sacrifice dryness for the sake of type safety and flexibility.
    */
    {
        const Page = Homepage;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = SoftwareCatalog;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = AddSoftwareLanding;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }
    {
        const Page = SoftwareDetails;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = SoftwareUserAndReferent;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = DeclarationForm;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = SoftwareForm;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Account;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                //userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Readme;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Terms;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    return <FourOhFour />;
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
    | "add software or service"
    | "add instance"
    | "required"
    | "invalid url"
    | "invalid version"
    | "all"
    | "allFeminine"
>()({ "App": null });
