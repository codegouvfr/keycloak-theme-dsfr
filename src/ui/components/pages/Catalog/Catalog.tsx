import { useMemo, useRef, useEffect } from "react";
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

    const { classes, cx, css } = useStyles();

    const scrollableDivRef = useRef<HTMLDivElement>(null);

    const titleCollapseParams = useMemo(
        (): CollapseParams => ({
            "behavior": "collapses on scroll",
            "scrollTopThreshold": 600,
            "scrollableElementRef": scrollableDivRef,
        }),
        [],
    );

    const helpCollapseParams = useMemo(
        (): CollapseParams => ({
            "behavior": "collapses on scroll",
            "scrollTopThreshold": 300,
            "scrollableElementRef": scrollableDivRef,
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

    if (catalogExplorerState.stateDescription !== "ready") {
        return null;
    }

    assert(catalogCardsSoftwares !== undefined);

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                classes={{ "title": css({ "paddingBottom": 3 }) }}
                mainIcon="catalog"
                title={t("header text1")}
                helpTitle={t("header text2")}
                helpContent={t("header text3")}
                helpIcon="sentimentSatisfied"
                titleCollapseParams={titleCollapseParams}
                helpCollapseParams={helpCollapseParams}
            />
            <div className={classes.bodyWrapper}>
                {(() => {
                    const { softwareName } = route.params;

                    return softwareName === undefined ? (
                        <CatalogCards
                            search={route.params.search}
                            onSearchChange={onSearchChange}
                            className={className}
                            softwares={catalogCardsSoftwares}
                            scrollableDivRef={scrollableDivRef}
                            onLoadMore={catalogExplorerThunks.loadMore}
                            hasMoreToLoad={catalogExplorerThunks.getHasMoreToLoad()}
                        />
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

const useStyles = makeStyles({ "name": { Catalog } })({
    "root": {},
    "bodyWrapper": {},
});
