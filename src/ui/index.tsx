import "unorm";
import * as reactDom from "react-dom";
import { RouteProvider } from "./routes";
import { CoreProvider } from "ui/coreApi/CoreProvider";
import { ThemeProvider, splashScreen, getViewPortConfig } from "./theme/theme";
import { App } from "ui/components/App";
import { KcApp, kcContext } from "ui/components/KcApp";
import "./valuesCarriedOverToKc/env";

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
                    <App />
                </CoreProvider>
            )}
        </ThemeProvider>
    </RouteProvider>,
    document.getElementById("root"),
);
