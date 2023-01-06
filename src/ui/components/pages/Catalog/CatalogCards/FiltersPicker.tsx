import React, { memo, useState } from "react";
import { GitHubPickerProps } from "onyxia-ui/src/GitHubPicker";
import { useEvt } from "evt/hooks";
import { NonPostableEvtLike } from "evt";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr, getColors } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { makeStyles } from "tss-react/dsfr";
import { CatalogSearchArea } from "./CatalogSearchArea";

export type FiltersPickerProps = {
    evtAction: NonPostableEvtLike<{
        action: "toggleFilters";
    }>;
};
export const FiltersPicker = memo((props: FiltersPickerProps) => {
    const { evtAction } = props;

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEvt(
        ctx => {
            evtAction.attach(ctx, ({ action }) => {
                if (action === "toggleFilters") {
                    return setIsFiltersOpen(!isFiltersOpen);
                }
            });
        },
        [evtAction, isFiltersOpen],
    );

    const { classes, cx } = useStyles();

    return (
        <>
            {isFiltersOpen && (
                <div className={cx(classes.filtersContainer)}>
                    <div className={cx(classes.filter)}>
                        <label className={cx(fr.cx("fr-label"))} htmlFor="organisation">
                            Organisation
                        </label>
                        <select name="organisation" className={cx(fr.cx("fr-select"))}>
                            <option value="value1">Value 1</option>
                            <option value="value2">Value 2</option>
                        </select>
                    </div>
                    <div className={cx(classes.filter)}>
                        <label className={cx(fr.cx("fr-label"))} htmlFor="categories">
                            Catégories
                        </label>
                        <select name="categories" className={cx(fr.cx("fr-select"))}>
                            <option value="value1">Value 1</option>
                            <option value="value2">Value 2</option>
                        </select>
                    </div>
                    <div className={cx(classes.filter)}>
                        <label className={cx(fr.cx("fr-label"))} htmlFor="contexte">
                            Contexte
                        </label>
                        <select name="contexte" className={cx(fr.cx("fr-select"))}>
                            <option value="value1">Value 1</option>
                            <option value="value2">Value 2</option>
                        </select>
                    </div>
                    <div className={cx(classes.filter)}>
                        <label className={cx(fr.cx("fr-label"))} htmlFor="prérogatives">
                            Prérogatives
                        </label>
                        <select name="prérogatives" className={cx(fr.cx("fr-select"))}>
                            <option value="value1">Value 1</option>
                            <option value="value2">Value 2</option>
                        </select>
                    </div>
                </div>
            )}
        </>
    );
});

export const { i18n } = declareComponentKeys<"filter by tags">()({ FiltersPicker });

const useStyles = makeStyles({ "name": { FiltersPicker } })(theme => ({
    "root": {
        "display": "flex",
        "flexDirection": "column",
        "paddingTop": fr.spacing("4v"),
        "paddingBottom": fr.spacing("4v"),
    },
    "headerSearchBar": {
        "display": "flex",
        "flex": 1,
        "marginBottom": fr.spacing("4v"),
    },
    "searchBarContainer": {
        "display": "flex",
        "width": "100%",
        "marginRight": fr.spacing("4v"),
    },
    "searchBar": {
        "borderTopLeftRadius": fr.spacing("1v"),
        "width": "100%",
    },
    "searchButton": {
        "borderTopRightRadius": fr.spacing("1v"),
    },
    "toggleFiltersButton": {
        "marginLeft": "auto",

        "&>i": {
            "&::before": {
                "--icon-size": fr.spacing("4v"),
            },
        },
    },
    "filtersContainer": {
        "display": "grid",
        "gridTemplateColumns": "repeat(4, 1fr)",
        "gap": fr.spacing("4v"),
    },
    "filter": {
        "&:not(:last-of-type)": {
            "borderRightWidth": "1px",
            "borderRightStyle": "solid",
            "borderRightColor": getColors(theme.isDark).decisions.border.default.grey
                .default,
            "paddingRight": fr.spacing("4v"),
        },
    },
}));
