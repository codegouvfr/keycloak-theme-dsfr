import { lazy, Suspense } from "react";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
import Fallback, { defaultKcProps, type KcProps, type PageProps } from "keycloakify";
import Template from "./Template";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";

const Login = lazy(() => import("./pages/Login"));

export default function KcApp(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const i18n = useI18n({ kcContext });

    const { classes } = useStyles();

    const kcProps: KcProps = {
        ...defaultKcProps,
        "kcHtmlClass": [...defaultKcProps.kcHtmlClass, classes.kcHtmlClass],
        "kcButtonPrimaryClass": [classes.kcButtonPrimaryClass, fr.cx("fr-btn")],
        "kcInputClass": fr.cx("fr-input")
    };

    //NOTE: Locales not yet downloaded
    if (i18n === null) {
        return null;
    }

    const pageProps: Omit<PageProps<any, typeof i18n>, "kcContext"> = {
        i18n,
        Template,
        "doFetchDefaultThemeResources": true,
        ...kcProps
    };

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return <Login {...{ kcContext, ...pageProps }} />;
                    default:
                        return <Fallback {...{ kcContext, ...pageProps }} />;
                }
            })()}
        </Suspense>
    );
}

const useStyles = makeStyles({ "name": { KcApp } })(theme => ({
    "kcHtmlClass": {
        "& body": {
            "background": "unset"
        },
        "background": theme.decisions.background.raised.grey.default,
        "& #kc-header-wrapper": {
            "visibility": "hidden"
        },
        "& a": {
            "&:hover, &:focus": {
                "textDecoration": "unset"
            }
        }
    },
    "kcButtonPrimaryClass": {
        "&:hover": {
            "color": theme.decisions.text.inverted.blueFrance.default
        }
    }
}));
