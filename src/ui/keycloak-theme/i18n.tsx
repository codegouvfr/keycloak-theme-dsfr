import { createUseI18n } from "keycloakify/login";

export const { useI18n } = createUseI18n({
    "en": {
        "home": "Home",
        "back": "Back",
        "alphanumericalCharsOnly": "Only alphanumerical characters",
        "administrativeEmail": "Administrative Email",
        "agencyName": "Agency Name",
        "connect": "Connect",
        "selfCredentials": "Or use your credentials",
        "email": "Your personal email",
        "email hint": "For example : name@example.com",
        "password": "Your password",
        "noAccount": "No account yet",
        "backToLogin": "Back to login",
        "you domain isn't allowed yet":
            "Your email domain isn't allowed yet. Contact us ",
        "mail body": [
            "Hello, ",
            "Would you, assuming it's granted, add my domain to the accept list.  ",
            "",
            "Best regards,"
        ].join("\n"),
        "mail subject": "[SILL] Adding new mail domain to the accept list"
    },
    "fr": {
        /* spell-checker: disable */
        "home": "Acceuil",
        "back": "Retour",
        "alphanumericalCharsOnly": "Caractère alphanumérique uniquement",
        "administrativeEmail": "Email administratif",
        "agencyName": "Nom du service de rattachement",
        "connect": "Se connecter",
        "selfCredentials": "Ou utiliser vos identifiants",
        "email": "Votre email personnel",
        "email hint": "Par exemple : nom@exemple.com",
        "password": "Votre mot de passe",
        "noAccount": "Pas encore de compte",
        "backToLogin": "Retour à la connexion",
        "you domain isn't allowed yet":
            "Votre domaine n'est pas encore autorisé. Contactez-nous ",
        "mail body": [
            "Bonjour,",
            "Veuillez, sous réserve qu'il soit éligible, ajouter mon nom de domaineà la liste des domaines autorisés pour s'inscrire sur la plateforme SILL.",
            "",
            "Cordialement,"
        ].join("\n"),
        "mail subject": "[SILL] Autorisation d'un nouveau domaine pour l'inscription"
        /* spell-checker: enable */
    }
});

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
