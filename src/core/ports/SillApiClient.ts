import type { TrpcRouter } from "sill-api";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { inferProcedureOutput } from "@trpc/server";

export type SillApiClient = {
    getOidcParams: {
        (): Promise<InferQueryOutput<"getOidcParams">>;
        clear: () => void;
    };
    getSoftware: () => Promise<InferQueryOutput<"getSoftware">>;
};

type TQuery = keyof TrpcRouter["_def"]["queries"];

type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
    TrpcRouter["_def"]["queries"][TRouteKey]
>;

//NOTE: We make sure we don't forget queries
{
    type Actual = keyof SillApiClient;

    type Expected = TQuery;

    assert<Equals<Actual, Expected>>();
}
