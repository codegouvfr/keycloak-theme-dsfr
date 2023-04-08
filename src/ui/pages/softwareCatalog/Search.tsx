import React, { useState } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { useTranslation } from "ui/i18n";
import { State as SoftwareCatalogState } from "core/usecases/softwareCatalog";
import Environment = SoftwareCatalogState.Environment;
import Prerogative = SoftwareCatalogState.Prerogative;
import MenuItem from "@mui/material/MenuItem";
import SelectMui from "@mui/material/Select";
import { InputBase } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

export type Props = {
    className?: string;
    search: string;
    onSearchChange: (search: string) => void;
    organizations: { organization: string; softwareCount: number }[];
    onOrganizationChange: (organization: string | undefined) => void;
    selectedOrganization: string | undefined;
    categories: { category: string; softwareCount: number }[];
    onCategoriesChange: (category: string | undefined) => void;
    selectedCategories: string | undefined;
    environments: { environment: Environment; softwareCount: number }[];
    onEnvironmentsChange: (environmentsFilter: Environment | undefined) => void;
    selectedEnvironment: string | undefined;
    prerogatives: { prerogative: Prerogative; softwareCount: number }[];
    onPrerogativesChange: (prerogatives: Prerogative[]) => void;
    selectedPrerogatives: Prerogative[];
    onResetFilters: () => void;
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
        environments,
        onEnvironmentsChange,
        selectedEnvironment,
        prerogatives,
        onPrerogativesChange,
        selectedPrerogatives,
        onResetFilters,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    const { t } = useTranslation({ Search });
    const { t: tCommon } = useTranslation({ "App": "App" });

    const { classes, cx } = useStyles();

    const onClickFilters = () => {
        if (areFiltersOpen) {
            onResetFilters();
        }
        setAreFiltersOpen(!areFiltersOpen);
    };

    const mappedPrerogativesOption: {
        [key in SoftwareCatalogState.Prerogative]: string;
    } = {
        "doRespectRgaa": t("doRespectRgaa"),
        "isFromFrenchPublicServices": t("isFromFrenchPublicServices"),
        "isInstallableOnUserTerminal": t("isInstallableOnUserTerminal"),
        "isTestable": t("isTestable"),
        "isPresentInSupportContract": t("isPresentInSupportContract")
    };

    return (
        <div className={cx(fr.cx("fr-accordion"), classes.root)}>
            <div className={cx(classes.basicSearch, className)}>
                <SearchBar
                    className={classes.searchBar}
                    label={t("placeholder")}
                    nativeInputProps={{
                        "value": search,
                        "onChange": event => onSearchChange(event.currentTarget.value)
                    }}
                />
                <Button
                    className={classes.filterButton}
                    iconId={
                        areFiltersOpen ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill"
                    }
                    iconPosition="right"
                    onClick={onClickFilters}
                    aria-expanded="false"
                    aria-controls="accordion-filters"
                >
                    {t("filters")}
                </Button>
            </div>
            <div className={cx("fr-collapse", classes.filters)} id="accordion-filters">
                <div className={cx(classes.filtersWrapper)}>
                    <Select
                        label={
                            <>
                                {t("organizationLabel")}{" "}
                                <Tooltip title={t("organization filter hint")} arrow>
                                    <i className={fr.cx("ri-question-line")} />
                                </Tooltip>
                            </>
                        }
                        disabled={!organizations.length}
                        nativeSelectProps={{
                            "onChange": event => onOrganizationChange(event.target.value),
                            "value": selectedOrganization ?? ""
                        }}
                        className={cx(classes.filterSelectGroup)}
                    >
                        {[undefined, ...organizations].map(organization => (
                            <option
                                value={organization?.organization ?? ""}
                                key={organization?.organization ?? 0}
                                disabled={organization?.softwareCount === 0}
                            >
                                {organization ? (
                                    <>
                                        {" "}
                                        {organization.organization} (
                                        {organization.softwareCount})
                                    </>
                                ) : (
                                    tCommon("allFeminine")
                                )}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label={t("categoriesLabel")}
                        disabled={!categories.length}
                        nativeSelectProps={{
                            "onChange": event => onCategoriesChange(event.target.value),
                            "value": selectedCategories ?? ""
                        }}
                        className={cx(classes.filterSelectGroup)}
                    >
                        {[undefined, ...categories].map(category => (
                            <option
                                value={category?.category ?? ""}
                                key={category?.category ?? 0}
                                disabled={category?.softwareCount === 0}
                            >
                                {category ? (
                                    <>
                                        {" "}
                                        {category.category} ({category.softwareCount})
                                    </>
                                ) : (
                                    tCommon("allFeminine")
                                )}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label={t("contextLabel")}
                        disabled={!environments.length}
                        nativeSelectProps={{
                            "onChange": event =>
                                onEnvironmentsChange(
                                    event.currentTarget.value as Environment
                                ),
                            "value": selectedEnvironment ?? ""
                        }}
                        className={cx(classes.filterSelectGroup)}
                    >
                        {[undefined, ...environments].map(environment => (
                            <option
                                value={environment?.environment ?? ""}
                                key={environment?.environment ?? 0}
                                disabled={environment?.softwareCount === 0}
                            >
                                {environment ? (
                                    <>
                                        {" "}
                                        {environment.environment} (
                                        {environment.softwareCount})
                                    </>
                                ) : (
                                    tCommon("all")
                                )}
                            </option>
                        ))}
                    </Select>

                    <div className={classes.filterSelectGroup}>
                        <label htmlFor="prerogatives-label">
                            {t("prerogativesLabel")}
                        </label>
                        <SelectMui
                            labelId="prerogatives-label"
                            id="prerogatives"
                            multiple
                            value={selectedPrerogatives ?? ""}
                            onChange={event =>
                                onPrerogativesChange(
                                    (typeof event.target.value === "string"
                                        ? event.target.value.split(",")
                                        : event.target.value) as Prerogative[]
                                )
                            }
                            className={cx(fr.cx("fr-select"), classes.multiSelect)}
                            input={<InputBase />}
                        >
                            {prerogatives.map(prerogative => (
                                <MenuItem
                                    key={prerogative?.prerogative}
                                    value={prerogative?.prerogative}
                                    disabled={prerogative?.softwareCount === 0}
                                >
                                    {prerogative ? (
                                        <>
                                            {" "}
                                            {
                                                mappedPrerogativesOption[
                                                    prerogative.prerogative
                                                ]
                                            }
                                            ({prerogative.softwareCount})
                                        </>
                                    ) : (
                                        tCommon("all")
                                    )}
                                </MenuItem>
                            ))}
                        </SelectMui>
                    </div>
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles({ "name": { Search } })(theme => ({
    "root": {
        "&:before": {
            content: "none"
        }
    },
    "basicSearch": {
        "display": "flex",
        "paddingTop": fr.spacing("6v")
    },
    "searchBar": {
        "flex": 1
    },
    "filterButton": {
        "backgroundColor": theme.decisions.background.actionLow.blueFrance.default,
        "&&&:hover": {
            "backgroundColor": theme.decisions.background.actionLow.blueFrance.hover
        },
        "color": theme.decisions.text.actionHigh.blueFrance.default,
        "marginLeft": fr.spacing("4v")
    },
    "filters": {
        "&&": {
            "overflowX": "visible",
            ...fr.spacing("padding", {
                "rightLeft": "1v"
            }),
            "margin": 0
        }
    },
    "filtersWrapper": {
        "display": "grid",
        "gridTemplateColumns": `repeat(4, minmax(20%, 1fr))`,
        "columnGap": fr.spacing("4v"),
        "marginTop": fr.spacing("3v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    },
    "filterSelectGroup": {
        "&:not(:last-of-type)": {
            "borderRight": `1px ${theme.decisions.border.default.grey.default} solid`,
            "paddingRight": fr.spacing("4v")
        },
        [fr.breakpoints.down("md")]: {
            "&:not(:last-of-type)": {
                "border": "none"
            }
        }
    },
    "multiSelect": {
        "marginTop": fr.spacing("2v"),
        "paddingRight": 0,
        "&&>.MuiInputBase-input": {
            "padding": 0
        },
        "&&>.MuiSvgIcon-root": {
            "display": "none"
        }
    }
}));

export const { i18n } = declareComponentKeys<
    | "filters"
    | "placeholder"
    | "filtersButton"
    | "organizationLabel"
    | "categoriesLabel"
    | "contextLabel"
    | "prerogativesLabel"
    | "isInstallableOnUserTerminal"
    | "isPresentInSupportContract"
    | "isFromFrenchPublicServices"
    | "doRespectRgaa"
    | "isTestable"
    | "organization filter hint"
>()({ Search });
