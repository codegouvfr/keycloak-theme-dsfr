import { useEffect, useTransition, useMemo } from "react";
import { createUseDebounce } from "powerhooks/useDebounce";
import { routes } from "ui/routes";
import { selectors, useCoreState, useCoreFunctions } from "core";
import { SoftwareCatalogControlled } from "./SoftwareCatalogControlled";
import { Props as SoftwareCatalogControlledProps } from "./SoftwareCatalogControlled";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { PageRoute } from "./route";

type Props = {
    className?: string;
    route: PageRoute;
};

const { useDebounce } = createUseDebounce({ "delay": 400 });

export default function SoftwareCatalog(props: Props) {
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

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "sort",
            "value": route.params.sort?.length ? route.params.sort : undefined
        });
    }, [route.params.sort]);

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
            "value": route.params.organization?.length
                ? route.params.organization
                : undefined
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
            "value": route.params.category?.length ? route.params.category : undefined
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
            "value": route.params.environment?.length
                ? route.params.environment
                : undefined
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

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "referentCount",
            "value": route.params.referentCount
        });
    }, [route.params.referentCount]);

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
