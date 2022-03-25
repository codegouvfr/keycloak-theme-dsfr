export type User = {
    email: string;
    agencyName: string;
    locale?: string;
};

export type UserApiClient = {
    getUser: () => Promise<User>;
};
