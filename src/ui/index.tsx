import "unorm";
import { createRoot } from "react-dom/client";
import { RouteProvider } from "./routes";
import { CoreProvider } from "ui/coreApi/CoreProvider";
import { ThemeProvider, splashScreen, getViewPortConfig } from "./theme/theme";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { kcContext } from "./components/KcApp/kcContext";

import "./valuesCarriedOverToKc/env";
//For jwt-simple
import { Buffer } from "buffer";
(window as any).Buffer = Buffer;

const App = lazy(() => import("./components/App"));
const KcApp = lazy(() => import("./components/KcApp"));

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <Suspense>
        <RouteProvider>
            <ThemeProvider
                splashScreen={splashScreen}
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
    </Suspense>,
);
