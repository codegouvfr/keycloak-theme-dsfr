/* eslint-disable array-callback-return */
import type { ThunkAction, State as RootState } from "../core";
import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createObjectThatThrowsIfAccessed } from "redux-clean-architecture/tools/createObjectThatThrowsIfAccessed";
import type { PayloadAction } from "@reduxjs/toolkit";
import { objectKeys } from "tsafe/objectKeys";
import memoize from "memoizee";
import { id } from "tsafe/id";
import { Fzf } from "fzf";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { createCompareFn } from "../tools/compareFn";
import { exclude } from "tsafe/exclude";
import type { ApiTypes } from "@codegouvfr/sill";

export type State = {
    softwares: State.Software.Internal[];
    search: string;
    sort: State.Sort | undefined;
    /** Used in organizations: E.g: DINUM */
    organization: string | undefined;
    /** E.g: JavaScript */
    category: string | undefined;
    environment: State.Environment | undefined;
    referentCount: number | undefined;
    prerogatives: State.Prerogative[];
};

export namespace State {
    export type Sort =
        | "added time"
        | "update time"
        | "last version publication date"
        | "user count"
        | "referent count"
        | "user count ASC"
        | "referent count ASC";

    export type Environment = "linux" | "windows" | "mac" | "browser" | "stack";

    export type Prerogative =
        | "isPresentInSupportContract"
        | "isFromFrenchPublicServices"
        | "doRespectRgaa"
        | "isInstallableOnUserTerminal"
        | "isTestable";

    export namespace Software {
        type Common = {
            logoUrl: string | undefined;
            softwareName: string;
            softwareDescription: string;
            lastVersion:
                | {
                      semVer: string;
                      publicationTime: number;
                  }
                | undefined;
            referentCount: number;
            userCount: number;
            parentSoftware:
                | ({ softwareName: string } & (
                      | { isInSill: true }
                      | { isInSill: false; url: string }
                  ))
                | undefined;
            testUrl: string | undefined;
        };

        export type External = Common & {
            prerogatives: Record<Prerogative, boolean>;
        };

        export type Internal = Common & {
            addedTime: number;
            updateTime: number;
            categories: string[];
            organizations: string[];
            prerogatives: Record<
                Exclude<Prerogative, "isInstallableOnUserTerminal" | "isTestable">,
                boolean
            >;
            softwareType: ApiTypes.SoftwareType;
            search: string;
        };
    }

    export type referentCount = number;
}

export const name = "softwareCatalog" as const;

export type UpdateFilterParams<
    K extends UpdateFilterParams.Key = UpdateFilterParams.Key
> = {
    key: K;
    value: State[K];
};

export namespace UpdateFilterParams {
    export type Key = keyof Omit<State, "softwares">;
}

export const { reducer, actions } = createSlice({
    name,
    "initialState": createObjectThatThrowsIfAccessed<State>(),
    //"initialState": {} as any as State,
    "reducers": {
        "initialized": (
            _state,
            { payload }: PayloadAction<{ softwares: State.Software.Internal[] }>
        ) => {
            const { softwares } = payload;

            return {
                softwares,
                "search": "",
                "sort": undefined,
                "organization": undefined,
                "category": undefined,
                "environment": undefined,
                "prerogatives": [],
                "referentCount": undefined
            };
        },
        "filterUpdated": (state, { payload }: PayloadAction<UpdateFilterParams>) => {
            const { key, value } = payload;

            (state as any)[key] = value;
        }
    }
});

