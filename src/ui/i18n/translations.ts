import { symToStr } from "tsafe/symToStr";
import { Reflect } from "tsafe/Reflect";
import { id } from "tsafe/id";
import { Header } from "ui/components/shared/Header";
import { App } from "ui/components/App/App";
import { FourOhFour } from "ui/components/pages/FourOhFour";
import { PortraitModeUnsupported } from "ui/components/pages/PortraitModeUnsupported";
import { Home } from "ui/components/pages/Home";
import { RegisterUserProfile } from "ui/components/KcApp/RegisterUserProfile";
import { AccountField } from "ui/components/pages/Account/AccountField";
import { Account } from "ui/components/pages/Account/Account";
import { AccountInfoTab } from "ui/components/pages/Account/tabs/AccountInfoTab";
import { AccountIntegrationsTab } from "ui/components/pages/Account/tabs/AccountIntegrationsTab";
import { AccountStorageTab } from "ui/components/pages/Account/tabs/AccountStorageTab";
import { AccountUserInterfaceTab } from "ui/components/pages/Account/tabs/AccountUserInterfaceTab";
import { CatalogCards } from "ui/components/pages/Catalog/CatalogCards/CatalogCards";
import { CatalogCard } from "ui/components/pages/Catalog/CatalogCards/CatalogCard";
import { Catalog } from "ui/components/pages/Catalog";
import { Footer } from "ui/components/App/Footer";
import { LoginDivider } from "ui/components/KcApp/Login/LoginDivider";
import { Login } from "ui/components/KcApp/Login";
import type { KcLanguageTag } from "keycloakify";
import { assert } from "tsafe/assert";

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
    [symToStr({ Home })]: Reflect<Home.I18nScheme>(),
    [symToStr({ RegisterUserProfile })]: Reflect<RegisterUserProfile.I18nScheme>(),
    [symToStr({ AccountField })]: Reflect<AccountField.I18nScheme>(),
    [symToStr({ Account })]: Reflect<Account.I18nScheme>(),
    [symToStr({ AccountInfoTab })]: Reflect<AccountInfoTab.I18nScheme>(),
    [symToStr({ AccountIntegrationsTab })]: Reflect<AccountIntegrationsTab.I18nScheme>(),
    [symToStr({ AccountStorageTab })]: Reflect<AccountStorageTab.I18nScheme>(),
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

export type SupportedLanguage = "en" | "fr";

assert<SupportedLanguage extends KcLanguageTag ? true : false>();

export const fallbackLanguage = "en";

assert<typeof fallbackLanguage extends SupportedLanguage ? true : false>();

