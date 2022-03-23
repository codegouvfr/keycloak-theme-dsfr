import { useRef, memo } from "react";
import { createPortal } from "react-dom";
import { makeStyles } from "ui/theme";
import { CatalogCard } from "./CatalogCard";
import { useTranslation } from "ui/i18n/useTranslations";
import { Text } from "ui/theme";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { ReactComponent as ServiceNotFoundSvg } from "ui/assets/svg/ServiceNotFound.svg";
import { SearchBar } from "onyxia-ui/SearchBar";
import type { SearchBarProps } from "onyxia-ui/SearchBar";
import type { UnpackEvt } from "evt";
import { breakpointsValues } from "onyxia-ui";
import { Evt } from "evt";
import { useOnLoadMore } from "powerhooks/useOnLoadMore";
import { CircularProgress } from "onyxia-ui/CircularProgress";
import type { Link } from "type-route";
import { useConst } from "powerhooks/useConst";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";
import { CompiledData } from "sill-api";

export type Props = {
    className?: string;
    softwares: {
        software: CompiledData.Software & { isUserReferent: boolean };
        openLink: Link;
    }[];
    search: string;
    onSearchChange: (search: string) => void;
    onLoadMore: () => void;
    hasMoreToLoad: boolean;
    searchBarWrapperElement: HTMLDivElement;
};

export const CatalogCards = memo((props: Props) => {
    const {
        className,
        softwares,
        search,
        onSearchChange,
        onLoadMore,
        hasMoreToLoad,
        searchBarWrapperElement,
    } = props;

    const { t } = useTranslation({ CatalogCards });

    const evtSearchBarAction = useConst(() =>
        Evt.create<UnpackEvt<SearchBarProps["evtAction"]>>(),
    );

    const onGoBackClick = useConstCallback(() => evtSearchBarAction.post("CLEAR SEARCH"));

    const loadingDivRef = useRef<HTMLDivElement>(null);

    useOnLoadMore({
        loadingDivRef,
        onLoadMore,
    });

    const doRenderSearchBarInHeader = (function useClosure() {
        const { windowInnerWidth } = useWindowInnerSize();

        if (windowInnerWidth >= breakpointsValues.lg) {
            return true;
        }

        return false;
    })();

    const { classes } = useStyles({
        "filteredCardCount": softwares.length,
        hasMoreToLoad,
        doRenderSearchBarInHeader,
    });

    const searchBarNode = (
        <div className={classes.searchBarWrapper}>
            <SearchBar
                search={search}
                evtAction={evtSearchBarAction}
                onSearchChange={onSearchChange}
                placeholder={t("search")}
            />
        </div>
    );

    return (
        <>
            {doRenderSearchBarInHeader &&
                createPortal(searchBarNode, searchBarWrapperElement)}
            <div className={className}>
                {!doRenderSearchBarInHeader && searchBarNode}
                {softwares.length !== 0 && (
                    <Text typo="section heading" className={classes.contextTypo}>
                        {t(search !== "" ? "search results" : "all software")}
                    </Text>
                )}
                <div className={classes.cards}>
                    {softwares.length === 0 ? (
                        <NoMatches search={search} onGoBackClick={onGoBackClick} />
                    ) : (
                        softwares.map(({ openLink, software }) => (
                            <CatalogCard
                                key={software.id}
                                software={software}
                                openLink={openLink}
                            />
                        ))
                    )}
                </div>
                <div ref={loadingDivRef} className={classes.bottomScrollSpace}>
                    <CircularProgress color="textPrimary" />
                </div>
            </div>
        </>
    );
});

export declare namespace CatalogCards {
    export type I18nScheme = {
        "main services": undefined;
        "all software": undefined;
        "search results": undefined;
        "show more": undefined;
        "no service found": undefined;
        "no result found": { forWhat: string };
        "check spelling": undefined;
        "go back": undefined;
        "search": undefined;
    };
}

const useStyles = makeStyles<{
    filteredCardCount: number;
    hasMoreToLoad: boolean;
    doRenderSearchBarInHeader: boolean;
}>({ "name": { CatalogCards } })(
    (theme, { filteredCardCount, hasMoreToLoad, doRenderSearchBarInHeader }) => ({
        "searchBarWrapper": {
            "paddingBottom": theme.spacing(4),
            ...(doRenderSearchBarInHeader
                ? {}
                : {
                      "position": "sticky",
                      "top": theme.spacing(3),
                  }),
        },
        "contextTypo": {
            "marginBottom": theme.spacing(4),
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

                          if (theme.windowInnerWidth >= breakpointsValues.md) {
                              return 2;
                          }

                          return 1;
                      })()},1fr)`,
                      "gap": theme.spacing(4),
                  }),
        },
        "bottomScrollSpace": {
            ...(hasMoreToLoad
                ? {
                      "display": "flex",
                      "justifyContent": "center",
                      ...theme.spacing.topBottom("padding", 3),
                  }
                : {
                      "& > *": {
                          "display": "none",
                      },
                      "height": theme.spacing(3),
                  }),
        },
    }),
);

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
                    <MuiLink className={classes.link} onClick={onGoBackClick}>
                        {t("go back")}
                    </MuiLink>
                </div>
            </div>
        );
    });

    return { NoMatches };
})();
