import { createRoot } from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { lazy, Suspense } from "react";
import { createCoreProvider } from "core-dsfr";
import { RouteProvider } from "./routes";
startReactDsfr({ "defaultColorScheme": "system" });

const App = lazy(() => import("./components/App"));

const { CoreProvider } = createCoreProvider({
    "sillApi": "mock"
});

createRoot(document.getElementById("root")!).render(
    <CoreProvider>
        <RouteProvider>
            <Suspense>
                <App />
            </Suspense>
        </RouteProvider>
    </CoreProvider>
);
