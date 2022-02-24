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
import { useElementEvt } from "evt/hooks/useElementEvt";
import { Evt } from "evt";

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

    useElementEvt(
        ({ ctx, element }) =>
            Evt.from(ctx, element, "scroll").attach(() => {
                const { scrollTop, clientHeight, scrollHeight } = element;

                console.log(
                    JSON.stringify(
                        {
                            scrollTop,
                            clientHeight,
                            scrollHeight,
                            "scrollTop + clientHeight - scrollHeight":
                                scrollTop + clientHeight - scrollHeight,
                            "scrollTop + clientHeight === scrollHeight":
                                scrollTop + clientHeight === scrollHeight,
                        },
                        null,
                        2,
                    ),
                );

                if (scrollTop + clientHeight === scrollHeight) {
                    console.log("load more");
                    catalogExplorerThunks.loadMore();
                }
            }),
        scrollableDivRef,
        [catalogExplorerThunks],
    );

    if (catalogExplorerState.stateDescription !== "ready") {
        return null;
    }

    assert(filteredSoftwares !== undefined);

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                classes={{ "title": css({ "paddingBottom": 3 }) }}
                mainIcon="catalog"
                title={t("header text1")}
                helpTitle={t("header text2")}
                helpContent={"TODO"}
                helpIcon="sentimentSatisfied"
                titleCollapseParams={titleCollapseParams}
                helpCollapseParams={helpCollapseParams}
            />
            <div className={classes.bodyWrapper}>
                <CatalogCards
                    search={route.params.search}
                    onSearchChange={onSearchChange}
                    className={className}
                    softwares={filteredSoftwares}
                    scrollableDivRef={scrollableDivRef}
                />
            </div>
        </div>
    );
}
export declare namespace Catalog {
    export type I18nScheme = {
        "header text1": undefined;
        "header text2": undefined;
    };
}

const useStyles = makeStyles({ "name": { Catalog } })({
    "root": {
        "height": "100%",
        "display": "flex",
        "flexDirection": "column",
    },
    "bodyWrapper": {
        "flex": 1,
        "overflow": "hidden",
    },
});
