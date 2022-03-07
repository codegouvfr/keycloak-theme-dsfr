import { useMemo, useEffect, useState } from "react";
import { createGroup } from "type-route";
import { useTranslation } from "ui/i18n/useTranslations";
import { makeStyles, PageHeader } from "ui/theme";
import type { CollapseParams } from "onyxia-ui/tools/CollapsibleWrapper";
import type { Props as CatalogExplorerCardsProps } from "./CatalogCards";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useSplashScreen } from "onyxia-ui";
import { useSelector, useThunks, selectors } from "ui/coreApi";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { CatalogCards } from "./CatalogCards";
import { SoftwareDetails } from "./SoftwareDetails";
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

    const { refSticky: pageHeaderRef, top: pageHeaderStickyTop } = useStickyTop();

    const { classes } = useStyles({ pageHeaderStickyTop });

    const titleCollapseParams = useMemo(
        (): CollapseParams => ({
            "behavior": "collapses on scroll",
            "scrollTopThreshold": 600,
        }),
        [],
    );

    const helpCollapseParams = useMemo(
        (): CollapseParams => ({
            "behavior": "collapses on scroll",
            "scrollTopThreshold": 300,
        }),
        [],
    );

    const catalogExplorerState = useSelector(state => state.catalogExplorer);

    const { catalogExplorerThunks } = useThunks();

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

    const catalogCardsSoftwares = useMemo(
        () =>
            filteredSoftwares?.map(software => ({
                software,
                "openLink": routes.catalogExplorer({
                    "search": route.params.search || undefined,
                    "softwareName": software.name,
                }).link,
            })),
        [filteredSoftwares],
    );

    const onGoBack = useConstCallback(() =>
        routes.catalogExplorer({ "search": route.params.search || undefined }).push(),
    );

    const pageHeaderClasses = useMemo(
        () => ({
            "root": classes.pageHeader,
            "title": classes.pageHeaderTitle,
        }),
        [classes.pageHeader, classes.pageHeaderTitle],
    );

    const { searchBarWrapperElement } = (function useClosure() {
        const [searchBarWrapperElement, setSearchBarWrapperElement] = useState<
            HTMLDivElement | undefined
        >();

        useEffect(() => {
            const pageHeaderElement = pageHeaderRef.current;

            if (pageHeaderElement === null) {
                return;
            }

            const searchBarWrapperElement = document.createElement("div");
            searchBarWrapperElement.className = "searchBar_portal";

            pageHeaderElement.appendChild(searchBarWrapperElement);

            setSearchBarWrapperElement(searchBarWrapperElement);
        }, [pageHeaderRef.current]);

        return { searchBarWrapperElement };
    })();

    if (catalogExplorerState.stateDescription !== "ready") {
        return null;
    }

    assert(catalogCardsSoftwares !== undefined);

    return (
        <div className={className}>
            <PageHeader
                ref={pageHeaderRef}
                classes={pageHeaderClasses}
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

                    return softwareName === undefined ? (
                        <>
                            {searchBarWrapperElement !== undefined && (
                                <CatalogCards
                                    search={route.params.search}
                                    onSearchChange={onSearchChange}
                                    softwares={catalogCardsSoftwares}
                                    onLoadMore={catalogExplorerThunks.loadMore}
                                    hasMoreToLoad={catalogExplorerThunks.getHasMoreToLoad()}
                                    searchBarWrapperElement={searchBarWrapperElement}
                                />
                            )}
                        </>
                    ) : (
                        (() => {
                            const software = catalogCardsSoftwares
                                .map(({ software }) => software)
                                .find(({ name }) => name === softwareName);

                            assert(software !== undefined);

                            return (
                                <SoftwareDetails
                                    software={software}
                                    onGoBack={onGoBack}
                                />
                            );
                        })()
                    );
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
})((theme, { pageHeaderStickyTop }) => ({
    "pageHeader": {
        "position": "sticky",
        "top": pageHeaderStickyTop,
        "backgroundColor": theme.colors.useCases.surfaces.background,
        "paddingLeft": theme.spacing(4),
        "marginBottom": 0,
    },
    "contentWrapper": {
        "marginLeft": theme.spacing(4),
    },
    "pageHeaderTitle": {
        "paddingBottom": 3,
    },
}));
