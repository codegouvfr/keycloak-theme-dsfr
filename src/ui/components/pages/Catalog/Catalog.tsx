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
import type { Link } from "type-route";
import { useStateRef } from "powerhooks/useStateRef";
import { useStickyTop } from "powerhooks/useStickyTop";
import memoize from "memoizee";
import { useConst } from "powerhooks/useConst";

Catalog.routeGroup = createGroup([routes.catalog]);

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

    const catalogState = useSelector(state => state.catalog);

    const { catalogThunks, userAuthenticationThunks } = useThunks();

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        switch (catalogState.stateDescription) {
            case "not fetched":
                if (!catalogState.isFetching) {
                    showSplashScreen({ "enableTransparency": true });
                    catalogThunks.fetchCatalog();
                }
                break;
            case "ready":
                hideSplashScreen();

                //NOTE: Restore previous search
                if (route.params.search === "" && catalogState.search !== "") {
                    routes.catalog({ "search": catalogState.search }).replace();
                }

                break;
        }
    }, [catalogState.stateDescription]);

    const { isProcessing } = useSelector(selectors.catalog.isProcessing);

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
                .catalog({
                    "search": search || undefined,
                })
                .replace(),
    );

    useEffect(() => {
        catalogThunks.setSearch({ "search": route.params.search });
    }, [route.params.search]);

    const { filteredSoftwares } = useSelector(selectors.catalog.filteredSoftwares);

    const { alikeSoftwares } = useSelector(selectors.catalog.alikeSoftwares);
    const { referentsBySoftwareId } = useSelector(
        selectors.catalog.referentsBySoftwareId,
    );

    const { softwares } = useSelector(selectors.catalog.softwares);

    const { softwareNameBySoftwareId } = useSelector(
        selectors.catalog.softwareNameBySoftwareId,
    );

    const openLinkBySoftwareId = useMemo(() => {
        if (softwareNameBySoftwareId === undefined) {
            return undefined;
        }

        const openLinkBySoftwareId: Record<number, Link> = {};

        Object.entries(softwareNameBySoftwareId).forEach(([id, name]) => {
            openLinkBySoftwareId[parseInt(id)] = routes.card({
                "software": name,
            }).link;
        });

        return openLinkBySoftwareId;
    }, [softwareNameBySoftwareId]);

    const onLogin = useConstCallback(() => {
        assert(!userAuthenticationThunks.getIsUserLoggedIn());
        userAuthenticationThunks.login();
    });

    const getFormLink = useConst(() =>
        memoize((softwareId: number | undefined) => routes.form({ softwareId }).link),
    );

    const { searchResultCount } = useSelector(selectors.catalog.searchResultCount);

    if (catalogState.stateDescription !== "ready") {
        return null;
    }

    assert(softwares !== undefined);
    assert(alikeSoftwares !== undefined);
    assert(filteredSoftwares !== undefined);
    assert(openLinkBySoftwareId !== undefined);
    assert(softwareNameBySoftwareId !== undefined);
    assert(searchResultCount !== undefined);

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                ref={pageHeaderRef}
                className={classes.pageHeader}
                mainIcon="catalog"
                title={t("header text1")}
                helpTitle={t("header text2")}
                helpContent={t("what is the SILL", {
                    "href": "https://man.sr.ht/~etalab/logiciels-libres/sill.md",
                })}
                helpIcon="sentimentSatisfied"
                titleCollapseParams={titleCollapseParams}
                helpCollapseParams={helpCollapseParams}
            />
            <div className={classes.contentWrapper}>
                {pageHeaderRef.current !== null && (
                    <CatalogCards
                        searchResultCount={searchResultCount}
                        search={route.params.search}
                        onSearchChange={onSearchChange}
                        filteredSoftwares={filteredSoftwares}
                        alikeSoftwares={alikeSoftwares}
                        referentsBySoftwareId={referentsBySoftwareId}
                        openLinkBySoftwareId={openLinkBySoftwareId}
                        onLoadMore={catalogThunks.loadMore}
                        hasMoreToLoad={catalogThunks.getHasMoreToLoad()}
                        searchBarWrapperElement={pageHeaderRef.current}
                        onLogin={onLogin}
                        onDeclareReferentAnswer={catalogThunks.declareUserReferent}
                        onUserNoLongerReferent={catalogThunks.userNoLongerReferent}
                        referenceNewSoftwareLink={getFormLink(undefined)}
                    />
                )}
            </div>
        </div>
    );
}
export const { i18n } = declareComponentKeys<
    "header text1" | "header text2" | ["what is the SILL", { href: string }]
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
