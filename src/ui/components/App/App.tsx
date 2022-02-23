import { useMemo, useEffect, memo } from "react";
import { Header } from "ui/components/shared/Header";
import { LeftBar } from "ui/theme";
import { Footer } from "./Footer";
import { useLng } from "ui/i18n/useLng";
import { getTosMarkdownUrl } from "ui/components/KcApp/getTosMarkdownUrl";
import { makeStyles } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { useThunks } from "ui/coreApi";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useRoute, routes } from "ui/routes";
import { Home } from "ui/components/pages/Home";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { useDomRect, useSplashScreen } from "onyxia-ui";
import { Account } from "ui/components/pages/Account";
import { FourOhFour } from "ui/components/pages/FourOhFour";
import { Catalog } from "ui/components/pages/Catalog";
import { typeGuard } from "tsafe/typeGuard";
import type { SupportedLanguage, fallbackLanguage } from "ui/i18n/translations";
import { id } from "tsafe/id";
import { createResolveLocalizedString } from "ui/tools/resolveLocalizedString";
import type { Item } from "onyxia-ui/LeftBar";
import { getExtraLeftBarItemsFromEnv } from "ui/env";

export const logoContainerWidthInPercent = 4;

export type Props = {
    className?: string;
};

export const App = memo((props: Props) => {
    const { className } = props;

    const { t } = useTranslation({ App });

    useApplyLanguageSelectedAtLogin();

    const {
        domRect: { width: rootWidth },
        ref: rootRef,
    } = useDomRect();

    {
        const { hideRootSplashScreen } = useSplashScreen();

        useEffectOnValueChange(() => {
            hideRootSplashScreen();
        }, [rootWidth === 0]);
    }

    const { classes, cx } = useStyles();

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

    const { tosUrl } = (function useClosure() {
        const { lng } = useLng();
        const tosUrl = getTosMarkdownUrl(lng);
        return { tosUrl };
    })();

    const { lng } = useLng();

    const leftBarItems = useMemo(
        () =>
            ({
                "home": {
                    "iconId": "home",
                    "label": t("home"),
                    "link": routes.home().link,
                } as const,
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
                ...(() => {
                    const extraLeftBarItems = getExtraLeftBarItemsFromEnv();

                    const { resolveLocalizedString } = createResolveLocalizedString({
                        "currentLanguage": lng,
                        "fallbackLanguage": id<typeof fallbackLanguage>("en"),
                    });

                    return extraLeftBarItems === undefined
                        ? {}
                        : Object.fromEntries(
                              extraLeftBarItems.map(({ iconId, label, url }, i) => [
                                  `extraItem${i}`,
                                  id<Item>({
                                      "iconId": iconId as any,
                                      "label": resolveLocalizedString(label),
                                      "link": {
                                          "href": url,
                                          "target": "_blank",
                                      },
                                  }),
                              ]),
                          );
                })(),
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
                    className={classes.leftBar}
                    collapsedWidth={logoContainerWidth}
                    reduceText={t("reduce")}
                    items={leftBarItems}
                    currentItemId={(() => {
                        switch (route.name) {
                            case "home":
                                return "home";
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
            />
        </div>
    );
});

export declare namespace App {
    export type I18nScheme = Record<"reduce" | "home" | "account" | "catalog", undefined>;
}

const useStyles = makeStyles({ "name": { App } })(theme => {
    const footerHeight = 32;

    return {
        "root": {
            "height": "100%",
            "display": "flex",
            "flexDirection": "column",
            "backgroundColor": theme.colors.useCases.surfaces.background,
            "margin": theme.spacing({ "topBottom": 0, "rightLeft": 4 }),
            "position": "relative",
        },
        "header": {
            "paddingBottom": 0, //For the LeftBar shadow
        },
        "betweenHeaderAndFooter": {
            "flex": 1,
            "overflow": "hidden",
            "display": "flex",
            "paddingTop": theme.spacing(2.3), //For the LeftBar shadow
            "paddingBottom": footerHeight,
        },
        "footer": {
            "height": footerHeight,
            "position": "absolute",
            "bottom": 0,
            "width": "100%",
            "background": "transparent",
        },
        "leftBar": {
            "height": "100%",
        },
        "main": {
            "height": "100%",
            "flex": 1,
            //TODO: See if scroll delegation works if we put auto here instead of "hidden"
            "paddingLeft": theme.spacing(4),
            "overflow": "hidden",
        },
    };
});

const PageSelector = memo((props: { route: ReturnType<typeof useRoute> }) => {
    const { route } = props;

    const { userAuthenticationThunks } = useThunks();

    const isUserLoggedIn = userAuthenticationThunks.getIsUserLoggedIn();

    /*
    Here is one of the few places in the codebase where we tolerate code duplication.
    We sacrifice dryness for the sake of type safety and flexibility.
    */
    {
        const Page = Catalog;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn(route) && !isUserLoggedIn) {
                userAuthenticationThunks.login();
                return null;
            }

            return <Page route={route} />;
        }
    }

    {
        const Page = Home;

        if (Page.routeGroup.has(route)) {
            if (Page.getDoRequireUserLoggedIn() && !isUserLoggedIn) {
                userAuthenticationThunks.login();
                return null;
            }

            return <Page />;
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
