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
import { useSelector, useThunks, selectors, pure } from "ui/coreApi";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { CatalogCards } from "./CatalogCards";
import { Props as CatalogCardsProps } from "./CatalogCards";
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
    const readyState =
        catalogState.stateDescription === "ready" ? catalogState : undefined;
    const { filteredSoftwares } = useSelector(selectors.catalog.filteredSoftwares);
    const { alikeSoftwares } = useSelector(selectors.catalog.alikeSoftwares);
    const { softwareNameBySoftwareId } = useSelector(
        selectors.catalog.softwareNameBySoftwareId,
    );
    const { searchResultCount } = useSelector(selectors.catalog.searchResultCount);

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
                if (route.params.q === "" && catalogState.queryString !== "") {
                    routes.catalog({ "q": catalogState.queryString }).replace();
                }

                break;
        }
    }, [catalogState.stateDescription]);

    useEffect(() => {
        const { isProcessing } = readyState ?? {};

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
    }, [readyState?.isProcessing]);

    const onSearchChange = useConstCallback<CatalogExplorerCardsProps["onSearchChange"]>(
        search =>
            routes
                .catalog({
                    "q":
                        pure.catalog.stringifyQuery({
                            search,
                            "tags": pure.catalog.parseQuery(route.params.q).tags,
                        }) || undefined,
                })
                .replace(),
    );

    useEffect(() => {
        catalogThunks.setQueryString({ "queryString": route.params.q });
    }, [route.params.q]);

    const { openLinkBySoftwareId, editLinkBySoftwareId, parentSoftwareBySoftwareId } =
        useMemo(() => {
            const { softwares } = readyState ?? {};

            if (softwares === undefined || softwareNameBySoftwareId === undefined) {
                return {};
            }

            const openLinkBySoftwareId: Record<number, Link> = {};
            const editLinkBySoftwareId: Record<number, Link> = {};
            const parentSoftwareBySoftwareId: Record<
                number,
                { name: string; link: Link | undefined } | undefined
            > = {};

            softwares.forEach(software => {
                openLinkBySoftwareId[software.id] = routes.card({
                    "name": software.name,
                }).link;
                editLinkBySoftwareId[software.id] = routes.form({
                    "softwareId": software.id,
                }).link;
                parentSoftwareBySoftwareId[software.id] =
                    software.parentSoftware === undefined
                        ? undefined
                        : (() => {
                              const { parentSoftware } = software;

                              let name: string;
                              let link: Link | undefined;

                              if (parentSoftware.isKnown) {
                                  name =
                                      softwareNameBySoftwareId[parentSoftware.softwareId];
                                  link = routes.card({ name }).link;
                              } else {
                                  name = parentSoftware.softwareName;
                                  link = undefined;
                              }

                              return { name, link };
                          })();
            });

            return {
                openLinkBySoftwareId,
                editLinkBySoftwareId,
                parentSoftwareBySoftwareId,
            };
        }, [readyState?.softwares, softwareNameBySoftwareId]);

    const onLogin = useConstCallback(() => {
        assert(!userAuthenticationThunks.getIsUserLoggedIn());
        userAuthenticationThunks.login({ "doesCurrentHrefRequiresAuth": false });
    });

    const getFormLink = useConst(() =>
        memoize((softwareId: number | undefined) => routes.form({ softwareId }).link),
    );

    const onSelectedTagsChange = useConstCallback<
        CatalogCardsProps["onSelectedTagsChange"]
    >(tags =>
        routes
            .catalog({
                "q":
                    pure.catalog.stringifyQuery({
                        search,
                        tags,
                    }) || undefined,
            })
            .push(),
    );

    if (readyState === undefined) {
        return null;
    }

    assert(alikeSoftwares !== undefined);
    assert(filteredSoftwares !== undefined);
    assert(openLinkBySoftwareId !== undefined);
    assert(editLinkBySoftwareId !== undefined);
    assert(searchResultCount !== undefined);
    assert(parentSoftwareBySoftwareId !== undefined);

    const { search, tags: selectedTags } = pure.catalog.parseQuery(route.params.q);

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
                        search={search}
                        selectedTags={selectedTags}
                        tags={readyState.tags}
                        onSearchChange={onSearchChange}
                        onSelectedTagsChange={onSelectedTagsChange}
                        filteredSoftwares={filteredSoftwares}
                        alikeSoftwares={alikeSoftwares}
                        referentsBySoftwareId={readyState.referentsBySoftwareId}
                        openLinkBySoftwareId={openLinkBySoftwareId}
                        parentSoftwareBySoftwareId={parentSoftwareBySoftwareId}
                        editLinkBySoftwareId={editLinkBySoftwareId}
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
    | "header text1"
    | "header text2"
    | { K: "what is the SILL"; P: { href: string }; R: JSX.Element }
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
    };
});
