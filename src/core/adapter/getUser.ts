import type { GetUser, User } from "core/ports/GetUser";
import { parseJwtPayload } from "sill-api";
import { zParsedJwtTokenPayload } from "sill-api";
import { decodeJwt } from "core/tools/jwt";

export function createGetUser(params: {
    jwtClaims: Record<keyof User, string>;
    getOidcAccessToken: () => string;
}) {
    const { jwtClaims, getOidcAccessToken } = params;

    const getUser: GetUser = async () =>
        parseJwtPayload({
            jwtClaims,
            "jwtPayload": decodeJwt(getOidcAccessToken()),
            zParsedJwtTokenPayload
        });

    return { getUser };
}
