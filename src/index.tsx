import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { kcContext as kcLoginThemeContext } from "login/kcContext";
import { kcContext as kcAccountThemeContext } from "account/kcContext";
import { MuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { assert } from "tsafe/assert";
startReactDsfr({ "defaultColorScheme": "system" });

const KcLoginThemeApp = lazy(() => import("login/KcApp"));
const KcAccountThemeApp = lazy(() => import("account/KcApp"));

createRoot(
    (() => {
        const rootElement = document.getElementById("root");

        assert(rootElement !== null);

        return rootElement;
    })()
).render(
    <Suspense>
        <MuiDsfrThemeProvider>
            {(() => {
                if (kcLoginThemeContext !== undefined) {
                    return <KcLoginThemeApp kcContext={kcLoginThemeContext} />;
                }

                if (kcAccountThemeContext !== undefined) {
                    return <KcAccountThemeApp kcContext={kcAccountThemeContext} />;
                }

                assert(false, "No kcContext found");
            })()}
        </MuiDsfrThemeProvider>
    </Suspense>
);
