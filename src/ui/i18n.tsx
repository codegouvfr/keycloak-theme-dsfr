import MuiLink from "@mui/material/Link";
import { createI18nApi, declareComponentKeys } from "i18nifty";
import { languages } from "sill-api";
import type { Language } from "sill-api";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { statefulObservableToStatefulEvt } from "powerhooks/tools/StatefulObservable/statefulObservableToStatefulEvt";
import { z } from "zod";
import { createUnionSchema } from "ui/tools/zod/createUnionSchema";
import { shortEndMonthDate } from "./useMoment";

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
    | typeof import("ui/components/shared/Header").i18n
    | typeof import("ui/components/shared/DescriptiveField").i18n
    | typeof import("ui/components/shared/ReferentDialogs").i18n
    | typeof import("ui/components/App/App").i18n
    | typeof import("ui/components/pages/FourOhFour").i18n
    | typeof import("ui/components/pages/Form/Form").i18n
    | typeof import("ui/components/pages/Form/FormAlikeSoftwares").i18n
    | typeof import("ui/components/pages/ServiceForm/ServiceForm").i18n
    | typeof import("ui/components/pages/SoftwareCard/SoftwareCard").i18n
    | typeof import("ui/components/pages/SoftwareCard/DereferenceSoftwareDialog").i18n
    | typeof import("ui/components/pages/Account/Account").i18n
    | typeof import("ui/components/pages/Account/tabs/AccountInfoTab").i18n
    | typeof import("ui/components/pages/Account/tabs/AccountUserInterfaceTab").i18n
    | typeof import("ui/components/pages/Catalog/CatalogCards/CatalogCards").i18n
    | typeof import("ui/components/pages/Catalog/CatalogCards/CatalogCard").i18n
    | typeof import("ui/components/pages/Catalog").i18n
    | typeof import("ui/components/pages/Terms").i18n
    | typeof import("ui/components/App/Footer").i18n
    | typeof import("ui/components/KcApp/Login").i18n
    | typeof import("ui/components/KcApp/RegisterUserProfile").i18n
    | typeof import("ui/components/shared/Tags/Tags").i18n
    | typeof import("ui/components/pages/ServiceCatalog/ServiceCatalogCards/ServiceCatalogCard").i18n
    | typeof import("ui/components/pages/ServiceCatalog/ServiceCatalogCards/ServiceCatalogCards").i18n
    | typeof import("ui/components/pages/ServiceCatalog").i18n
    | typeof import("ui/components/pages/ServiceForm/PickSoftware").i18n
