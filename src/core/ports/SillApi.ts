import { assert, type Equals } from "tsafe/assert";
import type { TrpcRouterInput, TrpcRouterOutput } from "@codegouvfr/sill";

export type SillApi = {
    getApiVersion: {
        (): Promise<TrpcRouterOutput["getApiVersion"]>;
        clear: () => void;
    };
    getOidcParams: {
        (): Promise<TrpcRouterOutput["getOidcParams"]>;
        clear: () => void;
    };
    getSoftwares: {
        (): Promise<TrpcRouterOutput["getSoftwares"]>;
        clear: () => void;
    };
    getInstances: {
        (): Promise<TrpcRouterOutput["getInstances"]>;
        clear: () => void;
    };
    getWikidataOptions: (
        params: TrpcRouterInput["getWikidataOptions"]
    ) => Promise<TrpcRouterOutput["getWikidataOptions"]>;
    getSoftwareFormAutoFillDataFromWikidataAndOtherSources: (
        params: TrpcRouterInput["getSoftwareFormAutoFillDataFromWikidataAndOtherSources"]
    ) => Promise<
        TrpcRouterOutput["getSoftwareFormAutoFillDataFromWikidataAndOtherSources"]
    >;
    createSoftware: (
        params: TrpcRouterInput["createSoftware"]
    ) => Promise<TrpcRouterOutput["createSoftware"]>;
    updateSoftware: (
        params: TrpcRouterInput["updateSoftware"]
    ) => Promise<TrpcRouterOutput["updateSoftware"]>;
    createUserOrReferent: (
        params: TrpcRouterInput["createUserOrReferent"]
    ) => Promise<TrpcRouterOutput["createUserOrReferent"]>;
    createInstance: (
        params: TrpcRouterInput["createInstance"]
    ) => Promise<TrpcRouterOutput["createInstance"]>;
    updateInstance: (
        params: TrpcRouterInput["updateInstance"]
    ) => Promise<TrpcRouterOutput["updateInstance"]>;
    getAgents: {
        (): Promise<TrpcRouterOutput["getAgents"]>;
        clear: () => void;
    };
    changeAgentOrganization: (
        params: TrpcRouterInput["changeAgentOrganization"]
    ) => Promise<TrpcRouterOutput["changeAgentOrganization"]>;

    updateEmail: (
        params: TrpcRouterInput["updateEmail"]
    ) => Promise<TrpcRouterOutput["updateEmail"]>;

    getAllowedEmailRegexp: {
        (): Promise<TrpcRouterOutput["getAllowedEmailRegexp"]>;
        clear: () => void;
    };
    getAgencyNames: {
        (): Promise<TrpcRouterOutput["getAgencyNames"]>;
        clear: () => void;
    };
    getTotalReferentCount: {
        (): Promise<TrpcRouterOutput["getTotalReferentCount"]>;
        clear: () => void;
    };
    getRegisteredUserCount: {
        (): Promise<TrpcRouterOutput["getRegisteredUserCount"]>;
        clear: () => void;
    };
    downloadCorsProtectedTextFile: (
        params: TrpcRouterInput["downloadCorsProtectedTextFile"]
    ) => Promise<TrpcRouterOutput["downloadCorsProtectedTextFile"]>;
};

//NOTE: We make sure we don't forget queries
{
    type X = Exclude<keyof SillApi, keyof TrpcRouterInput>;
    type Y = Exclude<keyof TrpcRouterInput, keyof SillApi>;

    assert<Equals<X, never>>();
    assert<Equals<Y, never>>();
}
