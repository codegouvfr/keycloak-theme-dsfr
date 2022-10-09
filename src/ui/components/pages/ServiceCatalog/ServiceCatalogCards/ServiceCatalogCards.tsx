import "minimal-polyfills/Object.fromEntries";
import { useMemo, memo } from "react";
import { createPortal } from "react-dom";
import { makeStyles, Text, Button, isViewPortAdapterEnabled } from "ui/theme";
import { ServiceCatalogCard } from "./ServiceCatalogCard";
import type { Props as ServiceCatalogCardProps } from "./ServiceCatalogCard";
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
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useStateRef } from "powerhooks/useStateRef";
import { GitHubPicker } from "onyxia-ui/GitHubPicker";
import type { GitHubPickerProps } from "onyxia-ui/GitHubPicker";
import { getTagColor } from "ui/components/shared/Tags/TagColor";
import { CustomTag } from "ui/components/shared/Tags/CustomTag";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import type { ServiceWithSoftwareInfo } from "core/usecases/serviceCatalog";
import type { Param0 } from "tsafe";

export type Props = Props.UserLoggedIn | Props.UserNotLoggedIn;

export namespace Props {
    export type Common = {
        className?: string;
        searchResultCount: number;
        referenceNewServiceLink: Link;
        filteredServices: ServiceWithSoftwareInfo[];
        editLinkByServiceId: Record<number, Link>;
        sillSoftwareLinkByServiceId: Record<number, Link | undefined>;
        search: string;
        onSearchChange: (search: string) => void;
        softwareNames: string[];
        selectedSoftwareName: string | undefined;
        onSelectedSoftwareChange: (softwareName: string | undefined) => void;
        onLoadMore: () => void;
        hasMoreToLoad: boolean;
        searchBarWrapperElement: HTMLDivElement;
    };

    export type UserLoggedIn = Common & {
        isUserLoggedIn: true;
        onRequestDelete: (params: { serviceId: number; reason: string }) => void;
    };

    export type UserNotLoggedIn = Common & {
        isUserLoggedIn: false;
        onLogin: () => void;
    };
}

