import "minimal-polyfills/Object.fromEntries";
import { useMemo, useEffect } from "react";
import { createGroup } from "type-route";
import { useTranslation } from "ui/i18n/useTranslations";
import { makeStyles, PageHeader } from "ui/theme";
import type { CollapseParams } from "onyxia-ui/CollapsibleWrapper";
import type { Props as CatalogExplorerCardsProps } from "./CatalogCards";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useSplashScreen } from "onyxia-ui";
import { useSelector, useThunks, selectors } from "ui/coreApi";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { CatalogCards } from "./CatalogCards";
import type { Props as CatalogCardsProps } from "./CatalogCards";
import { SoftwareDetails } from "./SoftwareDetails";
import { breakpointsValues } from "onyxia-ui";
import type { Link } from "type-route";
import { useStateRef } from "powerhooks/useStateRef";
import { useStickyTop } from "powerhooks/useStickyTop";

Catalog.routeGroup = createGroup([routes.catalogExplorer]);

type PageRoute = Route<typeof Catalog.routeGroup>;

Catalog.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function Catalog(props: Props) {
    const { className, route } = props;

    const { t } = useTranslation({ Catalog });

    const pageHeaderRef = useStateRef<HTMLDivElement>(null);

    const { top: pageHeaderStickyTop } = useStickyTop({ "ref": pageHeaderRef });

    const { classes, theme, cx } = useStyles({ pageHeaderStickyTop });

    const titleCollapseParams = useMemo((): CollapseParams => {
        if (theme.windowInnerWidth >= breakpointsValues.lg) {
            return {
                "behavior": "collapses on scroll",
                "scrollTopThreshold": 600,
            };
        }

        return {
            "behavior": "controlled",
            "isCollapsed": false,
        };
    }, [theme.windowInnerWidth]);

    const helpCollapseParams = useMemo((): CollapseParams => {
        if (theme.windowInnerWidth >= breakpointsValues.lg) {
            return {
                "behavior": "collapses on scroll",
                "scrollTopThreshold": 300,
            };
        }

        return {
            "behavior": "controlled",
            "isCollapsed": false,
        };
    }, []);

    const catalogExplorerState = useSelector(state => state.catalogExplorer);

    const { catalogExplorerThunks, userAuthenticationThunks } = useThunks();

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        switch (catalogExplorerState.stateDescription) {
            case "not fetched":
                if (!catalogExplorerState.isFetching) {
                    showSplashScreen({ "enableTransparency": true });
                    catalogExplorerThunks.fetchCatalogs();
                }
                break;
            case "ready":
                hideSplashScreen();
                break;
        }
    }, [catalogExplorerState.stateDescription]);

    const { isProcessing } = useSelector(selectors.catalogExplorer.isProcessing);

    useEffect(() => {
        if (isProcessing === undefined) {
            return;
        }

        if (isProcessing) {
            showSplashScreen({
                "enableTransparency": true,
            });
        } else {
            hideSplashScreen();
        }
    }, [isProcessing]);

    const onSearchChange = useConstCallback<CatalogExplorerCardsProps["onSearchChange"]>(
        search =>
            routes
                .catalogExplorer({
                    "search": search || undefined,
                })
                .replace(),
    );

    useEffect(() => {
        catalogExplorerThunks.setSearch({ "search": route.params.search });
    }, [route.params.search]);

    const { filteredSoftwares } = useSelector(
        selectors.catalogExplorer.filteredSoftwares,
    );

    const { alikeSoftwares } = useSelector(selectors.catalogExplorer.alikeSoftwares);
    const { referentsBySoftwareId } = useSelector(
        selectors.catalogExplorer.referentsBySoftwareId,
    );

    const openLinkBySoftwareId = useMemo(() => {
        if (filteredSoftwares === undefined) {
            return undefined;
        }

        const openLinkBySoftwareId: Record<number, Link> = {};

        filteredSoftwares.forEach(({ id, name }) => {
            openLinkBySoftwareId[id] = routes.catalogExplorer({
                "search": route.params.search || undefined,
                "softwareName": name,
            }).link;
        });

        return openLinkBySoftwareId;
    }, [filteredSoftwares]);

    const onLogin = useConstCallback(() => {
        assert(!userAuthenticationThunks.getIsUserLoggedIn());
        userAuthenticationThunks.login();
    });

    const onGoBack = useConstCallback(() =>
        routes.catalogExplorer({ "search": route.params.search || undefined }).push(),
    );

    const onDeclareOneselfReferent = useConstCallback<
        CatalogCardsProps["onDeclareOneselfReferent"]
    >(({ isExpert, softwareId }) =>
        catalogExplorerThunks.declareUserReferent({
            isExpert,
            softwareId,
        }),
    );

    const onUserNoLongerReferent = useConstCallback<
        CatalogCardsProps["onUserNoLongerReferent"]
    >(({ softwareId }) => catalogExplorerThunks.userNoLongerReferent({ softwareId }));

    if (catalogExplorerState.stateDescription !== "ready") {
        return null;
    }

    assert(alikeSoftwares !== undefined);
    assert(filteredSoftwares !== undefined);
    assert(openLinkBySoftwareId !== undefined);

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                ref={pageHeaderRef}
                className={classes.pageHeader}
                mainIcon="catalog"
                title={t("header text1")}
                helpTitle={t("header text2")}
                helpContent={t("header text3")}
                helpIcon="sentimentSatisfied"
                titleCollapseParams={titleCollapseParams}
                helpCollapseParams={helpCollapseParams}
            />
            <div className={classes.contentWrapper}>
                {(() => {
                    const { softwareName } = route.params;

                    return softwareName === undefined
                        ? pageHeaderRef.current !== null && (
                              <CatalogCards
                                  search={route.params.search}
                                  onSearchChange={onSearchChange}
                                  filteredSoftwares={filteredSoftwares}
                                  alikeSoftwares={alikeSoftwares}
                                  referentsBySoftwareId={referentsBySoftwareId}
                                  openLinkBySoftwareId={openLinkBySoftwareId}
                                  onLoadMore={catalogExplorerThunks.loadMore}
                                  hasMoreToLoad={catalogExplorerThunks.getHasMoreToLoad()}
                                  searchBarWrapperElement={pageHeaderRef.current}
                                  onLogin={onLogin}
                                  onDeclareOneselfReferent={onDeclareOneselfReferent}
                                  onUserNoLongerReferent={onUserNoLongerReferent}
                              />
                          )
                        : (() => {
                              const software = filteredSoftwares.find(
                                  ({ name }) => name === softwareName,
                              );

                              assert(software !== undefined);

                              return (
                                  <SoftwareDetails
                                      software={software}
                                      onGoBack={onGoBack}
                                  />
                              );
                          })();
                })()}
            </div>
        </div>
    );
}
export declare namespace Catalog {
    export type I18nScheme = {
        "header text1": undefined;
        "header text2": undefined;
        "header text3": undefined;
    };
}

const useStyles = makeStyles<{ pageHeaderStickyTop: number | undefined }>({
    "name": { Catalog },
})((theme, { pageHeaderStickyTop }) => {
    const spacingLeft = theme.spacing(
        (() => {
            if (theme.windowInnerWidth >= breakpointsValues.md) {
                return 4;
            }

            return 0;
        })(),
    );

    return {
        "root": {
            "marginLeft": "unset",
        },
        "contentWrapper": {
            "marginLeft": spacingLeft,
        },
        "pageHeader": {
            ...(() => {
                if (theme.windowInnerWidth >= breakpointsValues.lg) {
                    return {
                        "position": "sticky",
                        "top": pageHeaderStickyTop,
                    } as const;
                }

                return {};
            })(),
            "backgroundColor": theme.colors.useCases.surfaces.background,
            "paddingLeft": spacingLeft,
            "marginBottom": 0,
        },
    };
});
