import { lazy, Suspense } from "react";
import type { ClassKey } from "keycloakify/account";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
const DefaultPage = lazy(() => import("keycloakify/account/DefaultPage"));
const DefaultTemplate = lazy(() => import("keycloakify/account/Template"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    default:
                        return <DefaultPage kcContext={kcContext} i18n={i18n} classes={classes} Template={DefaultTemplate} doUseDefaultCss={true} />;
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
