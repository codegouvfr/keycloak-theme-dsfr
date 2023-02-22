import React, { memo } from "react";
import { makeStyles } from "tss-react/dsfr";
import type { SoftwareCatalogState } from "core-dsfr/usecases/softwareCatalog";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { Link } from "type-route";
import { fr } from "@codegouvfr/react-dsfr";
import { SoftwareCatalogCard } from "./SoftwareCatalogCard";
import { Search } from "./Search";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";

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
        ...rest
    } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();
    const { t } = useTranslation({ SoftwareCatalogControlled });

    const catalogCards = softwares.map(software => {
        const { softwareName } = software;

        const { softwareDetails, declareUsageForm } = linksBySoftwareName[softwareName];
        const softwareUserAndReferent: Link = {
            "href": `/users-and-referents?name=${softwareName}`,
            "onClick": () => {}
        };

        return (
            <SoftwareCatalogCard
                key={softwareName}
                {...software}
                declareForm={declareUsageForm}
                softwareDetails={softwareDetails}
                softwareUserAndReferent={softwareUserAndReferent}
            />
        );
    });

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
            />
            <div>
                <div className={classes.header}>
                    <h6 className={classes.softwareCount}>
                        {t("search results", {
                            count: softwares.length
                        })}
                    </h6>
                    <Select
                        label="Trier par"
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
                                {sort}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className={classes.cardList}>{catalogCards}</div>
            </div>
        </div>
    );
});

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
    },
    "cardList": {
        "display": "grid",
        "gridTemplateColumns": `repeat(3, 1fr)`,
        "columnGap": fr.spacing("4v"),
        "rowGap": fr.spacing("3v"),
        [fr.breakpoints.down("xl")]: {
            "gridTemplateColumns": `repeat(2, 1fr)`
        },
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    }
});

export const { i18n } = declareComponentKeys<{
    K: "search results";
    P: { count: number };
}>()({ SoftwareCatalogControlled });
