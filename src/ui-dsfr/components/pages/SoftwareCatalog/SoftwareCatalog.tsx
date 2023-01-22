import React, { useEffect, useTransition } from "react";
import { createGroup } from "type-route";
import type { Route } from "type-route";
import { createUseDebounce } from "powerhooks/useDebounce";
import { routes } from "ui-dsfr/routes";
import { selectors, useCoreState, useCoreFunctions } from "core-dsfr";
import { SoftwareCatalogControlled } from "./SoftwareCatalogControlled";
import { Props as SoftwareCatalogControlledProps } from "./SoftwareCatalogControlled";
import { useConstCallback } from "powerhooks/useConstCallback";

SoftwareCatalog.routeGroup = createGroup([routes.catalog]);

type PageRoute = Route<typeof SoftwareCatalog.routeGroup>;

SoftwareCatalog.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

const { useDebounce } = createUseDebounce({ "delay": 400 });

export function SoftwareCatalog(props: Props) {
    const { className, route } = props;

    const { softwareCatalog } = useCoreFunctions();

    const { softwares } = useCoreState(selectors.softwareCatalog.softwares);
    const { organizationFilterOptions } = useCoreState(
        selectors.softwareCatalog.organizationFilterOptions,
    );
    const { categoryFilterOptions } = useCoreState(
        selectors.softwareCatalog.categoryFilterOptions,
    );
    const { environmentFilterOptions } = useCoreState(
        selectors.softwareCatalog.environmentFilterOptions,
    );
    const { prerogativeFilterOptions } = useCoreState(
        selectors.softwareCatalog.prerogativeFilterOptions,
    );

    const [, startTransition] = useTransition();

    const onSortIdChange = useConstCallback<
        SoftwareCatalogControlledProps["onSortIdChange"]
    >(sort =>
        startTransition(() =>
            routes
                .catalog({
                    ...route.params,
                    sort,
                })
                .replace(),
        ),
    );

    const onSearchChange = useConstCallback<
        SoftwareCatalogControlledProps["onSearchChange"]
    >(search =>
        startTransition(() =>
            routes
                .catalog({
                    ...route.params,
                    search,
                })
                .replace(),
        ),
    );

    useDebounce(
        () =>
            softwareCatalog.updateFilter({
                "key": "search",
                "value": route.params.search,
            }),
        [route.params.search],
    );

    const onOrganizationFilterChange = useConstCallback<
        SoftwareCatalogControlledProps["onOrganizationFilterChange"]
    >(organization =>
        startTransition(() =>
            routes
                .catalog({
                    ...route.params,
                    organization,
                })
                .replace(),
        ),
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "organizationFilter",
            "value": route.params.organization,
        });
    }, [route.params.organization]);

    const onCategoryFilterChange = useConstCallback<
        SoftwareCatalogControlledProps["onCategoryFilterChange"]
    >(category =>
        startTransition(() =>
            routes
                .catalog({
                    ...route.params,
                    category,
                })
                .replace(),
        ),
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "categoryFilter",
            "value": route.params.category,
        });
    }, [route.params.category]);

    const onEnvironmentFilterChange = useConstCallback<
        SoftwareCatalogControlledProps["onEnvironmentFilterChange"]
    >(environment =>
        startTransition(() =>
            routes
                .catalog({
                    ...route.params,
                    environment,
                })
                .replace(),
        ),
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "environmentFilter",
            "value": route.params.environment,
        });
    }, [route.params.environment]);

    const onPrerogativesFilterChange = useConstCallback<
        SoftwareCatalogControlledProps["onPrerogativesFilterChange"]
    >(prerogatives =>
        startTransition(() =>
            routes
                .catalog({
                    ...route.params,
                    prerogatives,
                })
                .replace(),
        ),
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "prerogativesFilter",
            "value": route.params.prerogatives,
        });
    }, [route.params.prerogatives]);

    return (
        <SoftwareCatalogControlled
            className={className}
            softwares={softwares}
            sortId={route.params.sort}
            onSortIdChange={onSortIdChange}
            search={route.params.search}
            onSearchChange={onSearchChange}
            organizationFilterOptions={organizationFilterOptions}
            organizationFilter={route.params.organization}
            onOrganizationFilterChange={onOrganizationFilterChange}
            categoryFilerOptions={categoryFilterOptions}
            categoryFilter={route.params.category}
            onCategoryFilterChange={onCategoryFilterChange}
            environmentFilterOptions={environmentFilterOptions}
            environmentFilter={route.params.environment}
            onEnvironmentFilterChange={onEnvironmentFilterChange}
            prerogativesFilterOptions={prerogativeFilterOptions}
            prerogativesFilter={route.params.prerogatives}
            onPrerogativesFilterChange={onPrerogativesFilterChange}
        />
    );
}
