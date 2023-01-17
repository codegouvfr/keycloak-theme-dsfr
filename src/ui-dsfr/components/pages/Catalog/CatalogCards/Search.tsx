import React, { useState } from "react";
import { makeStyles } from "tss-react/dsfr";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";

export type Props = {
    className?: string;
    search: string;
    onSearchChange: (search: string) => void;
    organisations: string[];
    onOrganisationsChange: (organisation: string | undefined) => void;
    selectedOrganisation: string | undefined;
    categories: string[];
    onCategoriesChange: (contextcategory: string | undefined) => void;
    selectedCategory: string | undefined;
    contexts: string[];
    onContextsChange: (context: string | undefined) => void;
    selectedContext: string | undefined;
    prerogatives: string[];
    onPrerogativesChange: (prerogative: string | undefined) => void;
    selectedPrerogative: string | undefined;
};

export function Search(props: Props) {
    const {
        className,
        search,
        onSearchChange,
        organisations,
        onOrganisationsChange,
        selectedOrganisation,
        categories,
        onCategoriesChange,
        selectedCategory,
        contexts,
        onContextsChange,
        selectedContext,
        prerogatives,
        onPrerogativesChange,
        selectedPrerogative,
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
                    label="Filter by color code (e.g. #c9191e), CSS variable name (e.g. --text-active-red-marianne) or something else (e.g. marianne)..."
                    nativeInputProps={{
                        "ref": inputElement => setInputElement(inputElement),
                        "value": search,
                        "onChange": event => onSearchChange(event.target.value),
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
                    label={`Organisation`}
                    disabled={!organisations.length}
                    nativeSelectProps={{
                        "onChange": event => onOrganisationsChange(event.target.value),
                        "defaultValue": selectedOrganisation ?? "",
                    }}
                >
                    {organisations.map(organisation => (
                        <option value={organisation ?? ""} key={organisation ?? 0}>
                            {organisation ?? "No organisation selected..."}
                        </option>
                    ))}
                </Select>
                <Select
                    label={"Categories"}
                    disabled={!categories.length}
                    nativeSelectProps={{
                        "onChange": event => onCategoriesChange(event.target.value),
                        "defaultValue": selectedCategory ?? "",
                    }}
                >
                    {categories.map(category => (
                        <option value={category ?? ""} key={category ?? 0}>
                            {category ?? "No category selected..."}
                        </option>
                    ))}
                </Select>
                <Select
                    label={`Context`}
                    disabled={!contexts.length}
                    nativeSelectProps={{
                        "onChange": event => onContextsChange(event.target.value),
                        "defaultValue": selectedContext ?? "",
                    }}
                >
                    {contexts.map(context => (
                        <option value={context ?? ""} key={context ?? 0}>
                            {context ?? "No usage selected..."}
                        </option>
                    ))}
                </Select>
                <Select
                    label={`Prérogatives`}
                    disabled={!prerogatives.length}
                    nativeSelectProps={{
                        "onChange": event => onPrerogativesChange(event.target.value),
                        "defaultValue": prerogatives ?? "",
                    }}
                >
                    {prerogatives.map(prerogative => (
                        <option value={prerogative ?? ""} key={prerogative ?? 0}>
                            {prerogative ?? "No prerogative selected..."}
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
