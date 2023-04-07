import { useEffect, useTransition, useMemo } from "react";
import { createUseDebounce } from "powerhooks/useDebounce";
import { routes } from "ui/routes";
import { selectors, useCoreState, useCoreFunctions, useCoreEvts } from "core";
import { SoftwareCatalogControlled } from "ui/pages/softwareCatalog/SoftwareCatalogControlled";
import { useConstCallback } from "powerhooks/useConstCallback";
import { type PageRoute } from "./route";
import { useEvt } from "evt/hooks";
import { type Param0 } from "tsafe";

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

    const { sortOptions } = useCoreState(selectors.softwareCatalog.sortOptions);

    const { evtSoftwareCatalog } = useCoreEvts();

    const [, startTransition] = useTransition();

    //TODO: Submit an issue to type route, we shouldn't have to do this
    // This function could be removed it would still work but the url would be
    // less clean
    const updateRouteParams = useConstCallback(
        (params: Param0<(typeof routes)["softwareCatalog"]>) => {
            if (params.search === "") {
                delete params.search;
            }

            //TODO: Duplicated source of truth!
            if (params.sort === "referent_count") {
                delete params.sort;
            }

            if (params.prerogatives?.length === 0) {
                delete params.prerogatives;
            }

            return routes.softwareCatalog(params);
        }
    );

    {
        const getRoutParams = useConstCallback(() => route.params);

        useEvt(
            ctx => {
                evtSoftwareCatalog.attach(
                    ({ action }) => action === "change sort",
                    ctx,
                    ({ sort }) =>
                        startTransition(() => {
                            updateRouteParams({
                                ...getRoutParams(),
                                sort
                            }).replace();
                        })
                );
            },
            [evtSoftwareCatalog]
        );
    }

    useDebounce(
        () =>
            softwareCatalog.updateFilter({
                "key": "search",
                "value": route.params.search
            }),
        [route.params.search]
    );

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "sort",
            "value": route.params.sort?.length ? route.params.sort : undefined
        });
    }, [route.params.sort]);

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "organization",
            "value": route.params.organization?.length
                ? route.params.organization
                : undefined
        });
    }, [route.params.organization]);

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "category",
            "value": route.params.category?.length ? route.params.category : undefined
        });
    }, [route.params.category]);

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "environment",
            "value": route.params.environment?.length
                ? route.params.environment
                : undefined
        });
    }, [route.params.environment]);

    useEffect(() => {
        softwareCatalog.updateFilter({
            "key": "prerogatives",
            "value": route.params.prerogatives
        });
    }, [route.params.prerogatives]);

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

    return (
        <SoftwareCatalogControlled
            className={className}
            softwares={softwares}
            linksBySoftwareName={linksBySoftwareName}
            sortOptions={sortOptions}
            sort={route.params.sort}
            onSortChange={sort =>
                startTransition(() =>
                    updateRouteParams({ ...route.params, sort }).replace()
                )
            }
            search={route.params.search}
            onSearchChange={search =>
                startTransition(() =>
                    updateRouteParams({ ...route.params, search }).replace()
                )
            }
            organizationOptions={organizationOptions}
            organization={route.params.organization}
            onOrganizationChange={organization =>
                startTransition(() =>
                    updateRouteParams({ ...route.params, organization }).replace()
                )
            }
            categoryFilerOptions={categoryOptions}
            category={route.params.category}
            onCategoryFilterChange={category =>
                startTransition(() =>
                    updateRouteParams({ ...route.params, category }).replace()
                )
            }
            environmentOptions={environmentOptions}
            environment={route.params.environment}
            onEnvironmentChange={environment =>
                startTransition(() =>
                    updateRouteParams({ ...route.params, environment }).replace()
                )
            }
            prerogativesOptions={prerogativeFilterOptions}
            prerogatives={route.params.prerogatives}
            onPrerogativesChange={prerogatives =>
                startTransition(() =>
                    updateRouteParams({ ...route.params, prerogatives }).replace()
                )
            }
            onResetFilters={() =>
                startTransition(() =>
                    updateRouteParams({
                        ...route.params,
                        "organization": undefined,
                        "category": undefined,
                        "environment": undefined,
                        "prerogatives": []
                    }).replace()
                )
            }
        />
    );
}
