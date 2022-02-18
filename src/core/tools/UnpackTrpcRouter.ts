import { TRPCClient } from "@trpc/client";

export type UnpackTrpcRouter<AppTrpcClient extends TRPCClient<any>> =
    AppTrpcClient extends TRPCClient<infer AppTrpcRouter> ? AppTrpcRouter : never;
