import "unorm";
import * as reactDom from "react-dom";
import { RouteProvider } from "./routes";
import { CoreProvider } from "ui/coreApi/CoreProvider";
import { ThemeProvider, splashScreen, getViewPortConfig } from "./theme/theme";
import { App } from "ui/components/App";
import { KcApp, kcContext } from "ui/components/KcApp";
import "./valuesCarriedOverToKc/env";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

reactDom.render(
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
    document.getElementById("root"),
);
