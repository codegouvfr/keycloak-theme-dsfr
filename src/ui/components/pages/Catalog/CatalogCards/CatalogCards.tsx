import "minimal-polyfills/Object.fromEntries";
import { useRef, memo } from "react";
import { createPortal } from "react-dom";
import { makeStyles, Text, Button, isViewPortAdapterEnabled } from "ui/theme";
import { CatalogCard } from "./CatalogCard";
import type { Props as CatalogCardProps } from "./CatalogCard";
import { useTranslation } from "ui/i18n/useTranslations";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { ReactComponent as ServiceNotFoundSvg } from "ui/assets/svg/ServiceNotFound.svg";
import { SearchBar } from "onyxia-ui/SearchBar";
import type { SearchBarProps } from "onyxia-ui/SearchBar";
import type { UnpackEvt } from "evt";
import { Evt } from "evt";
import { useOnLoadMore } from "powerhooks/useOnLoadMore";
import { CircularProgress } from "onyxia-ui/CircularProgress";
import type { Link } from "type-route";
import { useConst } from "powerhooks/useConst";
import type { CompiledData, SoftwareRef } from "sill-api";
import { exclude } from "tsafe/exclude";
import { capitalize } from "tsafe/capitalize";
import { removeDuplicates } from "evt/tools/reducers/removeDuplicates";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import type { Param0 } from "tsafe";

export type Props = {
    className?: string;
    filteredSoftwares: CompiledData.Software[];
    alikeSoftwares: (
        | SoftwareRef.Unknown
        | {
              software: CompiledData.Software.WithoutReferent;
              isKnown: true;
          }
    )[];
    referentsBySoftwareId:
        | Record<
              number,
              {
                  referents: CompiledData.Software.WithReferent["referents"];
                  userIndex: number | undefined;
              }
          >
        | undefined;
    openLinkBySoftwareId: Record<number, Link>;
    search: string;
    onSearchChange: (search: string) => void;
    onLoadMore: () => void;
    hasMoreToLoad: boolean;
    searchBarWrapperElement: HTMLDivElement;
    onLogin: () => void;
    onDeclareOneselfReferent: (params: { softwareId: number; isExpert: boolean }) => void;
    onUserNoLongerReferent: (params: { softwareId: number }) => void;
    referenceNewSoftwareLink: Link;
};

export const CatalogCards = memo((props: Props) => {
    const {
        className,
        filteredSoftwares,
        alikeSoftwares,
        referentsBySoftwareId,
        openLinkBySoftwareId,
        search,
        onSearchChange,
        onLoadMore,
        hasMoreToLoad,
        searchBarWrapperElement,
        onLogin,
        onDeclareOneselfReferent,
        onUserNoLongerReferent,
        referenceNewSoftwareLink,
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

    const doRenderSearchBarInHeader = (() => {
        if (isViewPortAdapterEnabled) {
            return true;
        }

        return false;
    })();

    const { classes, css, theme } = useStyles({
        "filteredCardCount": filteredSoftwares.length,
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

    const onDeclareOneselfReferentFactory = useCallbackFactory(
        (
            [softwareId]: [number],
            [params]: [Param0<CatalogCardProps["onDeclareOneselfReferent"]>],
        ) => {
            const { isExpert } = params;

            onDeclareOneselfReferent({
                softwareId,
                isExpert,
            });
        },
    );

    const onUserNoLongerReferentFactory = useCallbackFactory(([softwareId]: [number]) =>
        onUserNoLongerReferent({ softwareId }),
    );

    const catalogCardBySoftwareId = Object.fromEntries(
        [
            ...filteredSoftwares,
            ...alikeSoftwares
                .map(o => (o.isKnown ? o.software : undefined))
                .filter(exclude(undefined)),
        ]
            .reduce(...removeDuplicates<CompiledData.Software>())
            .map(software => {
                const { referents, userIndex } =
                    referentsBySoftwareId?.[software.id] ?? {};

                return { software, referents, userIndex };
            })
            .map(({ software, referents, userIndex }) => [
                software.id,
                <CatalogCard
                    key={software.id}
                    software={software}
                    openLink={openLinkBySoftwareId[software.id]!}
                    referents={referents}
                    userIndexInReferents={userIndex}
                    onLogin={onLogin}
                    onDeclareOneselfReferent={onDeclareOneselfReferentFactory(
                        software.id,
                    )}
                    onUserNoLongerReferent={onUserNoLongerReferentFactory(software.id)}
                />,
            ]),
    );

    return (
        <>
            {doRenderSearchBarInHeader &&
                createPortal(searchBarNode, searchBarWrapperElement)}
            <div className={className}>
                {!doRenderSearchBarInHeader && searchBarNode}
                {filteredSoftwares.length !== 0 && (
                    <Text typo="section heading" className={classes.contextTypo}>
                        {t(search !== "" ? "search results" : "all software")}
                        &nbsp;
                        <Button
                            {...referenceNewSoftwareLink}
                            doOpenNewTabIfHref={false}
                            className={classes.formLinkButton}
                        >
                            {t("reference a new software")}
                        </Button>
                    </Text>
                )}
                <div className={classes.cards}>
                    {filteredSoftwares.length === 0 ? (
                        <NoMatches search={search} onGoBackClick={onGoBackClick} />
                    ) : (
                        filteredSoftwares.map(
                            software => catalogCardBySoftwareId[software.id],
                        )
                    )}
                </div>
                {(() => {
                    if (alikeSoftwares.length === 0) {
                        return null;
                    }

                    const softwares: CompiledData.Software[] = [];
                    const otherSoftwareNames: string[] = [];

                    alikeSoftwares.forEach(alikeSoftware => {
                        if (alikeSoftware.isKnown) {
                            softwares.push(alikeSoftware.software);
                        } else {
                            otherSoftwareNames.push(alikeSoftware.softwareName);
                        }
                    });

                    return (
                        <>
                            <Text
                                typo="section heading"
                                className={css({
                                    ...theme.spacing.topBottom("margin", 2),
                                })}
                            >
                                {t("alike software")}
                            </Text>
                            <div className={classes.cards}>
                                {softwares.map(
                                    software => catalogCardBySoftwareId[software.id],
                                )}
                            </div>
                            {otherSoftwareNames.length !== 0 && (
                                <Text typo="label 1">
                                    {capitalize(t("other similar software"))} :
                                    {alikeSoftwares
                                        .map(o =>
                                            o.isKnown ? undefined : o.softwareName,
                                        )
                                        .filter(exclude(undefined))
                                        .join(", ")}
                                </Text>
                            )}
                        </>
                    );
                })()}
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
        "alike software": undefined;
        "other similar software": undefined;
        "reference a new software": undefined;
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
                          if (isViewPortAdapterEnabled) {
                              return 3;
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
        "formLinkButton": {
            "marginLeft": theme.spacing(3),
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
