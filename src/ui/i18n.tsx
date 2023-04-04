import { createI18nApi, declareComponentKeys } from "i18nifty";
import { languages, type Language } from "@codegouvfr/sill";
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
    | typeof import("ui/App").i18n
    | typeof import("ui/pages/softwareCatalog/SoftwareCatalogControlled").i18n
    | typeof import("ui/pages/softwareCatalog/SoftwareCatalogCard").i18n
    | typeof import("ui/pages/softwareCatalog/Search").i18n
    | typeof import("ui/pages/softwareDetails/SoftwareDetails").i18n
    | typeof import("ui/pages/softwareDetails/HeaderDetailCard").i18n
    | typeof import("ui/pages/softwareDetails/PreviewTab").i18n
    | typeof import("ui/pages/softwareDetails/ReferencedInstancesTab").i18n
    | typeof import("ui/pages/softwareDetails/AlikeSoftwareTab").i18n
    | typeof import("ui/pages/softwareUserAndReferent/SoftwareUserAndReferent").i18n
    | typeof import("ui/pages/softwareCatalog/DetailUsersAndReferents").i18n
    | typeof import("ui/pages/declarationForm/DeclarationForm").i18n
    | typeof import("ui/pages/declarationForm/Step1").i18n
    | typeof import("ui/pages/declarationForm/Step2User").i18n
    | typeof import("ui/pages/declarationForm/Step2Referent").i18n
    | typeof import("ui/pages/homepage/Homepage").i18n
    | typeof import("ui/pages/homepage/SearchByProfile").i18n
    | typeof import("ui/pages/addSoftwareLanding/AddSoftwareLanding").i18n
    | typeof import("ui/pages/softwareForm/SoftwareForm").i18n
    | typeof import("ui/pages/softwareForm/Step1").i18n
    | typeof import("ui/pages/softwareForm/Step2").i18n
    | typeof import("ui/pages/softwareForm/Step3").i18n
    | typeof import("ui/pages/softwareForm/Step4").i18n
    | typeof import("ui/pages/instanceForm/InstanceForm").i18n
    | typeof import("ui/pages/instanceForm/Step1").i18n
    | typeof import("ui/pages/instanceForm/Step2").i18n
    | typeof import("ui/pages/account/Account").i18n
    | typeof import("ui/shared/Header").i18n
