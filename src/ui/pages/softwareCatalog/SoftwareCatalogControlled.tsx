import { useRef, useLayoutEffect, useMemo, memo } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import type { State as SoftwareCatalogState } from "core/usecases/softwareCatalog";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { Link } from "type-route";
import { fr } from "@codegouvfr/react-dsfr";
import { SoftwareCatalogCard } from "ui/pages/softwareCatalog/SoftwareCatalogCard";
import { Search } from "ui/pages/softwareCatalog/Search";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { routes } from "ui/routes";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";
import { useBreakpointsValues } from "@codegouvfr/react-dsfr/useBreakpointsValues";

const sortOptions = [
    "added time",
    "update time",
    "last version publication date",
    "user count",
    "referent count",
    "user count ASC",
    "referent count ASC"
] as const;

assert<Equals<(typeof sortOptions)[number], SoftwareCatalogState.Sort>>();

export type Props = {
    className?: string;
    softwares: SoftwareCatalogState.Software.External[];
    linksBySoftwareName: Record<
        string,
        Record<"softwareDetails" | "declareUsageForm", Link>
    >;

    search: string;
    onSearchChange: (search: string) => void;

    sort: SoftwareCatalogState.Sort | undefined;
    onSortChange: (sort: SoftwareCatalogState.Sort | undefined) => void;

    organizationOptions: {
        organization: string;
        softwareCount: number;
    }[];
    organization: string | undefined;
    onOrganizationChange: (organization: string | undefined) => void;

    categoryFilerOptions: {
        category: string;
        softwareCount: number;
    }[];
    category: string | undefined;
    onCategoryFilterChange: (category: string | undefined) => void;

    environmentOptions: {
        environment: SoftwareCatalogState.Environment;
        softwareCount: number;
    }[];
    environment: SoftwareCatalogState.Environment | undefined;
    onEnvironmentChange: (
        environmentsFilter: SoftwareCatalogState.Environment | undefined
    ) => void;

    prerogativesOptions: {
        prerogative: SoftwareCatalogState.Prerogative;
        softwareCount: number;
    }[];
    prerogatives: SoftwareCatalogState.Prerogative[];
    onPrerogativesChange: (prerogatives: SoftwareCatalogState.Prerogative[]) => void;
    onResetFilters: () => void;
};

export const SoftwareCatalogControlled = memo((props: Props) => {
    const {
        className,
        softwares,
        linksBySoftwareName,
        search,
        onSearchChange,
        sort,
        onSortChange,
        organizationOptions,
        organization,
        onOrganizationChange,
        categoryFilerOptions,
        category,
        onCategoryFilterChange,
        environmentOptions,
        environment,
        onEnvironmentChange,
        prerogativesOptions,
        prerogatives,
        onPrerogativesChange,
        onResetFilters,
        ...rest
    } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();
    const { t } = useTranslation({ SoftwareCatalogControlled });

    const mappedSortOption: {
        [key in SoftwareCatalogState.Sort]: string;
    } = {
        "added time": t("added time"),
        "update time": t("update time"),
        "referent count": t("referent count"),
        "referent count ASC": t("referent count ASC"),
        "user count": t("user count"),
        "user count ASC": t("user count ASC"),
        "last version publication date": t("last version publication date")
    };

    return (
        <div className={cx(fr.cx("fr-container"), classes.root, className)}>
            <Search
                search={search}
                onSearchChange={onSearchChange}
                organizations={organizationOptions}
                onOrganizationChange={onOrganizationChange}
                selectedOrganization={organization}
                categories={categoryFilerOptions}
                onCategoriesChange={onCategoryFilterChange}
                selectedCategories={category}
                environments={environmentOptions}
                onEnvironmentsChange={onEnvironmentChange}
                selectedEnvironment={environment}
                prerogatives={prerogativesOptions}
                onPrerogativesChange={onPrerogativesChange}
                selectedPrerogatives={prerogatives}
                onResetFilters={onResetFilters}
            />
            <div>
                <div className={classes.header}>
                    <h6 className={classes.softwareCount}>
                        {t("search results", {
                            count: softwares.length
                        })}
                    </h6>
                    <Select
                        label={t("sort by")}
                        nativeSelectProps={{
                            "onChange": event =>
                                onSortChange(
                                    event.currentTarget.value as SoftwareCatalogState.Sort
                                ),
                            "defaultValue": sort ?? ""
                        }}
                        className={classes.sort}
                    >
                        {sortOptions.map(sort => (
                            <option value={sort} key={sort}>
                                {mappedSortOption[sort]}
                            </option>
                        ))}
                    </Select>
                </div>
                <RowVirtualizerDynamicWindow
                    softwares={softwares}
                    linksBySoftwareName={linksBySoftwareName}
                />
            </div>
        </div>
    );
});

