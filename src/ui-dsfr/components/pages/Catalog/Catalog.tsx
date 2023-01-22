import "minimal-polyfills/Object.fromEntries";
import React, { useEffect, useState } from "react";
import { createGroup } from "type-route";
import type { Link } from "type-route";
import { makeStyles } from "tss-react/dsfr";
import type { Route } from "type-route";
import { declareComponentKeys } from "i18nifty";
import { useStateRef } from "powerhooks/useStateRef";
import { useStickyTop } from "powerhooks/useStickyTop";
import { createUseDebounce } from "powerhooks/useDebounce";
import { Fzf } from "fzf";
import { routes } from "ui/routes";
import { Props as CatalogCardProps } from "./CatalogCards/CatalogCard";
import { CatalogCards } from "./CatalogCards";
import { Search } from "./CatalogCards/Search";
import { Props as SearchProps } from "./CatalogCards/Search";

import LibreOfficeLogo from "../../../../stories/assets/logo_libreoffice.png";
import { logCallbacks } from "../../../../stories/getStory";

Catalog.routeGroup = createGroup([routes.catalog]);

type PageRoute = Route<typeof Catalog.routeGroup>;

Catalog.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

const { useDebounce } = createUseDebounce({ "delay": 400 });

export function Catalog(props: Props) {
    const { className, route } = props;
    const pageHeaderRef = useStateRef<HTMLDivElement>(null);
    const { top: pageHeaderStickyTop } = useStickyTop({ "ref": pageHeaderRef });
    const { classes, cx } = useStyles({ pageHeaderStickyTop });

    /**
     * MOCK DATA
     */
    const softwares = new Array(20).fill(0).map((...[, _i]) => ({
        softwareLogoUrl: LibreOfficeLogo,
        softwareName: `LibreOffice-${_i}`,
        softwareCurrentVersion: "2.0.1",
        softwareDateCurrentVersion: 1640995200000,
        declareUserOrReferent: {
            href: "#",
            onClick: () => {},
        },
        seeUserAndReferent: {
            href: "#",
            onClick: () => {},
        },
        demoLink: {
            href: "#",
            onClick: () => {},
        },
        isPresentInSupportMarket: true,
        isDesktop: true,
        isFromFrenchPublicService: true,
        softwareDescription:
            "Suite bureautique (logiciel de traitement de texte, tableur, etc.).",
        userCount: 13,
        referentCount: 4,

        softwareDetailsLink: {
            href: "#",
            onClick: () => {},
        },
        ...logCallbacks([
            "onLogin",
            "onDeclareReferentAnswer",
            "onUserNoLongerReferent",
            "onTagClick",
        ]),
    }));

    const organisations = ["organisation1", "organisation2", "organisation3"];
    const categories = ["category1", "category2", "category3"];
    const contexts = ["context1", "context2", "context3"];
    const prerogatives = ["prerogative1", "prerogative2", "prerogative3"];
    /**
     * FIN MOCK DATA
     */

    const [search, setSearch] = useState(route.params.q);
    const [selectedOrganisation, setSelectedOrganisation] =
        useState<SearchProps["selectedOrganisation"]>(undefined);
    const [selectedCategory, setSelectedCategory] =
        useState<SearchProps["selectedOrganisation"]>(undefined);
    const [selectedContext, setSelectedContext] =
        useState<SearchProps["selectedOrganisation"]>(undefined);
    const [selectedPrerogative, setSelectedPrerogative] =
        useState<SearchProps["selectedOrganisation"]>(undefined);

    const fzf = new Fzf<Omit<CatalogCardProps, "className">[]>(softwares, {
        "selector": item => item.softwareName,
    });

    const [
        filteredColorDecisionAndCorrespondingOption,
        setFilteredColorDecisionAndCorrespondingOption,
    ] = useState<Omit<CatalogCardProps, "className">[]>(softwares);

    useEffect(() => {
        updateSearch();
    }, []);

    const updateSearch = () => {
        setFilteredColorDecisionAndCorrespondingOption(
            fzf
                .find(search)
                .map(
                    ({ item: colorDecisionAndCorrespondingOption }) =>
                        colorDecisionAndCorrespondingOption,
                ),
        );
    };

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
        return routes.catalog({ "q": event.target.value }).replace();
    };

    useDebounce(updateSearch, [search]);

    return (
        <div className={cx(classes.root, className)}>
            <div>
                <p>Query: {route.params.q} </p>
                <Search
                    search={search}
                    onSearchChange={onSearchChange}
                    organisations={organisations}
                    onOrganisationChange={setSelectedOrganisation}
                    selectedOrganisation={selectedOrganisation}
                    categories={categories}
                    onCategoriesChange={setSelectedCategory}
                    selectedCategories={selectedCategory}
                    contexts={contexts}
                    onContextChange={setSelectedContext}
                    selectedContext={selectedContext}
                    prerogatives={prerogatives}
                    onPrerogativesChange={setSelectedPrerogative}
                    selectedPrerogatives={selectedPrerogative}
                />
                <CatalogCards
                    searchResultCount={filteredColorDecisionAndCorrespondingOption.length}
                    search={search}
                    catalogCardList={filteredColorDecisionAndCorrespondingOption}
                    onLoadMore={() => {
                        console.log("on Load more");
                    }}
                    hasMoreToLoad={false}
                />
            </div>
        </div>
    );
}

const useStyles = makeStyles<{ pageHeaderStickyTop: number | undefined }>({
    "name": { Catalog },
})(theme => {
    return {
        "root": {
            "marginLeft": "unset",
        },
        "pageHeader": {
            "backgroundColor": theme.decisions.background.default.grey.default,
            "marginBottom": 0,
        },
    };
});
