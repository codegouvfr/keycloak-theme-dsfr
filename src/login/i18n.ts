import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/i18n */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
       en: {
            "or-login-with-email": "Or sign in with your email",
            "accountTemporarilyDisabledMessage": "Invalid username or password.",
            "accountPermanentlyDisabledMessage": "Invalid username or password."
        },
        fr: {
            "or-login-with-email": "Ou connectez-vous avec votre email",
            "accountTemporarilyDisabledMessage": "Nom d'utilisateur ou mot de passe invalide.",
            "accountPermanentlyDisabledMessage": "Nom d'utilisateur ou mot de passe invalide."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
