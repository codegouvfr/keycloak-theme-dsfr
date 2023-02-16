import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";

const App = lazy(() => import("./components/App"));

createRoot(document.getElementById("root")!).render(
    <Suspense>
        <App />
    </Suspense>
);