export const ServiceCatalogCards = memo((props: Props) => {
    const {
        className,
        searchResultCount,
        referenceNewServiceLink,
        filteredServices,
        editLinkByServiceId,
        sillSoftwareLinkByServiceId,
        search,
        onSearchChange,
        softwareNames,
        selectedSoftwareName,
        onSelectedSoftwareChange,
        onLoadMore,
        hasMoreToLoad,
        searchBarWrapperElement,
        ...propsRest
    } = props;

    const { t } = useTranslation({ ServiceCatalogCards });

    const loadingDivRef = useStateRef<HTMLDivElement>(null);

    useOnLoadMore({ loadingDivRef, onLoadMore });

    const doRenderSearchBarInHeader = isViewPortAdapterEnabled;

    const { classes } = useStyles({
        "filteredCardCount": filteredServices.length,
        hasMoreToLoad,
        doRenderSearchBarInHeader,
    });

    const onRequestDeleteFactory = useCallbackFactory(
        (
            [serviceId]: [number],
            [{ reason }]: [
                Param0<ServiceCatalogCardProps.UserLoggedIn["onRequestDelete"]>,
            ],
        ) => {
            assert(propsRest.isUserLoggedIn);
            propsRest.onRequestDelete({ serviceId, reason });
        },
    );

    const evtCatalogSearchAreaAction = useConst(() =>
        Evt.create<SearchAreaProps["evtAction"]>(),
    );

    const onGoBackClick = useConstCallback(() =>
        evtCatalogSearchAreaAction.post("CLEAR SEARCH"),
    );

    const catalogSearchAreaNode = (
        <SearchArea
            className={classes.searchBarWrapper}
            evtAction={evtCatalogSearchAreaAction}
            softwareNames={softwareNames}
            selectedSoftwareName={selectedSoftwareName}
            onSelectedSoftwareChange={onSelectedSoftwareChange}
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
                {filteredServices.length !== 0 && (
                    <Text typo="section heading" className={classes.contextTypo}>
                        {t("search results", { "count": searchResultCount })}
                        &nbsp;
                        <Button
                            {...referenceNewServiceLink}
                            doOpenNewTabIfHref={false}
                            className={classes.formLinkButton}
                        >
                            {t("reference a new service")}
                        </Button>
                    </Text>
                )}
                <div className={classes.cards}>
                    {filteredServices.length === 0 ? (
                        <NoMatches search={search} onGoBackClick={onGoBackClick} />
                    ) : (
                        filteredServices.map(service => (
                            <ServiceCatalogCard
                                key={service.id}
                                service={service}
                                editLink={editLinkByServiceId[service.id]!}
                                sillSoftwareLink={sillSoftwareLinkByServiceId[service.id]}
                                {...(propsRest.isUserLoggedIn
                                    ? {
                                          "isUserLoggedIn": true,
                                          "onRequestDelete": onRequestDeleteFactory(
                                              service.id,
                                          ),
                                      }
                                    : {
                                          "isUserLoggedIn": false,
                                          "onLogin": propsRest.onLogin,
                                      })}
                            />
                        ))
                    )}
                </div>
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

const useStyles = makeStyles<
    {
        filteredCardCount: number;
        hasMoreToLoad: boolean;
        doRenderSearchBarInHeader: boolean;
    },
    "moreToLoadProgress"
>({ "name": { ServiceCatalogCards } })(
    (
        theme,
        { filteredCardCount, hasMoreToLoad, doRenderSearchBarInHeader },
        classes,
    ) => ({
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
                      [`& .${classes.moreToLoadProgress}`]: {
                          "display": "none",
                      },
                      "height": theme.spacing(3),
                  }),
        },
        "moreToLoadProgress": {},
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

        const { t } = useTranslation({ CatalogCards: ServiceCatalogCards });

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

type SearchAreaProps = {
    className?: string;
    evtAction: NonPostableEvt<"CLEAR SEARCH">;
    softwareNames: string[];
    selectedSoftwareName: string | undefined;
    onSelectedSoftwareChange: (softwareName: string | undefined) => void;
    search: string;
    onSearchChange: (search: string) => void;
};

const { SearchArea } = (() => {
    const SearchArea = memo((props: SearchAreaProps) => {
        const {
            className,
            evtAction,
            softwareNames,
            selectedSoftwareName,
            onSelectedSoftwareChange,
            search,
            onSearchChange,
        } = props;

        const evtSearchBarAction = useConst(() =>
            Evt.create<SearchBarProps["evtAction"]>(),
        );

        const evtGitHubPickerAction = useConst(() =>
            Evt.create<GitHubPickerProps["evtAction"]>(),
        );

        useEvt(
            ctx =>
                evtAction.attach(
                    data => data === "CLEAR SEARCH",
                    ctx,
                    () => evtSearchBarAction.post("CLEAR SEARCH"),
                ),
            [evtAction],
        );

        const buttonRef = useStateRef<HTMLButtonElement>(null);

        const { classes, cx, theme } = useStyles();

        const onGitHubPickerSelectTags = useConstCallback<
            GitHubPickerProps["onSelectedTags"]
        >(params => {
            onSelectedSoftwareChange(params.isSelect ? params.tag : undefined);

            evtGitHubPickerAction.post({
                "action": "close",
            });
        });

        const { t } = useTranslation({ ServiceCatalogCards });

        const githubPickerSelectedTags = useMemo(
            () => (selectedSoftwareName === undefined ? [] : [selectedSoftwareName]),
            [selectedSoftwareName],
        );

        return (
            <div className={cx(classes.root, className)}>
                <SearchBar
                    className={classes.searchBar}
                    search={search}
                    evtAction={evtSearchBarAction}
                    onSearchChange={onSearchChange}
                    placeholder={t("search")}
                />
                {selectedSoftwareName !== undefined && (
                    <CustomTag
                        className={classes.tag}
                        tag={selectedSoftwareName}
                        onRemove={() =>
                            onGitHubPickerSelectTags({
                                "isSelect": false,
                                "tag": selectedSoftwareName,
                            })
                        }
                    />
                )}
                <Button
                    ref={buttonRef}
                    className={classes.tagButton}
                    startIcon="add"
                    variant="secondary"
                    onClick={() =>
                        evtGitHubPickerAction.post({
                            "action": "open",
                            "anchorEl":
                                (assert(buttonRef.current !== null), buttonRef.current),
                        })
                    }
                >
                    {t("filter by software")}
                </Button>
                <GitHubPicker
                    evtAction={evtGitHubPickerAction}
                    getTagColor={tag => getTagColor({ tag, theme }).color}
                    tags={softwareNames}
                    selectedTags={githubPickerSelectedTags}
                    onSelectedTags={onGitHubPickerSelectTags}
                />
            </div>
        );
    });

    const useStyles = makeStyles({ "name": { SearchArea } })(theme => ({
        "root": {
            "display": "flex",
        },
        "searchBar": {
            "flex": 1,
        },
        "tag": {
            "marginLeft": theme.spacing(2),
        },
        "tagButton": {
            "marginLeft": theme.spacing(2),
        },
    }));

    return { SearchArea };
})();

export const { i18n } = declareComponentKeys<
    | { K: "search results"; P: { count: number } }
    | "show more"
    | "no service found"
    | { K: "no result found"; P: { forWhat: string } }
    | "check spelling"
    | "go back"
    | "search"
    | "filter by software"
    | "reference a new service"
>()({ ServiceCatalogCards });
