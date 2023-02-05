import "minimal-polyfills/Object.fromEntries";
import { memo } from "react";
import { createPortal } from "react-dom";
import { makeStyles, Text, Button, isViewPortAdapterEnabled } from "ui/theme";
import { CatalogCard } from "./CatalogCard";
import type { Props as CatalogCardProps } from "./CatalogCard";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { ReactComponent as ServiceNotFoundSvg } from "ui/assets/svg/ServiceNotFound.svg";
import { SearchBar } from "onyxia-ui/SearchBar";
import type { SearchBarProps } from "onyxia-ui/SearchBar";
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
import { useStateRef } from "powerhooks/useStateRef";
import { GitHubPicker } from "onyxia-ui/GitHubPicker";
import type { GitHubPickerProps } from "onyxia-ui/GitHubPicker";
import { getTagColor } from "ui/components/shared/Tags/TagColor";
import { CustomTag } from "ui/components/shared/Tags/CustomTag";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";

export type Props = {
    className?: string;
    searchResultCount: number;
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
    editLinkBySoftwareId: Record<number, Link>;
    parentSoftwareBySoftwareId: Record<
        number,
        | {
              name: string;
              link: Link | undefined;
          }
        | undefined
    >;
    search: string;
    onSearchChange: (search: string) => void;
    tags: string[];
    selectedTags: string[];
    onSelectedTagsChange: (selectedTags: string[]) => void;
    onLoadMore: () => void;
    hasMoreToLoad: boolean;
    searchBarWrapperElement: HTMLDivElement;
    onLogin: () => void;
    onDeclareReferentAnswer: (params: {
        softwareId: number;
        isExpert: boolean;
        useCaseDescription: string;
        isPersonalUse: boolean;
    }) => void;
    onUserNoLongerReferent: (params: { softwareId: number }) => void;
    referenceNewSoftwareLink: Link;
};

