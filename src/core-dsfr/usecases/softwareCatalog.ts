import type { ThunkAction, State as RootState } from "../setup";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture/tools/createObjectThatThrowsIfAccessed";
import type { PayloadAction } from "@reduxjs/toolkit";
import { objectKeys } from "tsafe/objectKeys";
import memoize from "memoizee";
import { id } from "tsafe/id";

export type SoftwareCatalogState = {
    softwares: SoftwareCatalogState.Software.Internal[];

    search: string;
    sortId: SoftwareCatalogState.SortId | undefined;
    /** Used in organizations: E.g: DINUM */
    organizationFilter: string | undefined;
    /** E.g: JavaScript */
    categoryFilter: string | undefined;
    environmentFilter: SoftwareCatalogState.Environment | undefined;
    prerogativesFilter: SoftwareCatalogState.Prerogative[];
};

export namespace SoftwareCatalogState {
    const sortIds = [
        "added time",
        "update time",
        "last version publication date",
        "user count",
        "referent count",
        "user count ASC",
        "referent count ASC",
    ] as const;

    export type SortId = typeof sortIds[number];

    const environments = ["linux", "windows", "mac", "browser", "smartphone"] as const;

    export type Environment = typeof environments[number];

    const prerogatives = [
        "isInstallableOnUserTerminal",
        "isPresentInSupportContract",
        "isFromFrenchPublicServices",
        "doRespectRgaa",
    ] as const;

    export type Prerogative = typeof prerogatives[number];

    export namespace Software {
        type Common = {
            softwareId: number;
            logoUrl: string | undefined;
            softwareName: string;
            softwareDescriptions: string;
            lastVersion:
                | {
                      semVer: string;
                      publicationTime: number;
                  }
                | undefined;
            referentsCount: number;
            userCounts: number;
            isPresentInSupportContract: boolean;
            isFromFrenchPublicService: boolean;
            doRespectRgaa: boolean;
            addedTime: number;
            updateTime: number;
            parentSoftware:
                | {
                      softwareName: string;
                      softwareId: string;
                  }
                | undefined;
            testUrl: string;
        };

        export type External = Common & {
            prerogatives: Record<Prerogative, boolean>;
        };

        export type Internal = Common & {
            categories: string[];
            organizations: string[];
            environments: Record<Environment, boolean>;
            //NOTE: We can deduce if it's installable on user terminal by looking at the environments
            prerogatives: Record<
                Exclude<Prerogative, "isInstallableOnUserTerminal">,
                boolean
            >;
        };
    }
}

export const name = "softwareCatalog" as const;

export type ChangeValueParams<K extends ChangeValueParams.Key = ChangeValueParams.Key> = {
    key: K;
    value: SoftwareCatalogState[K];
};

export namespace ChangeValueParams {
    export type Key = keyof Omit<SoftwareCatalogState, "softwares">;
}

export const { reducer, actions } = createSlice({
    name,
    "initialState": createObjectThatThrowsIfAccessed<SoftwareCatalogState>(),
    "reducers": {
        "initialized": (
            _state,
            {
                payload,
            }: PayloadAction<{ softwares: SoftwareCatalogState.Software.Internal[] }>,
        ) => {
            const { softwares } = payload;

            return {
                softwares,
                "search": "",
                "sortId": undefined,
                "organizationFilter": undefined,
                "categoryFilter": undefined,
                "environmentFilter": undefined,
                "prerogativesFilter": [],
            };
        },
        "valueUpdated": (state, { payload }: PayloadAction<ChangeValueParams>) => {
            const { key, value } = payload;

            (state as any)[key] = value;
        },
    },
});

export const thunks = {
    "updateFilter":
        <K extends ChangeValueParams.Key>(
            params: ChangeValueParams<K>,
        ): ThunkAction<void> =>
        (...args) => {
            const [dispatch] = args;
            dispatch(actions.valueUpdated(params));
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, , {}] = args;

            dispatch(
                actions.initialized({
                    "softwares": [],
                }),
            );
        },
};

