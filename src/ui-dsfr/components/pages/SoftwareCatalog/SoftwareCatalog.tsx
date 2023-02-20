import { useEffect, useTransition, useMemo } from "react";
import { createGroup } from "type-route";
import type { Route } from "type-route";
import { createUseDebounce } from "powerhooks/useDebounce";
import { routes } from "ui-dsfr/routes";
import { selectors, useCoreState, useCoreFunctions } from "core-dsfr";
import { SoftwareCatalogControlled } from "./SoftwareCatalogControlled";
import { Props as SoftwareCatalogControlledProps } from "./SoftwareCatalogControlled";
import { useConstCallback } from "powerhooks/useConstCallback";

SoftwareCatalog.routeGroup = createGroup([routes.softwareCatalog]);

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
    const { organizationOptions } = useCoreState(
        selectors.softwareCatalog.organizationOptions
    );
    const { categoryOptions } = useCoreState(selectors.softwareCatalog.categoryOptions);
    const { environmentOptions } = useCoreState(
        selectors.softwareCatalog.environmentOptions
    );
    const { prerogativeFilterOptions } = useCoreState(
        selectors.softwareCatalog.prerogativeFilterOptions
    );

    const linksBySoftwareName = useMemo(
        () =>
            Object.fromEntries(
                softwares.map(({ softwareName }) => [
                    softwareName,
                    {
                        "softwareDetails": routes.softwareDetails({
                            "name": softwareName
                        }).link,
                        "declareUsageForm": routes.declarationForm({
                            "name": softwareName
                        }).link
                    }
                ])
            ),
        [softwares]
    );

    const [, startTransition] = useTransition();

    const onSortChange = useConstCallback<SoftwareCatalogControlledProps["onSortChange"]>(
        sort =>
            startTransition(() =>
                routes
                    .softwareCatalog({
                        ...route.params,
                        sort
                    })
                    .replace()
            )
    );

    const onSearchChange = useConstCallback<
        SoftwareCatalogControlledProps["onSearchChange"]
    >(search =>
        startTransition(() =>
            routes
                .softwareCatalog({
                    ...route.params,
                    search
                })
                .replace()
        )
    );

    useDebounce(
        () =>
            softwareCatalog.updateFilter({
                "key": "search",
                "value": route.params.search
            }),
        [route.params.search]
    );

    const onOrganizationChange = useConstCallback<
        SoftwareCatalogControlledProps["onOrganizationChange"]
    >(organization =>
        startTransition(() =>
            routes
                .softwareCatalog({
                    ...route.params,
                    organization
                })
                .replace()
        )
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "organization",
            "value": route.params.organization
        });
    }, [route.params.organization]);

    const onCategoryFilterChange = useConstCallback<
        SoftwareCatalogControlledProps["onCategoryFilterChange"]
    >(category =>
        startTransition(() =>
            routes
                .softwareCatalog({
                    ...route.params,
                    category
                })
                .replace()
        )
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "category",
            "value": route.params.category
        });
    }, [route.params.category]);

    const onEnvironmentChange = useConstCallback<
        SoftwareCatalogControlledProps["onEnvironmentChange"]
    >(environment =>
        startTransition(() =>
            routes
                .softwareCatalog({
                    ...route.params,
                    environment
                })
                .replace()
        )
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "environment",
            "value": route.params.environment
        });
    }, [route.params.environment]);

    const onPrerogativesChange = useConstCallback<
        SoftwareCatalogControlledProps["onPrerogativesChange"]
    >(prerogatives =>
        startTransition(() =>
            routes
                .softwareCatalog({
                    ...route.params,
                    prerogatives
                })
                .replace()
        )
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "prerogatives",
            "value": route.params.prerogatives
        });
    }, [route.params.prerogatives]);

    return (
        <SoftwareCatalogControlled
            className={className}
            softwares={softwares}
            linksBySoftwareName={linksBySoftwareName}
            sort={route.params.sort}
            onSortChange={onSortChange}
            search={route.params.search}
            onSearchChange={onSearchChange}
            organizationOptions={organizationOptions}
            organization={route.params.organization}
            onOrganizationChange={onOrganizationChange}
            categoryFilerOptions={categoryOptions}
            category={route.params.category}
            onCategoryFilterChange={onCategoryFilterChange}
            environmentOptions={environmentOptions}
            environment={route.params.environment}
            onEnvironmentChange={onEnvironmentChange}
            prerogativesOptions={prerogativeFilterOptions}
            prerogatives={route.params.prerogatives}
            onPrerogativesChange={onPrerogativesChange}
        />
    );
}
