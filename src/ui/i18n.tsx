import MuiLink from "@mui/material/Link";
import { createI18nApi } from "i18nifty";
import { languages } from "sill-api";
import type { Language } from "sill-api";

export { languages };
export type { Language };

export const fallbackLanguage = "en";

export const {
    useTranslation,
    resolveLocalizedString,
    useLang,
    evtLang,
    useResolveLocalizedString,
} = createI18nApi<
    | typeof import("ui/components/shared/Header").i18n
    | typeof import("ui/components/shared/DescriptiveField").i18n
    | typeof import("ui/components/shared/ReferentDialogs").i18n
    | typeof import("ui/components/App/App").i18n
    | typeof import("ui/components/pages/FourOhFour").i18n
    | typeof import("ui/components/pages/Form").i18n
    | typeof import("ui/components/pages/SoftwareCard").i18n
    | typeof import("ui/components/pages/Account/Account").i18n
    | typeof import("ui/components/pages/Account/tabs/AccountInfoTab").i18n
    | typeof import("ui/components/pages/Account/tabs/AccountUserInterfaceTab").i18n
    | typeof import("ui/components/pages/Catalog/CatalogCards/CatalogCards").i18n
    | typeof import("ui/components/pages/Catalog/CatalogCards/CatalogCard").i18n
    | typeof import("ui/components/pages/Catalog").i18n
    | typeof import("ui/components/App/Footer").i18n
    | typeof import("ui/components/KcApp/Login/LoginDivider").i18n
    | typeof import("ui/components/KcApp/Login").i18n
    | typeof import("ui/components/KcApp/RegisterUserProfile").i18n
