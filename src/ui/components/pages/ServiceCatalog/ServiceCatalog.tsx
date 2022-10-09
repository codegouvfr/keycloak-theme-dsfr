import "minimal-polyfills/Object.fromEntries";
import { useMemo, useEffect } from "react";
import { createGroup } from "type-route";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles, PageHeader, isViewPortAdapterEnabled } from "ui/theme";
import type { CollapseParams } from "onyxia-ui/CollapsibleWrapper";
import type { Props as CatalogExplorerCardsProps } from "./ServiceCatalogCards";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useSplashScreen } from "onyxia-ui";
import { useSelector, useThunks, selectors, pure } from "ui/coreApi";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { ServiceCatalogCards } from "./ServiceCatalogCards";
import { Props as CatalogCardsProps } from "./ServiceCatalogCards";
import type { Link } from "type-route";
import { useStateRef } from "powerhooks/useStateRef";
import { useStickyTop } from "powerhooks/useStickyTop";
import memoize from "memoizee";
import { useConst } from "powerhooks/useConst";

ServiceCatalog.routeGroup = createGroup([routes.serviceCatalog]);

type PageRoute = Route<typeof ServiceCatalog.routeGroup>;

ServiceCatalog.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function ServiceCatalog(props: Props) {
    const { className, route } = props;

    const { t } = useTranslation({ ServiceCatalog });

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

    const { sliceState } = useSelector(selectors.serviceCatalog.sliceState);
    const { queryString } = useSelector(selectors.serviceCatalog.queryString);
    const { isProcessing } = useSelector(selectors.serviceCatalog.isProcessing);
    const { filteredServices } = useSelector(selectors.serviceCatalog.filteredServices);
    const { searchResultCount } = useSelector(selectors.serviceCatalog.searchResultCount);
    const { softwareNames } = useSelector(selectors.serviceCatalog.softwareNames);

    const { serviceCatalogThunks, userAuthenticationThunks } = useThunks();

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        switch (sliceState.stateDescription) {
            case "not fetched":
                if (!sliceState.isFetching) {
                    showSplashScreen({ "enableTransparency": true });
                    serviceCatalogThunks.fetchCatalog();
                }
                break;
            case "ready":
                hideSplashScreen();

                //NOTE: Restore previous search
                if (route.params.q === "" && queryString !== "") {
                    routes.serviceCatalog({ "q": queryString }).replace();
                }

                break;
        }
    }, [sliceState.stateDescription]);

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
                .serviceCatalog({
                    "q":
                        pure.serviceCatalog.stringifyQuery({
                            search,
                            "softwareName": pure.serviceCatalog.parseQuery(route.params.q)
                                .softwareName,
                        }) || undefined,
                })
                .replace(),
    );

    const onSelectedSoftwareChange = useConstCallback<
        CatalogCardsProps["onSelectedSoftwareChange"]
    >(softwareName =>
        routes
            .serviceCatalog({
                "q":
                    pure.serviceCatalog.stringifyQuery({
                        "search": pure.serviceCatalog.parseQuery(route.params.q).search,
                        softwareName,
                    }) || undefined,
            })
            .replace(),
    );

    useEffect(() => {
        serviceCatalogThunks.setQueryString({ "queryString": route.params.q });
    }, [route.params.q]);

    const getFormLink = useConst(() =>
        memoize((serviceId: number | undefined) => {
            //return routes.form({ softwareId }).link;
            console.log(`TODO: Point to Service form ${serviceId}`);
            return {
                "href": "",
                "onClick": () => {
                    /* nothing */
                },
            };
        }),
    );

    const { editLinkByServiceId, sillSoftwareLinkByServiceId } = useMemo(() => {
        if (filteredServices === undefined) {
            return {};
        }

        const editLinkByServiceId: Record<number, Link> = {};
        const sillSoftwareLinkByServiceId: Record<number, Link | undefined> = {};

        filteredServices.forEach(service => {
            editLinkByServiceId[service.id] = getFormLink(service.id);

            sillSoftwareLinkByServiceId[service.id] = !service.deployedSoftware.isInSill
                ? undefined
                : routes.card({ "name": service.deployedSoftware.softwareName }).link;
        });

        return {
            editLinkByServiceId,
            sillSoftwareLinkByServiceId,
        };
    }, [filteredServices]);

    const onLogin = useConstCallback(() =>
        userAuthenticationThunks.login({ "doesCurrentHrefRequiresAuth": false }),
    );

    if (sliceState.stateDescription !== "ready") {
        return null;
    }

    assert(filteredServices !== undefined);
    assert(editLinkByServiceId !== undefined);
    assert(sillSoftwareLinkByServiceId !== undefined);
    assert(searchResultCount !== undefined);
    assert(softwareNames !== undefined);

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                ref={pageHeaderRef}
                className={classes.pageHeader}
                mainIcon="http"
                title={t("header text1")}
                helpTitle={t("header text2")}
                helpContent={t("what is the catalog of service", {
                    "link": routes.readme().link,
                })}
                helpIcon="sentimentSatisfied"
                titleCollapseParams={titleCollapseParams}
                helpCollapseParams={helpCollapseParams}
            />
            <div className={classes.contentWrapper}>
                {pageHeaderRef.current !== null && (
                    <ServiceCatalogCards
                        searchResultCount={searchResultCount}
                        referenceNewServiceLink={getFormLink(undefined)}
                        filteredServices={filteredServices}
                        editLinkByServiceId={editLinkByServiceId}
                        sillSoftwareLinkByServiceId={sillSoftwareLinkByServiceId}
                        search={pure.serviceCatalog.parseQuery(route.params.q).search}
                        onSearchChange={onSearchChange}
                        softwareNames={softwareNames}
                        selectedSoftwareName={
                            pure.serviceCatalog.parseQuery(route.params.q).softwareName
                        }
                        onSelectedSoftwareChange={onSelectedSoftwareChange}
                        onLoadMore={serviceCatalogThunks.loadMore}
                        hasMoreToLoad={serviceCatalogThunks.getHasMoreToLoad()}
                        searchBarWrapperElement={pageHeaderRef.current}
                        {...(userAuthenticationThunks.getIsUserLoggedIn()
                            ? {
                                  "isUserLoggedIn": true,
                                  "onRequestDelete": serviceCatalogThunks.deleteService,
                              }
                            : {
                                  "isUserLoggedIn": false,
                                  onLogin,
                              })}
                    />
                )}
            </div>
        </div>
    );
}
export const { i18n } = declareComponentKeys<
    | "header text1"
    | "header text2"
    | { K: "what is the catalog of service"; P: { link: Link }; R: JSX.Element }
>()({ ServiceCatalog });

const useStyles = makeStyles<{ pageHeaderStickyTop: number | undefined }>({
    "name": { ServiceCatalog },
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
    };
});
