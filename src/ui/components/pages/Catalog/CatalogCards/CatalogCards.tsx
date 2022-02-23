import { useState, memo } from "react";
import type { RefObject } from "react";
import { makeStyles } from "ui/theme";
import { CatalogCard } from "./CatalogCard";
import { useTranslation } from "ui/i18n/useTranslations";
import { Text } from "ui/theme";
import { useConstCallback } from "powerhooks/useConstCallback";
import Link from "@mui/material/Link";
import { ReactComponent as ServiceNotFoundSvg } from "ui/assets/svg/ServiceNotFound.svg";
import { SearchBar } from "onyxia-ui/SearchBar";
import type { SearchBarProps } from "onyxia-ui/SearchBar";
import type { UnpackEvt } from "evt";
import { breakpointsValues } from "onyxia-ui";
import { Evt } from "evt";
import type { Software } from "sill-api";

export type Props = {
    className?: string;
    softwares: Software[];
    search: string;
    onSearchChange: (search: string) => void;
    scrollableDivRef: RefObject<HTMLDivElement>;
};

export const CatalogCards = memo((props: Props) => {
    const { className, softwares, search, onSearchChange, scrollableDivRef } = props;

    const { t } = useTranslation({ CatalogCards });

    const { classes, cx } = useStyles({
        "filteredCardCount": softwares.length,
    });

    const [evtSearchBarAction] = useState(() =>
        Evt.create<UnpackEvt<SearchBarProps["evtAction"]>>(),
    );

    const onGoBackClick = useConstCallback(() => evtSearchBarAction.post("CLEAR SEARCH"));

    return (
        <div className={cx(classes.root, className, "foo-bar")}>
            <SearchBar
                className={classes.searchBar}
                search={search}
                evtAction={evtSearchBarAction}
                onSearchChange={onSearchChange}
                placeholder={t("search")}
            />
            <div ref={scrollableDivRef} className={classes.cardsWrapper}>
                {softwares.length === 0 ? undefined : (
                    <Text typo="section heading" className={classes.contextTypo}>
                        {t(search !== "" ? "search results" : "all services")}
                    </Text>
                )}
                <div className={classes.cards}>
                    {softwares.length === 0 ? (
                        <NoMatches search={search} onGoBackClick={onGoBackClick} />
                    ) : (
                        softwares.map(software => (
                            <CatalogCard key={software.id} software={software} />
                        ))
                    )}
                </div>
                <div className={classes.bottomScrollSpace} />
            </div>
        </div>
    );
});

export declare namespace CatalogCards {
    export type I18nScheme = {
        "main services": undefined;
        "all services": undefined;
        "search results": undefined;
        "show more": undefined;
        "no service found": undefined;
        "no result found": { forWhat: string };
        "check spelling": undefined;
        "go back": undefined;
        "search": undefined;
    };
}

const { NoMatches } = (() => {
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
            "fill": theme.colors.palette.dark.greyVariant2,
            "width": 100,
            "margin": 0,
        },
        "h2": {
            ...theme.spacing.topBottom("margin", 4),
        },
        "typo": {
            "marginBottom": theme.spacing(1),
            "color": theme.colors.palette.light.greyVariant3,
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
                    <ServiceNotFoundSvg className={classes.svg} />
                    <Text typo="page heading" className={classes.h2}>
                        {t("no service found")}
                    </Text>
                    <Text className={classes.typo} typo="body 1">
                        {t("no result found", { "forWhat": search })}
                    </Text>
                    <Text className={classes.typo} typo="body 1">
                        {t("check spelling")}
                    </Text>
                    <Link className={classes.link} onClick={onGoBackClick}>
                        {t("go back")}
                    </Link>
                </div>
            </div>
        );
    });

    return { NoMatches };
})();

const useStyles = makeStyles<{
    filteredCardCount: number;
}>({ "name": { CatalogCards } })((theme, { filteredCardCount }) => ({
    "root": {
        "height": "100%",
        "display": "flex",
        "flexDirection": "column",
    },
    "searchBar": {
        "marginBottom": theme.spacing(4),
    },
    "contextTypo": {
        "marginBottom": theme.spacing(4),
    },
    "cardsWrapper": {
        "flex": 1,
        "overflow": "auto",
    },
    "cards": {
        ...(filteredCardCount === 0
            ? {}
            : {
                  "display": "grid",
                  "gridTemplateColumns": `repeat(${(() => {
                      if (theme.windowInnerWidth >= breakpointsValues.xl) {
                          return 4;
                      }
                      if (theme.windowInnerWidth >= breakpointsValues.lg) {
                          return 3;
                      }

                      return 2;
                  })()},1fr)`,
                  "gap": theme.spacing(4),
              }),
    },
    "bottomScrollSpace": {
        "height": theme.spacing(3),
    },
}));
