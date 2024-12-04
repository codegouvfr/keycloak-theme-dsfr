import { i18nBuilder } from "keycloakify/account";
import type { ThemeName } from "../kc.gen";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withExtraLanguages({})
    .withCustomTranslations({
        en: { updateProfile: "Update profile", deleteAccount: "Delete account" },
        fr: {
            updateProfile: "Mettre à jour le profil",
            deleteAccount: "Supprimer le compte"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
