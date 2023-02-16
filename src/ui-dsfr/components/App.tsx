import { makeStyles } from "tss-react/dsfr";
import { useRoute } from "../routes";
import { SoftwareCatalog } from "./pages/SoftwareCatalog";
import { Homepage } from "./pages/Homepage";

export default function App() {
    const route = useRoute();

    const { classes, cx } = useStyles();

    return (
        <div className={cx(classes.root)}>
            <h1>Header</h1>
            <main className={classes.main}>
                <PageSelector route={route} />
            </main>
            <h2>Footer</h2>
        </div>
    );
}

const useStyles = makeStyles({
    "name": { App }
})({
    "root": {
        "display": "flex",
        "flexDirection": "column",
        "height": "100vh"
    },
    "main": {
        "flex": 1
    }
});

function PageSelector(props: { route: ReturnType<typeof useRoute> }) {
    const { route } = props;

    const isUserLoggedIn = true;

    /*
    Here is one of the few places in the codebase where we tolerate code duplication.
    We sacrifice dryness for the sake of type safety and flexibility.
    */
    {
        const Page = SoftwareCatalog;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                //userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Homepage;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                //userAuthentication.login({ "doesCurrentHrefRequiresAuth": true });
                return null;
            }

            return <Page route={route} />;
        }
    }

    return <h1>Not found 😢</h1>;
}
