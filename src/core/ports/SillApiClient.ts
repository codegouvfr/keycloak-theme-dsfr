import type { TrpcRouter, inferProcedureOutput, inferProcedureInput } from "sill-api";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

export type SillApiClient = {
    getVersion: {
        (): Promise<InferOutput<"getVersion">>;
        clear: () => void;
    };
    getOidcParams: {
        (): Promise<InferOutput<"getOidcParams">>;
        clear: () => void;
    };
    getCompiledData: () => Promise<InferOutput<"getCompiledData">>;
    getReferentsBySoftwareId: () => Promise<InferOutput<"getReferentsBySoftwareId">>;
    declareUserReferent: (
        params: InferInput<"declareUserReferent">,
    ) => Promise<InferOutput<"declareUserReferent">>;
    userNoLongerReferent: (
        params: InferInput<"userNoLongerReferent">,
    ) => Promise<InferOutput<"userNoLongerReferent">>;
    addSoftware: (
        params: InferInput<"addSoftware">,
    ) => Promise<InferOutput<"addSoftware">>;
    updateSoftware: (
        params: InferInput<"updateSoftware">,
    ) => Promise<InferOutput<"updateSoftware">>;
    autoFillFormInfo: (
        params: InferInput<"autoFillFormInfo">,
    ) => Promise<InferOutput<"autoFillFormInfo">>;
    updateAgencyName: (
        params: InferInput<"updateAgencyName">,
    ) => Promise<InferOutput<"updateAgencyName">>;
    updateEmail: (
        params: InferInput<"updateEmail">,
    ) => Promise<InferOutput<"updateEmail">>;
    getAllowedEmailRegexp: (
        params: InferInput<"getAllowedEmailRegexp">,
    ) => Promise<InferOutput<"getAllowedEmailRegexp">>;
    getAgencyNames: (
        params: InferInput<"getAgencyNames">,
    ) => Promise<InferOutput<"getAgencyNames">>;
    getTags: {
        (params: InferInput<"getTags">): Promise<InferOutput<"getTags">>;
        clear: () => void;
    };
    dereferenceSoftware: (
        params: InferInput<"dereferenceSoftware">,
    ) => Promise<InferOutput<"dereferenceSoftware">>;
    downloadCorsProtectedTextFile: (
        params: InferInput<"downloadCorsProtectedTextFile">,
    ) => Promise<InferOutput<"downloadCorsProtectedTextFile">>;
    dereferenceService: (
        params: InferInput<"dereferenceService">,
    ) => Promise<InferOutput<"dereferenceService">>;
};

type InferOutput<TRouteKey extends _.TAll> = TRouteKey extends _.TQuery
    ? _.InferQueryOutput<TRouteKey>
    : TRouteKey extends _.TMutations
    ? _.InferMutationsOutput<TRouteKey>
    : never;

type InferInput<TRouteKey extends _.TAll> = TRouteKey extends _.TQuery
    ? _.InferQueryInput<TRouteKey>
    : TRouteKey extends _.TMutations
    ? _.InferMutationsInput<TRouteKey>
    : never;
namespace _ {
    export type TQuery = keyof TrpcRouter["_def"]["queries"];
    export type TMutations = keyof TrpcRouter["_def"]["mutations"];
    export type TAll = TQuery | TMutations;

    export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
        TrpcRouter["_def"]["queries"][TRouteKey]
    >;

    export type InferMutationsOutput<TRouteKey extends TMutations> = inferProcedureOutput<
        TrpcRouter["_def"]["mutations"][TRouteKey]
    >;

    export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
        TrpcRouter["_def"]["queries"][TRouteKey]
    >;

    export type InferMutationsInput<TRouteKey extends TMutations> = inferProcedureInput<
        TrpcRouter["_def"]["mutations"][TRouteKey]
    >;
}

//NOTE: We make sure we don't forget queries
{
    type Actual = keyof SillApiClient;

    type Expected = _.TAll;

    assert<Equals<Actual, Expected>>();
}
