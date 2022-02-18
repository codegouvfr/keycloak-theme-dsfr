import type { UserApiClient, User } from "../ports/UserApiClient";
import { createDecodeJwtNoVerify } from "sill-api/tools/decodeJwt/adapter/noVerify";
import { symToStr } from "tsafe/symToStr";

export function createJwtUserApiClient(params: {
    jwtClaims: Record<keyof User, string>;
    getOidcAccessToken: () => Promise<string>;
}): UserApiClient {
    const { jwtClaims, getOidcAccessToken } = params;

    const { decodeJwt } = createDecodeJwtNoVerify({ jwtClaims });

    return {
        "getUser": async () => {
            const { groups, local, ...rest } = await decodeJwt({
                "jwtToken": await getOidcAccessToken(),
            });

            return {
                ...rest,
                [symToStr({ groups })]: JSON.parse(groups) as string[],
                [symToStr({ local })]: local as User["local"],
            };
        },
    };
}
