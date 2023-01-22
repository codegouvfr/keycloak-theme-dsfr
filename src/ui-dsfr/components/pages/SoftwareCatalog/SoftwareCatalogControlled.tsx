import { memo } from "react";
import { makeStyles } from "tss-react/dsfr";
import type { SoftwareCatalogState } from "core-dsfr/usecases/softwareCatalog";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

const availableSortIds = [
    "added time",
    "update time",
    "last version publication date",
    "user count",
    "referent count",
    "user count ASC",
    "referent count ASC",
] as const;

assert<Equals<typeof availableSortIds[number], SoftwareCatalogState.SortId>>();

export type Props = {
    className?: string;
    softwares: SoftwareCatalogState.Software.External[];

    search: string;
    onSearchChange: (search: string) => void;

    sortId: SoftwareCatalogState.SortId | undefined;
    onSortIdChange: (sortId: SoftwareCatalogState.SortId | undefined) => void;

    organizationFilterOptions: {
        organization: string;
        softwareCount: number;
    }[];
    organizationFilter: string | undefined;
    onOrganizationFilterChange: (organizationFilter: string | undefined) => void;

    categoryFilerOptions: {
        category: string;
        softwareCount: number;
    }[];
    categoryFilter: string | undefined;
    onCategoryFilterChange: (categoryFilter: string | undefined) => void;

    environmentFilterOptions: {
        environment: SoftwareCatalogState.Environment;
        softwareCount: number;
    }[];
    environmentFilter: SoftwareCatalogState.Environment | undefined;
    onEnvironmentFilterChange: (
        environmentsFilter: SoftwareCatalogState.Environment | undefined,
    ) => void;

    prerogativesFilterOptions: {
        prerogative: SoftwareCatalogState.Prerogative;
        softwareCount: number;
    }[];
    prerogativesFilter: SoftwareCatalogState.Prerogative[];
    onPrerogativesFilterChange: (
        prerogativesFilter: SoftwareCatalogState.Prerogative[],
    ) => void;
};

export const SoftwareCatalogControlled = memo((props: Props) => {
    const { className } = props;

    const { cx, classes } = useStyles();

    return <div className={cx(classes.root, className)}></div>;
});

const useStyles = makeStyles({ "name": { SoftwareCatalogControlled } })(theme => ({
    "root": {},
}));
