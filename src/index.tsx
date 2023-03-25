import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { kcContext as kcLoginThemeContext } from "keycloak-theme/login/kcContext";
import { MuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
startReactDsfr({ "defaultColorScheme": "system" });

const App = lazy(() => import("ui/App"));
const KcLoginThemeApp = lazy(() => import("keycloak-theme/login/KcApp"));

createRoot(document.getElementById("root")!).render(
    <Suspense>
        <MuiDsfrThemeProvider>
            {(() => {
                if (kcLoginThemeContext !== undefined) {
                    return <KcLoginThemeApp kcContext={kcLoginThemeContext} />;
                }

                return <App />;
            })()}
        </MuiDsfrThemeProvider>
    </Suspense>
);