>()(
    {
        languages,
        fallbackLanguage,
    },
    {
        "en": {
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
                "s3 scripts": "Init script",
                "service password": "Password for your services",
                "service password helper text": `This password is required to log in to all of your services. 
            It is generated automatically and renews itself regularly.`,
                "not yet defined": "Not yet defined",
                "reset helper dialogs": "Reset instructions windows",
                "reset": "Reset",
                "reset helper dialogs helper text":
                    "Reset message windows that have been requested not to be shown again",
            },
            "RegisterUserProfile": {
                "allowed email domains": "Allowed domains:",
                "minimum length": ({ n }) => `Minimum length: ${n}`,
                "must be different from email": "Password can't be the email",
                "password mismatch": "Passwords mismatch",
                "go back": "Go back",
                "form not filled properly yet":
                    "Please make sure the form is properly filled out",
                "must respect the pattern": "Must respect the pattern",
                "your domain isn't listed yet?": "Your domain isn't listed yet?",
                "contact us at": "Contact us at:",
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
            },
            "FourOhFour": {
                "not found": "Page not found",
            },
            "CatalogCard": {
                "learn more": "Learn more",
                "try it": "Try it 🚀",
                "you are referent": "You are referent",
                "you are the referent": "You are the referent",
                "show the referent": "Show the referent",
                "show referents": "Show referents",
                "show the others referents": "Show the others referents",
                "declare oneself referent": "Declare yourself referent",
                "this software has no referent": "This software has not referent",
                "no longer referent": "I am no longer referent",
                "to install on the computer of the agent":
                    "To install on the computer of the agent",
                //TODO: Rename
                "identified developer": "Author",
                "identified developers": "Authors",
            },
            "ReferentDialogs": {
                "close": "Close",
                "expert": "You are technical expert",
                "you": "You",
                "declare oneself referent of": ({ softwareName }) =>
                    `Declare yourself referent of ${softwareName}`,
                "cancel": "Cancel",
                "send": "Send",
                "declare oneself referent": "Declare yourself referent",
                "no longer referent": "I am no longer referent",
                "useCaseDescription": "Use case description",
                "useCaseDescription helper":
                    "Please describe in what context and to which extend this software is used in your agency",
                "i am a technical expert": "I am a technical expert",
            },
            "CatalogCards": {
                "show more": "Show more",
                "no service found": "No service found",
                "no result found": ({ forWhat }) => `No result found for ${forWhat}`,
                "check spelling":
                    "Please check your spelling or try widening your search.",
                "go back": "Back to main services",
                "main services": "Main services",
                "all software": "All software",
                "search results": "Search result",
                "search": "Search",
                "alike software": "Alike software",
                "other similar software":
                    "Others similar software that are not in the catalog",
                "reference a new software": "Reference a new software",
            },
            "Catalog": {
                "header text1": "Recommended Free Software catalog",
                "header text2":
                    "Catalog of used and recommended free and open source software for administrative public services.",
                "header text3": ({ link }) => (
                    <>
                        You are a public agent and you want to recommend a free
                        software?&nbsp;<MuiLink {...link}>Click here</MuiLink>.
                    </>
                ),
            },
            "Footer": {
                "contribute": "Contribute",
                "terms of service": "Terms of service",
                "change language": "Change language",
                "rss feed": "RSS Feed",
            },
            "LoginDivider": {
                "or": "or",
            },
            "Login": {
                "doRegister": "Create an account",
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
                "isPresentInSupportContract": "Is present in support contract",
                "isPresentInSupportContract helper":
                    "Is the software listed in the support contract (if in doubt say no)",
                "send": "Send",
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
            },
            "SoftwareCard": {
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
                    "The software is a plugin or an extension for another software",
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
            },
        },
        "fr": {
            /* spell-checker: disable */
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
                "agency name": "Nom du service de ratachement",
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
                "s3 scripts": "Script d'initialisation",
                "service password": "Mot de passe pour vos services",
                "service password helper text": `Ce mot de passe est nécessaire pour vous connecter à tous vos services. 
            Il est généré automatiquement et se renouvelle régulièrement.`,
                "not yet defined": "Non définie",
                "reset helper dialogs": "Réinitialiser les fenêtres d'instructions",
                "reset": "Réinitialiser",
                "reset helper dialogs helper text":
                    "Réinitialiser les fenêtres de messages que vous ne voulez plus afficher",
            },
            "RegisterUserProfile": {
                "allowed email domains": "Domaines autorisés",
                "minimum length": ({ n }) => `Longueur minimale ${n}`,
                "must be different from email": "Ne peut pas être le courriel",
                "password mismatch": "Les deux mots de passe ne correspondent pas",
                "go back": "Retour",
                "form not filled properly yet":
                    "Veuillez vérifier que vous avez bien rempli le formulaire",
                "must respect the pattern": "Dois respecter le format",
                "your domain isn't listed yet?":
                    "Votre domaine n'est pas encore dans la liste?",
                "contact us at": "Contactez-nous à:",
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
            },
            "FourOhFour": {
                "not found": "Page non trouvée",
            },
            "CatalogCard": {
                "learn more": "En savoir plus",
                "try it": "Essayer 🚀",
                "you are referent": "Vous êtes référent",
                "you are the referent": "Vous êtes le référent",
                "show the referent": "Voir le référent",
                "show referents": "Voir les référents",
                "show the others referents": "Voir les autres référents",
                "declare oneself referent": "Me déclarer référent",
                "this software has no referent": "Pas de référent",
                "no longer referent": "Je ne suis plus référent",
                "to install on the computer of the agent":
                    "À installer sur le poste de travail de l'agent",
                "identified developer": "Auteur",
                "identified developers": "Auteurs",
            },
            "ReferentDialogs": {
                "close": "Fermer",
                "expert": "Vous êtes expert technique",
                "you": "Vous",
                "declare oneself referent of": ({ softwareName }) =>
                    `Me déclarer référent pour ${softwareName}`,
                "cancel": "Annuler",
                "send": "Envoyer",
                "declare oneself referent": "Me déclarer référent",
                "no longer referent": "Je ne suis plus référent",
                "useCaseDescription": "Déscription du cas d'usage",
                "useCaseDescription helper":
                    "Décrivez le cas d'usage de ce logiciel dans votre administration.",
                "i am a technical expert": "Je suis expert technique",
            },
            "CatalogCards": {
                "show more": "Afficher tous",
                "no service found": "Service non trouvé",
                "no result found": ({ forWhat }) =>
                    `Aucun résultat trouvé pour ${forWhat}`,
                "check spelling": `Vérifiez que le nom du service est correctement 
            orthographié ou essayez d'élargir votre recherche.`,
                "go back": "Retourner aux principaux services",
                "main services": "Principaux services",
                "all software": "Tous les logiciels",
                "search results": "Résultats de la recherche",
                "search": "Rechercher",
                "alike software": "Logiciels similaires",
                "other similar software":
                    "Autres logiciels similaires qui ne sont pas dans le catalogue",
                "reference a new software": "Référencer un nouveau logiciel",
            },
            "Catalog": {
                "header text1": "Catalogue des logiciels libres du SILL",
                "header text2":
                    "Le catalogue des logiciels libres utilisés et recommandés pour les administrations",
                "header text3": ({ link }) => (
                    <>
                        Vous êtes agent public et souhaitez recommander un logiciel
                        libre?&nbsp;<MuiLink {...link}>Cliquez ici</MuiLink>.
                    </>
                ),
            },
            "Footer": {
                "contribute": "Contribuer au projet",
                "terms of service": "Conditions d'utilisation",
                "change language": "Changer la langue",
                "rss feed": "Flux RSS",
            },
            "LoginDivider": {
                "or": "ou",
            },
            "Login": {
                "doRegister": "Créer un compte",
            },
            "Form": {
                "agentWorkstation": "Ordinateur de l'agent",
                "agentWorkstation helper":
                    "S'installe sur le poste de travail de l'agent?",
                "cancel": "Annuler",
                "comptoirDuLibreId": "Identifiant dans le Comptoir du Libre",
                "comptoirDuLibreId helper":
                    "Identifiant du logiciel sur comptoir-du-libre.org (visible dans l'URL)",
                "function": "Fonction du logicel",
                "function helper":
                    "Fonction du logiciel (éditeur de texte, éditeur de vidéo, etc.)",
                "invalid wikidata id": "Entité Wikidata invalide",
                "isFromFrenchPublicService": "🇫🇷 Développé par l'administration?",
                "isFromFrenchPublicService helper":
                    "Est-ce que le logicel est développé par le service public francais?",
                "should be an integer": "Devrait être un identifiant numérique",
                "isPresentInSupportContract":
                    "Couvert par le marché de support logiciels libres",
                "isPresentInSupportContract helper":
                    "Est présent dans le marché de support - dans le doute, laisser à faux",
                "license": "Licence",
                "license helper": "Licence du logiciel (GNU GPL, BSD, etc.)",
                "mandatory field": "Ce champ est obligatoire",
                "name": "Nom du logiciel",
                "name helper": "Non du logiciel (GIMP, Inkscape, etc.)",
                "send": "Envoyer",
                "versionMin": "Version minimale",
                "versionMin helper":
                    "Quelle est la version minimale acceptable pour le logiciel?",
                "wikidata id already exists":
                    "Un logiciel avec cet identifiant existe déjà",
                "wikidataId": "Entité Wikidata",
                "wikidataId helper":
                    "Quelle est l'entité Wikidata du logiciel, par exemple Q8038 pour GIMP",
                "name already exists": "Il existe déjà un logiciel avec ce nom",
                "title add": "Référencer un nouveau logiciel",
                "title edit": "Editer une fiche",
                "help title add":
                    "Déclarez que ce logiciel est utilisé au sein de votre administration.",
                "help title edit": "Mettre à jour la fiche SILL de ce logiciel",
                "help": `La plupart des informations sont collectées automatiquement depuis wikidata.org
            Il est important de renseigner l'entité Wikidata en premier, les autres champs 
            seront préremplis en fonction.  
            Si le logiciel n'a pas encore de fiche Wikidata, nous vous invitons à en créer une!`,
            },
            "SoftwareCard": {
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
                    "Ce logiciel est un module ou une extention d'un autre logiciel",
                "alike softwares": "Logiciels similaires",
                "alike softwares helper": "Alternative identifiée à ce logiciel",
                "workstation": "Poste agent",
                "workstation helper":
                    "S'agit-il d'un logiciel s'installant directement sur le poste de l'agent (exemple: LibreOffice, contre-exemple: WordPress)?",
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
            },
            /* spell-checker: enable */
        },
    },
);
