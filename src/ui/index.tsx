import * as reactDom from "react-dom";
import { I18nProvider } from "./i18n/I18nProvider";
import { RouteProvider } from "./routes";
import { CoreProvider } from "ui/coreApi/CoreProvider";
import { ThemeProvider, splashScreen } from "./theme";
import { App } from "ui/components/App";
import { KcApp, kcContext } from "ui/components/KcApp";
import "./envCarriedOverToKc";

reactDom.render(
    <I18nProvider>
        <RouteProvider>
            <ThemeProvider splashScreen={splashScreen}>
                {kcContext !== undefined ? (
                    <KcApp kcContext={kcContext} />
                ) : (
                    <CoreProvider>
                        <App />
                    </CoreProvider>
                )}
            </ThemeProvider>
        </RouteProvider>
    </I18nProvider>,
    document.getElementById("root"),
);
