export type GetUser = () => Promise<User>;

export type User = {
    id: string;
    email: string;
    agencyName: string;
    locale?: string;
};
