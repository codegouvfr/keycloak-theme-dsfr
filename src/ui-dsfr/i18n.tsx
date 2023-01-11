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
                "parent software": ({ name, link }) => (
                    <>
                        Plugin or distribution of{" "}
                        {link === undefined ? name : <MuiLink {...link}>{name}</MuiLink>}
                    </>
                ),
                "you are referent": ({ isOnlyReferent }) =>
                    `You are${isOnlyReferent ? " the" : ""} referent`,
                "last version": "Last version",
                "last version date": ({ date }) => `Last version (${date})`,
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `User ${userCount}, Referents ${referentCount}`,
                "declare oneself referent": "Declare yourself referent",
                "this software has no referent": "This software has not referent",
                "no longer referent": "I am no longer referent",
                "to install on the computer of the agent":
                    "To install on the computer of the agent",
                "authors": ({ doUsePlural }) => `Author${doUsePlural ? "s" : ""}`,
                "show referents": ({ isUserReferent, referentCount }) => {
                    if (isUserReferent) {
                        if (referentCount >= 3) {
                            return "see other referents";
                        }

                        if (referentCount === 2) {
                            return "see the other referent";
                        }

                        assert(false);
                    } else {
                        return `See referent${referentCount === 1 ? "" : "s"}`;
                    }
                },
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
                "you are referent": ({ isOnlyReferent }) =>
                    `Vous êtes${isOnlyReferent ? " le" : ""} référent`,
                "last version": undefined,
                "last version date": undefined,
                "userAndReferentCount": undefined,
                "authors": ({ doUsePlural }) => `Auteur${doUsePlural ? "s" : ""}`,
                "parent software": ({ name, link }) => (
                    <>
                        Plugin ou distribution de{" "}
                        {link === undefined ? name : <MuiLink {...link}>{name}</MuiLink>}
                    </>
                ),
                "declare oneself referent": "Me déclarer référent",
                "this software has no referent": "Pas de référent",
                "no longer referent": "Je ne suis plus référent",
                "to install on the computer of the agent":
                    "À installer sur le poste de travail de l'agent",
                "show referents": ({ isUserReferent, referentCount }) => {
                    if (isUserReferent) {
                        if (referentCount >= 3) {
                            return "voir les autres référents";
                        }

                        if (referentCount === 2) {
                            return "voir l'autre référent";
                        }

                        assert(false);
                    } else {
                        return referentCount === 1
                            ? "voir le référent"
                            : "voir les référents";
                    }
                },
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
