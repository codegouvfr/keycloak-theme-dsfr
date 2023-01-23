import { memo } from "react";
import { makeStyles } from "tss-react/dsfr";
import type { SoftwareCatalogState } from "core-dsfr/usecases/softwareCatalog";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

const availableSorts = [
    "added time",
    "update time",
    "last version publication date",
    "user count",
    "referent count",
    "user count ASC",
    "referent count ASC",
] as const;

assert<Equals<typeof availableSorts[number], SoftwareCatalogState.Sort>>();

export type Props = {
    className?: string;
    softwares: SoftwareCatalogState.Software.External[];

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
        environmentsFilter: SoftwareCatalogState.Environment | undefined,
    ) => void;

    prerogativesOptions: {
        prerogative: SoftwareCatalogState.Prerogative;
        softwareCount: number;
    }[];
    prerogatives: SoftwareCatalogState.Prerogative[];
    onPrerogativesChange: (prerogatives: SoftwareCatalogState.Prerogative[]) => void;
};

export const SoftwareCatalogControlled = memo((props: Props) => {
    const { className } = props;

    const { cx, classes } = useStyles();

    return <div className={cx(classes.root, className)}></div>;
});

const useStyles = makeStyles({ "name": { SoftwareCatalogControlled } })({
    "root": {},
});
