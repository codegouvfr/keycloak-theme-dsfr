import { symToStr } from "tsafe/symToStr";
import { Reflect } from "tsafe/Reflect";
import { id } from "tsafe/id";
import { Header } from "ui/components/shared/Header";
import { App } from "ui/components/App/App";
import { FourOhFour } from "ui/components/pages/FourOhFour";
import { PortraitModeUnsupported } from "ui/components/pages/PortraitModeUnsupported";
import { RegisterUserProfile } from "ui/components/KcApp/RegisterUserProfile";
import { AccountField } from "ui/components/pages/Account/AccountField";
import { Account } from "ui/components/pages/Account/Account";
import { AccountInfoTab } from "ui/components/pages/Account/tabs/AccountInfoTab";
import { AccountUserInterfaceTab } from "ui/components/pages/Account/tabs/AccountUserInterfaceTab";
import { CatalogCards } from "ui/components/pages/Catalog/CatalogCards/CatalogCards";
import { CatalogCard } from "ui/components/pages/Catalog/CatalogCards/CatalogCard";
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
    [symToStr({ PortraitModeUnsupported })]: Reflect<PortraitModeUnsupported.I18nScheme>(),
    [symToStr({ FourOhFour })]: Reflect<FourOhFour.I18nScheme>(),
    [symToStr({ RegisterUserProfile })]: Reflect<RegisterUserProfile.I18nScheme>(),
    [symToStr({ AccountField })]: Reflect<AccountField.I18nScheme>(),
    [symToStr({ Account })]: Reflect<Account.I18nScheme>(),
    [symToStr({ AccountInfoTab })]: Reflect<AccountInfoTab.I18nScheme>(),
    [symToStr({ AccountUserInterfaceTab })]: Reflect<AccountUserInterfaceTab.I18nScheme>(),
    [symToStr({ CatalogCard })]: Reflect<CatalogCard.I18nScheme>(),
    [symToStr({ CatalogCards })]: Reflect<CatalogCards.I18nScheme>(),
    [symToStr({ Catalog })]: Reflect<Catalog.I18nScheme>(),
    [symToStr({ Footer })]: Reflect<Footer.I18nScheme>(),
    [symToStr({ LoginDivider })]: Reflect<LoginDivider.I18nScheme>(),
    [symToStr({ Login })]: Reflect<Login.I18nScheme>(),
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
        "AccountField": {
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
            "allowed email domains": "Allowed domains",
            "minimum length": "Minimum length: {{n}}",
            "must be different from email": "Pass can't be the email",
            "password mismatch": "Passwords mismatch",
            "go back": "Go back",
            "form not filled properly yet":
                "Please make sure the form is properly filled out",
            "must respect the pattern": "Must respect the pattern",
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
        "PortraitModeUnsupported": {
            "portrait mode not supported": "Portrait mode isn't supported yet",
            "instructions":
                "To use this app on your phone please enable the rotation sensor and turn your phone.",
        },
        "CatalogCard": {
            "learn more": "Learn more",
            "try it": "Try it 🚀",
            "you are referent": "You are referent",
            "you are the referent": "You are the referent",
            "show the referent": "Show the referent",
            "show referents": "Show referents",
            "show the others referents": "Show the others referents",
            "close": "Close",
            "expert": "You are expert",
            "you": "You",
            "declare oneself referent": "Declare yourself referent",
            "declare oneself referent of":
                "Declare yourself referent of {{softwareName}}",
            "cancel": "Cancel",
            "send": "Send",
            "this software has not referent": "This software has not referent",
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
        "AccountField": {
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
        "PortraitModeUnsupported": {
            "portrait mode not supported": "Le mode portrait n'est pas encore supporté",
            "instructions":
                "Pour utiliser cette application depuis votre mobile, veuillez activer le capteur de rotation et tourner votre téléphone.",
        },
        "CatalogCard": {
            "learn more": "En savoir plus",
            "try it": "Essayer 🚀",
            "you are referent": "Vous êtes référent",
            "you are the referent": "Vous êtes le référent",
            "show the referent": "Voir le référent",
            "show referents": "Voir les référents",
            "show the others referents": "Voir les autres référents",
            "close": "Fermer",
            "expert": "Vous êtes expert",
            "you": "Vous",
            "declare oneself referent": "Me déclarer référent",
            "declare oneself referent of": "Me déclarer référent de {{softwareName}}",
            "cancel": "Annuler",
            "send": "Envoyer",
            "this software has not referent": "Pas de référent",
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
        /* spell-checker: enable */
    },
});