function RowVirtualizerDynamicWindow(props: {
    softwares: SoftwareCatalogState.Software.External[];
    linksBySoftwareName: Record<
        string,
        Record<"softwareDetails" | "declareUsageForm", Link>
    >;
}) {
    const { softwares, linksBySoftwareName } = props;

    const { columnCount } = (function useClosure() {
        const { breakpointsValues } = useBreakpointsValues();

        const { windowInnerWidth } = useWindowInnerSize();

        const columnCount = (() => {
            if (windowInnerWidth < breakpointsValues.md) {
                return 1;
            }

            if (windowInnerWidth < breakpointsValues.xl) {
                return 2;
            }

            return 3;
        })();

        return { columnCount };
    })();

    const softwaresGroupedByLine = useMemo(() => {
        const groupedSoftwares: (SoftwareCatalogState.Software.External | undefined)[][] =
            [];

        for (let i = 0; i < softwares.length; i += columnCount) {
            const row: SoftwareCatalogState.Software.External[] = [];

            for (let j = 0; j < columnCount; j++) {
                row.push(softwares[i + j]);
            }

            groupedSoftwares.push(row);
        }

        return groupedSoftwares;
    }, [softwares, columnCount]);

    const parentRef = useRef<HTMLDivElement>(null);

    const parentOffsetRef = useRef(0);

    useLayoutEffect(() => {
        parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
    }, []);

    const virtualizer = useWindowVirtualizer({
        "count": softwaresGroupedByLine.length,
        "estimateSize": () => 250,
        "scrollMargin": parentOffsetRef.current
    });
    const items = virtualizer.getVirtualItems();

    const { css } = useStyles();

    const gutter = fr.spacing("4v");

    return (
        <div ref={parentRef}>
            <div
                style={{
                    "height": virtualizer.getTotalSize(),
                    "position": "relative"
                }}
            >
                <div
                    style={{
                        "position": "absolute",
                        "top": 0,
                        "left": 0,
                        "width": "100%",
                        "transform": `translateY(${
                            items[0].start - virtualizer.options.scrollMargin
                        }px)`
                    }}
                >
                    {items.map(virtualRow => (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                        >
                            <div
                                className={css({
                                    "display": "grid",
                                    "gridTemplateColumns": `repeat(${columnCount}, 1fr)`,
                                    "gridGap": gutter,
                                    "marginTop": gutter
                                })}
                            >
                                {softwaresGroupedByLine[virtualRow.index].map(
                                    (software, i) => {
                                        if (software === undefined) {
                                            return <div key={i} />;
                                        }

                                        const { softwareName } = software;

                                        const { softwareDetails, declareUsageForm } =
                                            linksBySoftwareName[softwareName];

                                        return (
                                            <SoftwareCatalogCard
                                                key={softwareName}
                                                declareForm={declareUsageForm}
                                                softwareDetails={softwareDetails}
                                                softwareUserAndReferent={
                                                    routes.softwareUsersAndReferents({
                                                        "name": softwareName
                                                    }).link
                                                }
                                                {...software}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles({ "name": { SoftwareCatalogControlled } })({
    "root": {
        "paddingBottom": fr.spacing("30v"),
        [fr.breakpoints.down("md")]: {
            "paddingBottom": fr.spacing("20v")
        }
    },
    "header": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between",
        ...fr.spacing("margin", {
            "topBottom": "4v"
        }),
        [fr.breakpoints.down("md")]: {
            "flexWrap": "wrap"
        }
    },
    "softwareCount": {
        "marginBottom": 0
    },
    "sort": {
        "display": "flex",
        "alignItems": "center",
        "gap": fr.spacing("2v"),

        "&&>select": {
            "width": "auto",
            "marginTop": 0
        },
        [fr.breakpoints.down("md")]: {
            "marginTop": fr.spacing("4v")
        }
    }
});

export const { i18n } = declareComponentKeys<
    | {
          K: "search results";
          P: { count: number };
      }
    | "sort by"
    | "added time"
    | "update time"
    | "referent count"
    | "referent count ASC"
    | "user count"
    | "user count ASC"
    | "last version publication date"
>()({ SoftwareCatalogControlled });
