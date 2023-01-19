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

export const fallbackLanguage = "en";

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

const {
    useTranslation,
    resolveLocalizedString,
    useLang,
    $lang,
    useResolveLocalizedString,
} = createI18nApi<
    | typeof import("ui-dsfr/components/pages/Catalog/CatalogCards/CatalogCard").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/CatalogCards/CatalogCards").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/CatalogCards/Search").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/DetailCard").i18n
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
                "isDesktop": "This software can be installed on desktop",
                "isFromFrenchPublicService":
                    "This software is from French public service",
                "isPresentInSupportMarket": "This software is present in support market",
            },

            "CatalogCards": {
                "no service found": "No software found",
                "no result found": ({ forWhat }) => `No result found for ${forWhat}`,
                "check spelling":
                    "Please check your spelling or try widening your search.",
                "go back": "Back to main services",
                "search results": ({ count }) => `${count} Free software`,
            },
            "Search": {
                "placeholder": "Rechercher un logiciel, un mot, une référence",
                "filtersButton": "Filtres",
                "organizationLabel": "Organization",
                "categoriesLabel": "Catégories",
                "contextLabel": "Contexte",
                "prerogativesLabel": "Prérogatives",
            },
            "DetailCard": {
                "tab title overview": "Overview",
                "tab title instance": ({ instanceCount }) =>
                    `Referenced instance (${instanceCount})`,
                "tab title alike software": ({ alikeSoftwareCount }) =>
                    `Alike or equivalent proprietary software (${alikeSoftwareCount})`,
                "about": "About",
                "use full links": "Use full links",
                "prerogatives": "Prerogatives",
                "last version": "Last version",
                "last version date": ({ date }) => `in ${date}`,
                "register": "Date de l'ajout : ",
                "register date": ({ date }) => `${date}`,
                "minimal version": "Version minimale requise : ",
                "license": "License : ",
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} users and ${referentCount} referents`,
                "declare oneself referent": "Declare yourself referent / user",
                "isDesktop": "Installable on agent desktop",
                "isPresentInSupportMarket": "Present in support market",
                "isFromFrenchPublicService": "From French public service",
                "isRGAACompliant": "Is compliant with RGAA rules",
                "service provider": "See service providers",
                "comptoire du libre sheet": "Open Comptoir du libre sheet",
                "wikiData sheet": "Open Wikidata sheet",
            },
        },
        "fr": {
            /* spell-checker: disable */
            "CatalogCard": {
                "last version": "Dernière version",
                "last version date": ({ date }) => `en (${date})`,
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} utilisateurs et ${referentCount} referents`,
                "declare oneself referent": "Se déclarer référent / utilisateur",
                "isDesktop": "Ce logiciel s'installe sur ordinateur",
                "isFromFrenchPublicService":
                    "Ce logiciel est originaire du service public français",
                "isPresentInSupportMarket":
                    "Ce logiciel est présent dans le marcher de support",
            },
            "CatalogCards": {
                "no service found": "Logiciel non trouvé",
                "no result found": ({ forWhat }) =>
                    `Aucun résultat trouvé pour ${forWhat}`,
                "check spelling": `Vérifiez que le nom du service est correctement
            orthographié ou essayez d'élargir votre recherche.`,
                "go back": "Retourner aux principaux services",
                "search results": ({ count }) =>
                    `${count} logiciel libre${count === 1 ? "" : "s"}`,
            },
            "Search": {
                "placeholder": "Rechercher un logiciel, un mot, une référence",
                "filtersButton": "Filtres",
                "organizationLabel": "Organization",
                "categoriesLabel": "Catégories",
                "contextLabel": "Contexte",
                "prerogativesLabel": "Prérogatives",
            },
            "DetailCard": {
                "tab title overview": "Aperçu",
                "tab title instance": ({ instanceCount }) =>
                    `Instances référencées (${instanceCount})`,
                "tab title alike software": ({ alikeSoftwareCount }) =>
                    `Logiciel similaires ou équivalents propriétaires (${alikeSoftwareCount})`,
                "about": "À propos",
                "use full links": "Liens utiles",
                "prerogatives": "Prérogatives",
                "last version": "Dernière version : ",
                "last version date": ({ date }) => `en ${date}`,
                "register": "Date de l'ajout : ",
                "register date": ({ date }) => `${date}`,
                "minimal version": "Version minimale requise : ",
                "license": "License : ",
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} utilisateurs et ${referentCount} referents`,
                "declare oneself referent": "Se déclarer référent / utilisateur",
                "isDesktop": "Installable sur poste agent",
                "isPresentInSupportMarket": "Présent dans le marché de support",
                "isFromFrenchPublicService": "Développé par le service public",
                "isRGAACompliant": "Respecte les normes RGAA",
                "service provider": "Voir les prestataires de services",
                "comptoire du libre sheet": "Consulter la fiche du Comptoire du Libre",
                "wikiData sheet": "Consulter la fiche de Wikidata",
            },
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