export const thunks = {
    "updateFilter":
        <K extends UpdateFilterParams.Key>(
            params: UpdateFilterParams<K>
        ): ThunkAction<void> =>
        (...args) => {
            const [dispatch] = args;
            dispatch(actions.filterUpdated(params));
        }
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
        async (...args) => {
            const [dispatch, , { sillApi, evtAction }] = args;

            const initialize = async () => {
                const apiSoftwares = await sillApi.getSoftwares();

                const softwares = apiSoftwares.map(({ softwareName }) => {
                    const software = apiSoftwareToInternalSoftware({
                        apiSoftwares,
                        "softwareRef": {
                            "type": "name",
                            softwareName
                        }
                    });

                    assert(software !== undefined);

                    return software;
                });

                dispatch(actions.initialized({ softwares }));
            };

            initialize();

            evtAction.attach(
                action =>
                    (action.sliceName === "softwareForm" &&
                        action.actionName === "formSubmitted") ||
                    (action.sliceName === "declarationForm" &&
                        action.actionName === "formSubmitted"),
                () => initialize()
            );
        }
};

export const selectors = (() => {
    const internalSoftwares = (rootState: RootState) =>
        rootState.softwareCatalog.softwares;
    const search = (rootState: RootState) => rootState.softwareCatalog.search;
    const sort = (rootState: RootState) => rootState.softwareCatalog.sort;
    const organization = (rootState: RootState) => rootState.softwareCatalog.organization;
    const category = (rootState: RootState) => rootState.softwareCatalog.category;
    const environment = (rootState: RootState) => rootState.softwareCatalog.environment;
    const prerogatives = (rootState: RootState) => rootState.softwareCatalog.prerogatives;
    const referentCount = (rootState: RootState) =>
        rootState.softwareCatalog.referentCount;

    const { filterBySearch } = (() => {
        const getFzf = memoize(
            (softwares: State.Software.Internal[]) =>
                new Fzf(softwares, { "selector": ({ search }) => search }),
            { "max": 1 }
        );

        const filterBySearchMemoized = memoize(
            (softwares: State.Software.Internal[], search: string) =>
                new Set(
                    getFzf(softwares)
                        .find(search)
                        .map(({ item: { softwareName } }) => softwareName)
                ),
            { "max": 1 }
        );

        function filterBySearch(params: {
            softwares: State.Software.Internal[];
            search: string;
        }) {
            const { softwares, search } = params;

            const softwareIds = filterBySearchMemoized(softwares, search);

            return softwares.filter(({ softwareName }) => softwareIds.has(softwareName));
        }

        return { filterBySearch };
    })();

    function filterByOrganization(params: {
        softwares: State.Software.Internal[];
        organization: string;
    }) {
        const { softwares, organization } = params;

        return softwares.filter(({ organizations }) =>
            organizations.includes(organization)
        );
    }

    function filterByCategory(params: {
        softwares: State.Software.Internal[];
        category: string;
    }) {
        const { softwares, category } = params;

        return softwares.filter(({ categories }) => categories.includes(category));
    }

    function filterByEnvironnement(params: {
        softwares: State.Software.Internal[];
        environment: State.Environment;
    }) {
        const { softwares, environment } = params;

        return softwares.filter(({ softwareType }) => {
            switch (environment) {
                case "linux":
                case "mac":
                case "windows":
                    return (
                        softwareType.type === "desktop" && softwareType.os[environment]
                    );
                case "browser":
                    return softwareType.type === "cloud";
                case "stack":
                    return softwareType.type === "stack";
            }
        });
    }

    function filterByPrerogative(params: {
        softwares: State.Software.Internal[];
        prerogative: State.Prerogative;
    }) {
        const { softwares, prerogative } = params;

        return softwares.filter(
            software =>
                ({
                    ...internalSoftwareToExternalSoftware(software).prerogatives,
                    ...software.prerogatives,
                    "isTestable": software.testUrl !== undefined
                }[prerogative])
        );
    }

    function filterByReferentCount(params: {
        softwares: State.Software.Internal[];
        referentCount: State.referentCount;
    }) {
        const { softwares, referentCount } = params;

        return softwares.filter(software => software.referentCount === referentCount);
    }

    const softwares = createSelector(
        internalSoftwares,
        search,
        sort,
        organization,
        category,
        environment,
        prerogatives,
        referentCount,
        (
            internalSoftwares,
            search,
            sort,
            organization,
            category,
            environment,
            prerogatives,
            referentCount
        ) => {
            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search
                });
            }

            if (organization !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organization
                });
            }

            if (category !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": category
                });
            }

            if (environment !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environment
                });
            }

            for (const prerogative of prerogatives) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative
                });
            }

            if (referentCount !== undefined) {
                tmpSoftwares = filterByReferentCount({
                    "softwares": tmpSoftwares,
                    referentCount
                });
            }

            tmpSoftwares = [...tmpSoftwares].sort(
                (() => {
                    switch (sort ?? "last version publication date") {
                        case "added time":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software => software.addedTime,
                                "order": "descending"
                            });
                        case "update time":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software => software.updateTime,
                                "order": "descending"
                            });
                        case "last version publication date":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software =>
                                    software.lastVersion?.publicationTime ?? 0,
                                "order": "descending",
                                "tieBreaker": createCompareFn({
                                    "getWeight": software => software.updateTime,
                                    "order": "descending"
                                })
                            });
                        case "referent count":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software => software.referentCount,
                                "order": "descending"
                            });
                        case "referent count ASC":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software => software.referentCount,
                                "order": "ascending"
                            });
                        case "user count":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software => software.userCount,
                                "order": "descending"
                            });
                        case "user count ASC":
                            return createCompareFn<State.Software.Internal>({
                                "getWeight": software => software.userCount,
                                "order": "ascending"
                            });
                    }
                })()
            );

            return tmpSoftwares.map(internalSoftwareToExternalSoftware);
        }
    );

    const organizationOptions = createSelector(
        internalSoftwares,
        search,
        category,
        environment,
        prerogatives,
        (
            internalSoftwares,
            search,
            category,
            environment,
            prerogatives
        ): { organization: string; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByOrganization = Object.fromEntries(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ organizations }) => organizations)
                            .reduce((prev, curr) => [...prev, ...curr], [])
                    )
                ).map(organization => [organization, 0])
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search
                });
            }

            if (category !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": category
                });
            }

            if (environment !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environment
                });
            }

            for (const prerogative of prerogatives) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative
                });
            }

            tmpSoftwares.forEach(({ organizations }) =>
                organizations.forEach(
                    organization =>
                        softwareCountInCurrentFilterByOrganization[organization]++
                )
            );

            return Object.entries(softwareCountInCurrentFilterByOrganization)
                .map(([organization, softwareCount]) => ({
                    organization,
                    softwareCount
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        }
    );

    const categoryOptions = createSelector(
        internalSoftwares,
        search,
        organization,
        environment,
        prerogatives,
        (
            internalSoftwares,
            search,
            organization,
            environment,
            prerogatives
        ): { category: string; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByCategory = Object.fromEntries(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ categories }) => categories)
                            .reduce((prev, curr) => [...prev, ...curr], [])
                    )
                ).map(category => [category, 0])
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search
                });
            }

            if (organization !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organization
                });
            }

            if (environment !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environment
                });
            }

            for (const prerogative of prerogatives) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative
                });
            }

            tmpSoftwares.forEach(({ categories }) =>
                categories.forEach(
                    category => softwareCountInCurrentFilterByCategory[category]++
                )
            );

            return Object.entries(softwareCountInCurrentFilterByCategory)
                .map(([category, softwareCount]) => ({
                    category,
                    softwareCount
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        }
    );

    const environmentOptions = createSelector(
        internalSoftwares,
        search,
        organization,
        category,
        prerogatives,
        (
            internalSoftwares,
            search,
            organization,
            category,
            prerogatives
        ): { environment: State.Environment; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByEnvironment = new Map(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ softwareType }): State.Environment[] => {
                                switch (softwareType.type) {
                                    case "cloud":
                                        return ["browser"];
                                    case "stack":
                                        return ["stack" as const];
                                    case "desktop":
                                        return objectKeys(softwareType.os).filter(
                                            os => softwareType.os[os]
                                        );
                                }
                                assert(false);
                            })
                            .reduce((prev, curr) => [...prev, ...curr], [])
                    )
                ).map(environment => [environment, id<number>(0)] as const)
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search
                });
            }

            if (organization !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organization
                });
            }

            if (category !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": category
                });
            }

            for (const prerogative of prerogatives) {
                tmpSoftwares = filterByPrerogative({
                    "softwares": tmpSoftwares,
                    prerogative
                });
            }

            tmpSoftwares.forEach(({ softwareType }) => {
                switch (softwareType.type) {
                    case "cloud":
                        softwareCountInCurrentFilterByEnvironment.set(
                            "browser",
                            softwareCountInCurrentFilterByEnvironment.get("browser")! + 1
                        );
                        break;
                    case "stack":
                        softwareCountInCurrentFilterByEnvironment.set(
                            "stack",
                            softwareCountInCurrentFilterByEnvironment.get("stack")! + 1
                        );
                        break;
                    case "desktop":
                        objectKeys(softwareType.os)
                            .filter(os => softwareType.os[os])
                            .forEach(os =>
                                softwareCountInCurrentFilterByEnvironment.set(
                                    os,
                                    softwareCountInCurrentFilterByEnvironment.get(os)! + 1
                                )
                            );
                        break;
                }
            });

            return Array.from(softwareCountInCurrentFilterByEnvironment.entries())
                .map(([environment, softwareCount]) => ({
                    environment,
                    softwareCount
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        }
    );

    const prerogativeFilterOptions = createSelector(
        internalSoftwares,
        search,
        organization,
        category,
        environment,
        (
            internalSoftwares,
            search,
            organization,
            category,
            environment
        ): { prerogative: State.Prerogative; softwareCount: number }[] => {
            const softwareCountInCurrentFilterByPrerogative = new Map(
                Array.from(
                    new Set(
                        internalSoftwares
                            .map(({ prerogatives }) =>
                                objectKeys(prerogatives).filter(
                                    prerogative => prerogatives[prerogative]
                                )
                            )
                            .reduce((prev, curr) => [...prev, ...curr], [])
                    )
                ).map(prerogative => [prerogative, id<number>(0)] as const)
            );

            let tmpSoftwares = internalSoftwares;

            if (search !== "") {
                tmpSoftwares = filterBySearch({
                    "softwares": tmpSoftwares,
                    search
                });
            }

            if (organization !== undefined) {
                tmpSoftwares = filterByOrganization({
                    "softwares": tmpSoftwares,
                    "organization": organization
                });
            }

            if (category !== undefined) {
                tmpSoftwares = filterByCategory({
                    "softwares": tmpSoftwares,
                    "category": category
                });
            }

            if (environment !== undefined) {
                tmpSoftwares = filterByEnvironnement({
                    "softwares": tmpSoftwares,
                    "environment": environment
                });
            }

            tmpSoftwares.forEach(({ prerogatives }) =>
                objectKeys(prerogatives)
                    .filter(prerogative => prerogatives[prerogative])
                    .forEach(prerogative =>
                        softwareCountInCurrentFilterByPrerogative.set(
                            prerogative,
                            softwareCountInCurrentFilterByPrerogative.get(prerogative)! +
                                1
                        )
                    )
            );

            return Array.from(softwareCountInCurrentFilterByPrerogative.entries())
                .map(([prerogative, softwareCount]) => ({
                    prerogative,
                    softwareCount
                }))
                .sort((a, b) => a.softwareCount - b.softwareCount);
        }
    );

    return {
        softwares,
        organizationOptions,
        categoryOptions,
        environmentOptions,
        prerogativeFilterOptions
    };
})();

