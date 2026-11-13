/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ExtendKcContext } from "keycloakify/login";
import type { KcEnvName, ThemeName } from "../kc.gen";

export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string> & {};
    // NOTE: Here you can declare more properties to extend the KcContext
    // See: https://docs.keycloakify.dev/faq-and-help/some-values-you-need-are-missing-from-in-kccontext
    client: {
        baseUrl?: string;
    };
    darkMode?: boolean;
};

export type KcContextExtensionPerPage = {
    // Pages custom rendues par l'extension keycloak `mail-otp-authenticator`.
    "mail-otp-form.ftl": {
        // Attribut posé par l'authenticator (form.setAttribute("code_control", ...)).
        code_control: string;
    };
    "otp-choice.ftl": {};
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
