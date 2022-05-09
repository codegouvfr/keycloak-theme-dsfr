import { symToStr } from "tsafe/symToStr";
import { Reflect } from "tsafe/Reflect";
import { id } from "tsafe/id";
import { Header } from "ui/components/shared/Header";
import { App } from "ui/components/App/App";
import { FourOhFour } from "ui/components/pages/FourOhFour";
import { Form } from "ui/components/pages/Form";
import { CatalogSoftwareDetails } from "ui/components/pages/Catalog/CatalogSoftwareDetails";
import { RegisterUserProfile } from "ui/components/KcApp/RegisterUserProfile";
import { DescriptiveField } from "ui/components/shared/DescriptiveField";
import { Account } from "ui/components/pages/Account/Account";
import { AccountInfoTab } from "ui/components/pages/Account/tabs/AccountInfoTab";
import { AccountUserInterfaceTab } from "ui/components/pages/Account/tabs/AccountUserInterfaceTab";
import { CatalogCards } from "ui/components/pages/Catalog/CatalogCards/CatalogCards";
import { CatalogCard } from "ui/components/pages/Catalog/CatalogCards/CatalogCard";
import { CatalogReferentDialogs } from "ui/components/pages/Catalog/CatalogReferentDialogs";
import { Catalog } from "ui/components/pages/Catalog";
import { Footer } from "ui/components/App/Footer";
import { LoginDivider } from "ui/components/KcApp/Login/LoginDivider";
import { Login } from "ui/components/KcApp/Login";
import type { KcLanguageTag } from "keycloakify";
import { assert } from "tsafe/assert";
import type { Language } from "sill-api";

export type Scheme = {
    [key: string]: undefined | Record<string, string>;
};

type ToTranslations<S extends Scheme> = {
    [key in keyof S]: string;
};

// prettier-ignore
const reflectedI18nSchemes = {
    [symToStr({ Header })]: Reflect<Header.I18nScheme>(),
    [symToStr({ App })]: Reflect<App.I18nScheme>(),
    [symToStr({ FourOhFour })]: Reflect<FourOhFour.I18nScheme>(),
    [symToStr({ RegisterUserProfile })]: Reflect<RegisterUserProfile.I18nScheme>(),
    [symToStr({ DescriptiveField })]: Reflect<DescriptiveField.I18nScheme>(),
    [symToStr({ Account })]: Reflect<Account.I18nScheme>(),
    [symToStr({ AccountInfoTab })]: Reflect<AccountInfoTab.I18nScheme>(),
    [symToStr({ AccountUserInterfaceTab })]: Reflect<AccountUserInterfaceTab.I18nScheme>(),
    [symToStr({ CatalogCard })]: Reflect<CatalogCard.I18nScheme>(),
    [symToStr({ CatalogCards })]: Reflect<CatalogCards.I18nScheme>(),
    [symToStr({ Catalog })]: Reflect<Catalog.I18nScheme>(),
    [symToStr({ Footer })]: Reflect<Footer.I18nScheme>(),
    [symToStr({ LoginDivider })]: Reflect<LoginDivider.I18nScheme>(),
    [symToStr({ Login })]: Reflect<Login.I18nScheme>(),
    [symToStr({ Form })]: Reflect<Form.I18nScheme>(),
    [symToStr({ CatalogSoftwareDetails })]: Reflect<CatalogSoftwareDetails.I18nScheme>(),
    [symToStr({ CatalogReferentDialogs })]: Reflect<CatalogReferentDialogs.I18nScheme>(),
};

export type I18nSchemes = typeof reflectedI18nSchemes;

export type Translations = {
    [K in keyof I18nSchemes]: ToTranslations<I18nSchemes[K]>;
};

assert<Language extends KcLanguageTag ? true : false>();

export const fallbackLanguage = "en";

assert<typeof fallbackLanguage extends Language ? true : false>();

