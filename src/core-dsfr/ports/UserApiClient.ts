export type User = {
    id: string;
    email: string;
    agencyName: string;
    locale?: string;
};

export type UserApiClient = {
    getUser: () => Promise<User>;
};