export const CatalogCards = memo((props: Props) => {
    const {
        className,
        searchResultCount,
        filteredSoftwares,
        alikeSoftwares,
        referentsBySoftwareId,
        openLinkBySoftwareId,
        editLinkBySoftwareId,
        parentSoftwareBySoftwareId,
        search,
        onSearchChange,
        tags,
        selectedTags,
        onSelectedTagsChange,
        onLoadMore,
        hasMoreToLoad,
        searchBarWrapperElement,
        onLogin,
        onDeclareReferentAnswer,
        onUserNoLongerReferent,
        referenceNewSoftwareLink
    } = props;

    const { t } = useTranslation({ CatalogCards });

    const loadingDivRef = useStateRef<HTMLDivElement>(null);

    useOnLoadMore({
        loadingDivRef,
        onLoadMore
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
        doRenderSearchBarInHeader
    });

    const onDeclareReferentAnswerFactory = useCallbackFactory(
        (
            [softwareId]: [number],
            [{ isExpert, useCaseDescription, isPersonalUse }]: [
                Param0<CatalogCardProps["onDeclareReferentAnswer"]>
            ]
        ) =>
            onDeclareReferentAnswer({
                softwareId,
                isExpert,
                useCaseDescription,
                isPersonalUse
            })
    );

    const onUserNoLongerReferentFactory = useCallbackFactory(([softwareId]: [number]) =>
        onUserNoLongerReferent({ softwareId })
    );

    const onTagClick = useConstCallback<CatalogCardProps["onTagClick"]>(tag =>
        onSelectedTagsChange([tag, ...selectedTags])
    );

    const catalogCardBySoftwareId = Object.fromEntries(
        [
            ...filteredSoftwares,
            ...alikeSoftwares
                .map(o => (o.isKnown ? o.software : undefined))
                .filter(exclude(undefined))
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
                    editLink={editLinkBySoftwareId[software.id]!}
                    parentSoftware={parentSoftwareBySoftwareId[software.id]}
                    referents={referents}
                    userIndexInReferents={userIndex}
                    onLogin={onLogin}
                    onDeclareReferentAnswer={onDeclareReferentAnswerFactory(software.id)}
                    onUserNoLongerReferent={onUserNoLongerReferentFactory(software.id)}
                    onTagClick={onTagClick}
                />
            ])
    );

    const evtCatalogSearchAreaAction = useConst(() =>
        Evt.create<CatalogSearchAreaProps["evtAction"]>()
    );

    const onGoBackClick = useConstCallback(() =>
        evtCatalogSearchAreaAction.post("CLEAR SEARCH")
    );

    const catalogSearchAreaNode = (
        <CatalogSearchArea
            className={classes.searchBarWrapper}
            evtAction={evtCatalogSearchAreaAction}
            tags={tags}
            selectedTags={selectedTags}
            onSelectedTagsChange={onSelectedTagsChange}
            search={search}
            onSearchChange={onSearchChange}
        />
    );

    return (
        <>
            {doRenderSearchBarInHeader &&
                createPortal(catalogSearchAreaNode, searchBarWrapperElement)}
            <div className={className}>
                {!doRenderSearchBarInHeader && catalogSearchAreaNode}
                {filteredSoftwares.length !== 0 && (
                    <Text typo="section heading" className={classes.contextTypo}>
                        {t("search results", { count: searchResultCount })}
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
                            software => catalogCardBySoftwareId[software.id]
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
                                    ...theme.spacing.topBottom("margin", 2)
                                })}
                            >
                                {t("alike software")}
                            </Text>
                            <div className={classes.cards}>
                                {softwares.map(
                                    software => catalogCardBySoftwareId[software.id]
                                )}
                            </div>
                            {otherSoftwareNames.length !== 0 && (
                                <Text typo="label 1">
                                    {capitalize(t("other similar software"))} :
                                    {alikeSoftwares
                                        .map(o =>
                                            o.isKnown ? undefined : o.softwareName
                                        )
                                        .filter(exclude(undefined))
                                        .join(", ")}
                                </Text>
                            )}
                        </>
                    );
                })()}
                <div ref={loadingDivRef} className={classes.bottomScrollSpace}>
                    <CircularProgress
                        className={classes.moreToLoadProgress}
                        color="textPrimary"
                    />
                </div>
            </div>
        </>
    );
});

export const { i18n } = declareComponentKeys<
    | "main services"
    | { K: "search results"; P: { count: number } }
    | "show more"
    | "no service found"
    | { K: "no result found"; P: { forWhat: string } }
    | "check spelling"
    | "go back"
    | "search"
    | "alike software"
    | "other similar software"
    | "reference a new software"
    | "filter by tags"
>()({ CatalogCards });

const useStyles = makeStyles<
    {
        filteredCardCount: number;
        hasMoreToLoad: boolean;
        doRenderSearchBarInHeader: boolean;
    },
    "moreToLoadProgress"
>({ "name": { CatalogCards } })(
    (
        theme,
        { filteredCardCount, hasMoreToLoad, doRenderSearchBarInHeader },
        classes
    ) => ({
        "searchBarWrapper": {
            "paddingBottom": theme.spacing(4),
            ...(doRenderSearchBarInHeader
                ? {}
                : {
                      "position": "sticky",
                      "top": theme.spacing(3)
                  })
        },
        "contextTypo": {
            "marginBottom": theme.spacing(4)
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
                      "gap": theme.spacing(4)
                  })
        },
        "bottomScrollSpace": {
            ...(hasMoreToLoad
                ? {
                      "display": "flex",
                      "justifyContent": "center",
                      ...theme.spacing.topBottom("padding", 3)
                  }
                : {
                      [`& .${classes.moreToLoadProgress}`]: {
                          "display": "none"
                      },
                      "height": theme.spacing(3)
                  })
        },
        "moreToLoadProgress": {},
        "formLinkButton": {
            "marginLeft": theme.spacing(3)
        }
    })
);

