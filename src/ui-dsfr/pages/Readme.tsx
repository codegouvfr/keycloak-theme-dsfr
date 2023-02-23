import { useEffect } from "react";
import type { Route } from "type-route";
import { createGroup } from "type-route";
import { routes } from "ui-dsfr/routes";
import { useSplashScreen } from "onyxia-ui";
import { Markdown } from "onyxia-ui/Markdown";
import { useQuery } from "react-query";
import { useCoreFunctions } from "core";
import { makeStyles } from "tss-react/dsfr";
import { QueryClient, QueryClientProvider } from "react-query";
import { fr } from "@codegouvfr/react-dsfr";
const readmeUrl = "https://git.sr.ht/~etalab/logiciels-libres/blob/master/sill.md";

Readme.routeGroup = createGroup([routes.readme]);

type PageRoute = Route<typeof Readme.routeGroup>;

Readme.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: PageRoute;
};

const queryClient = new QueryClient();

export function Readme(props: Props) {
    return (
        <QueryClientProvider client={queryClient}>
            <ReadmeExpectQueryContext {...props} />
        </QueryClientProvider>
    );
}

function ReadmeExpectQueryContext(props: Props) {
    const { className } = props;

    const { fetchProxy } = useCoreFunctions();

    const { data: readme } = useQuery(
        ["readme", readmeUrl],
        () =>
            fetchProxy
                .downloadCoreProtectedTextFile(readmeUrl)
                .then(text => text.split("---").reverse()[0]) // Remove title that isn't standard Markdown
    );

    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (typeof readme === "string") {
                hideSplashScreen();
            } else {
                showSplashScreen({
                    "enableTransparency": false
                });
            }
        }, [readme]);
    }

    const { classes, cx } = useStyles();

    if (readme === undefined) {
        return null;
    }

    return (
        <div className={cx(classes.root, className)}>
            <Markdown className={classes.markdown}>{readme}</Markdown>
        </div>
    );
}

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