function apiSoftwareToInternalSoftware(params: {
    apiSoftwares: ApiTypes.Software[];
    softwareRef:
        | {
              type: "wikidataId";
              wikidataId: string;
          }
        | {
              type: "name";
              softwareName: string;
          };
}): State.Software.Internal | undefined {
    const { apiSoftwares, softwareRef } = params;

    const apiSoftware = apiSoftwares.find(apiSoftware => {
        switch (softwareRef.type) {
            case "name":
                return apiSoftware.softwareName === softwareRef.softwareName;
            case "wikidataId":
                return apiSoftware.wikidataId === softwareRef.wikidataId;
        }
    });

    if (apiSoftware === undefined) {
        return undefined;
    }

    const {
        softwareName,
        logoUrl,
        softwareDescription,
        lastVersion,
        parentSoftware: parentSoftwareWikidataRef,
        testUrl,
        addedTime,
        updateTime,
        categories,
        prerogatives,
        softwareType,
        userAndReferentCountByOrganization
    } = apiSoftware;

    assert<
        Equals<ApiTypes.Software["prerogatives"], State.Software.Internal["prerogatives"]>
    >();

    const parentSoftware: State.Software.Internal["parentSoftware"] = (() => {
        if (parentSoftwareWikidataRef === undefined) {
            return undefined;
        }

        in_sill: {
            const software = apiSoftwares.find(
                software => software.wikidataId === parentSoftwareWikidataRef.wikidataId
            );

            if (software === undefined) {
                break in_sill;
            }

            return {
                "softwareName": software.softwareName,
                "isInSill": true
            };
        }

        return {
            "isInSill": false,
            "softwareName": parentSoftwareWikidataRef.wikidataLabel,
            "url": `https://www.wikidata.org/wiki/${parentSoftwareWikidataRef.wikidataId}`
        };
    })();

    return {
        logoUrl,
        softwareName,
        softwareDescription,
        lastVersion,
        "referentCount": Object.values(userAndReferentCountByOrganization)
            .map(({ referentCount }) => referentCount)
            .reduce((prev, curr) => prev + curr, 0),
        "userCount": Object.values(userAndReferentCountByOrganization)
            .map(({ userCount }) => userCount)
            .reduce((prev, curr) => prev + curr, 0),
        testUrl,
        addedTime,
        updateTime,
        categories,
        "organizations": objectKeys(userAndReferentCountByOrganization),
        parentSoftware,
        softwareType,
        prerogatives,
        "search": [
            softwareName,
            softwareDescription,
            lastVersion?.semVer,
            categories.join(" "),
            parentSoftware === undefined
                ? undefined
                : apiSoftwareToInternalSoftware({
                      apiSoftwares,
                      "softwareRef": {
                          "type": "name",
                          "softwareName": parentSoftware.softwareName
                      }
                  })?.search
        ]
            .filter(exclude(undefined))
            .join(" ")
    };
}