export const resources = id<Record<Language, Translations>>({
    "en": {
        "Account": {
            "infos": "Account infos",
            "user-interface": "Interface preferences",
            "text1": "My account",
            "text2": "Access your different account information.",
            "text3":
                "Configure your usernames, emails, passwords and personal access tokens directly connected to your services.",
            "personal tokens tooltip":
                "Password that are generated for you and that have a given validity period",
        },
        "AccountInfoTab": {
            "general information": "General information",
            "user id": "User id (IDEP)",
            "full name": "Full name",
            "email": "Email address",
            "change account info": "Change account information (e.g., password).",
            "agency name": "Agency name",
        },
        "AccountUserInterfaceTab": {
            "title": "Interface preferences",
            "enable dark mode": "Enable dark mode",
            "dark mode helper": "Low light interface theme with dark colored background.",
        },
        "DescriptiveField": {
            "copy tooltip": "Copy in clipboard",
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
            "minimum length": "Minimum length: {{n}}",
            "must be different from email": "Pass can't be the email",
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
            "catalog": "Software catalog",
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
        "CatalogReferentDialogs": {
            "close": "Close",
            "expert": "You are technical expert",
            "you": "You",
            "declare oneself referent of":
                "Declare yourself referent of {{softwareName}}",
            "cancel": "Cancel",
            "send": "Send",
            "declare oneself referent": "Declare yourself referent",
            "no longer referent": "I am no longer referent",
        },
        "CatalogCards": {
            "show more": "Show more",
            "no service found": "No service found",
            "no result found": "No result found for {{forWhat}}",
            "check spelling": "Please check your spelling or try widening your search.",
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
            "header text1": "Software catalog",
            "header text2":
                "Catalog of used and recommended free and open source software for administrative public services.",
            "header text3":
                "You are a public agent and you want to recommend a free software? Click here.",
        },
        "Footer": {
            "contribute": "Contribute",
            "terms of service": "Terms of service",
            "change language": "Change language",
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
                "Is it meant to be installed on the agent workstation?",
            "cancel": "Cancel",
            "comptoirDuLibreId": "Comptoir du Libre ID",
            "comptoirDuLibreId helper":
                "ID of the software on comptoir-du-libre.org (It's in the url, ex 67 for Gimp)",
            "function": "Software's function",
            "function helper": "What is the function of the software?",
            "i am a technical expert": "I am a technical expert",
            "invalid wikidata id": "Invalid wikidata id",
            "isFromFrenchPublicService": "Is 🇫🇷",
            "isFromFrenchPublicService helper":
                "Is the software developed by a French public service?",
            "license": "License",
            "license helper": "What is the license of the software? E.g. GPLv3",
            "mandatory field": "Mandatory field",
            "name": "Software's name",
            "name helper": "What is the name of the software?",
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
            "help": `Most information are automatically collected from Wikidata.org
            It is important that you first fill in the WikiData ID, the other fields will
            be filled automatically.  
            If the software do not exist yet in WikiData you are more than welcome to 
            create an entry for it.
            `,
        },
        "CatalogSoftwareDetails": {
            "update software information": "Update software information",
            "software name": "Name of the software",
            "software's function": "Software's function",
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
            "total service provider":
                "{{howMany}} in total, see them on le-comptoir-du-libre.org",
            "comptoir page": "Le Comptoir du Libre's page",
            "comptoir page helper":
                "The Comptoir du libre is a catalog much like the SILL",
            "see on comptoir": "Consult the page on comptoir-du-libre.org",
            "wikidata page": "WikiData.org page",
            "wikidata page helper":
                "Wikidata is a public database from which we collect most of the information we display",
            "see on wikidata": "Consult WikiData.org page",
            "license": "License",
            "workshops replay": "Workshop replays",
            "workshops replay helper": "Replays of workshop about this software",
            "see all workshops": "See all workshops",
            "test url": "Try this software right now",
            "test url helper":
                "If you are a french public agent you are entitled to test this software in your browser",
            "launch": "Launch 🚀",
        },
    },
    "fr": {
        /* spell-checker: disable */
        "Account": {
            "infos": "Information du compte",
            "user-interface": "Modes d'interface",
            "text1": "Mon compte",
            "text2": "Accèdez à vos différentes informations de compte.",
            "text3":
                "Configurez vos identifiants, e-mails, mots de passe et jetons d'accès personnels directement connectés à vos services.",
            "personal tokens tooltip": 'Ou en anglais "token".',
        },
        "AccountInfoTab": {
            "general information": "Informations générales",
            "user id": "Identifiant (IDEP)",
            "full name": "Nom complet",
            "email": "Adresse mail",
            "change account info":
                "Modifier les informations du compte (comme, par exemple, votre mot de passe)",
            "agency name": "Nom du service de ratachement",
        },
        "AccountUserInterfaceTab": {
            "title": "Configurer le mode d'interface",
            "enable dark mode": "Activer le mode sombre",
            "dark mode helper":
                "Thème de l'interface à faible luminosité avec un fond de couleur sombre.",
        },
        "DescriptiveField": {
            "copy tooltip": "Copier dans le press papier",
            "language": "Changer la langue",
            "s3 scripts": "Script d'initialisation",
            "service password": "Mot de passe pour vos services",
            "service password helper text": `Ce mot de passe est nécessaire pour vous connecter à tous vos services. 
            Il est généré automatiquement et se renouvelle régulièrement.`,
            "not yet defined": "Non définie",
            "reset helper dialogs": "Réinitialiser les fenêtres d'instructions",
            "reset": "Réinitialiser",
            "reset helper dialogs helper text":
                "Réinitialiser les fenêtres de messages que vous avez demandé de ne plus afficher",
        },
        "RegisterUserProfile": {
            "allowed email domains": "Domaines autorisés",
            "minimum length": "Longueur minimum {{n}}",
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
            "catalog": "Catalogue de logiciel",
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
        "CatalogReferentDialogs": {
            "close": "Fermer",
            "expert": "Vous êtes expert technique",
            "you": "Vous",
            "declare oneself referent of": "Me déclarer référent de {{softwareName}}",
            "cancel": "Annuler",
            "send": "Envoyer",
            "declare oneself referent": "Me déclarer référent",
            "no longer referent": "Je ne suis plus référent",
        },
        "CatalogCards": {
            "show more": "Afficher tous",
            "no service found": "Service non trouvé",
            "no result found": "Aucun résultat trouvé pour {{forWhat}}",
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
            "reference a new software": "Reférencer un nouveau logiciel",
        },
        "Catalog": {
            "header text1": "Catalogue de logiciel",
            "header text2":
                "Le catalogue des logiciels libres utilisé et recommandé pour les administrations",
            "header text3":
                "Vous êtes Agen publique et souhaitez recommander un logiciel libre? Cliquez ici.",
        },
        "Footer": {
            "contribute": "Contribuer au projet",
            "terms of service": "Conditions d'utilisation",
            "change language": "Changer la langue",
        },
        "LoginDivider": {
            "or": "ou",
        },
        "Login": {
            "doRegister": "Créer un compte",
        },
        "Form": {
            "agentWorkstation": "Ordinateur de l'agent",
            "agentWorkstation helper": "S'install sur le poste de travail de l'agent?",
            "cancel": "Annuler",
            "comptoirDuLibreId": "Comptoir du Libre ID",
            "comptoirDuLibreId helper":
                "ID du logiciel sur comptoir-du-libre.org (Visible dans l'URL, ex 67 for Gimp)",
            "function": "Fonction du logicel",
            "function helper":
                "Fonction du logiciel (ex: éditeur de texte, éditeur de vidéo, etc.)",
            "i am a technical expert": "Je suis expert technique",
            "invalid wikidata id": "Wikidata ID invalide",
            "isFromFrenchPublicService": "Viens de l'administration 🇫🇷?",
            "isFromFrenchPublicService helper":
                "Est-ce que le logicel est développé par le service publique francais?",
            "license": "Licence",
            "license helper": "Licence du logiciel (ex: GPL, BSD, etc.)",
            "mandatory field": "Ce champ est obligatoire",
            "name": "Nom du logiciel",
            "name helper": "Non du logiciel (ex: Gimp, Inkscape, etc.)",
            "send": "Envoyer",
            "versionMin": "Version minimale",
            "versionMin helper":
                "Quelle est la version minimal acceptable pour le logiciel?",
            "wikidata id already exists": "Un logiciel avec cet ID existe déjà",
            "wikidataId": "Wikidata ID",
            "wikidataId helper":
                "Quelle est l'identifiant Wikidata du logiciel, example: Q8038 for Gimp",
            "name already exists": "Il existe déjà un logiciel avec ce nom",
            "title add": "Recenser un nouveau logiciel",
            "title edit": "Editer une fiche",
            "help title add":
                "Déclarez que ce logiciel est utilisé au sein de votre administration.",
            "help title edit": "Mettre à jour la fiche SILL de ce logiciel",
            "help": `La plupart des informations sont collectées automatiquement depuis Wikidata.org
            Il est important de renseigner l'ID WikiData en premier, les autres champs 
            seront près remplis en fonction.  
            Si le logiciel n'a pas encore de fiche WikiData, vous êtes bienvenu pour en créer une!`,
        },
        "CatalogSoftwareDetails": {
            "update software information": "Mettre à jour les informations du logiciel",
            "software name": "Nom du logiciel",
            "software's function": "Fonction du logiciel",
            "sill id": "Identifiant SILL",
            "sill id helper":
                "Identifiant unique dans la base de donnée de logiciel du SILL.",
            "in sill from date": "Date d'entré dans le sill",
            "dev by public service": "Développer par le service publique",
            "present in support contract": "Présent dans le marché de support",
            "learn more about the": "En savoir plus sur le",
            "MISEULL":
                "Marchés interministériels support et expertise à l'usage des logiciels libres",
            "yes": "Oui",
            "no": "Non",
            "repo": "Dépot de code source",
            "website of the software": "Site web du logiciel",
            "minimal version": "Version minimum requise",
            "minimal version helper":
                "Version la plus encienne qu'il est encore acceptable d'avoir en production",
            "referents": "Référents",
            "referents helper":
                "Agents du service publique francais déclarant utiliser le logiciel",
            "see referents": "Voir les référents",
            "parent software": "Logiciel parent",
            "parent software helper":
                "Ce logiciel est un plugin ou une extention d'un autre logiciel",
            "alike softwares": "Logiciels similaires",
            "alike softwares helper": "Alternative identifié a ce logiciel",
            "workstation": "Poste agent",
            "workstation helper":
                "Es qu'il s'agit d'un logiciell s'installant directement sur le poste de l'agent, example: LibreOffice, contre example: WordPress)",
            "authors": "Auteurs",
            "authors helper":
                "Auteurs, personne phisique ou morale, à l'orrigine du développement du logiciel",
            "service provider": "Préstataire de service",
            "service provider helper":
                "Entreprise proposant des préstation pour ce logiciel logiciel",
            "total service provider":
                "{{howMany}} au total, les consulter sur le comptoir du libre",
            "comptoir page": "Fiche sur le Comptoir du Libre",
            "comptoir page helper":
                "Le comptoir du libre est un catalogue de logiciel libre homologue au SILL",
            "see on comptoir": "Consulter la fiche comptoir-du-libre.org",
            "wikidata page": "Fiche WikiData.org",
            "wikidata page helper":
                "WikiData est une base de connaissance publique. La plus part des information afficher sont colécter sur WikiData.org",
            "see on wikidata": "Consulter la fiche WikiData.org",
            "license": "Lisence",
            "workshops replay": "Replay des atteliers",
            "workshops replay helper":
                "Rediffustion des atteliers BlueHats sur ce logiciel",
            "see all workshops": "Voir tous les atteliers et être avertis des prochains",
            "test url": "Essayer ce logiciel maintenant",
            "test url helper":
                "Si vous êtes agent publique, vous avez le droit de tester ce logiciel dans votre navigateur",
            "launch": "Launch 🚀",
        },
        /* spell-checker: enable */
    },
});
