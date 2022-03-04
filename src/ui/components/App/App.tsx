import { useMemo, useEffect, memo } from "react";
import { Header } from "ui/components/shared/Header";
import { LeftBar } from "ui/theme";
import { Footer } from "./Footer";
import { useLng } from "ui/i18n/useLng";
import { makeStyles } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { useThunks } from "ui/coreApi";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useRoute, routes } from "ui/routes";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { useDomRect, useSplashScreen } from "onyxia-ui";
import { Account } from "ui/components/pages/Account";
import { FourOhFour } from "ui/components/pages/FourOhFour";
import { Catalog } from "ui/components/pages/Catalog";
import { typeGuard } from "tsafe/typeGuard";
import type { SupportedLanguage, fallbackLanguage } from "ui/i18n/translations";
import { id } from "tsafe/id";
import { createResolveLocalizedString } from "ui/tools/resolveLocalizedString";
import type { KcLanguageTag } from "keycloakify";
import { useConst } from "powerhooks/useConst";
import { useStickyTop } from "ui/tools/useStickyTop";

export const logoContainerWidthInPercent = 4;

export type Props = {
    className?: string;
};

export const App = memo((props: Props) => {
    const { className } = props;

    const { t } = useTranslation({ App });

    useApplyLanguageSelectedAtLogin();

    const {
        domRect: { width: rootWidth, height: rootHeight },
        ref: rootRef,
    } = useDomRect();

    const {
        ref: headerRef,
        domRect: { height: headerHeight },
    } = useDomRect();
    const {
        ref: footerRef,
        domRect: { height: footerHeight },
    } = useDomRect();

    {
        const { hideRootSplashScreen } = useSplashScreen();

        useEffectOnValueChange(() => {
            hideRootSplashScreen();
        }, [rootWidth === 0]);
    }

    const { refSticky, top } = useStickyTop();

    const { classes, cx } = useStyles({
        "leftBarTop": top,
        "leftBarHeight": rootHeight - headerHeight - footerHeight,
    });

    const logoContainerWidth = Math.max(
        Math.floor((Math.min(rootWidth, 1920) * logoContainerWidthInPercent) / 100),
        45,
    );

    const route = useRoute();

    const onHeaderLogoClick = useConstCallback(() => routes.home().push());

    const { userAuthenticationThunks } = useThunks();

    const isUserLoggedIn = userAuthenticationThunks.getIsUserLoggedIn();

    const onHeaderAuthClick = useConstCallback(() =>
        isUserLoggedIn
            ? userAuthenticationThunks.logout({ "redirectTo": "home" })
            : userAuthenticationThunks.login(),
    );

    const tosUrl = (function useClosure() {
        const { lng } = useLng();
        const termsOfServices = useConst(() =>
            userAuthenticationThunks.getTermsOfServices(),
        );

        return useMemo(() => {
            if (termsOfServices === undefined) {
                return undefined;
            }

            const { resolveLocalizedString } =
                createResolveLocalizedString<KcLanguageTag>({
                    "currentLanguage": lng,
                    "fallbackLanguage": id<typeof fallbackLanguage>("en"),
                });

            return resolveLocalizedString(termsOfServices);
        }, [lng]);
    })();

    const { lng } = useLng();

    const leftBarItems = useMemo(
        () =>
            ({
                "account": {
                    "iconId": "account",
                    "label": t("account"),
                    "link": routes.account().link,
                    "hasDividerBelow": true,
                },
                "catalog": {
                    "iconId": "catalog",
                    "label": t("catalog"),
                    "link": routes.catalogExplorer().link,
                },
            } as const),
        [t, lng],
    );

    return (
        <div ref={rootRef} className={cx(classes.root, className)}>
            {(() => {
                const common = {
                    "className": classes.header,
                    "useCase": "core app",
                    logoContainerWidth,
                    "onLogoClick": onHeaderLogoClick,
                    "ref": headerRef,
                } as const;

                return isUserLoggedIn ? (
                    <Header
                        {...common}
                        isUserLoggedIn={true}
                        onLogoutClick={onHeaderAuthClick}
                    />
                ) : (
                    <Header
                        {...common}
                        isUserLoggedIn={false}
                        onLoginClick={onHeaderAuthClick}
                    />
                );
            })()}
            <section className={classes.betweenHeaderAndFooter}>
                <LeftBar
                    ref={refSticky}
                    className={classes.leftBar}
                    collapsedWidth={logoContainerWidth}
                    reduceText={t("reduce")}
                    items={leftBarItems}
                    currentItemId={(() => {
                        switch (route.name) {
                            case "account":
                                return "account";
                            case "catalogExplorer":
                                return "catalog";
                        }
                    })()}
                />

                <main className={classes.main}>
                    <PageSelector route={route} />
                </main>
            </section>
            <Footer
                className={classes.footer}
                //NOTE: Defined in ./config-overrides.js
                packageJsonVersion={process.env.VERSION!}
                contributeUrl={"https://github.com/etalab/sill"}
                tosUrl={tosUrl}
                ref={footerRef}
            />
        </div>
    );
});