export const resources = id<Record<SupportedLanguage, Translations>>({
    "en": {
        "Account": {
            "infos": "Account infos",
            "third-party-integration": "external services",
            "storage": "Connect to storage",
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
            "auth information": "Onyxia authentication information",
            "auth information helper": `Theses information allows you to identify yourself
            within the platform and the various services.`,
            "ip address": "IP Address",
        },
        "AccountIntegrationsTab": {
            "git section title": "Git configuration",
            "git section helper": `To ensure that you appear from your services 
            as the author of Git contributions`,
            "gitName": "Username for Git",
            "gitEmail": "Email for Git",
            "third party tokens section title":
                "Connect your Gitlab, Github and Kaggle accounts",
            "third party tokens section helper": `
                Connect your services to external accounts using 
                personal access tokens and environment variables
            `,
            "personal token": "{{serviceName}} personal access token",
            "link for token creation": "Create your {{serviceName}} token.",
            "accessible as env":
                "Accessible withing your services as the environnement variable",
        },
        "AccountStorageTab": {
            "credentials section title": "Connect your data to your services",
            "credentials section helper":
                "Amazon-compatible MinIO object storage (AWS S3). This information is already filled in automatically.",
            "accessible as env":
                "Accessible withing your services as the environnement variable:",
            "init script section title":
                "To access your storage outside of datalab services",
            "init script section helper":
                "Download or copy the init script in the programming language of your choice.",
            "valid until": "Valid until {{when}}",
        },
        "AccountUserInterfaceTab": {
            "title": "Interface preferences",
            "enable dark mode": "Enable dark mode",
            "dark mode helper": "Low light interface theme with dark colored background.",
            "enable beta": "Enable beta-test mode",
            "beta mode helper": "For advanced platform configurations and features.",
            "enable dev mode": "Enable developer mode",
            "dev mode helper": "Enable features that are currently being developed",
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
            "must be different from username": "Pass can't be the username",
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
            "home": "Home",
            "account": "My account",
            "catalog": "Services catalog",
        },
        "FourOhFour": {
            "not found": "Page not found",
        },
        "PortraitModeUnsupported": {
            "portrait mode not supported": "Portrait mode isn't supported yet",
            "instructions":
                "To use this app on your phone please enable the rotation sensor and turn your phone.",
        },
        "Home": {
            "welcome": `Welcome {{who}}!`,
            "title": "Welcome to the Onyxia datalab",
            "new user": "New to the datalab?",
            "login": "Login",
            "subtitle": "Work with Python or R, enjoy all the computing power you need!",
            "cardTitle1": "An ergonomic environment and on-demand services",
            "cardTitle2": "An active and enthusiastic community at your service",
            "cardTitle3": "Fast, flexible and online data storage",
            "cardText1":
                "Analyze data, perform distributed computing and take advantage of a large catalog of services. Reserve the computing power you need.",
            "cardText2":
                "Use and share the resources available to you: tutorials, training and exchange channels.",
            "cardText3":
                "To easily access your data and those made available to you from your programs - S3 API implementation",
            "cardButton1": "Consult the catalog",
            "cardButton2": "Join the community",
            "cardButton3": "Consult the data",
        },
        "CatalogCard": {
            "launch": "Launch",
            "learn more": "Learn more",
        },
        "CatalogCards": {
            "show more": "Show more",
            "no service found": "No service found",
            "no result found": "No result found for {{forWhat}}",
            "check spelling": "Please check your spelling or try widening your search.",
            "go back": "Back to main services",
            "main services": "Main services",
            "all services": "All services",
            "search results": "Search result",
            "search": "Search",
        },
        "Catalog": {
            "header text1": "Services catalog",
            "header text2":
                "Explore, launch and configure services with just a few clicks.",
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
            "third-party-integration": "Services externes",
            "storage": "Connexion au stockage",
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
            "auth information": "Informations d'authentification Onyxia",
            "auth information helper": `Ces informations vous permettent de vous identifier 
            au sein de la plateforme et des différents services.`,
            "ip address": "Adresse IP",
        },
        "AccountIntegrationsTab": {
            "git section title": "Configurations Git",
            "git section helper": `Pour vous assurez que vous apparaissiez depuis vos
            services comme l'auteur des contributions Git`,
            "gitName": "Nom d'utilisateur pour Git",
            "gitEmail": "Email pour Git",
            "third party tokens section title":
                "Connecter vos comptes Gitlab, Github et Kaggle",
            "third party tokens section helper": `Connectez vos services à des comptes extérieurs à l'aide
            de jetons d'accès personnel et de variables d'environnement.`,
            "personal token": "Jeton d'accès personnel {{serviceName}}",
            "link for token creation": "Créer votre jeton {{serviceName}}.",
            "accessible as env":
                "Accessible au sein de vos services en tant que la variable d'environnement",
        },
        "AccountStorageTab": {
            "credentials section title": "Connecter vos données à vos services",
            "credentials section helper":
                "Stockage object MinIO compatible Amazon (AWS S3). Ces informations sont déjà renseignés automatiquement.",
            "accessible as env":
                "Accessible au sein de vos services en tant que la variable d'environnement",
            "init script section title":
                "Pour accèder au stockage en dehors des services du datalab",
            "init script section helper": `Téléchargez ou copiez le script d'initialisation dans le langage de programmation de votre choix.`,
            "valid until": "Valides jusqu'a {{when}}",
        },
        "AccountUserInterfaceTab": {
            "title": "Configurer le mode d'interface",
            "enable dark mode": "Activer le mode sombre",
            "dark mode helper":
                "Thème de l'interface à faible luminosité avec un fond de couleur sombre.",
            "enable beta": "Activer le mode béta-testeur",
            "beta mode helper":
                "Pour des configurations et fonctionnalités avancées de la plateforme.",
            "enable dev mode": "Activer le mode développeur",
            "dev mode helper": "Activer les fonctionnalités en cours de développement",
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
            "must be different from username": "Ne peut pas être le nom d'utilisateur",
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
            "home": "Accueil",
            "account": "Mon compte",
            "catalog": "Catalogue de services",
        },
        "FourOhFour": {
            "not found": "Page non trouvée",
        },
        "PortraitModeUnsupported": {
            "portrait mode not supported": "Le mode portrait n'est pas encore supporté",
            "instructions":
                "Pour utiliser cette application depuis votre mobile, veuillez activer le capteur de rotation et tourner votre téléphone.",
        },
        "Home": {
            "welcome": `Bienvenue {{who}}!`,
            "title": "Bienvenue sur le datalab",
            "login": "Connexion",
            "new user": "Nouvel utilisateur du datalab?",
            "subtitle":
                "Travaillez avec Python ou R et disposez de la puissance dont vous avez besoin!",
            "cardTitle1": "Un environnement ergonomique et des services à la demande",
            "cardTitle2": "Une communauté active et enthousiaste à votre écoute",
            "cardTitle3": "Un espace de stockage de données rapide, flexible et en ligne",
            "cardText1":
                "Analysez les données, faites du calcul distribué et profitez d’un large catalogue de services. Réservez la puissance de calcul dont vous avez besoin.",
            "cardText2":
                "Profitez et partagez des ressources mises à votre disposition: tutoriels, formations et canaux d’échanges.",
            "cardText3":
                "Pour accéder facilement à vos données et à celles mises à votre disposition depuis vos programmes - Implémentation API S3",
            "cardButton1": "Consulter le catalogue",
            "cardButton2": "Rejoindre la communauté",
            "cardButton3": "Consulter des données",
        },
        "CatalogCard": {
            "launch": "Lancer",
            "learn more": "En savoir plus",
        },
        "CatalogCards": {
            "show more": "Afficher tous",
            "no service found": "Service non trouvé",
            "no result found": "Aucun résultat trouvé pour {{forWhat}}",
            "check spelling": `Vérifiez que le nom du service est correctement 
            orthographié ou essayez d'élargir votre recherche.`,
            "go back": "Retourner aux principaux services",
            "main services": "Principaux services",
            "all services": "Tous les services",
            "search results": "Résultats de la recherche",
            "search": "Rechercher",
        },
        "Catalog": {
            "header text1": "Catalogue de services",
            "header text2":
                "Explorez, lancez et configurez des services en quelques clics seulement.",
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
