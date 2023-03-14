import { useEffect, useMemo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useConst } from "powerhooks/useConst";
import { useCoreFunctions } from "core";
import { useSplashScreen } from "onyxia-ui";
import { Markdown } from "onyxia-ui/Markdown";
import { useQuery } from "react-query";
import { createResolveLocalizedString } from "i18nifty";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLang, fallbackLanguage } from "ui/i18n";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import type { PageRoute } from "./route";

type Props = {
    className?: string;
    route: PageRoute;
};

const queryClient = new QueryClient();

export default function Terms(props: Props) {
    return (
        <QueryClientProvider client={queryClient}>
            <TermsExpectQueryContext {...props} />
        </QueryClientProvider>
    );
}
function TermsExpectQueryContext(props: Props) {
    const { className } = props;

    const { userAuthentication } = useCoreFunctions();

    const tosUrl = (function useClosure() {
        const { lang } = useLang();
        const termsOfServices = useConst(() =>
            userAuthentication.getTermsOfServicesUrl()
        );

        return useMemo(() => {
            const { resolveLocalizedString } = createResolveLocalizedString({
                "currentLanguage": lang,
                fallbackLanguage
            });

            return resolveLocalizedString(termsOfServices);
        }, [lang]);
    })();

    const { data: tos } = useQuery(["tos", tosUrl], () =>
        tosUrl === undefined ? undefined : fetch(tosUrl).then(res => res.text())
    );

    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (typeof tos === "string") {
                hideSplashScreen();
            } else {
                showSplashScreen({
                    "enableTransparency": false
                });
            }
        }, [tos]);
    }

    const { classes, cx } = useStyles();

    if (tos === undefined) {
        return null;
    }

    return (
        <div className={cx(classes.root, className)}>
            <Markdown className={classes.markdown}>{tos}</Markdown>
        </div>
    );
}

export const { i18n } = declareComponentKeys<"no terms">()({
    Terms
});

export const useStyles = makeStyles()(theme => ({
    "root": {
        "display": "flex",
        "justifyContent": "center"
    },
    "markdown": {
        "borderRadius": fr.spacing("2v"),
        "backgroundColor": theme.decisions.background.actionHigh.beigeGrisGalet.default,
        "maxWidth": 900,
        "padding": fr.spacing("4v"),
        "&:hover": {
            "boxShadow": "0px 6px 10px 0px rgba(0,0,0,0.14)"
        },
        "marginBottom": fr.spacing("2v")
    }
}));