export const selectors = (() => {
    const internalSoftwares = (rootState: RootState) =>
        rootState.softwareCatalog.softwares;
    const search = (rootState: RootState) => rootState.softwareCatalog.search;
    const sortId = (rootState: RootState) => rootState.softwareCatalog.sortId;
    const organizationFilter = (rootState: RootState) =>
        rootState.softwareCatalog.organizationFilter;
    const categoryFilter = (rootState: RootState) =>
        rootState.softwareCatalog.categoryFilter;
    const environmentFilter = (rootState: RootState) =>
        rootState.softwareCatalog.environmentFilter;
    const prerogativesFilter = (rootState: RootState) =>
        rootState.softwareCatalog.prerogativesFilter;

    function internalSoftwareToExternalSoftware(
        software: SoftwareCatalogState.Software.Internal,
    ) {
        return null as any as SoftwareCatalogState.Software.External;
    }

    const { filterBySearch } = (() => {
        const filterBySearchMemoized = memoize(
            (softwares: SoftwareCatalogState.Software.Internal[], search: string) => {
                return null as any as Set<number>;
            },
            { "max": 1 },
        );

        function filterBySearch(params: {
            softwares: SoftwareCatalogState.Software.Internal[];
            search: string;
        }) {
            const { softwares, search } = params;

            const softwareIds = filterBySearchMemoized(softwares, search);

            return softwares.filter(({ softwareId }) => softwareIds.has(softwareId));
        }

        return { filterBySearch };
    })();

    function filterByOrganization(params: {
        softwares: SoftwareCatalogState.Software.Internal[];
        organization: string;
    }) {
        const { softwares, organization } = params;

        return softwares.filter(({ organizations }) =>
            organizations.includes(organization),
        );
    }

    function filterByCategory(params: {
        softwares: SoftwareCatalogState.Software.Internal[];
        category: string;
    }) {
        const { softwares, category } = params;

        return softwares.filter(({ categories }) => categories.includes(category));
    }

    function filterByEnvironnement(params: {
        softwares: SoftwareCatalogState.Software.Internal[];
        environment: SoftwareCatalogState.Environment;
    }) {
        const { softwares, environment } = params;

        return softwares.filter(({ environments }) => environments[environment]);
    }

    function filterByPrerogative(params: {
        softwares: SoftwareCatalogState.Software.Internal[];
        prerogative: SoftwareCatalogState.Prerogative;
    }) {
        const { softwares, prerogative } = params;

        return softwares.filter(
            software =>
                internalSoftwareToExternalSoftware(software).prerogatives[prerogative],
        );
    }

    const softwares = createSelector(
        internalSoftwares,
        search,
        sortId,
        organizationFilter,
        categoryFilter,
        environmentFilter,
        prerogativesFilter,
        (
            internalSoftwares,
            search,
            sortId,
            organizationFilter,
            categoryFilter,
            environmentFilter,
            prerogativesFilter,
        ) => {
            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search,
                });
            }

            if (organizationFilter !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organizationFilter,
                });
            }

            if (categoryFilter !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": categoryFilter,
                });
            }

            if (environmentFilter !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environmentFilter,
                });
            }

            for (const prerogative of prerogativesFilter) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative,
                });
            }

            tmpSoftwares.sort(
                (() => {
                    switch (sortId) {
                        case "added time":
                            return null as any;
                        case "last version publication date":
                            return null as any;
                        case "referent count":
                            return null as any;
                        case "referent count ASC":
                            return null as any;
                        case "update time":
                            return null as any;
                        case "user count":
                            return null as any;
                        case "user count ASC":
                            return null as any;
                    }
                })(),
            );

            return tmpSoftwares.map(internalSoftwareToExternalSoftware);
        },
    );

    const organizationFilterOptions = createSelector(
        internalSoftwares,
        search,
        categoryFilter,
        environmentFilter,
        prerogativesFilter,
        (
            internalSoftwares,
            search,
            categoryFilter,
            environmentFilter,
            prerogativesFilter,
        ): { organization: string; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByOrganization = Object.fromEntries(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ organizations }) => organizations)
                            .reduce((prev, curr) => [...prev, ...curr], []),
                    ),
                ).map(organization => [organization, 0]),
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search,
                });
            }

            if (categoryFilter !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": categoryFilter,
                });
            }

            if (environmentFilter !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environmentFilter,
                });
            }

            for (const prerogative of prerogativesFilter) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative,
                });
            }

            tmpSoftwares.forEach(({ organizations }) =>
                organizations.forEach(
                    organization =>
                        softwareCountInCurrentFilterByOrganization[organization]++,
                ),
            );

            return Object.entries(softwareCountInCurrentFilterByOrganization)
                .map(([organization, softwareCount]) => ({
                    organization,
                    softwareCount,
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        },
    );

    const categoryFilterOptions = createSelector(
        internalSoftwares,
        search,
        organizationFilter,
        environmentFilter,
        prerogativesFilter,
        (
            internalSoftwares,
            search,
            organizationFilter,
            environmentFilter,
            prerogativesFilter,
        ): { category: string; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByCategory = Object.fromEntries(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ categories }) => categories)
                            .reduce((prev, curr) => [...prev, ...curr], []),
                    ),
                ).map(category => [category, 0]),
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search,
                });
            }

            if (organizationFilter !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organizationFilter,
                });
            }

            if (environmentFilter !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environmentFilter,
                });
            }

            for (const prerogative of prerogativesFilter) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative,
                });
            }

            tmpSoftwares.forEach(({ categories }) =>
                categories.forEach(
                    category => softwareCountInCurrentFilterByCategory[category]++,
                ),
            );

            return Object.entries(softwareCountInCurrentFilterByCategory)
                .map(([category, softwareCount]) => ({
                    category,
                    softwareCount,
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        },
    );

    const environmentFilterOptions = createSelector(
        internalSoftwares,
        search,
        organizationFilter,
        categoryFilter,
        prerogativesFilter,
        (
            internalSoftwares,
            search,
            organizationFilter,
            categoryFilter,
            prerogativesFilter,
        ): { environment: SoftwareCatalogState.Environment; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByEnvironment = new Map(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ environments }) =>
                                objectKeys(environments).filter(
                                    environment => environments[environment],
                                ),
                            )
                            .reduce((prev, curr) => [...prev, ...curr], []),
                    ),
                ).map(environment => [environment, id<number>(0)] as const),
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search,
                });
            }

            if (organizationFilter !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organizationFilter,
                });
            }

            if (categoryFilter !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": categoryFilter,
                });
            }

            for (const prerogative of prerogativesFilter) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative,
                });
            }

            tmpSoftwares.forEach(({ environments }) =>
                objectKeys(environments)
                    .filter(environment => environments[environment])
                    .forEach(environment =>
                        softwareCountInCurrentFilterByEnvironment.set(
                            environment,
                            softwareCountInCurrentFilterByEnvironment.get(environment)! +
                                1,
                        ),
                    ),
            );

            return Array.from(softwareCountInCurrentFilterByEnvironment.entries())
                .map(([environment, softwareCount]) => ({
                    environment,
                    softwareCount,
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        },
    );

    const prerogativeFilterOptions = createSelector(
        internalSoftwares,
        search,
        organizationFilter,
        categoryFilter,
        environmentFilter,
        (
            internalSoftwares,
            search,
            organizationFilter,
            categoryFilter,
            environmentFilter,
        ): { prerogative: SoftwareCatalogState.Prerogative; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByPrerogative = new Map(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ prerogatives }) =>
                                objectKeys(prerogatives).filter(
                                    prerogative => prerogatives[prerogative],
                                ),
                            )
                            .reduce((prev, curr) => [...prev, ...curr], []),
                    ),
                ).map(prerogative => [prerogative, id<number>(0)] as const),
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search,
                });
            }

            if (organizationFilter !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organizationFilter,
                });
            }

            if (categoryFilter !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": categoryFilter,
                });
            }

            if (environmentFilter !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environmentFilter,
                });
            }

            tmpSoftwares.forEach(({ prerogatives }) =>
                objectKeys(prerogatives)
                    .filter(prerogative => prerogatives[prerogative])
                    .forEach(prerogative =>
                        softwareCountInCurrentFilterByPrerogative.set(
                            prerogative,
                            softwareCountInCurrentFilterByPrerogative.get(prerogative)! +
                                1,
                        ),
                    ),
            );

            return Array.from(softwareCountInCurrentFilterByPrerogative.entries())
                .map(([prerogative, softwareCount]) => ({
                    prerogative,
                    softwareCount,
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        },
    );

    return {
        softwares,
        organizationFilterOptions,
        categoryFilterOptions,
        environmentFilterOptions,
        prerogativeFilterOptions,
    };
})();
