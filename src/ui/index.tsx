import "unorm";
import { createRoot } from "react-dom/client";
import { RouteProvider } from "./routes";
import { CoreProvider } from "ui/coreApi/CoreProvider";
import { ThemeProvider, splashScreen, getViewPortConfig } from "./theme/theme";
import { App } from "ui/components/App";
import { KcApp, kcContext } from "ui/components/KcApp";
import "./valuesCarriedOverToKc/env";
import { QueryClient, QueryClientProvider } from "react-query";

//For jwt-simple
import { Buffer } from "buffer";
(window as any).Buffer = Buffer;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <RouteProvider>
        <ThemeProvider
            splashScreen={splashScreen}
            getViewPortConfig={kcContext !== undefined ? undefined : getViewPortConfig}
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
    </RouteProvider>,
);
