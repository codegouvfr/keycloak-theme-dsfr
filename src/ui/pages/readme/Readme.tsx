import { Markdown } from "keycloakify/tools/Markdown";
import { useQuery } from "react-query";
import { useCoreFunctions } from "core";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
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
            <ContextualizedReadme {...props} />
        </QueryClientProvider>
    );
}

function ContextualizedReadme(props: Props) {
    const { className } = props;

    const { fetchProxy } = useCoreFunctions();

    const { data: readme } = useQuery(
        ["readme", readmeUrl],
        () =>
            fetchProxy
                .downloadCoreProtectedTextFile(readmeUrl)
                .then(text => text.split("---").reverse()[0]) // Remove title that isn't standard Markdown
    );

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

export const useStyles = makeStyles({ "name": { Readme } })({
    "root": {
        "display": "flex",
        "justifyContent": "center"
    },
    "markdown": {
        "borderRadius": fr.spacing("2v"),
        "maxWidth": 900,
        "padding": fr.spacing("4v"),
        ...fr.spacing("margin", {
            "topBottom": "6v"
        })
    }
});
