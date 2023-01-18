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
    organisations: string[];
    onOrganisationChange: (organisation: string | undefined) => void;
    selectedOrganisation: string | undefined;
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
        organisations,
        onOrganisationChange,
        selectedOrganisation,
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

    const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
    const [searchBarWrapperElement, setSearchBarWrapperElement] =
        useState<HTMLDivElement | null>(null);
    const [filtersWrapperDivElement, setFiltersWrapperDivElement] =
        useState<HTMLDivElement | null>(null);

    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    const { t } = useTranslation({ Search });
    const { classes, cx } = useStyles({
        "filterWrapperMaxHeight": areFiltersOpen
            ? filtersWrapperDivElement?.scrollHeight ?? 0
            : 0,
    });

    return (
        <>
            <div
                className={cx(classes.root, className)}
                ref={searchBarWrapperElement =>
                    setSearchBarWrapperElement(searchBarWrapperElement)
                }
            >
                <SearchBar
                    className={classes.searchBar}
                    label={t("placeholder")}
                    nativeInputProps={{
                        "ref": inputElement => setInputElement(inputElement),
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
                >
                    Filters
                </Button>
            </div>
            <div
                ref={filtersWrapperDivElement =>
                    setFiltersWrapperDivElement(filtersWrapperDivElement)
                }
                className={classes.filtersWrapper}
            >
                <Select
                    label={t("organisationLabel")}
                    disabled={!organisations.length}
                    nativeSelectProps={{
                        "onChange": event => onOrganisationChange(event.target.value),
                        "defaultValue": selectedOrganisation ?? "",
                    }}
                >
                    {organisations.map(organisation => (
                        <option value={organisation} key={organisation}>
                            {organisation}
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
                >
                    {prerogatives.map(prerogative => (
                        <option value={prerogative} key={prerogative}>
                            {prerogative}
                        </option>
                    ))}
                </Select>
            </div>
        </>
    );
}

const useStyles = makeStyles<{ filterWrapperMaxHeight: number }>({ "name": { Search } })(
    (theme, { filterWrapperMaxHeight }) => ({
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
        "filtersWrapper": {
            "transition": "max-height 0.2s ease-out",
            "maxHeight": filterWrapperMaxHeight,
            "overflow": "hidden",
            "display": "flex",
            "marginTop": fr.spacing("3v"),
            "& > *": {
                "flex": 1,
                ...fr.spacing("padding", {
                    "rightLeft": "4v",
                }),
            },
        },
    }),
);

export const { i18n } = declareComponentKeys<
    | "placeholder"
    | "filtersButton"
    | "organisationLabel"
    | "categoriesLabel"
    | "contextLabel"
    | "prerogativesLabel"
>()({ Search });
