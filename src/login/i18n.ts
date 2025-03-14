import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/i18n */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: { "or-login-with-email": "Or sign in with your email" },
        fr: { "or-login-with-email": "Ou connectez-vous avec votre email" }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
