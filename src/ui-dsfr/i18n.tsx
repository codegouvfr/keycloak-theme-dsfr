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
    useResolveLocalizedString
} = createI18nApi<
    | typeof import("ui-dsfr/components/pages/SoftwareCatalog/SoftwareCatalogControlled").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareCatalog/SoftwareCatalogCard").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareCatalog/Search").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareDetails/SoftwareDetails").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareDetails/HeaderDetailCard").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareDetails/PreviewTab").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareDetails/ReferencedInstancesTab").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareDetails/AlikeSoftwareTab").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareDetails/FooterDetailCard").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareUserAndReferent/SoftwareUserAndReferent").i18n
    | typeof import("ui-dsfr/components/pages/SoftwareUserAndReferent/FooterSoftwareUserAndReferent").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/DetailUsersAndReferents").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/DeclareUserOrReferent/DeclareUserOrReferent").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/DeclareUserOrReferent/UserTypeStep").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/DeclareUserOrReferent/UserStep").i18n
    | typeof import("ui-dsfr/components/pages/Catalog/DeclareUserOrReferent/ReferentStep").i18n
    | typeof import("ui-dsfr/components/pages/Authentication/Authentication").i18n
    | typeof import("ui-dsfr/components/pages/Authentication/Inputs").i18n
    | typeof import("ui-dsfr/components/pages/Homepage/Homepage").i18n
