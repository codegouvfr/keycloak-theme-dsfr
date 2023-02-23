import { createRoot } from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { lazy, Suspense } from "react";
import { createCoreProvider } from "core-dsfr";
import { getConfiguration } from "configuration-dsfr";
import { RouteProvider } from "./routes";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { Evt } from "evt";
import { evtLang } from "ui-dsfr/i18n";
import {
    addSillApiUrlToQueryParams,
    addTermsOfServicesUrlToQueryParams
} from "ui-dsfr/KcApp/valuesTransferredOverUrl";
import { kcContext } from "ui-dsfr/KcApp/kcContext";
startReactDsfr({ "defaultColorScheme": "system" });

const App = lazy(() => import("ui-dsfr/App"));
const KcApp = lazy(() => import("ui-dsfr/KcApp/KcApp"));

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

createRoot(document.getElementById("root")!).render(
    <Suspense>
        <RouteProvider>
            {kcContext !== undefined ? (
                <KcApp kcContext={kcContext} />
            ) : (
                <CoreProvider>
                    <App />
                </CoreProvider>
            )}
        </RouteProvider>
    </Suspense>
);
