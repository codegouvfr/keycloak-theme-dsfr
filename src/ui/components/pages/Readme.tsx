import { useEffect } from "react";
import type { Route } from "type-route";
import { createGroup } from "type-route";
import { routes } from "ui/routes";
import { useSplashScreen } from "onyxia-ui";
import { Markdown } from "onyxia-ui/Markdown";
import { useQuery } from "react-query";
import { makeStyles } from "ui/theme";
import { useCoreFunctions } from "core";
const readmeUrl = "https://git.sr.ht/~etalab/logiciels-libres/blob/master/sill.md";

Readme.routeGroup = createGroup([routes.readme]);

type PageRoute = Route<typeof Readme.routeGroup>;

Readme.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function Readme(props: Props) {
    const { className } = props;

    const { fetchProxy } = useCoreFunctions();

    const { data: readme } = useQuery(
        ["readme", readmeUrl],
        () =>
            fetchProxy
                .downloadCoreProtectedTextFile(readmeUrl)
                .then(text => text.split("---").reverse()[0]), // Remove title that isn't standard Markdown
    );

    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (typeof readme === "string") {
                hideSplashScreen();
            } else {
                showSplashScreen({
                    "enableTransparency": false,
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
        "justifyContent": "center",
    },
    "markdown": {
        "borderRadius": theme.spacing(2),
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "maxWidth": 900,
        "padding": theme.spacing(4),
        "&:hover": {
            "boxShadow": theme.shadows[1],
        },
        "marginBottom": theme.spacing(2),
    },
}));
