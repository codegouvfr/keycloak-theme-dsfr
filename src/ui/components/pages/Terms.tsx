import { useEffect, useMemo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useConst } from "powerhooks/useConst";
import { useThunks } from "ui/coreApi";
import type { Route } from "type-route";
import { createGroup } from "type-route";
import { routes } from "ui/routes";
import { useSplashScreen } from "onyxia-ui";
import { Markdown } from "onyxia-ui/Markdown";
import { useQuery } from "react-query";
import { createResolveLocalizedString } from "i18nifty";
import { useLang, fallbackLanguage, useTranslation } from "ui/i18n";
import { Text } from "ui/theme";
import { makeStyles } from "ui/theme";

Terms.routeGroup = createGroup([routes.terms]);

type PageRoute = Route<typeof Terms.routeGroup>;

Terms.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function Terms(props: Props) {
    const { className } = props;

    const { userAuthenticationThunks } = useThunks();

    const tosUrl = (function useClosure() {
        const { lang } = useLang();
        const termsOfServices = useConst(() =>
            userAuthenticationThunks.getTermsOfServices(),
        );

        return useMemo(() => {
            if (termsOfServices === undefined) {
                return undefined;
            }

            const { resolveLocalizedString } = createResolveLocalizedString({
                "currentLanguage": lang,
                fallbackLanguage,
            });

            return resolveLocalizedString(termsOfServices);
        }, [lang]);
    })();

    const { data: tos } = useQuery(["tos", tosUrl], () =>
        tosUrl === undefined ? undefined : fetch(tosUrl).then(res => res.text()),
    );

    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (typeof tos === "string") {
                hideSplashScreen();
            } else {
                showSplashScreen({
                    "enableTransparency": false,
                });
            }
        }, [tos]);
    }

    const { t } = useTranslation({ Terms });

    const { classes, cx } = useStyles();

    if (tosUrl === undefined) {
        return <Text typo="display heading">{t("no terms")}</Text>;
    }

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
    Terms,
});

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
