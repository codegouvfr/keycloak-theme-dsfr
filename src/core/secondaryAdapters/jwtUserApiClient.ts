import type { UserApiClient, User } from "../ports/UserApiClient";
import { parseJwtPayload } from "sill-api";
import { zParsedJwtTokenPayload } from "sill-api";
import { decodeJwt } from "core-dsfr/tools/jwt";

export function createJwtUserApiClient(params: {
    jwtClaims: Record<keyof User, string>;
    getOidcAccessToken: () => string;
}): UserApiClient {
    const { jwtClaims, getOidcAccessToken } = params;

    return {
        "getUser": () =>
            Promise.resolve(
                parseJwtPayload({
                    jwtClaims,
                    "jwtPayload": decodeJwt(getOidcAccessToken()),
                    zParsedJwtTokenPayload
                })
            )
    };
}
