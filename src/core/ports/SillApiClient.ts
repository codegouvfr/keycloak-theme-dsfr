import type { TrpcRouter } from "sill-api";

import { TRPCClient } from "@trpc/client";

export type SillApiClient = TRPCClient<TrpcRouter>;
