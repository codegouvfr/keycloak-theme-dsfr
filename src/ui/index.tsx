import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { kcContext } from "ui/keycloak-theme/kcContext";
startReactDsfr({ "defaultColorScheme": "system" });

const App = lazy(() => import("ui/App"));
const KcApp = lazy(() => import("ui/keycloak-theme/KcApp"));

createRoot(document.getElementById("root")!).render(
    <Suspense>
        {kcContext !== undefined ? <KcApp kcContext={kcContext} /> : <App />}
    </Suspense>
);
