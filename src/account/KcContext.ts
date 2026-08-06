import type { ExtendKcContext } from "keycloakify/account";
import type { KcEnvName, ThemeName } from "../kc.gen";

export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string>;
    darkMode?: boolean;
};

type AccountUrl = {
    getLogoutUrl: () => string;
    accountUrl: string;
    passwordUrl?: string;
    totpUrl: string;
    socialUrl?: string;
    sessionsUrl: string;
    applicationsUrl: string;
    logUrl?: string;
    resourceUrl?: string;
    loginAction?: string;
    loginRestartFlowUrl?: string;
};

type AccountFeatures = {
    identityFederation?: boolean;
    log?: boolean;
    authorization?: boolean;
    passwordUpdateSupported?: boolean;
};

type AccountRealm = {
    userManagedAccessAllowed: boolean;
};

type AccountMessage = {
    type: "success" | "info" | "warning" | "error";
    summary: string;
};

type AccountReferrer = {
    url?: string;
    name?: string;
};

export type KcContextExtensionPerPage = {
    "account.ftl": {
        url: AccountUrl;
        features: AccountFeatures;
        realm: AccountRealm;
        message?: AccountMessage;
        referrer?: AccountReferrer;
    };
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
