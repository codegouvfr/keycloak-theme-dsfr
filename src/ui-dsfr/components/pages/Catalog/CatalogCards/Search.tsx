import React, { useState } from "react";
import { makeStyles } from "tss-react/dsfr";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { useTranslation } from "ui-dsfr/i18n";

export type Props = {
    className?: string;
    search: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    organizations: string[];
    onOrganizationChange: (organization: string | undefined) => void;
    selectedOrganization: string | undefined;
    categories: string[];
    onCategoriesChange: (contextcategory: string | undefined) => void;
    selectedCategories: string | undefined;
    contexts: string[];
    onContextChange: (context: string | undefined) => void;
    selectedContext: string | undefined;
    prerogatives: string[];
    onPrerogativesChange: (prerogative: string | undefined) => void;
    selectedPrerogatives: string | undefined;
};

export function Search(props: Props) {
    const {
        className,
        search,
        onSearchChange,
        organizations,
        onOrganizationChange,
        selectedOrganization,
        categories,
        onCategoriesChange,
        selectedCategories,
        contexts,
        onContextChange,
        selectedContext,
        prerogatives,
        onPrerogativesChange,
        selectedPrerogatives,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    const { t } = useTranslation({ Search });
    const { classes, cx } = useStyles();

    return (
        <div className="fr-accordion">
            <div className={cx(classes.root, className)}>
                <SearchBar
                    className={classes.searchBar}
                    label={t("placeholder")}
                    nativeInputProps={{
                        "value": search,
                        "onChange": event => onSearchChange(event),
                    }}
                />
                <Button
                    className={classes.filterButton}
                    iconId={
                        areFiltersOpen ? "ri-arrow-down-s-fill" : "ri-arrow-up-s-fill"
                    }
                    iconPosition="right"
                    onClick={() => setAreFiltersOpen(!areFiltersOpen)}
                    aria-expanded="false"
                    aria-controls="accordion-filters"
                >
                    Filters
                </Button>
            </div>
            <div
                className={cx("fr-collapse", classes.filtersAccordion)}
                id="accordion-filters"
            >
                <div className={cx(classes.filtersWrapper)}>
                    <Select
                        label={t("organizationLabel")}
                        disabled={!organizations.length}
                        nativeSelectProps={{
                            "onChange": event => onOrganizationChange(event.target.value),
                            "defaultValue": selectedOrganization ?? "",
                        }}
                        className={cx(classes.filterSelectGroup)}
                    >
                        {organizations.map(organization => (
                            <option value={organization} key={organization}>
                                {organization}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label={t("categoriesLabel")}
                        disabled={!categories.length}
                        nativeSelectProps={{
                            "onChange": event => onCategoriesChange(event.target.value),
                            "defaultValue": selectedCategories ?? "",
                        }}
                        className={cx(classes.filterSelectGroup)}
                    >
                        {categories.map(category => (
                            <option value={category} key={category}>
                                {category}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label={t("contextLabel")}
                        disabled={!contexts.length}
                        nativeSelectProps={{
                            "onChange": event => onContextChange(event.target.value),
                            "defaultValue": selectedContext ?? "",
                        }}
                        className={cx(classes.filterSelectGroup)}
                    >
                        {contexts.map(context => (
                            <option value={context} key={context}>
                                {context}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label={t("prerogativesLabel")}
                        disabled={!prerogatives.length}
                        nativeSelectProps={{
                            "onChange": event => onPrerogativesChange(event.target.value),
                            "defaultValue": prerogatives ?? "",
                        }}
                        className={classes.filterSelectGroup}
                    >
                        {prerogatives.map(prerogative => (
                            <option value={prerogative} key={prerogative}>
                                {prerogative}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles({ "name": { Search } })(theme => ({
    "root": {
        "display": "flex",
        "paddingTop": fr.spacing("6v"),
    },
    "searchBar": {
        "flex": 1,
    },
    "filterButton": {
        "backgroundColor": theme.decisions.background.actionLow.blueFrance.default,
        "&&&:hover": {
            "backgroundColor": theme.decisions.background.actionLow.blueFrance.hover,
        },
        "color": theme.decisions.text.actionHigh.blueFrance.default,
        "marginLeft": fr.spacing("4v"),
    },
    "filtersAccordion": {
        "&&": {
            "paddingLeft": 0,
            "paddingRight": 0,
        },
    },
    "filtersWrapper": {
        "display": "grid",
        "gridTemplateColumns": "repeat(4, 1fr)",
        "gap": fr.spacing("4v"),
        "marginTop": fr.spacing("3v"),
    },
    "filterSelectGroup": {
        "&:not(:last-of-type)": {
            "paddingRight": "4v",
        },
    },
}));

export const { i18n } = declareComponentKeys<
    | "placeholder"
    | "filtersButton"
    | "organizationLabel"
    | "categoriesLabel"
    | "contextLabel"
    | "prerogativesLabel"
>()({ Search });