function internalSoftwareToExternalSoftware(
    software: State.Software.Internal
): State.Software.External {
    const {
        logoUrl,
        softwareName,
        softwareDescription,
        lastVersion,
        referentCount,
        userCount,
        testUrl,
        addedTime,
        updateTime,
        categories,
        organizations,
        prerogatives: {
            isFromFrenchPublicServices,
            isPresentInSupportContract,
            doRespectRgaa
        },
        search,
        parentSoftware,
        softwareType,
        ...rest
    } = software;

    assert<Equals<typeof rest, {}>>();

    return {
        logoUrl,
        softwareName,
        softwareDescription,
        lastVersion,
        referentCount,
        userCount,
        testUrl,
        "prerogatives": {
            isFromFrenchPublicServices,
            isPresentInSupportContract,
            doRespectRgaa,
            "isInstallableOnUserTerminal": softwareType.type === "desktop",
            "isTestable": testUrl !== undefined
        },
        parentSoftware
    };
}

export function apiSoftwareToExternalCatalogSoftware(params: {
    apiSoftwares: ApiTypes.Software[];
    wikidataId: string;
}): State.Software.External | undefined {
    const { apiSoftwares, wikidataId } = params;

    const internalSoftware = apiSoftwareToInternalSoftware({
        apiSoftwares,
        "softwareRef": {
            "type": "wikidataId",
            wikidataId
        }
    });

    if (internalSoftware === undefined) {
        return undefined;
    }

    return internalSoftwareToExternalSoftware(internalSoftware);
}
