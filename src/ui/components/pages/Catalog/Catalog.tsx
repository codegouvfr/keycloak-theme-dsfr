import "minimal-polyfills/Object.fromEntries";
import { useMemo, useEffect } from "react";
import { createGroup } from "type-route";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles, PageHeader, isViewPortAdapterEnabled } from "ui/theme";
import type { CollapseParams } from "onyxia-ui/CollapsibleWrapper";
import type { Props as CatalogExplorerCardsProps } from "./CatalogCards";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useSplashScreen } from "onyxia-ui";
import { useSelector, useThunks, selectors } from "ui/coreApi";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { CatalogCards } from "./CatalogCards";
import { CatalogSoftwareDetails } from "./CatalogSoftwareDetails";
import type { Props as CatalogSoftwareDetailsProps } from "./CatalogSoftwareDetails";
import type { Link } from "type-route";
import { useStateRef } from "powerhooks/useStateRef";
import { useStickyTop } from "powerhooks/useStickyTop";
import memoize from "memoizee";
import { useConst } from "powerhooks/useConst";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import type { Param0 } from "tsafe";

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
        if (isViewPortAdapterEnabled) {
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
        if (isViewPortAdapterEnabled) {
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
                    catalogExplorerThunks.fetchCatalog();
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

    const { softwares } = useSelector(selectors.catalogExplorer.softwares);

    const { softwareNameBySoftwareId } = useSelector(
        selectors.catalogExplorer.softwareNameBySoftwareId,
    );

    const openLinkBySoftwareId = useMemo(() => {
        if (softwareNameBySoftwareId === undefined) {
            return undefined;
        }

        const openLinkBySoftwareId: Record<number, Link> = {};

        Object.entries(softwareNameBySoftwareId).forEach(([id, name]) => {
            openLinkBySoftwareId[parseInt(id)] = routes.catalogExplorer({
                "search": route.params.search || undefined,
                "software": name,
            }).link;
        });

        return openLinkBySoftwareId;
    }, [softwareNameBySoftwareId]);

    const onLogin = useConstCallback(() => {
        assert(!userAuthenticationThunks.getIsUserLoggedIn());
        userAuthenticationThunks.login();
    });

    const onGoBack = useConstCallback(() =>
        routes.catalogExplorer({ "search": route.params.search || undefined }).push(),
    );

    const onDeclareReferentAnswerFactory = useCallbackFactory(
        (
            [softwareId]: [number],
            [{ isExpert, useCaseDescription }]: [
                Param0<CatalogSoftwareDetailsProps["onDeclareReferentAnswer"]>,
            ],
        ) =>
            catalogExplorerThunks.declareUserReferent({
                isExpert,
                softwareId,
                useCaseDescription,
            }),
    );

    const onUserNoLongerReferentFactory = useCallbackFactory(([softwareId]: [number]) =>
        catalogExplorerThunks.userNoLongerReferent({ softwareId }),
    );

    const getFormLink = useConst(() =>
        memoize((softwareId: number | undefined) => routes.form({ softwareId }).link),
    );

    const softwareNameOrSoftwareId = (() => {
        const { software: softwareNameOrSoftwareIdAsString } = route.params;

        if (softwareNameOrSoftwareIdAsString === undefined) {
            return undefined;
        }

        const n = parseInt(softwareNameOrSoftwareIdAsString);

        return isNaN(n) ? softwareNameOrSoftwareIdAsString : n;
    })();

    useEffect(() => {
        if (typeof softwareNameOrSoftwareId !== "number") {
            return;
        }

        if (softwares === undefined) {
            return;
        }

        const software = softwares.find(
            ({ name, id }) =>
                softwareNameOrSoftwareId ===
                (typeof softwareNameOrSoftwareId === "number" ? id : name),
        );

        if (software === undefined) {
            routes.fourOhFour().replace();
            return;
        }

        routes
            .catalogExplorer({
                "software": software.name,
            })
            .replace();
    }, [softwareNameOrSoftwareId, softwares]);

    //NOTE: We expect the route param to be the name of the software, if
    //it's the id we replace in the above effect.
    if (typeof softwareNameOrSoftwareId === "number") {
        return null;
    }

    if (catalogExplorerState.stateDescription !== "ready") {
        return null;
    }

    assert(softwares !== undefined);
    assert(alikeSoftwares !== undefined);
    assert(filteredSoftwares !== undefined);
    assert(openLinkBySoftwareId !== undefined);
    assert(softwareNameBySoftwareId !== undefined);

    return (
        <div className={cx(classes.root, className)}>
            {route.params.software === undefined && (
                <PageHeader
                    ref={pageHeaderRef}
                    className={classes.pageHeader}
                    mainIcon="catalog"
                    title={t("header text1")}
                    helpTitle={t("header text2")}
                    helpContent={t("header text3", { "link": routes.form().link })}
                    helpIcon="sentimentSatisfied"
                    titleCollapseParams={titleCollapseParams}
                    helpCollapseParams={helpCollapseParams}
                />
            )}
            <div className={classes.contentWrapper}>
                {softwareNameOrSoftwareId === undefined
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
                              onDeclareReferentAnswer={
                                  catalogExplorerThunks.declareUserReferent
                              }
                              onUserNoLongerReferent={
                                  catalogExplorerThunks.userNoLongerReferent
                              }
                              referenceNewSoftwareLink={getFormLink(undefined)}
                          />
                      )
                    : (() => {
                          const software = softwares.find(
                              ({ name }) => softwareNameOrSoftwareId === name,
                          );

                          if (software === undefined) {
                              routes.fourOhFour().replace();
                              return null;
                          }

                          const { referents, userIndex } =
                              referentsBySoftwareId?.[software.id] ?? {};

                          return (
                              <CatalogSoftwareDetails
                                  className={classes.softwareDetails}
                                  software={software}
                                  onGoBack={onGoBack}
                                  editLink={
                                      referentsBySoftwareId === undefined
                                          ? undefined
                                          : referentsBySoftwareId[software.id]
                                                .userIndex !== undefined
                                          ? getFormLink(software.id)
                                          : undefined
                                  }
                                  referents={referents}
                                  userIndexInReferents={userIndex}
                                  onDeclareReferentAnswer={onDeclareReferentAnswerFactory(
                                      software.id,
                                  )}
                                  onUserNoLongerReferent={onUserNoLongerReferentFactory(
                                      software.id,
                                  )}
                                  onLogin={onLogin}
                                  openLinkBySoftwareId={openLinkBySoftwareId}
                                  softwareNameBySoftwareId={softwareNameBySoftwareId}
                              />
                          );
                      })()}
            </div>
        </div>
    );
}
export const { i18n } = declareComponentKeys<
    "header text1" | "header text2" | ["header text3", { link: Link }]
>()({ Catalog });

const useStyles = makeStyles<{ pageHeaderStickyTop: number | undefined }>({
    "name": { Catalog },
})((theme, { pageHeaderStickyTop }) => {
    const spacingLeft = theme.spacing(
        (() => {
            if (isViewPortAdapterEnabled) {
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
                if (isViewPortAdapterEnabled) {
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
        "softwareDetails": {
            "marginBottom": theme.spacing(3),
        },
    };
});
