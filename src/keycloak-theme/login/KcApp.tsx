import { lazy, Suspense, useEffect } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { fr } from "@codegouvfr/react-dsfr";
import Fallback, { type PageProps } from "keycloakify/login";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
// Leave it this way, it must always be evaluated.
import { isDark as isAppDark } from "./valuesTransferredOverUrl";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";

const Template = lazy(() => import("./Template"));
const Login = lazy(() => import("./pages/Login"));
const RegisterUserProfile = lazy(() => import("./pages/RegisterUserProfile"));
const Terms = lazy(() => import("./pages/Terms"));

export default function KcApp(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const i18n = useI18n({ kcContext });

    const { classes, cx } = useStyles();

    {
        const { setIsDark } = useIsDark();

        useEffect(() => {
            if (isAppDark === undefined) {
                return;
            }

            setIsDark(isAppDark);
        }, [isAppDark]);
    }

    //NOTE: Locales not yet downloaded
    if (i18n === null) {
        return null;
    }

    const pageProps: Omit<PageProps<any, typeof i18n>, "kcContext"> = {
        i18n,
        Template,
        "doUseDefaultCss": true,
        "classes": {
            "kcHtmlClass": classes.kcHtmlClass,
            "kcButtonPrimaryClass": cx(classes.kcButtonPrimaryClass, fr.cx("fr-btn")),
            "kcInputClass": fr.cx("fr-input")
        }
    };

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return <Login {...{ kcContext, ...pageProps }} />;
                    case "register-user-profile.ftl":
                        return <RegisterUserProfile {...{ kcContext, ...pageProps }} />;
                    case "terms.ftl":
                        return <Terms {...{ kcContext, ...pageProps }} />;
                    default:
                        return <Fallback {...{ kcContext, ...pageProps }} />;
                }
            })()}
        </Suspense>
    );
}

const useStyles = makeStyles({ "name": { KcApp } })(theme => ({
    "kcHtmlClass": {
        "fontSize": "unset",
        "& label": {
            "fontWeight": "unset"
        },
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