export declare namespace App {
    export type I18nScheme = Record<"reduce" | "account" | "catalog", undefined>;
}

const useStyles = makeStyles<{ leftBarTop: number | undefined; leftBarHeight: number }>({
    "name": { App },
})((theme, { leftBarTop, leftBarHeight }) => ({
    "root": {
        "height": "100%",
        "overflow": "auto",
        "backgroundColor": theme.colors.useCases.surfaces.background,
        "padding": theme.spacing({ "topBottom": 0, "rightLeft": 4 }),
        "position": "relative",
        // https://stackoverflow.com/questions/55211408/collapse-header-with-dynamic-height-on-scroll/55212530
        "overflowAnchor": "none",
    },
    "header": {
        //"paddingBottom": 0, //For the LeftBar shadow
        "position": "sticky",
        "top": 0,
    },
    "betweenHeaderAndFooter": {
        "display": "flex",
        "alignItems": "start",
    },
    "footer": {
        "height": 32,
        "position": "sticky",
        "bottom": 0,
        "zIndex": 0,
    },
    "leftBar": {
        "position": "sticky",
        "top": leftBarTop,
        "height": leftBarHeight,
        "zIndex": 1,
    },
    "main": {
        //TODO: See if scroll delegation works if we put auto here instead of "hidden"
        "paddingLeft": theme.spacing(4),
        "flex": 1,
    },
}));

const PageSelector = memo((props: { route: ReturnType<typeof useRoute> }) => {
    const { route } = props;

    const { userAuthenticationThunks } = useThunks();

    const isUserLoggedIn = userAuthenticationThunks.getIsUserLoggedIn();

    {
        useEffect(() => {
            if (route.name !== "home") {
                return;
            }

            routes.catalogExplorer().replace();
        }, [route.name]);

        if (route.name === "home") {
            return null;
        }
    }

    /*
    Here is one of the few places in the codebase where we tolerate code duplication.
    We sacrifice dryness for the sake of type safety and flexibility.
    */
    {
        const Page = Catalog;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthenticationThunks.login();
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Catalog;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthenticationThunks.login();
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Account;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthenticationThunks.login();
                return null;
            }

            return <Page route={route} />;
        }
    }

    return <FourOhFour />;
});

/** On the login pages hosted by keycloak the user can select
 * a language, we want to use this language on the app.
 * For example we want that if a user selects english on the
 * register page while signing in that the app be set to english
 * automatically.
 */
function useApplyLanguageSelectedAtLogin() {
    const { userAuthenticationThunks } = useThunks();

    const isUserLoggedIn = userAuthenticationThunks.getIsUserLoggedIn();

    const { setLng } = useLng();

    useEffect(() => {
        if (!isUserLoggedIn) {
            return;
        }

        const { local } = userAuthenticationThunks.getUser();

        if (
            !typeGuard<SupportedLanguage>(
                local,
                local in
                    id<Record<SupportedLanguage, null>>({
                        "en": null,
                        "fr": null,
                    }),
            )
        ) {
            return;
        }

        setLng(local);
    }, []);
}