>()(
    { languages, fallbackLanguage },
    {
        "en": {
            "App": {
                "yes": "Yes",
                "no": "No",
                "previous": "Previous",
                "next": "Next",
                "add software": "Add software",
                "update software": "Update software",
                "add software or service": "Add software or service",
                "add instance": "Add instance",
                "required": "This field is required",
                "invalid url": 'Invalid url. It must start with "http"',
                "invalid version": "The value must be numeric (Eg: 2.0.1)",
                "all": "All",
                "allFeminine": "All",
                "loading": "Loading...",
                "no result": "No result",
                "search": "Search",
                "validate": "Validate",
                "not provided": "Not provided"
            },
            "Homepage": {
                "title": (
                    <>
                        <span>The free software catalog </span>recommended by the State
                        for the whole administration.
                    </>
                ),
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
                "discover as DSI label": "Discover as CIO",
                "discover as DSI description": "Description CIO à changer",
                "contribute as agent label": "Contribute as agent",
                "contribute as agent description":
                    "Description contribution agent à changer",
                "contribute as DSI label": "Contribute as CIO",
                "contribute as DSI description": "Description contribution CIO à changer",
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
                "add software or service description": "Description text body à changer",
                "complete form": "Complete the add form"
            },
            "SearchByProfile": {
                "agent label": "I am an agent or a CIO",
                "search label": "I search...",
                "agent": "An agent",
                "CIO": "A CIO",
                "search placeholder": "Search a software, a word, a reference",
                "specific free software": "A specific type of free software",
                "similar proprietary software":
                    "A free alternative to my proprietary working software",
                "reference software usage": "To reference a use of software",
                "declare referent": "À devenir référent d'un logiciel",
                "add software": "To become a referent of a software",
                "specific software with constraint":
                    "A specific type of software (with specific constraints)",
                "similar free software for agent":
                    "A free alternative to my agents' tracing software",
                "reference software usage in my organization":
                    "To reference a use of software within my establishment",
                "reference instance":
                    "To reference the instance of a service and its use within my establishment",
                "need assistance": "Support for the transition to free software"
            },
            "AddSoftwareLanding": {
                "title": (
                    <>
                        <span>Help us enrich the catalog</span> by adding software or
                        software deployments in your organization !
                    </>
                ),
                "subtitle":
                    "Participate in the creation of a reference platform for public service software equipment and share useful information with agents and CIOs of the administration",
                "who can add software": "Who can add software or a service and how?",
                "discover as agent label": "Discover as agent",
                "discover as agent description": "Description agent à changer",
                "discover as DSI label": "Discover as CIO",
                "discover as DSI description": "Description CIO à changer",
                "contribute as agent label": "Contribute as agent",
                "contribute as agent description":
                    "Description contribution agent à changer",
                "contribute as DSI label": "Contribute as CIO",
                "contribute as DSI description": "Description contribution CIO à changer"
            },
            "SoftwareForm": {
                "title software update form": "Update logiciel",
                "stepper title": ({ currentStepIndex }) => {
                    switch (currentStepIndex) {
                        case 1:
                            return "What kind of software do you want to add ?";
                        case 2:
                            return "About the software";
                        case 3:
                            return "Some prerequisites";
                        case 4:
                            return "Proprietary similar and equivalent software";
                        default:
                            return "";
                    }
                },
                "submit": "Add software"
            },
            "SoftwareFormStep1": {
                "software desktop": "Desktop installable software",
                "software cloud": "Application software solution hosted in the cloud",
                "software cloud hint": "Public cloud or your organization's cloud",
                "module": "Brick or technical modules",
                "module hint": "For example proxies, HTTP servers or plugins",
                "checkbox legend":
                    "Operating system on which the software can be installed",
                "required": "This field is required"
            },
            "SoftwareFormStep2": {
                "wikidata id": "Wikidata ID",
                "wikidata id hint": (
                    <>
                        Associate the software with an existing{" "}
                        <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page">
                            Wikidata
                        </a>{" "}
                        file
                    </>
                ),
                "wikidata id information":
                    "This information will automatically populate other fields",
                "comptoir du libre id": "Comptoir du Libre identifier",
                "comptoir du libre id hint": "Page URL or numeric ID",
                "software name": "Software name",
                "software feature": "Software function",
                "software feature hint":
                    "Describe in a few words the features of the software",
                "license": "Software license",
                "license hint": "(GNU, GPL, BSD, etc.)",
                "minimal version": "Minimum version",
                "minimal version hint":
                    "Earliest version still acceptable to have in production",
                "url or numeric id": "This field must be a URL or an ID number", //TODO: move to common keys,
                "autofill notice":
                    "This information will automatically populate other fields"
            },
            "SoftwareFormStep3": {
                "is present in support market":
                    "Is the software present in the support market?",
                "is from french public service":
                    "Is the software developed by the French public service?"
            },
            "SoftwareFormStep4": {
                "similar software": "This software is an alternative to ...",
                "similar software hint":
                    "Associate the software with similar software, proprietary or not"
            },
            "InstanceForm": {
                "breadcrumb add instance": "Add instance",
                "breadcrumb update instance": "Update instance",
                "title add instance form": "Add software instance",
                "title update instance form": "Update software instance",
                "stepper title": ({ currentStepIndex }) => {
                    switch (currentStepIndex) {
                        case 1:
                            return "About the instantiated software";
                        case 2:
                            return "About the instance";
                        default:
                            return "";
                    }
                },
                "submit": "Add instance"
            },
            "InstanceFormStep1": {
                "software instance":
                    "What is the primary software used and deployed by your instance?",
                "other software": "Are there other software mobilized by your instance?"
            },
            "InstanceFormStep2": {
                "is in public access label": "Is your instance publicly accessible?*",
                "is in public access hint": "*Within the public service",
                "instance url label": "If so, what is the URL of the instance ?",
                "instance url hint":
                    "In order to offer quick access to the service offered",
                "organization label": "Which organization is involved?",
                "organization hint":
                    "What is the state organization that maintains this instance?",
                "targeted public label": "Who is the target audience?",
                "targeted public hint":
                    "Describe in a few words to whom the service offer is proposed"
            },
            "SoftwareCatalogControlled": {
                "search results": ({ count }) =>
                    `${count} free software${count === 1 ? "" : "s"}`,
                "sort by": "Sort by",
                "added time": "Last added",
                "update time": "Last updated",
                "referent count": "Referent count",
                "referent count ASC": "Referent count ASC",
                "user count": "User count",
                "user count ASC": "User count ASC",
                "last version publication date": "Last publicated version"
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
                "prerogativesLabel": "Prérogatives",
                "filters": "Filters",
                "isInstallableOnUserTerminal": "Can be installed on user terminal",
                "isFromFrenchPublicServices": "Is from French public services",
                "doRespectRgaa": "Is compliant with RGAA rules",
                "isPresentInSupportContract": "Is present in support contract",
                "isTestable": "Is testable"
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
                "wikiData sheet": "Open Wikidata sheet",
                "share software": "Share the software",
                "declare referent": "Declare yourself referent / user"
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
            "SoftwareUserAndReferent": {
                "catalog breadcrumb": "Software catalog",
                "user and referent breadcrumb": "Users and referents",
                "title": "Users and referents",
                "tab user title": "Users",
                "tab referent title": "Referents",
                "category": "Category",
                "softwareDetails": "See the software sheet",
                "declare user": "Declare yourself as a user",
                "declare referent": "Declare yourself as a referent"
            },
            "DeclarationForm": {
                "catalog breadcrumb": "Software catalog",
                "declare yourself user or referent breadcrumb":
                    "Declare yourself user or referent of the software",
                "send": "Send my statement",
                "title step 1": "How would you like to declare ?",
                "title step 2 user": "About your usage",
                "title step 2 referent": "About your referencing"
            },
            "DeclarationFormStep1": {
                "user type label": "I'm a user of this software",
                "user type hint": "Inside my organization",
                "referent type label": "I would like to be referent of this software",
                "referent type hint":
                    "As a guarantor and reference of the use of this software inside my organization"
            },
            "DeclarationFormStep2User": {
                "useCase": "Describe in a few words your use case",
                "environment": "In which environment do you use your software ?",
                "version": "Which version of the software do you use ? (Optionnel)",
                "service": "More precisely, which service of the software do you use ?"
            },
            "DeclarationFormStep2Referent": {
                "legend title": "Are you a technical expert of this software ?",
                "legend hint": "You are able to answer to questions of agents and of CIO",
                "useCase": "Describe in a few words the use case of your administration",
                "service":
                    "More precisely, which service of the software do you declare yourself referent"
            },
            "Account": {
                "title": "My account",
                "mail": "Email address",
                "organization": "Name of the affiliated organization",
                "update data": "Change account information (such as your password)",
                "no organization": "No organization"
            },
            "Header": {
                "home title": "Home - Socle interministériel de logiciels libres",
                "title": "Socle interministériel de logiciels libres",
                "navigation welcome": "Welcome to the SILL",
                "navigation catalog": "Software catalog",
                "navigation add software": "Add software or instance",
                "navigation support request": "Support request",
                "navigation about": "About the site",
                "quick access test": "Immediate test",
                "quick access login": "Sign in",
                "quick access logout": "Sign out",
                "quick access account": "My account",
                "select language": "Select language"
            }
        },
        "fr": {
            /* spell-checker: disable */
            "App": {
                "yes": "Oui",
                "no": "Non",
                "previous": "Précedent",
                "next": "Suivant",
                "add software": "Ajouter un logiciel",
                "update software": "Mettre à jour un logiciel",
                "add software or service": "Ajouter un logiciel ou un service",
                "add instance": "Ajouter une instance",
                "required": "Ce champs est requis",
                "invalid url": 'URL invalide. Elle doit commencer par "http"',
                "invalid version": "La valeur doit être numérique (Exemple : 2.0.1)",
                "all": "Tous",
                "allFeminine": "Toutes",
                "loading": "Chargement...",
                "no result": "Aucun résultat",
                "search": "Rechercher",
                "validate": "Valider",
                "not provided": "Pas renseigné"
            },
            "Homepage": {
                "title": (
                    <>
                        <span>Le catalogue de logiciels libres de référence</span>{" "}
                        recommandé par l'État pour toute l'administration.
                    </>
                ),
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
                "add software or service description": "Description text body à changer",
                "complete form": "Remplir le formulaire d'ajout"
            },
            "SearchByProfile": {
                "agent label": "Je suis un agent ou une DSI",
                "search label": "Je cherche...",
                "search placeholder": "Rechercher un logiciel, un mot, une référence",
                "agent": "An agent",
                "CIO": "A CIO",
                "specific free software": "Un type de logiciel libre spécifique",
                "similar proprietary software":
                    "Une alternative libre à mon logiciel de travail propriétaire",
                "reference software usage": "À référencer un usage de logiciel",
                "declare referent": "À devenir référent d'un logiciel",
                "add software": "À ajouter un logiciel",
                "specific software with constraint":
                    "Un type de logiciel spécifique (avec des contraintes spécifiques)",
                "similar free software for agent":
                    "Une alternative libre au logiciel de travail de mes agents",
                "reference software usage in my organization":
                    "À référencer un usage de logiciels au sein de mon établissement",
                "reference instance":
                    "À référencer l'instance d'un service et son usage au sein de mon établissement",
                "need assistance": "Un accompagnement vers la transition vers le libre"
            },
            "AddSoftwareLanding": {
                "title": (
                    <>
                        <span>Aidez nous à enrichir le catalogue</span> en ajoutant des
                        logiciels ou des déploiement de logiciels dans votre organisation
                        !
                    </>
                ),
                "subtitle":
                    "Participez à la création d'une plateforme de référence pour l'équipement logiciel du service public et partagez des informations utiles aux agents et DSI de l'administration",
                "who can add software":
                    "Qui peut ajouter un logiciel ou un service et comment ?",
                "discover as agent label": "Découvrir en tant qu'agent",
                "discover as agent description": "Description agent à changer",
                "discover as DSI label": "Découvrir en tant que DSI",
                "discover as DSI description": "Description DSI à changer",
                "contribute as agent label": "Contribuer en tant qu'agent",
                "contribute as agent description":
                    "Description contribution agent à changer",
                "contribute as DSI label": "Contribuer en tant que DSI",
                "contribute as DSI description": "Description contribution DSI à changer"
            },
            "SoftwareForm": {
                "title software update form": "Mettre à jour un logiciel",
                "stepper title": ({ currentStepIndex }) => {
                    switch (currentStepIndex) {
                        case 1:
                            return "Quel type de logiciel souhaitez-vous ajouter ?";
                        case 2:
                            return "À propos du logiciel";
                        case 3:
                            return "Quelques pré-requis ?";
                        case 4:
                            return "Logiciels similaires et équivalents propriétaires";
                        default:
                            return "";
                    }
                },
                "submit": "Ajouter le logiciel"
            },
            "SoftwareFormStep1": {
                "software desktop": "Logiciel installable sur poste de travail",
                "software cloud":
                    "Solution logicielle applicative hébergée dans le cloud",
                "software cloud hint": "Cloud public ou cloud de votre organisation",
                "module": "Brique ou modules techniques",
                "module hint": "Par exemple des proxy, serveurs HTTP ou plugins",
                "checkbox legend":
                    "Système d'exploitation sur lequel le logiciel peut être installé",
                "required": "Ce champs est required" //TODO: move to common keys
            },
            "SoftwareFormStep2": {
                "wikidata id": "Identifiant Wikidata",
                "wikidata id hint": (
                    <>
                        Associer le logiciel à une fiche{" "}
                        <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page">
                            Wikidata
                        </a>{" "}
                        déjà existante
                    </>
                ),
                "wikidata id information":
                    "Cette information remplira automatiquement d'autres champs",
                "comptoir du libre id": "Identifiant Comptoire du Libre",
                "comptoir du libre id hint": "URL de la page ou identifiant numérique",
                "software name": "Nom du logiciel",
                "software feature": "Fonction du logiciel",
                "software feature hint":
                    "Décrivez en quelques mots les fonctionnalités du logiciel",
                "license": "License du logiciel",
                "license hint": "(GNU, GPL, BSD, etc.)",
                "minimal version": "Version minimale",
                "minimal version hint":
                    "Version la plus ancienne encore acceptable d'avoir en production",
                "url or numeric id":
                    "Ce champs doit être une url ou un numéro d'identifiant", //TODO: move to common keys,
                "autofill notice":
                    "Cette information remplira automatiquement d'autres champs"
            },
            "SoftwareFormStep3": {
                "is present in support market":
                    "Le logiciel est-il présent sur le marché de support ?",
                "is from french public service":
                    "Le logiciel est-il développé par le service public français ?"
            },
            "SoftwareFormStep4": {
                "similar software": "Ce logiciel est une alternative à ...",
                "similar software hint":
                    "Associez le logiciel à des logiciel similaire, propriétaire ou non"
            },
            "InstanceForm": {
                "breadcrumb add instance": "Ajouter une instance",
                "breadcrumb update instance": "Mettre à jour une instance",
                "title add instance form": "Ajouter une instance de logiciel",
                "title update instance form": "Mettre à jour une instance de logiciel",
                "stepper title": ({ currentStepIndex }) => {
                    switch (currentStepIndex) {
                        case 1:
                            return "À propos du logiciel instancié";
                        case 2:
                            return "À propos de l'instance";
                        default:
                            return "";
                    }
                },
                "submit": "Add instance"
            },
            "InstanceFormStep1": {
                "software instance":
                    "Quel est le logiciel principal utilisé et déployé par votre instance ?",
                "other software":
                    "Y a-t-il d'autres logiciels mobilisés par votre instance ?"
            },
            "InstanceFormStep2": {
                "is in public access label":
                    "Votre instance est-elle accessible publiquement ?",
                "is in public access hint": "*Au sein du service public",
                "instance url label": "Si oui, quel est l'URL de l'instance ?",
                "instance url hint":
                    "Afin de proposer un accès rapide au service proposé",
                "organization label": "Quelle est l'organisation concernée ?",
                "organization hint":
                    "Quelle est l'organization étatique qui maintient cette instance ?",
                "targeted public label": "Quel est le public concerné ?",
                "targeted public hint":
                    "Décrivez en quelques mots à qui l'offre de service est proposée"
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
                    `${count} logiciel libre${count === 1 ? "" : "s"}`,
                "sort by": "Trier par",
                "added time": "Dernier ajouté",
                "update time": "Dernier mis à jour",
                "referent count": "Nombre de référent",
                "referent count ASC": "Nombre de référent croissant",
                "user count": "Nombre d'utilisateur",
                "user count ASC": "Nombre d'utilisateur croissant",
                "last version publication date": "Dernière version publiée"
            },
            "Search": {
                "placeholder": "Rechercher un logiciel, un mot, une référence",
                "filtersButton": "Filtres",
                "organizationLabel": "Organization",
                "categoriesLabel": "Catégories",
                "contextLabel": "Contexte",
                "prerogativesLabel": "Prérogatives",
                "filters": "Filtres",
                "isInstallableOnUserTerminal": "Installable sur un poste agent",
                "isFromFrenchPublicServices": "Développé par le service public",
                "doRespectRgaa": "Respecte les normes RGAA",
                "isPresentInSupportContract": "Présent dans le marché de support",
                "isTestable": "Est essayable"
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
                "wikiData sheet": "Consulter la fiche de Wikidata",
                "share software": "Partager la fiche",
                "declare referent": "Se déclarer référent / utilisateur"
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
            "SoftwareUserAndReferent": {
                "catalog breadcrumb": "Software catalog",
                "user and referent breadcrumb": "Utilisateurs et référents",
                "title": "Utilisateurs et référents",
                "tab user title": "Utilisateurs",
                "tab referent title": "Référents",
                "category": "Catégorie",
                "softwareDetails": "Voir la fiche logiciel",
                "declare user": "Se déclarer utilisateur",
                "declare referent": "Se déclarer référent"
            },
            "DeclarationForm": {
                "catalog breadcrumb": "Le catalogue de logiciel",
                "declare yourself user or referent breadcrumb":
                    "Se déclarer utilisateur ou référent du logiciel",
                "send": "Envoyer ma déclaration",
                "title step 1": "Comment souhaitez-vous déclarer ?",
                "title step 2 user": "À propos de votre usage",
                "title step 2 referent": "À propos de votre référencement"
            },
            "DeclarationFormStep1": {
                "user type label": "Je suis un utilisateur de ce logiciel",
                "user type hint": "Au sein de mon établissement",
                "referent type label": "Je souhaite devenir référent de ce logiciel",
                "referent type hint":
                    "Comme garant et référence de l'utilisation du logiciel au sein de mon établissement"
            },
            "DeclarationFormStep2User": {
                "useCase": "Décrivez en quelques mots votre cas d'usage",
                "environment": "Dans quel environnement utilisez-vous ce logiciel ?",
                "version": "Quelle version du logiciel utilisez vous ? (Optionnel)",
                "service": "Plus précisément, quel service du logiciel utilisez-vous ?"
            },
            "DeclarationFormStep2Referent": {
                "legend title": "Êtes-vous un expert technique concernant ce logiciel ?",
                "legend hint":
                    "Vous pouvez répondre aux questions techniques d'agents et de DSI",
                "useCase":
                    "Décrivez en quelques mots le cas d'usage de votre administration",
                "service":
                    "Plus précisément, pour quel service du logiciel vous déclarez-vous référent ?"
            },
            "Account": {
                "title": "Mon compte",
                "mail": "Adresse de courriel",
                "organization": "Nom de l'établissement de rattachement",
                "update data":
                    "Modifier les informations du compte (comme par exemple votre mot de passe)",
                "no organization": "Aucune organisation"
            },
            "Header": {
                "home title": "Accueil - Socle interministériel de logiciels libres",
                "title": "Socle interministériel de logiciels libres",
                "navigation welcome": "Bienvenue sur le SILL",
                "navigation catalog": "Catalogue de logiciel",
                "navigation add software": "Ajouter un logiciel ou une instance",
                "navigation support request": "Demande d'accompagement",
                "navigation about": "À propos du site",
                "quick access test": "Test immédiat",
                "quick access login": "Se connecter",
                "quick access logout": "Se déconnecter",
                "quick access account": "Mon compte",
                "select language": "Sélectionner une langue"
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
    type Got = ReturnType<(typeof zLocalizedString)["parse"]>;
    type Expected = LocalizedString;

    assert<Equals<Got, Expected>>();
}
