import type { TrpcRouter } from "sill-api";
import { TRPCClient } from "@trpc/client";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { inferProcedureOutput } from "@trpc/server";

export type TrpcSillApiClient = TRPCClient<TrpcRouter>;

type TQuery = keyof TrpcRouter["_def"]["queries"];

type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
    TrpcRouter["_def"]["queries"][TRouteKey]
>;

export type SillApiClient = {
    getOidcParams: () => Promise<InferQueryOutput<"getOidcParams">>;
    getSoftware: () => Promise<InferQueryOutput<"getSoftware">>;
};

//NOTE: We make sure we don't forget queries
{
    type Actual = keyof SillApiClient;

    type Expected = TQuery;

    assert<Equals<Actual, Expected>>();
}