>()(
    { languages, fallbackLanguage },
    {
        "en": {
            "DereferenceSoftwareDialog": {
                "remove from sill": ({ softwareName }) =>
                    `Remove ${softwareName} from the SILL`,
                "cancel": "Cancel",
                "confirm": "Confirm",
                "reason": "Reason for dereferencing",
                "reason helper text":
                    "Please explain why this software should be removed from the SILL",
                "last recommended version": "Last recommended version",
                "enf of recommendation": "End of recommendation",
                "complete deletion": "Complete deletion",
            },
            "Account": {
                "infos": "Account information",
                "user-interface": "Interface preferences",
                "text1": "My account",
                "text2": "Access your account information.",
                "text3":
                    "Configure your username, emails, password and personal access tokens directly connected to your services.",
                "personal tokens tooltip":
                    "Password generated for you with a given validity period",
            },
            "AccountInfoTab": {
                "general information": "General information",
                "user id": "User ID (IDEP)",
                "full name": "Full name",
                "email": "Email address",
                "change account info": "Change account information (e.g., password).",
                "agency name": "Agency name",
                "agency name helper": "Name of your institution, for example DINUM",
                "not a valid email": "Not a valid email",
                "email helper":
                    "You'll use this email to connect to the platform and to be contacted by other users about the software you are referent of",
            },
            "AccountUserInterfaceTab": {
                "title": "Interface preferences",
                "enable dark mode": "Enable dark mode",
                "dark mode helper":
                    "Low light interface theme with dark colored background.",
            },
            "DescriptiveField": {
                "copy tooltip": "Copy to clipboard",
                "language": "Change language",
                "service password": "Password for your services",
                "service password helper text": `This password is required to log in to all of your services. 
            It is generated automatically and renews itself regularly.`,
                "not yet defined": "Not yet defined",
            },
            "RegisterUserProfile": {
                "minimum length": ({ n }) => `Minimum length: ${n}`,
                "must be different from email": "Password can't be the email",
                "password mismatch": "Passwords mismatch",
                "go back": "Go back",
                "form not filled properly yet":
                    "Please make sure the form is properly filled out",
                "must respect the pattern": "Must respect the pattern",
                "mail subject": "[SILL] Adding new mail domain to the accept list",
                "mail body": `
            Hello, 
            Would you, assuming it's granted, add my domain to the accept list.  

            Best regards,
            `,
                "use your administrative email": "Your administrative email",
                "you domain isn't allowed yet": ({ contactEmail, mailtoHref }) => (
                    <>
                        Your email domain isn't allowed yet. Contact us at{" "}
                        <MuiLink href={mailtoHref}>{contactEmail}</MuiLink>
                    </>
                ),
            },
            "Header": {
                "login": "Login",
                "logout": "Logout",
                "trainings": "Trainings",
                "documentation": "Documentation",
                "project": "Project",
            },
            "App": {
                "reduce": "Reduce",
                "account": "My account",
                "catalog": "Recommended Free Software catalog",
                "service catalog": "Services",
            },
            "FourOhFour": {
                "not found": "Page not found",
            },
            "CatalogCard": {
                "parent software": ({ name, link }) => (
                    <>
                        Plugin or distribution of{" "}
                        {link === undefined ? name : <MuiLink {...link}>{name}</MuiLink>}
                    </>
                ),
                "last version": "Last version",
                "last version date": ({ date }) => {
                    return `the ${date}`;
                },
                "userAndReferentCount": ({ userCount, referentCount }) => {
                    return `${userCount} users and ${referentCount} referent`;
                },
                "you are referent": ({ isOnlyReferent }) =>
                    `You are${isOnlyReferent ? " the" : ""} referent`,
                "declare oneself referent": "Declare yourself referent / user",
                "this software has no referent": "This software has not referent",
                "no longer referent": "I am no longer referent",
                "to install on the computer of the agent":
                    "To install on the computer of the agent",
                "authors": ({ doUsePlural }) => `Author${doUsePlural ? "s" : ""}`,
                "show referents": ({ isUserReferent, referentCount }) => {
                    /* Usefull plural discrimination ? */
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
            "ReferentDialogs": {
                "close": "Close",
                "declare oneself referent of": ({ softwareName }) =>
                    `Declare yourself referent of ${softwareName}`,
                "cancel": "Cancel",
                "send": "Send",
                "declare oneself referent": "Declare yourself referent",
                "no longer referent": "I am no longer referent",
                "use case description": "Use case description",
                "use case description helper":
                    "Please describe in what context and to which extend this software is used in your agency",
                "i am a technical expert": "I am a technical expert",
                "on behalf of who are you referent": "On behalf of who are you referent?",
                "on my own behalf": "Only on my own behalf",
                "on my establishment behalf": "On my establishment's behalf",
                "yes": "Yes",
                "no": "No",
                "email": "Email",
                "establishment": "Establishment",
                "expert": "Technical expert",
                "institutional referent": "Institutional referent",
                "institutional referent help":
                    "Is the person referent in he's own name or in the name of it's establshment",
                "mail subject": ({ softwareName }) =>
                    `Initial contact for ${softwareName}`,
                "mail body": ({ softwareName }) => `
                Hello,
                I got your contact from sill.etalab.gouv.fr, you are referent fro ${softwareName}.  
                [...]
                `,
            },
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
            "Terms": {
                "no terms":
                    "No terms of service document provided for this instance of the SILL",
            },
            "Footer": {
                "contribute": "Contribute",
                "terms of service": "Terms of service",
                "change language": "Change language",
                "rss feed": "RSS Feed",
            },
            "Login": {
                "doRegister": "Create an account",
                "or": "or",
            },
            "Form": {
                "agentWorkstation": "Agent workstation",
                "agentWorkstation helper":
                    "Is it meant to be installed on the public agent workstation?",
                "cancel": "Cancel",
                "comptoirDuLibreId": "Comptoir du Libre ID",
                "comptoirDuLibreId helper":
                    "ID of the software on comptoir-du-libre.org (It's in the url, ex 67 for Gimp)",
                "function": "Software's function",
                "function helper": "What is the function of the software?",
                "invalid wikidata id": "Invalid wikidata id",
                "isFromFrenchPublicService":
                    "🇫🇷 Is developed by a French administration?",
                "isFromFrenchPublicService helper":
                    "Is the software developed by a French public service?",
                "license": "License",
                "license helper": "What is the license of the software? E.g. GPLv3",
                "mandatory field": "Mandatory field",
                "name": "Software's name",
                "name helper": "What is the name of the software?",
                "should be an integer": "Should be an integer",
                "create software": "Done",
                "update software": "Update software info",
                "versionMin": "Minimal version",
                "versionMin helper":
                    "What is the minimal acceptable version of the software?",
                "wikidata id already exists":
                    "There is already a software with this wikidata id in the SILL",
                "wikidataId": "Wikidata ID",
                "wikidataId helper":
                    "What is the wikidata id of the software? E.g. Q8038 for Gimp",
                "name already exists":
                    "There is already a software with this name in the SILL",
                "title add": "Add new software",
                "title edit": "Edit software",
                "help title add": "Declare that this software is in use in your agency",
                "help title edit": "Edit this software's information",
                "help": `Most information are automatically collected from wikidata.org
            It is important that you first fill in the Wikidata ID, the other fields will
            be filled automatically.  
            If the software do not exist yet in Wikidata you are more than welcome to 
            create an entry for it.
            `,
                "tags": "Tags",
                "tags helper": "Tags to help you find the software",
                "change tags": ({ selectedTagsCount }) =>
                    selectedTagsCount === 0 ? "Add tags" : "Add or remove tags",
                "confirm give up": "The software haven't been updated yet, confirm quit?",
                "generalInfoMd": "General information",
                "generalInfoMd helper":
                    "A multiline Markdown text where you can includes extra information about the software",
            },
            "FormAlikeSoftwares": {
                "done": "Done",
                "similar to": "Similar software in the SILL",
                "add": "Add",
                "alternative to": "This software is an alternative to",
                "no similar software": "There isn't any similar software in the SILL",
                "no alternative": "Not an alternative to any other software",
            },
            "ServiceForm": {
                "mandatory field": "Mandatory field",
                "not a valid url": "Not a valid url",
                "service already referenced": "Service already referenced",
                "description": "Description",
                "description helper":
                    "Please describe this service in a few words, this text can be in MarkDown",
                "agencyName": "Agency name",
                "agencyName helper":
                    "Name of the organizational unit of the french service public that maintain this service",
                "serviceUrl": "Service URL",
                "serviceUrl helper":
                    "The URL of the service (this is the more important)",
                "softwareName": "Service name",
                "softwareName helper":
                    "Name of the main software deployed, it must be free software",
                "update service": "Update service",
                "create service": "Create service",
                "cancel": "Cancel",
                "title add": "Add new service",
                "title edit": "Edit service",
                "help title add":
                    "Reference a new service powered by free software and maintained by the french public service",
                "help title edit": "Edit service information",
                "help": `By referencing services you help establish a landscape of what free software are in production in the french public service.`,
            },
            "SoftwareCard": {
                "dev by french public service": "Developed by french public service",
                "update software information": "Update software information",
                "software name": "Name of the software",
                "software function": "Software's function",
                "sill id": "SILL ID",
                "sill id helper": "Uniq ID in the SILL's database",
                "in sill from date": "Date of entry in the SILL",
                "dev by public service": "Developed by french public service",
                "present in support contract": "Present in the support contract",
                "learn more about the": "Learn more about",
                "MISEULL": "inter administration support contract",
                "yes": "Yes",
                "no": "No",
                "repo": "Source code repository",
                "website of the software": "Software's website",
                "minimal version": "Minimal acceptable version",
                "minimal version helper":
                    "Older version that it's still ok to have in production",
                "referents": "Referents",
                "referents helper":
                    "Public service agent that declares that this software is being used in their administrations",
                "see referents": "See referents",
                "parent software": "Parent software",
                "parent software helper":
                    "The software is a plugin, or a distribution of another software",
                "alike softwares": "Alike softwares",
                "alike softwares helper": "Known alternatives to this software",
                "workstation": "Agent workstation",
                "workstation helper":
                    "Is the software meant to be installed directly onto the agent computer, example: LibreOffice, counter example: Wordpress",
                "authors": "Authors",
                "authors helper":
                    "Authors, physical or moral entity behind the development of this software",
                "service provider": "Service provider",
                "service provider helper": "Company offering support for this software",
                "total service provider": ({ howMany }) =>
                    `${howMany} in total, see them on comptoir-du-libre.org`,
                "comptoir page": "Le Comptoir du Libre's page",
                "comptoir page helper":
                    "The Comptoir du Libre is a catalog published by ADULLACT",
                "see on comptoir": "Consult the page on comptoir-du-libre.org",
                "wikidata page": "Wikidata.org page",
                "wikidata page helper":
                    "Wikidata is a collaborative CC0 database from which we collect most of the information we display",
                "see on wikidata": "Consult wikidata.org page",
                "license": "License",
                "workshops replay": "Workshop replays",
                "workshops replay helper": "Replays of workshop about this software",
                "see all workshops": "See all workshops",
                "test url": "Try this software right now",
                "test url helper":
                    "If you are a french public agent you are entitled to test this software in your browser",
                "launch": "Launch 🚀",
                "workshop": ({ n }) => `Workshop n°${n}`,
                "use cases": "Use cases",
                "use cases helper":
                    "Documented use cases of the software in the french public services",
                "use case": ({ n }) => `Card n°${n}`,
                "tags": "Tags",
                "tags helper": "Tags that help find the software",
                "dereference from SILL": "Dereference from SILL...",
                "software dereferenced": ({
                    lastRecommendedVersion,
                    reason,
                    when,
                }) => `From ${when}, this software is no longer recommended${
                    reason === undefined ? "" : `, ${reason}`
                }}.
                ${
                    lastRecommendedVersion === undefined
                        ? ""
                        : `Last acceptable version: ${lastRecommendedVersion}`
                }`,
                "general info": "General information",
                "GouvTech Catalog": "GouvTech Catalog",
                "GouvTech Catalog helper":
                    "Digital solutions offered by companies to public services.",
                "consult on GouvTech": ({ gouvTechDomain }) =>
                    `Consult on ${gouvTechDomain}`,
                "public services": "Public services",
                "public services helper":
                    "Services maintained by the public sector powered by this software",
                "see the services": ({ servicesCount }) =>
                    `See the ${servicesCount} services`,
            },
            "Tags": {
                "change tags": ({ isThereTagsAlready }) =>
                    isThereTagsAlready ? "Add or remove tags" : "Add tags",
                "github picker label": "Software tags",
                "github picker create tag": ({ tag }) => `Create the "${tag}" tag`,
                "github picker done": "Done",
                "tags": "Tags",
                "no tags": "No tags",
            },
            "ServiceCatalogCard": {
                "proceed": "Proceed",
                "abort": "Abort",
                "confirm unregister service": ({ serviceName }) =>
                    `Confirm the deletion of ${serviceName}?`,
                "access service": "Access the service 🚀",
                "maintained by": "Maintained by",
                "software": "Software",
                "provide a reason for deleting the service":
                    "Please provide a reason for dereferencing this service.",
                "can't be empty": "Please provide a reason",
            },
            "ServiceCatalogCards": {
                "search results": ({ count }) => `${count} services`,
                "show more": "Show more",
                "no service found": "No software found",
                "no result found": ({ forWhat }) => `No result found for ${forWhat}`,
                "check spelling":
                    "Please check your spelling or try widening your search.",
                "go back": "Back to main services",
                "search": "Search",
                "filter by software": "Filter by software",
                "reference a new service": "Reference a new service",
            },
            "ServiceCatalog": {
                "header text1": "Service catalog",
                "header text2":
                    "Catalog of services maintained by the French public sector and powered by free and open source software",
                "what is the catalog of service": ({ link }) => (
                    <>
                        {" "}
                        <MuiLink {...link}>Click here</MuiLink> to learn more about what
                        is the catalog of service.{" "}
                    </>
                ),
            },
            "PickSoftware": {
                "validate unknown software name": ({ softwareName }) =>
                    `Validate "${softwareName}"`,
                "select the software": "Select the software",
                "deployed software": "Software deployed",
                "consider registering this software in the sill": ({
                    selectedSoftwareName,
                }) =>
                    `${selectedSoftwareName} isn't registered in the SILL yet, would you consider adding it?`,
            },
        },
        "fr": {
            /* spell-checker: disable */
            "DereferenceSoftwareDialog": {
                "remove from sill": ({ softwareName }) =>
                    `Retirer ${softwareName} du SILL`,
                "cancel": "Annuler",
                "confirm": "Confirmer",
                "reason": "Raison du déréférencement",
                "reason helper text":
                    "Expliquez pourquoi le logiciel doit être déréférencé du SILL",
                "last recommended version": "Dernière version recommandée",
                "enf of recommendation": "Fin de recommandations",
                "complete deletion": "Complètement supprimé du SILL",
            },
            "Account": {
                "infos": "Information du compte",
                "user-interface": "Interface",
                "text1": "Mon compte",
                "text2": "Accédez aux informations de votre compte.",
                "text3":
                    "Configurez vos identifiant, courriel, mot de passe et jetons d'accès personnels directement connectés à vos services.",
                "personal tokens tooltip": 'Ou en anglais "token".',
            },
            "AccountInfoTab": {
                "general information": "Informations générales",
                "user id": "Identifiant (IDEP)",
                "full name": "Nom complet",
                "email": "Adresse de courriel",
                "change account info":
                    "Modifier les informations du compte (comme, par exemple, votre mot de passe)",
                "agency name": "Nom de l'établissement de rattachement",
                "agency name helper": "Nom de votre institution, par example DINUM",
                "not a valid email": "Courriel non valide",
                "email helper":
                    "Utilisé pour la connexion et pour que les utilisateurs puissent vous joindre à propos des logiciels dont vous êtes référent",
            },
            "AccountUserInterfaceTab": {
                "title": "Configurer l'interface",
                "enable dark mode": "Activer le mode sombre",
                "dark mode helper":
                    "Thème de l'interface à faible luminosité avec un fond de couleur sombre.",
            },
            "DescriptiveField": {
                "copy tooltip": "Copier dans le presse-papier",
                "language": "Changer la langue",
                "service password": "Mot de passe pour vos services",
                "service password helper text": `Ce mot de passe est nécessaire pour vous connecter à tous vos services. 
            Il est généré automatiquement et se renouvelle régulièrement.`,
                "not yet defined": "Non définie",
            },
            "RegisterUserProfile": {
                "minimum length": ({ n }) => `Longueur minimale ${n}`,
                "must be different from email": "Ne peut pas être le courriel",
                "password mismatch": "Les deux mots de passe ne correspondent pas",
                "go back": "Retour",
                "form not filled properly yet":
                    "Veuillez vérifier que vous avez bien rempli le formulaire",
                "must respect the pattern": "Dois respecter le format",
                "mail subject":
                    "[SILL] Autorisation d'un nouveau domaine pour l'inscription",
                "mail body": `
            Bonjour, 

            veuillez, sous réserve qu'il soit éligible, ajouter mon nom de domaine
            à la liste des domaines autorisés pour s'inscrire sur la plateforme SILL.  

            Cordialement,
            `,
                "use your administrative email": "Votre courriel en tant qu'agent public",
                "you domain isn't allowed yet": ({ contactEmail, mailtoHref }) => (
                    <>
                        Votre domaine n'est pas encore autorisé. Contactez-nous à{" "}
                        <MuiLink href={mailtoHref}>{contactEmail}</MuiLink>
                    </>
                ),
            },
            "Header": {
                "login": "Connexion",
                "logout": "Déconnexion",
                "trainings": "Formations",
                "documentation": "Documentation",
                "project": "Projet",
            },
            "App": {
                "reduce": "Réduire",
                "account": "Mon compte",
                "catalog": "Catalogue des logiciels libres du SILL",
                "service catalog": "Services",
            },
            "FourOhFour": {
                "not found": "Page non trouvée",
            },
            "CatalogCard": {
                "last version": "Dernière version",
                "last version date": ({ date }) => {
                    return `en ${date}`;
                },
                "userAndReferentCount": ({ userCount, referentCount }) => {
                    return `${userCount} utilisateurs et ${referentCount} référents`;
                },
                "you are referent": ({ isOnlyReferent }) =>
                    `Vous êtes${isOnlyReferent ? " le" : ""} référent`,
                "authors": ({ doUsePlural }) => `Auteur${doUsePlural ? "s" : ""}`,
                "parent software": ({ name, link }) => (
                    <>
                        Plugin ou distribution de{" "}
                        {link === undefined ? name : <MuiLink {...link}>{name}</MuiLink>}
                    </>
                ),
                "declare oneself referent": "Se déclarer référent / utilisateur",
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
            "ReferentDialogs": {
                "close": "Fermer",
                "declare oneself referent of": ({ softwareName }) =>
                    `Me déclarer référent pour ${softwareName}`,
                "cancel": "Annuler",
                "send": "Envoyer",
                "declare oneself referent": "Me déclarer référent",
                "no longer referent": "Je ne suis plus référent",
                "use case description": "Description du cas d'usage",
                "use case description helper":
                    "Décrivez le cas d'usage de ce logiciel dans votre administration.",
                "i am a technical expert": "Je suis expert technique",
                "on behalf of who are you referent":
                    "Au nom de qui vous déclarez-vous référent ?",
                "on my own behalf": "En mon nom propre",
                "on my establishment behalf": "Au nom de mon établissement",
                "yes": "Oui",
                "no": "Non",
                "email": "Courriel",
                "establishment": "Établissement",
                "expert": "Expert technique",
                "institutional referent": "Référent institutionnel",
                "institutional referent help": `Un référent institutionnel est référent au nom de l'établissement auquel il est
                rattaché, les autres référents le sont à titre personnel.`,
                "mail subject": ({ softwareName }) =>
                    `Prise de contact relative à ${softwareName}`,
                "mail body": ({ softwareName }) => `
                Bonjour,
                J'ai obtenu votre contact via sill.etalab.gouv.fr, vous êtes référent pour ${softwareName}.  
                [...]
                `,
            },
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
            "Terms": {
                "no terms":
                    "Pas de document de terms et condition fournis pour cette instance du SILL",
            },
            "Footer": {
                "contribute": "Contribuer au projet",
                "terms of service": "Conditions d'utilisation",
                "change language": "Changer la langue",
                "rss feed": "Flux RSS",
            },
            "Login": {
                "doRegister": "Créer un compte",
                "or": "ou",
            },
            "Form": {
                "agentWorkstation": "Ordinateur de l'agent",
                "agentWorkstation helper":
                    "S'installe sur le poste de travail de l'agent ?",
                "cancel": "Annuler",
                "comptoirDuLibreId": "Identifiant dans le Comptoir du Libre",
                "comptoirDuLibreId helper":
                    "Identifiant du logiciel sur comptoir-du-libre.org (visible dans l'URL)",
                "function": "Fonction du logiciel",
                "function helper":
                    "Fonction du logiciel (éditeur de texte, éditeur de vidéo, etc.)",
                "invalid wikidata id": "Entité Wikidata invalide",
                "isFromFrenchPublicService": "🇫🇷 Développé par l'administration ?",
                "isFromFrenchPublicService helper":
                    "Est-ce que le logiciel est développé par le service public francais ?",
                "should be an integer": "Devrait être un identifiant numérique",
                "license": "Licence",
                "license helper": "Licence du logiciel (GNU GPL, BSD, etc.)",
                "mandatory field": "Ce champ est obligatoire",
                "name": "Nom du logiciel",
                "name helper": "Non du logiciel (GIMP, Inkscape, etc.)",
                "create software": "Terminer",
                "update software": "Mettre à jour les informations",
                "versionMin": "Version minimale",
                "versionMin helper":
                    "Quelle est la version minimale acceptable pour le logiciel ?",
                "wikidata id already exists":
                    "Un logiciel avec cet identifiant existe déjà",
                "wikidataId": "Entité Wikidata",
                "wikidataId helper":
                    "Quelle est l'entité Wikidata du logiciel, par exemple Q8038 pour GIMP",
                "name already exists": "Il existe déjà un logiciel avec ce nom",
                "title add": "Référencer un nouveau logiciel",
                "title edit": "Éditer une fiche",
                "help title add":
                    "Déclarez que ce logiciel est utilisé au sein de votre administration.",
                "help title edit": "Mettre à jour la fiche SILL de ce logiciel",
                "help": `La plupart des informations sont collectées automatiquement depuis wikidata.org.
            Il est important de renseigner l'entité Wikidata en premier, les autres champs 
            seront préremplis en fonction.  
            Si le logiciel n'a pas encore de fiche Wikidata, nous vous invitons à en créer une !`,
                "tags": "Tags",
                "tags helper": "Tags pour aider a trouver ce logiciel",
                "change tags": ({ selectedTagsCount }) =>
                    selectedTagsCount === 0 ? "Add tags" : "Add or remove tags",
                "confirm give up":
                    "Le logiciel n'a pas été mis à jour, confirmer l'abandon ?",
                "generalInfoMd": "Information générale",
                "generalInfoMd helper":
                    "Un texte en Markdown multiligne où vous pouvez spécifier des information que vous jugerez pertinente a propos du logiciel",
            },
            "FormAlikeSoftwares": {
                "done": "OK",
                "similar to": "Logiciel similaire du SILL",
                "add": "Ajouter",
                "alternative to": "Ce logiciel est une alternative à",
                "no similar software": "Pas d'autre logiciels similaires dans le SILL",
                "no alternative": "Pas d'alternative renseignée",
            },
            "ServiceForm": {
                "mandatory field": "Champ obligatoire",
                "not a valid url": "Ce n'es pas un URL valide",
                "service already referenced": "Ce service est déjà référencé",
                "description": "Description",
                "description helper":
                    "Décrivez brièvement l'offre de service, le text peut être en MarkDown",
                "agencyName": "Administration ou collectivité",
                "agencyName helper":
                    "Administration ou collectivité mettant en charge de la maintenance du service",
                "serviceUrl": "URL du service",
                "serviceUrl helper":
                    "Le plus important, l'URL permettant d'accéder au service",
                "softwareName": "Nom du logiciel",
                "softwareName helper": "Nom du logiciel libre déployer",
                "update service": "Mètre à jour",
                "create service": "Crée",
                "cancel": "Annuler",
                "title add": "Référencer un nouveau service",
                "title edit": "Mettre à jour le service",
                "help title add":
                    "Référencer un nouveau service propulsé avec du logiciel libre et maintenu par le service public",
                "help title edit": "Mètre à jour les informations du service",
                "help": `En référençant de nouveaux services, vous aider à établir un panorama des logiciels libres mis en production au sein du service public.`,
            },
            "SoftwareCard": {
                "dev by french public service":
                    "Développer par le service public français",
                "update software information":
                    "Mettre à jour les informations du logiciel",
                "software name": "Nom du logiciel",
                "software function": "Fonction du logiciel",
                "sill id": "Identifiant SILL",
                "sill id helper":
                    "Identifiant unique dans la base de données des logiciels du SILL",
                "in sill from date": "Date d'entrée dans le SILL",
                "dev by public service": "Développé par le service public",
                "present in support contract": "Présent dans le marché de support",
                "learn more about the": "En savoir plus sur les",
                "MISEULL":
                    "marchés interministériels de support et d'expertise à l'usage des logiciels libres",
                "yes": "Oui",
                "no": "Non",
                "repo": "Dépôt de code source",
                "website of the software": "Site web du logiciel",
                "minimal version": "Version minimale requise",
                "minimal version helper":
                    "Version la plus ancienne qu'il est encore acceptable d'avoir en production",
                "referents": "Référents",
                "referents helper":
                    "Agents du service public francais déclarant utiliser le logiciel",
                "see referents": "Voir les référents",
                "parent software": "Logiciel parent",
                "parent software helper":
                    "Ce logiciel est un module ou une distribution d'un autre logiciel",
                "alike softwares": "Logiciels similaires",
                "alike softwares helper": "Alternative identifiée à ce logiciel",
                "workstation": "Poste agent",
                "workstation helper":
                    "S'agit-il d'un logiciel s'installant directement sur le poste de l'agent (exemple: LibreOffice, contre-exemple: WordPress) ?",
                "authors": "Auteurs",
                "authors helper":
                    "Auteurs, personne physique ou morale, à l'origine du développement du logiciel",
                "service provider": "Prestataire de service",
                "service provider helper":
                    "Entreprise proposant des prestations pour ce logiciel",
                "total service provider": ({ howMany }) =>
                    `${howMany} au total, les consulter sur le Comptoir du Libre`,
                "comptoir page": "Fiche sur le Comptoir du Libre",
                "comptoir page helper":
                    "Le Comptoir du Libre est un catalogue de logiciels libres publié par l'ADULLACT",
                "see on comptoir": "Consulter la fiche comptoir-du-libre.org",
                "wikidata page": "Fiche wikidata.org",
                "wikidata page helper":
                    "Wikidata est une base de connaissances collaborative et libre. La plupart des informations affichées sont collectées depuis wikidata.org",
                "see on wikidata": "Consulter la fiche wikidata.org",
                "license": "Licence",
                "workshops replay": "Visionnage des ateliers",
                "workshops replay helper":
                    "Rediffusion des ateliers BlueHats sur ce logiciel",
                "see all workshops":
                    "Voir tous les ateliers et être averti des prochains",
                "test url": "Essayer ce logiciel maintenant",
                "test url helper":
                    "Si vous êtes agent public, vous pouvez tester ce logiciel dans votre navigateur",
                "launch": "Démarrer 🚀",
                "workshop": ({ n }) => `Atelier n°${n}`,
                "use cases": "Cas d'usage",
                "use cases helper":
                    "Cas d'usage documenté d'une utilisation de ce logiciel au sein de l'administration.",
                "use case": ({ n }) => `Fiche n°${n}`,
                "tags": "Tags",
                "tags helper": "Tags aidant à trouver le logiciel",
                "dereference from SILL": "Déréférencer du SILL...",
                "software dereferenced": ({
                    lastRecommendedVersion,
                    reason,
                    when,
                }) => `Depuis ${when}, ce logiciel n'est plus recommandé ${
                    reason === undefined ? "" : ` : « ${reason} »`
                }.
                ${
                    !lastRecommendedVersion
                        ? ""
                        : `Dernière version recommandée : ${lastRecommendedVersion}`
                }`,
                "general info": "Informations générales",
                "GouvTech Catalog": "Catalogue GouvTech",
                "GouvTech Catalog helper":
                    "Catalogue des solutions numériques proposées par les entreprises aux services publics.",
                "consult on GouvTech": ({ gouvTechDomain }) =>
                    `Consulter sur ${gouvTechDomain}`,
                "public services": "Services",
                "public services helper":
                    "Services maintenus par l'organisme public qui utilise ce logiciel",
                "see the services": ({ servicesCount }) =>
                    `See the ${servicesCount} services`,
            },
            "Tags": {
                "change tags": ({ isThereTagsAlready }) =>
                    isThereTagsAlready
                        ? "Ajouter ou modifier les tags"
                        : "Ajouter des tags",
                "github picker label": "Tags du logiciel",
                "github picker create tag": ({ tag }) => `Crée le tag "${tag}"`,
                "github picker done": "Ok",
                "tags": "Tags",
                "no tags": "Aucun tag",
            },
            "ServiceCatalogCard": {
                "proceed": "Confirmer",
                "abort": "Abandonner",
                "confirm unregister service": ({ serviceName }) =>
                    `Confirmer la suppression de ${serviceName}?`,
                "provide a reason for deleting the service":
                    "Veuillez préciser la raison pour laquelle vous déréférencez ce service.",
                "can't be empty": "Veuiller préciser une raison",
                "access service": "Accéder au service 🚀",
                "maintained by": "Maintenu par",
                "software": "Logiciel",
            },
            "ServiceCatalogCards": {
                "search results": ({ count }) => `${count} services`,
                "show more": "Montrer plus",
                "no service found": "Pas de service trouvé",
                "no result found": ({ forWhat }) =>
                    `Par de résultat trouvé pour ${forWhat}`,
                "check spelling":
                    "Please check your spelling or try widening your search.",
                "go back": "Back to main services",
                "search": "Search",
                "filter by software": "Filter by software",
                "reference a new service": "Référencer un nouveau service",
            },
            "ServiceCatalog": {
                "header text1": "Catalogue de service",
                "header text2":
                    "Catalogue de services maintenus par des organismes publics et propulsés par du logiciel libre",
                "what is the catalog of service": ({ link }) => (
                    <>
                        {" "}
                        <MuiLink {...link}>Cliquez ici</MuiLink> pour en apprendre plus à
                        propos de ce qu'est le catalogue de services.{" "}
                    </>
                ),
            },
            "PickSoftware": {
                "validate unknown software name": ({ softwareName }) =>
                    `Validé avec "${softwareName}"`,
                "select the software": "Sélectionner le logiciel",
                "deployed software": "Logiciel déployé",
                "consider registering this software in the sill": ({
                    selectedSoftwareName,
                }) =>
                    `${selectedSoftwareName} n'est pas encore dans le SILL, envisageriez-vous de l'ajouter ?`,
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
