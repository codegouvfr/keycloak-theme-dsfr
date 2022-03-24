import type { KcLanguageTag } from "keycloakify";

export type User = {
    email: string;
    agencyName: string;
    locale: KcLanguageTag;
};

export type UserApiClient = {
    getUser: () => Promise<User>;
};
