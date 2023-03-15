import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { kcContext } from "ui/keycloak-theme/kcContext";
import { MuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
startReactDsfr({ "defaultColorScheme": "system" });

const App = lazy(() => import("ui/App"));
const KcApp = lazy(() => import("ui/keycloak-theme/KcApp"));

createRoot(document.getElementById("root")!).render(
    <Suspense>
        <MuiDsfrThemeProvider>
            {kcContext !== undefined ? <KcApp kcContext={kcContext} /> : <App />}
        </MuiDsfrThemeProvider>
    </Suspense>
);
