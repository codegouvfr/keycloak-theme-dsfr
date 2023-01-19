import React, { memo } from "react";
import { makeStyles } from "tss-react/dsfr";
import { CatalogCard } from "./CatalogCard";
import type { Props as CatalogCardProps } from "./CatalogCard";
import { declareComponentKeys } from "i18nifty";
import { useOnLoadMore } from "powerhooks/useOnLoadMore";
import { useStateRef } from "powerhooks/useStateRef";
import { fr } from "@codegouvfr/react-dsfr";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";

export type Props = {
    className?: string;
    search: string;
    searchResultCount: number;
    onLoadMore: () => void;
    hasMoreToLoad: boolean;
    catalogCardList: Omit<CatalogCardProps, "className">[];
};

export const CatalogCards = memo((props: Props) => {
    const {
        className,
        searchResultCount,
        search,
        onLoadMore,
        hasMoreToLoad,
        catalogCardList,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    /*const { t } = useTranslation({ CatalogCards });*/

    const loadingDivRef = useStateRef<HTMLDivElement>(null);

    useOnLoadMore({
        loadingDivRef,
        onLoadMore,
    });

    const { classes, cx } = useStyles({
        "softwareListCount": catalogCardList.length,
        hasMoreToLoad,
    });

    const catalogCards = catalogCardList.map(software => {
        const { softwareName } = software;

        return <CatalogCard key={softwareName} {...software} />;
    });

    return <div className={cx(classes.cards)}>{catalogCards}</div>;
});

export const { i18n } = declareComponentKeys<
    | { K: "search results"; P: { count: number } }
    | "no service found"
    | { K: "no result found"; P: { forWhat: string } }
    | "check spelling"
    | "go back"
>()({ CatalogCards });

const useStyles = makeStyles<
    {
        softwareListCount: number;
        hasMoreToLoad: boolean;
    },
    "moreToLoadProgress"
>({ "name": { CatalogCards } })(
    (theme, { softwareListCount, hasMoreToLoad }, classes) => ({
        "cards": {
            ...(softwareListCount === 0
                ? {}
                : {
                      "display": "grid",
                      "gridTemplateColumns": `repeat(3, 1fr)`,
                      "columnGap": fr.spacing("4v"),
                      "rowGap": fr.spacing("3v"),
                      [fr.breakpoints.down("xl")]: {
                          "gridTemplateColumns": `repeat(2, 1fr)`,
                      },
                      [fr.breakpoints.down("md")]: {
                          "gridTemplateColumns": `repeat(1, 1fr)`,
                      },
                  }),
        },
        "bottomScrollSpace": {
            ...(hasMoreToLoad
                ? {
                      "display": "flex",
                      "justifyContent": "center",
                      "color": theme.decisions.text.default.grey.default,
                      ...fr.spacing("padding", { "topBottom": "3v" }),
                  }
                : {
                      [`& .${classes.moreToLoadProgress}`]: {
                          "display": "none",
                      },
                      "height": fr.spacing("3v"),
                  }),
        },
        "moreToLoadProgress": {},
    }),
);

/*const { NoMatches } = (() => {
    type Props = {
        search: string;
        onGoBackClick(): void;
    };

    const useStyles = makeStyles()(theme => ({
        "root": {
            "display": "flex",
            "justifyContent": "center",
        },
        "innerDiv": {
            "textAlign": "center",
            "maxWidth": 500,
        },
        "svg": {
            "fill": theme.decisions.background.contrast.grey.default,
            "width": 100,
            "margin": 0,
        },
        "h2": {
            //...theme.spacing.topBottom("margin", 4),
            ...fr.spacing('margin', { topBottom: "4v" })
        },
        "typo": {
            "marginBottom": fr.spacing("1v"),
            "color": theme.decisions.text.title.grey.default,
        },
        "link": {
            "cursor": "pointer",
        },
    }));

    const NoMatches = memo((props: Props) => {
        const { search, onGoBackClick } = props;

        const { classes } = useStyles();

        const { t } = useTranslation({ CatalogCards });

        return (
            <div className={classes.root}>
                <div className={classes.innerDiv}>
                    {/!*<ServiceNotFoundSvg className={classes.svg} />*!/}
                    <h2>{t("no service found")}</h2>
                    <p> {t("no result found", { "forWhat": search })}</p>
                    <p> {t("check spelling")}</p>
                    <MuiLink className={classes.link} onClick={onGoBackClick}>
                        {t("go back")}
                    </MuiLink>
                </div>
            </div>
        );
    });

    return { NoMatches };
})();*/
