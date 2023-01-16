import "minimal-polyfills/Object.fromEntries";
import React, { memo } from "react";
import { makeStyles } from "tss-react/dsfr";
import { CatalogCard } from "./CatalogCard";
/*import { CatalogSearchArea } from "./CatalogSearchArea.tsx";*/
import type { Props as CatalogCardProps } from "./CatalogCard";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { useConstCallback } from "powerhooks/useConstCallback";
import MuiLink from "@mui/material/Link";
import { ReactComponent as ServiceNotFoundSvg } from "ui-dsfr/assets/svg/ServiceNotFound.svg";
import { useOnLoadMore } from "powerhooks/useOnLoadMore";
import { CircularProgress } from "onyxia-ui/CircularProgress";
import type { Link } from "type-route";
import type { CompiledData } from "sill-api";
import { exclude } from "tsafe/exclude";
import { capitalize } from "tsafe/capitalize";
import { removeDuplicates } from "evt/tools/reducers/removeDuplicates";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import type { Param0 } from "tsafe";
import { useStateRef } from "powerhooks/useStateRef";
import { fr } from "@codegouvfr/react-dsfr";
//import {  } from "@codegouvfr/react-dsfr/fr"
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";

export type Software = {
    softwareId: number;
    softwareLogoUrl?: string;
    softwareName: string;
    isFromFrenchPublicService: boolean;
    isDesktop: boolean;
    isPresentInSupportMarket: boolean;
    softwareCurrentVersion: string;
    softwareDateCurrentVersion: number;
    softwareDescription?: string;
    userCount: number;
    referentCount: number;
    seeUserAndReferent: Link;
    declareUserOrReferent: Link;
    demoLink: Link;
    softwareDetailsLink: Link;
};

export type Props = {
    className?: string;
    search: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchResultCount: number;
    onLoadMore: () => void;
    hasMoreToLoad: boolean;
    softwareList: Software[];
};

export const CatalogCards = memo((props: Props) => {
    const {
        className,
        searchResultCount,
        search,
        onSearchChange,
        onLoadMore,
        hasMoreToLoad,
        softwareList,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ CatalogCards });

    const loadingDivRef = useStateRef<HTMLDivElement>(null);

    useOnLoadMore({
        loadingDivRef,
        onLoadMore,
    });

    const { classes, cx } = useStyles({
        "softwareListCount": softwareList.length,
        hasMoreToLoad,
    });

    const catalogCards = softwareList
        .reduce(...removeDuplicates<Software>())
        .map(software => {
            const {
                softwareId,
                softwareName,
                isPresentInSupportMarket,
                isFromFrenchPublicService,
                isDesktop,
                softwareCurrentVersion,
                softwareDateCurrentVersion,
                softwareDescription,
                userCount,
                referentCount,
                seeUserAndReferent,
                declareUserOrReferent,
                demoLink,
                softwareDetailsLink,
                softwareLogoUrl,
            } = software;

            return (
                <CatalogCard
                    key={softwareId}
                    softwareLogoUrl={softwareLogoUrl}
                    softwareName={softwareName}
                    isFromFrenchPublicService={isFromFrenchPublicService}
                    isDesktop={isDesktop}
                    isPresentInSupportMarket={isPresentInSupportMarket}
                    softwareCurrentVersion={softwareCurrentVersion}
                    softwareDateCurrentVersion={softwareDateCurrentVersion}
                    softwareDescription={softwareDescription}
                    userCount={userCount}
                    referentCount={referentCount}
                    seeUserAndReferent={seeUserAndReferent}
                    declareUserOrReferent={declareUserOrReferent}
                    demoLink={demoLink}
                    softwareDetailsLink={softwareDetailsLink}
                />
            );
        });

    /*    const evtCatalogSearchAreaAction = useConst(() =>
        Evt.create<CatalogSearchAreaProps["evtAction"]>(),
    );*/

    /*    const onGoBackClick = useConstCallback(() =>
        evtCatalogSearchAreaAction.post("CLEAR SEARCH"),
    );*/

    return (
        /*            <CatalogSearchArea
                tags={tags}
                selectedTags={selectedTags}
                onSelectedTagsChange={onSelectedTagsChange}
                search={search}
                onSearchChange={onSearchChange}
            />*/
        <div className={cx(classes.cards)}>{catalogCards}</div>
    );
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
                      "gridColumnGap": fr.spacing("4v"),
                      "gridRowGap": fr.spacing("3v"),
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
