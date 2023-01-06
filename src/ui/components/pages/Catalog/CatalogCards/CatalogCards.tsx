import "minimal-polyfills/Object.fromEntries";
import React, { memo } from "react";
import { makeStyles, Text, Button } from "ui/theme";
import { CatalogCard } from "./CatalogCard";
import { CatalogSearchArea } from "./CatalogSearchArea";
import type { Props as CatalogCardProps } from "./CatalogCard";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { ReactComponent as ServiceNotFoundSvg } from "ui/assets/svg/ServiceNotFound.svg";
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
import type { NonPostableEvt } from "evt";
import { routes } from "../../../../routes";

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
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    tags: string[];
    selectedTags: string[];
    onSelectedTagsChange: (selectedTags: string[]) => void;
    onLoadMore: () => void;
    hasMoreToLoad: boolean;
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
        onLogin,
        onDeclareReferentAnswer,
        onUserNoLongerReferent,
        referenceNewSoftwareLink,
    } = props;

    const { t } = useTranslation({ CatalogCards });

    const loadingDivRef = useStateRef<HTMLDivElement>(null);

    useOnLoadMore({
        loadingDivRef,
        onLoadMore,
    });

    const { classes, css, theme } = useStyles({
        "filteredCardCount": filteredSoftwares.length,
        hasMoreToLoad,
    });

    const onDeclareReferentAnswerFactory = useCallbackFactory(
        (
            [softwareId]: [number],
            [{ isExpert, useCaseDescription, isPersonalUse }]: [
                Param0<CatalogCardProps["onDeclareReferentAnswer"]>,
            ],
        ) =>
            onDeclareReferentAnswer({
                softwareId,
                isExpert,
                useCaseDescription,
                isPersonalUse,
            }),
    );

    const onUserNoLongerReferentFactory = useCallbackFactory(([softwareId]: [number]) =>
        onUserNoLongerReferent({ softwareId }),
    );

    const onTagClick = useConstCallback<CatalogCardProps["onTagClick"]>(tag =>
        onSelectedTagsChange([tag, ...selectedTags]),
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
                    declareUserOrReferent={routes.home().link}
                    editLink={editLinkBySoftwareId[software.id]!}
                    parentSoftware={parentSoftwareBySoftwareId[software.id]}
                    referents={referents}
                    userIndexInReferents={userIndex}
                    onLogin={onLogin}
                    onDeclareReferentAnswer={onDeclareReferentAnswerFactory(software.id)}
                    onUserNoLongerReferent={onUserNoLongerReferentFactory(software.id)}
                    onTagClick={onTagClick}
                />,
            ]),
    );

    /*    const evtCatalogSearchAreaAction = useConst(() =>
        Evt.create<CatalogSearchAreaProps["evtAction"]>(),
    );*/

    /*    const onGoBackClick = useConstCallback(() =>
        evtCatalogSearchAreaAction.post("CLEAR SEARCH"),
    );*/

    return (
        <>
            <CatalogSearchArea
                tags={tags}
                selectedTags={selectedTags}
                onSelectedTagsChange={onSelectedTagsChange}
                search={search}
                onSearchChange={onSearchChange}
            />

            <div className={className}>
                {/** TODO : Show results of search */}
                {/*                {!doRenderSearchBarInHeader && catalogSearchAreaNode}
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
                )}*/}
                <h6>{t("search results", { count: searchResultCount })}</h6>
                <div className={classes.cards}>
                    {filteredSoftwares.length === 0 ? (
                        /*<NoMatches search={search} onGoBackClick={onGoBackClick} />*/
                        <p>No match</p>
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
>()({ CatalogCards });

const useStyles = makeStyles<
    {
        filteredCardCount: number;
        hasMoreToLoad: boolean;
    },
    "moreToLoadProgress"
>({ "name": { CatalogCards } })(
    (theme, { filteredCardCount, hasMoreToLoad }, classes) => ({
        "contextTypo": {
            "marginBottom": theme.spacing(4),
        },
        "cards": {
            ...(filteredCardCount === 0
                ? {}
                : {
                      "display": "grid",
                      "gridTemplateColumns": `repeat(${(() => {
                          return 3;
                      })()}, 1fr)`,
                      "gridColumnGap": theme.spacing(4),
                      "gridRowGap": theme.spacing(3),
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
