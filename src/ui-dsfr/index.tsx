import { createRoot } from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { lazy, Suspense } from "react";
startReactDsfr({ "defaultColorScheme": "system" });

const App = lazy(() => import("./components/App"));

createRoot(document.getElementById("root")!).render(
    <Suspense>
        <App />
    </Suspense>
);
