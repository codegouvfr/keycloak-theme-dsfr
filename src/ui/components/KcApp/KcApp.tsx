import { useEffect, lazy, Suspense } from "react";
import type { KcContext } from "./kcContext";
import KcAppBase, { defaultKcProps } from "keycloakify";
import { makeStyles } from "ui/theme";
import { useLang } from "ui/i18n";
import { typeGuard } from "tsafe/typeGuard";
import type { Language } from "sill-api";
import { languages } from "sill-api";
import { id } from "tsafe/id";
import { useI18n } from "./i18n";

const Login = lazy(() => import("./Login"));
const RegisterUserProfile = lazy(() => import("./RegisterUserProfile"));
const Terms = lazy(() => import("./Terms"));
const LoginUpdateProfile = lazy(() => import("./LoginUpdateProfile"));

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
                    id<readonly string[]>(languages).includes(i18n.currentLanguageTag),
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
        "kcLoginClass": [...defaultKcProps.kcLoginClass, classes.kcLoginClass],
        "kcFormCardClass": [...defaultKcProps.kcFormCardClass, classes.kcFormCardClass],
        "kcButtonPrimaryClass": [
            ...defaultKcProps.kcButtonPrimaryClass,
            classes.kcButtonPrimaryClass,
        ],
        "kcInputClass": [...defaultKcProps.kcInputClass, classes.kcInputClass],
    };

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return <Login {...{ kcContext, ...props }} />;
                    case "terms.ftl":
                        return <Terms {...{ kcContext, ...props }} />;
                    case "login-update-profile.ftl":
                        return <LoginUpdateProfile {...{ kcContext, ...props }} />;
                    case "register-user-profile.ftl":
                        return <RegisterUserProfile {...{ kcContext, ...props }} />;
                    default:
                        return <KcAppBase {...{ kcContext, ...props }} />;
                }
            })()}
        </Suspense>
    );
}

const useStyles = makeStyles({ "name": { KcApp } })(theme => ({
    "kcLoginClass": {
        "& #kc-locale": {
            "zIndex": 5,
        },
    },
    "kcHtmlClass": {
        "& body": {
            "background": "unset",
            "fontFamily": theme.typography.fontFamily,
        },
        "background": `${theme.colors.useCases.surfaces.background}`,
        "& a": {
            "color": `${theme.colors.useCases.typography.textFocus}`,
        },
        "& #kc-current-locale-link": {
            "color": `${theme.colors.palette.light.greyVariant3}`,
        },
        "& label": {
            "fontSize": 14,
            "color": theme.colors.palette.light.greyVariant3,
            "fontWeight": "normal",
        },
        "& #kc-page-title": {
            ...theme.typography.variants["page heading"].style,
            "color": theme.colors.palette.dark.main,
        },
        "& #kc-header-wrapper": {
            "visibility": "hidden",
        },
    },
    "kcFormCardClass": {
        "borderRadius": 10,
    },
    "kcButtonPrimaryClass": {
        "backgroundColor": "unset",
        "backgroundImage": "unset",
        "borderColor": `${theme.colors.useCases.typography.textFocus}`,
        "borderWidth": "2px",
        "borderRadius": `20px`,
        "color": `${theme.colors.useCases.typography.textFocus}`,
        "textTransform": "uppercase",
    },
    "kcInputClass": {
        "borderRadius": "unset",
        "border": "unset",
        "boxShadow": "unset",
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
        "&:focus": {
            "borderColor": "unset",
            "borderBottom": `1px solid ${theme.colors.useCases.typography.textFocus}`,
        },
    },
}));
