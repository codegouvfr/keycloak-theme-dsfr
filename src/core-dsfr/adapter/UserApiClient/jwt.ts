import type { UserApiClient, User } from "../../ports/UserApiClient";
import { parseJwtPayload } from "sill-api";
import { zParsedJwtTokenPayload } from "sill-api";
import * as jwtSimple from "core-dsfr/tools/jwt-siple";

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
                    "jwtPayload": jwtSimple.decode(getOidcAccessToken(), "", true),
                    zParsedJwtTokenPayload
                })
            )
    };
}
