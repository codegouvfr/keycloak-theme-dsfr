import "unorm";
import { createRoot } from "react-dom/client";
import { RouteProvider } from "./routes";
import { ThemeProvider, getViewPortConfig } from "./theme";
import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { kcContext } from "./components/KcApp/kcContext";
import { createCoreProvider } from "core";
import { getConfiguration } from "configuration";
import { injectTransferableEnvsInSearchParams } from "ui/valuesCarriedOverToKc/env";
import { injectGlobalStatesInSearchParams } from "powerhooks/useGlobalState";
import { injectTosInSearchParams } from "ui/valuesCarriedOverToKc/termsOfServices";
import { addParamToUrl } from "powerhooks/tools/urlSearchParams";
import { Evt } from "evt";
import { evtLang } from "ui/i18n";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";

import "./valuesCarriedOverToKc/env";
//For jwt-simple
import { Buffer } from "buffer";
(window as any).Buffer = Buffer;

const App = lazy(() => import("./components/App"));
const KcApp = lazy(() => import("./components/KcApp"));

const { CoreProvider } = createCoreProvider(() => ({
    ...getConfiguration(),
    "transformUrlBeforeRedirectToLogin": ({ url, termsOfServices }) =>
        [url]
            .map(injectTransferableEnvsInSearchParams)
            .map(injectGlobalStatesInSearchParams)
            .map(
                url =>
                    addParamToUrl({
                        url,
                        "name": "ui_locales",
                        "value": evtLang.state,
                    }).newUrl,
            )
            .map(url => injectTosInSearchParams({ url, termsOfServices }))[0],
    "evtUserActivity": Evt.merge([
        Evt.from(document, "mousemove"),
        Evt.from(document, "keydown"),
    ]).pipe(() => [undefined as void]),
}));

const queryClient = new QueryClient();

/** TODO: Update doc on https://react-dsfr.etalab.studio/
 * old : startDsfrReact({ defaultColorScheme: "system" });
 * new should be : startReactDsfr({ defaultColorScheme: "system" });
 */
startReactDsfr({ defaultColorScheme: "system" });

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Suspense>
            <RouteProvider>
                <ThemeProvider
                    getViewPortConfig={
                        kcContext !== undefined ? undefined : getViewPortConfig
                    }
                >
                    {kcContext !== undefined ? (
                        <KcApp kcContext={kcContext} />
                    ) : (
                        <CoreProvider>
                            <QueryClientProvider client={queryClient}>
                                <App />
                            </QueryClientProvider>
                        </CoreProvider>
                    )}
                </ThemeProvider>
            </RouteProvider>
        </Suspense>
    </React.StrictMode>,
);