>()(
    { languages, fallbackLanguage },
    {
        "en": {
            "Homepage": {
                "title":
                    "The free software catalog recommended by the State for the whole administration",
                "agent label": "I am an agent or a DSI",
                "search label": "I search...",
                "research placeholder": "Search a software, a word, a reference",
                "or": "or",
                "sign in": "Sign in",
                "software selection": "Some software selection",
                "last added": "Last added",
                "most used": "The most used",
                "essential": "To have on your desktop",
                "selection of the month": "Selection of the month",
                "waiting for referent": "Waiting for a referent",
                "in support market": "Is present in support market",
                "why use the STILL": "Why and when use the SILL ?",
                "discover as agent label": "Discover as agent",
                "discover as agent description": "Description agent à changer",
                "discover as DSI label": "Discover as DSI",
                "discover as DSI description": "Description DSI à changer",
                "contribute as agent label": "Contribute as agent",
                "contribute as agent description":
                    "Description contribution agent à changer",
                "contribute as DSI label": "Contribute as DSI",
                "contribute as DSI description": "Description contribution DSI à changer",
                "SILL numbers": "The SILL in figures",
                "referenced software": "referenced software",
                "user": "site user",
                "referent": "software referent",
                "organization": "organization",
                "help us": "Help us to enrich the catalog",
                "declare referent title":
                    "Declare oneself user or referent of a software",
                "declare referent description": "Description text body à changer",
                "search software": "Search a software",
                "edit software title": "Edit a software",
                "edit software description": "Description text body à changer",
                "add software or service title": "Add a software or a service",
                "add software or service description": "Description text body à changer",
                "complete form": "Complete the add form"
            },
            "SoftwareCatalogControlled": {
                "search results": ({ count }) =>
                    `${count} free software${count === 1 ? "" : "s"}`
            },
            "SoftwareCatalogCard": {
                "last version": "Last version",
                "last version date": ({ date }) => `in (${date})`,
                "declare oneself referent": "Declare yourself referent / user",
                "isDesktop": "This software can be installed on desktop",
                "isFromFrenchPublicService":
                    "This software is from French public service",
                "isPresentInSupportMarket": "This software is present in support market"
            },
            "Search": {
                "placeholder": "Rechercher un logiciel, un mot, une référence",
                "filtersButton": "Filtres",
                "organizationLabel": "Organization",
                "categoriesLabel": "Catégories",
                "contextLabel": "Contexte",
                "prerogativesLabel": "Prérogatives"
            },
            "SoftwareDetails": {
                "catalog breadcrumb": "Software catalog",
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
                "declare oneself referent": "Declare yourself referent / user",
                "isDesktop": "Installable on agent desktop",
                "isPresentInSupportMarket": "Present in support market",
                "isFromFrenchPublicService": "From French public service",
                "isRGAACompliant": "Is compliant with RGAA rules",
                "service provider": "See service providers",
                "comptoire du libre sheet": "Open Comptoir du libre sheet",
                "wikiData sheet": "Open Wikidata sheet"
            },
            "HeaderDetailCard": {
                "authors": "Authors : ",
                "website": "Official website",
                "repository": "Source code repository"
            },
            "PreviewTab": {
                "about": "About",
                "use full links": "Use full links",
                "prerogatives": "Prerogatives",
                "last version": "Last version",
                "last version date": ({ date }) => `in ${date}`,
                "register": "Date de l'ajout : ",
                "register date": ({ date }) => `${date}`,
                "minimal version": "Version minimale requise : ",
                "license": "License : ",
                "isDesktop": "Installable on agent desktop",
                "isPresentInSupportMarket": "Present in support market",
                "isFromFrenchPublicService": "From French public service",
                "isRGAACompliant": "Is compliant with RGAA rules",
                "service provider": "See service providers",
                "comptoire du libre sheet": "Open Comptoir du libre sheet",
                "wikiData sheet": "Open Wikidata sheet"
            },
            "ReferencedInstancesTab": {
                "instanceCount": ({ instanceCount, publicOrganisationCount }) =>
                    `${instanceCount} maintained instance by ${publicOrganisationCount} public organisation`,
                "concerned public": "Concerned public : ",
                "go to instance": "Open the instance"
            },
            "AlikeSoftwareTab": {
                "alike software sill": "Alike software in SILL",
                "alike software proprietary": "Alike proprietary software"
            },
            "DetailUsersAndReferents": {
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} users and ${referentCount} referents`
            },
            "FooterDetailCard": {
                "share software": "Share the software",
                "declare referent": "Declare yourself referent / user"
            },
            "SoftwareUserAndReferent": {
                "catalog breadcrumb": "Software catalog",
                "user and referent breadcrumb": "Users and referents",
                "title": "Users and referents",
                "tab user title": "Users",
                "tab referent title": "Referents",
                "category": "Category"
            },
            "FooterSoftwareUserAndReferent": {
                "softwareDetails": "Voir la fiche logiciel",
                "declare user": "Se déclarer utilisateur",
                "declare referent": "Se déclarer référent"
            },
            "DeclareUserOrReferent": {
                "title": "Declare yourself user or referent of the software",
                "catalog breadcrumb": "Software catalog",
                "declare yourself user or referent breadcrumb":
                    "Declare yourself user or referent of the software",
                "back": "Back",
                "next": "Next",
                "send": "Send"
            },
            "UserTypeStep": {
                "user type label": "I'm a user of this software",
                "user type hint": "Inside my organization",
                "referent type label": "I would like to be referent of this software",
                "referent type hint":
                    "As a guarantor and reference of the use of this software inside my organization"
            },
            "UserStep": {
                "useCase": "Describe in a few words your use case",
                "environment": "In which environment do you use your software ?",
                "version": "Which version of the software do you use ? (Optionnel)",
                "service": "More precisely, which service of the software do you use ?"
            },
            "ReferentStep": {
                "legend title": "Are you a technical expert of this software ?",
                "legend hint": "You are able to answer to questions of agents et of DSI",
                "yes": "Yes",
                "no": "No",
                "useCase": "Describe in a few words the use case of your administration",
                "service":
                    "More precisely, which service of the software do you declare yourself referent"
            },
            "Authentication": {
                "connect": "Se connecter",
                "back": "Retour",
                "selfCredentials": "Ou utiliser vos identifiants",
                "forget password": "Mot de passe oublié ?",
                "no account": "Pas encore de compte ?",
                "log with": "Identify with",
                "franceConnect": "FranceConnect",
                "what is franceConnect": "What is FranceConnect ?",
                "what is franceConnect title": "What is FranceConnect - new window"
            },
            "Inputs": {
                "email": "Votre email personnel",
                "email hint": "Par exemple : nom@exemple.com",
                "password": "Votre mot de passe"
            }
        },
        "fr": {
            /* spell-checker: disable */
            "Homepage": {
                "title":
                    "Le catalogue de logiciels libres de référence recommandé par l'État pour toute l'administration",
                "agent label": "Je suis un agent ou une DSI",
                "search label": "Je cherche...",
                "research placeholder": "Rechercher un logiciel, un mot, une référence",
                "or": "ou",
                "sign in": "Se connecter",
                "software selection": "Quelques sélections de logiciels",
                "last added": "Derniers ajouts",
                "most used": "Les plus utilisés",
                "essential": "À avoir sur son poste",
                "selection of the month": "La sélection du mois",
                "waiting for referent": "En attente de référent",
                "in support market": "Dans le marché de support",
                "why use the STILL": "Pourquoi et quand utiliser le SILL ?",
                "discover as agent label": "Découvrir en tant qu'agent",
                "discover as agent description": "Description agent à changer",
                "discover as DSI label": "Découvrir en tant que DSI",
                "discover as DSI description": "Description DSI à changer",
                "contribute as agent label": "Contribuer en tant qu'agent",
                "contribute as agent description":
                    "Description contribution agent à changer",
                "contribute as DSI label": "Contribuer en tant que DSI",
                "contribute as DSI description": "Description contribution DSI à changer",
                "SILL numbers": "Le SILL en plusieurs chiffres",
                "referenced software": "logiciels référencés",
                "user": "utilisateurs du site",
                "referent": "référents de logiciels",
                "organization": "organismes présent",
                "help us": "Aidez-nous à enrichir le catalogue",
                "declare referent title":
                    "Se déclarer utilisateur ou référent d'un logiciel",
                "declare referent description": "Description text body à changer",
                "search software": "Rechercher un logiciel",
                "edit software title": "Éditer une fiche logiciel",
                "edit software description": "Description text body à changer",
                "add software or service title": "Ajouter un logiciel ou un service",
                "add software or service description": "Description text body à changer",
                "complete form": "Remplir le formulaire d'ajout"
            },
            "SoftwareCatalogCard": {
                "last version": "Dernière version",
                "last version date": ({ date }) => `en (${date})`,
                "declare oneself referent": "Se déclarer référent / utilisateur",
                "isDesktop": "Ce logiciel s'installe sur ordinateur",
                "isFromFrenchPublicService":
                    "Ce logiciel est originaire du service public français",
                "isPresentInSupportMarket":
                    "Ce logiciel est présent dans le marcher de support"
            },
            "SoftwareCatalogControlled": {
                "search results": ({ count }) =>
                    `${count} logiciel libre${count === 1 ? "" : "s"}`
            },
            "Search": {
                "placeholder": "Rechercher un logiciel, un mot, une référence",
                "filtersButton": "Filtres",
                "organizationLabel": "Organization",
                "categoriesLabel": "Catégories",
                "contextLabel": "Contexte",
                "prerogativesLabel": "Prérogatives"
            },
            "SoftwareDetails": {
                "catalog breadcrumb": "Le catalogue de logiciel",
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
                "declare oneself referent": "Se déclarer référent / utilisateur",
                "isDesktop": "Installable sur poste agent",
                "isPresentInSupportMarket": "Présent dans le marché de support",
                "isFromFrenchPublicService": "Développé par le service public",
                "isRGAACompliant": "Respecte les normes RGAA",
                "service provider": "Voir les prestataires de services",
                "comptoire du libre sheet": "Consulter la fiche du Comptoire du Libre",
                "wikiData sheet": "Consulter la fiche de Wikidata"
            },
            "HeaderDetailCard": {
                "authors": "Auteurs : ",
                "website": "Site web officiel",
                "repository": "Dépôt du code source"
            },
            "PreviewTab": {
                "about": "À propos",
                "use full links": "Liens utiles",
                "prerogatives": "Prérogatives",
                "last version": "Dernière version : ",
                "last version date": ({ date }) => `en ${date}`,
                "register": "Date de l'ajout : ",
                "register date": ({ date }) => `${date}`,
                "minimal version": "Version minimale requise : ",
                "license": "License : ",
                "isDesktop": "Installable sur poste agent",
                "isPresentInSupportMarket": "Présent dans le marché de support",
                "isFromFrenchPublicService": "Développé par le service public",
                "isRGAACompliant": "Respecte les normes RGAA",
                "service provider": "Voir les prestataires de services",
                "comptoire du libre sheet": "Consulter la fiche du Comptoire du Libre",
                "wikiData sheet": "Consulter la fiche de Wikidata"
            },
            "ReferencedInstancesTab": {
                "instanceCount": ({ instanceCount, publicOrganisationCount }) =>
                    `${instanceCount} instances maintenues par ${publicOrganisationCount} organisations publiques`,
                "concerned public": "Public concerné : ",
                "go to instance": "Accéder à l'instance"
            },
            "AlikeSoftwareTab": {
                "alike software sill": "Logiciels similaires sur le SILL",
                "alike software proprietary": "Logiciels équivalents propriétaires"
            },
            "DetailUsersAndReferents": {
                "userAndReferentCount": ({ userCount, referentCount }) =>
                    `${userCount} utilisateurs et ${referentCount} referents`
            },
            "FooterDetailCard": {
                "share software": "Partager la fiche",
                "declare referent": "Se déclarer référent / utilisateur"
            },
            "SoftwareUserAndReferent": {
                "catalog breadcrumb": "Software catalog",
                "user and referent breadcrumb": "Utilisateurs et référents",
                "title": "Utilisateurs et référents",
                "tab user title": "Utilisateurs",
                "tab referent title": "Référents",
                "category": "Catégorie"
            },
            "FooterSoftwareUserAndReferent": {
                "softwareDetails": "Voir la fiche logiciel",
                "declare user": "Se déclarer utilisateur",
                "declare referent": "Se déclarer référent"
            },
            "DeclareUserOrReferent": {
                "title": "Se déclarer utilisateur ou référent du logiciel",
                "catalog breadcrumb": "Le catalogue de logiciel",
                "declare yourself user or referent breadcrumb":
                    "Se déclarer utilisateur ou référent du logiciel",
                "back": "Précédent",
                "next": "Suivant",
                "send": "Envoyer"
            },
            "UserTypeStep": {
                "user type label": "Je suis un utilisateur de ce logiciel",
                "user type hint": "Au sein de mon établissement",
                "referent type label": "Je souhaite devenir référent de ce logiciel",
                "referent type hint":
                    "Comme garant et référence de l'utilisation du logiciel au sein de mon établissement"
            },
            "UserStep": {
                "useCase": "Décrivez en quelques mots votre cas d'usage",
                "environment": "Dans quel environnement utilisez-vous ce logiciel ?",
                "version": "Quelle version du logiciel utilisez vous ? (Optionnel)",
                "service": "Plus précisément, quel service du logiciel utilisez-vous ?"
            },
            "ReferentStep": {
                "legend title": "Êtes-vous un expert technique concernant ce logiciel ?",
                "legend hint":
                    "Vous pouvez répondre aux questions techniques d'agents et de DSI",
                "yes": "Oui",
                "no": "Non",
                "useCase":
                    "Décrivez en quelques mots le cas d'usage de votre administration",
                "service":
                    "Plus précisément, pour quel service du logiciel vous déclarez-vous référent ?"
            },
            "Authentication": {
                "connect": "Se connecter",
                "back": "Retour",
                "selfCredentials": "Ou utilisez vos identifiants",
                "forget password": "Mot de passe oublié ?",
                "no account": "Pas encore de compte ?",
                "log with": "S'identifier avec",
                "franceConnect": "FranceConnect",
                "what is franceConnect": "Qu'est-ce que FranceConnect ?",
                "what is franceConnect title":
                    "Qu'est ce que FranceConnect - nouvelle fenêtre"
            },
            "Inputs": {
                "email": "Votre email personnel",
                "email hint": "Par exemple : nom@exemple.com",
                "password": "Votre mot de passe"
            }
            /* spell-checker: enable */
        }
    }
);

export { useTranslation, resolveLocalizedString, useLang, useResolveLocalizedString };

export const evtLang = statefulObservableToStatefulEvt({
    "statefulObservable": $lang
});

export const zLocalizedString = z.union([
    z.string(),
    z.record(createUnionSchema(languages), z.string())
]);

{
    type Got = ReturnType<typeof zLocalizedString["parse"]>;
    type Expected = LocalizedString;

    assert<Equals<Got, Expected>>();
}
