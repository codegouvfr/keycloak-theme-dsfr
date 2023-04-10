import { useEffect, useTransition, useMemo } from "react";
import { createUseDebounce } from "powerhooks/useDebounce";
import { routes } from "ui/routes";
import { selectors, useCoreState, useCoreFunctions, useCoreEvts } from "core";
import { SoftwareCatalogControlled } from "ui/pages/softwareCatalog/SoftwareCatalogControlled";
import { useConstCallback } from "powerhooks/useConstCallback";
import { type PageRoute } from "./route";
import { useEvt } from "evt/hooks";
import { type Param0 } from "tsafe";
import { useConst } from "powerhooks/useConst";
import { id } from "tsafe/id";

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

    //TODO: Submit an issue to type route, this should be built in.
    const { updateRouteParams } = (function useClosure() {
        const refParams = useConst(() => ({
            "ref": id<Param0<(typeof routes)["softwareCatalog"]>>(route.params)
        }));

        const updateRouteParams = useConstCallback(
            (paramsToUpdate: (typeof refParams)["ref"]) => {
                const params = { ...refParams.ref, ...paramsToUpdate };

                if (params.search === "") {
                    delete params.search;
                }

                //WARNING: Duplicated source of truth with the route definition
                if (params.sort === "referent_count") {
                    delete params.sort;
                }

                if (params.prerogatives?.length === 0) {
                    delete params.prerogatives;
                }

                refParams.ref = params;

                return routes.softwareCatalog(params);
            }
        );

        return { updateRouteParams };
    })();

    useEvt(
        ctx => {
            evtSoftwareCatalog.attach(
                ({ action }) => action === "change sort",
                ctx,
                ({ sort }) =>
                    startTransition(() => {
                        updateRouteParams({
                            sort
                        }).replace();
                    })
            );
        },
        [evtSoftwareCatalog]
    );

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
        /* prettier-ignore */
        <SoftwareCatalogControlled
            className={className}
            softwares={softwares}
            linksBySoftwareName={linksBySoftwareName}
            sortOptions={sortOptions}
            sort={route.params.sort}
            onSortChange={sort => startTransition(() => updateRouteParams({ sort }).replace())}
            search={route.params.search}
            onSearchChange={search => updateRouteParams({ search }).replace()}
            organizationOptions={organizationOptions}
            organization={route.params.organization}
            onOrganizationChange={organization => startTransition(() => updateRouteParams({ organization }).replace())}
            categoryOptions={categoryOptions}
            category={route.params.category}
            onCategoryChange={category => startTransition(() => updateRouteParams({ category }).replace())}
            environmentOptions={environmentOptions}
            environment={route.params.environment}
            onEnvironmentChange={environment => startTransition(() => updateRouteParams({  environment }).replace())}
            prerogativesOptions={prerogativeFilterOptions}
            prerogatives={route.params.prerogatives}
            onPrerogativesChange={prerogatives => startTransition(() => updateRouteParams({ prerogatives }).replace())}
        />
    );
}