const { NoMatches } = (() => {
    type Props = {
        search: string;
        onGoBackClick(): void;
    };

    const useStyles = makeStyles()(theme => ({
        "root": {
            "display": "flex",
            "justifyContent": "center"
        },
        "innerDiv": {
            "textAlign": "center",
            "maxWidth": 500
        },
        "svg": {
            "fill": theme.colors.palette.dark.greyVariant2,
            "width": 100,
            "margin": 0
        },
        "h2": {
            ...theme.spacing.topBottom("margin", 4)
        },
        "typo": {
            "marginBottom": theme.spacing(1),
            "color": theme.colors.palette.light.greyVariant3
        },
        "link": {
            "cursor": "pointer"
        }
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

type CatalogSearchAreaProps = {
    className?: string;
    evtAction: NonPostableEvt<"CLEAR SEARCH">;
    tags: string[];
    selectedTags: string[];
    onSelectedTagsChange: (selectedTags: string[]) => void;
    search: string;
    onSearchChange: (search: string) => void;
};

const { CatalogSearchArea } = (() => {
    const CatalogSearchArea = memo((props: CatalogSearchAreaProps) => {
        const {
            className,
            evtAction,
            tags,
            selectedTags,
            onSelectedTagsChange,
            search,
            onSearchChange
        } = props;

        const evtSearchBarAction = useConst(() =>
            Evt.create<SearchBarProps["evtAction"]>()
        );

        const evtGitHubPickerAction = useConst(() =>
            Evt.create<GitHubPickerProps["evtAction"]>()
        );

        useEvt(
            ctx =>
                evtAction.attach(
                    data => data === "CLEAR SEARCH",
                    ctx,
                    () => evtSearchBarAction.post("CLEAR SEARCH")
                ),
            [evtAction]
        );

        const buttonRef = useStateRef<HTMLButtonElement>(null);

        const { classes, cx, theme } = useStyles();

        const onSelectedTags = useConstCallback<GitHubPickerProps["onSelectedTags"]>(
            params => {
                onSelectedTagsChange(
                    params.isSelect
                        ? [...selectedTags, params.tag]
                        : selectedTags.filter(tag => tag !== params.tag)
                );

                evtGitHubPickerAction.post({
                    "action": "close"
                });
            }
        );

        const { t } = useTranslation({ CatalogCards });

        return (
            <div className={cx(classes.root, className)}>
                <SearchBar
                    className={classes.searchBar}
                    search={search}
                    evtAction={evtSearchBarAction}
                    onSearchChange={onSearchChange}
                    placeholder={t("search")}
                />
                {selectedTags.map(tag => (
                    <CustomTag
                        className={classes.tag}
                        tag={tag}
                        key={tag}
                        onRemove={() =>
                            onSelectedTags({
                                "isSelect": false,
                                tag
                            })
                        }
                    />
                ))}
                <Button
                    ref={buttonRef}
                    className={classes.tagButton}
                    startIcon="add"
                    variant="secondary"
                    onClick={() =>
                        evtGitHubPickerAction.post({
                            "action": "open",
                            "anchorEl":
                                (assert(buttonRef.current !== null), buttonRef.current)
                        })
                    }
                >
                    {t("filter by tags")}
                </Button>
                <GitHubPicker
                    evtAction={evtGitHubPickerAction}
                    getTagColor={tag => getTagColor({ tag, theme }).color}
                    tags={tags}
                    selectedTags={selectedTags}
                    onSelectedTags={onSelectedTags}
                />
            </div>
        );
    });

    const useStyles = makeStyles({ "name": { CatalogSearchArea } })(theme => ({
        "root": {
            "display": "flex"
        },
        "searchBar": {
            "flex": 1
        },
        "tag": {
            "marginLeft": theme.spacing(2)
        },
        "tagButton": {
            "marginLeft": theme.spacing(2)
        }
    }));

    return { CatalogSearchArea };
})();
