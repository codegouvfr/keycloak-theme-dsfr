import { useEffect } from "react";
import { useSplashScreen } from "onyxia-ui";
import { Markdown } from "onyxia-ui/Markdown";
import { useQuery } from "react-query";
import { useCoreFunctions } from "core";
import { makeStyles } from "tss-react/dsfr";
import { QueryClient, QueryClientProvider } from "react-query";
import { fr } from "@codegouvfr/react-dsfr";
import type { PageRoute } from "./route";
const readmeUrl = "https://git.sr.ht/~etalab/logiciels-libres/blob/master/sill.md";

type Props = {
    className?: string;
    route: PageRoute;
};

const queryClient = new QueryClient();

export default function Readme(props: Props) {
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

export const useStyles = makeStyles({ "name": { Readme } })(theme => ({
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
