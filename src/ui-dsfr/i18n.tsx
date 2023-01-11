import MuiLink from "@mui/material/Link";
import { createI18nApi, declareComponentKeys } from "i18nifty";
import { languages } from "sill-api";
import type { Language } from "sill-api";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { statefulObservableToStatefulEvt } from "powerhooks/tools/StatefulObservable/statefulObservableToStatefulEvt";
import { z } from "zod";
import { createUnionSchema } from "ui/tools/zod/createUnionSchema";

export { declareComponentKeys };
export { languages };
export type { Language };

console.log("ui-dsfr!!!!");

export const fallbackLanguage = "en";

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

const {
    useTranslation,
    resolveLocalizedString,
    useLang,
    $lang,
    useResolveLocalizedString,
} = createI18nApi<
    //| typeof import("ui-dsfr/components/pages/Catalog/CatalogCards/CatalogCards").i18n
    typeof import("ui-dsfr/components/pages/Catalog/CatalogCards/CatalogCard").i18n
    //| typeof import("ui-dsfr/components/pages/Catalog").i18n
>()(
    { languages, fallbackLanguage },
    {
        "en": {
            "CatalogCard": {
                "last version": "Last version",
                "last version date": ({ date }) => `in (${date})`,
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} users and ${referentCount} referents`,
                "declare oneself referent": "Declare yourself referent / user",
                "isDesktop": "This software can be installed on desktop"
            },
            /*
            "CatalogCards": {
                "show more": "Show more",
                "no service found": "No software found",
                "no result found": ({ forWhat }) => `No result found for ${forWhat}`,
                "check spelling":
                    "Please check your spelling or try widening your search.",
                "go back": "Back to main services",
                "main services": "Main services",
                "search results": ({ count }) => `${count} Free software`,
                "search": "Search",
                "alike software": "Alike software",
                "other similar software":
                    "Others similar software that are not in the catalog",
                "reference a new software": "Reference a new software",
                "filter by tags": "Filter by tags",
            },
            "Catalog": {
                "header text1": "Recommended Free Software catalog",
                "header text2":
                    "Catalog of used and recommended free and open source software for administrative public services.",
                "what is the SILL": ({ link }) => (
                    <>
                        {" "}
                        <MuiLink {...link}>Click here</MuiLink> to learn more about what
                        is the SILL.{" "}
                    </>
                ),
            },
            */
        },
        "fr": {
            /* spell-checker: disable */
            "CatalogCard": {
                "last version": "Dernière version",
                "last version date": ({ date }) => `en (${date})`,
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} utilisateurs et ${referentCount} referents`,
                "declare oneself referent": "Se déclarer référent / utilisateur",
                "isDesktop": "Ce logiciel s'installe sur ordinateur"
            },
            /*
            "CatalogCards": {
                "show more": "Afficher tous",
                "no service found": "Logiciel non trouvé",
                "no result found": ({ forWhat }) =>
                    `Aucun résultat trouvé pour ${forWhat}`,
                "check spelling": `Vérifiez que le nom du service est correctement
            orthographié ou essayez d'élargir votre recherche.`,
                "go back": "Retourner aux principaux services",
                "main services": "Principaux services",
                "search results": ({ count }) =>
                    `${count} logiciel libre${count === 1 ? "" : "s"}`,
                "search": "Rechercher",
                "alike software": "Logiciels similaires",
                "other similar software":
                    "Autres logiciels similaires qui ne sont pas dans le catalogue",
                "reference a new software": "Référencer un nouveau logiciel",
                "filter by tags": "Filtrer par tags",
            },
            "Catalog": {
                "header text1": "Catalogue des logiciels libres du SILL",
                "header text2":
                    "Le catalogue des logiciels libres utilisés et recommandés pour les administrations",
                "what is the SILL": ({ link }) => (
                    <>
                        {" "}
                        <MuiLink {...link}>Cliquez ici</MuiLink>
                        &nbsp;pour comprendre ce qu'est le SILL et quelles sont ses
                        missions
                    </>
                ),
            },
            */
            /* spell-checker: enable */
        },
    },
);

export { useTranslation, resolveLocalizedString, useLang, useResolveLocalizedString };

export const evtLang = statefulObservableToStatefulEvt({
    "statefulObservable": $lang,
});

export const zLocalizedString = z.union([
    z.string(),
    z.record(createUnionSchema(languages), z.string()),
]);

{
    type Got = ReturnType<typeof zLocalizedString["parse"]>;
    type Expected = LocalizedString;

    assert<Equals<Got, Expected>>();
}
