import {
    useEffect,
    //lazy,
    Suspense
} from "react";
import KcAppBase, { defaultKcProps } from "keycloakify";
import { useLang } from "ui-dsfr/i18n";
import { typeGuard } from "tsafe/typeGuard";
import { languages, type Language } from "sill-api";
import { id } from "tsafe/id";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
import { makeStyles } from "tss-react/dsfr";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";

//const Login = lazy(() => import("./Login"));
//const RegisterUserProfile = lazy(() => import("./RegisterUserProfile"));
//const Terms = lazy(() => import("./Terms"));
//const LoginUpdateProfile = lazy(() => import("./LoginUpdateProfile"));

export type Props = {
    kcContext: KcContext;
};

export default function KcApp({ kcContext }: Props) {
    const i18n = useI18n({ kcContext });

    {
        const { setLang } = useLang();

        useEffect(() => {
            if (i18n === null) {
                return;
            }

            if (
                !typeGuard<Language>(
                    i18n.currentLanguageTag,
                    id<readonly string[]>(languages).includes(i18n.currentLanguageTag)
                )
            ) {
                return;
            }

            setLang(i18n.currentLanguageTag);
        }, [i18n]);
    }

    const { classes } = useStyles();

    //NOTE: Locale not yet downloaded
    if (i18n === null) {
        return null;
    }

    const props = {
        i18n,
        ...defaultKcProps,
        "kcHtmlClass": [...defaultKcProps.kcHtmlClass, classes.kcHtmlClass],
        "kcButtonPrimaryClass": [classes.kcButtonPrimaryClass, "fr-btn"],
        "kcInputClass": ["fr-input"]
    };

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    /*
                    case "login.ftl":
                        return <Login {...{ kcContext, ...props }} />;
                    case "terms.ftl":
                        return <Terms {...{ kcContext, ...props }} />;
                    case "login-update-profile.ftl":
                        return <LoginUpdateProfile {...{ kcContext, ...props }} />;
                    case "register-user-profile.ftl":
                        return <RegisterUserProfile {...{ kcContext, ...props }} />;
                    */
                    default:
                        return <Fallback {...{ kcContext, ...props }} />;
                }
            })()}
        </Suspense>
    );
}

function Fallback(params: Parameters<typeof KcAppBase>[0]) {
    const { setIsDark } = useIsDark();

    useEffect(() => {
        setIsDark(false);
    }, []);

    return <KcAppBase {...params} />;
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
