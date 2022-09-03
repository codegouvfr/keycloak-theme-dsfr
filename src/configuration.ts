import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import * as JSONC from "comment-json";
import { getEnv } from "./env";
import type { KcLanguageTag } from "keycloakify";
import { kcLanguageTags } from "keycloakify";
import type { IconId } from "ui/theme";
import { iconIds } from "ui/theme/icons";
import { z } from "zod";
import { createUnionSchema } from "ui/tools/zod/createUnionSchema";

export type Configuration = {
    /**
     * Null mean that we use a mock of the API
     * Default is `${location.origin}/api`
     * You can also pass an url to a json file like: https://code.gouv.fr/data/sill2.json
     * to enable à mock implementation.
     * */
    apiUrl?: string;
    /**
     * Mock authentication is only allowed (and required) if
     * the API have Keycloak disabled.
     */
    mockAuthentication?: {
        isUserInitiallyLoggedIn: boolean;
        user: {
            id: string;
            email: string;
            agencyName: string;
            /** example: 'en' 'fr' ... */
            locale: KcLanguageTag;
        };
    };
    headerLinks?: {
        iconId: IconId;
        label: string | Partial<Record<KcLanguageTag, string>>;
        url: string;
    }[];
};

const zKcLanguageTags = createUnionSchema(kcLanguageTags);

const zConfiguration = z.object({
    "apiUrl": z.string().optional(),
    "mockAuthentication": z
        .object({
            "isUserInitiallyLoggedIn": z.boolean(),
            "user": z.object({
                "id": z.string(),
                "email": z.string(),
                "agencyName": z.string(),
                "locale": zKcLanguageTags,
            }),
        })
        .optional(),
    "headerLinks": z
        .array(
            z.object({
                "iconId": createUnionSchema(iconIds),
                "label": z.union([z.string(), z.record(zKcLanguageTags, z.string())]),
                "url": z.string(),
            }),
        )
        .optional(),
});

{
    type Got = ReturnType<typeof zConfiguration["parse"]>;
    type Expected = Configuration;

    assert<Equals<Got, Expected>>();
}

export const getConfiguration = memoize(
    (): Omit<Configuration, "apiUrl"> & {
        apiUrl: string;
    } => {
        const { CONFIGURATION } = getEnv();

        if (CONFIGURATION === undefined) {
            throw new Error(
                `We need a ${symToStr({
                    CONFIGURATION,
                })} environnement variable`,
            );
        }

        let configuration: Configuration;

        try {
            configuration = JSONC.parse(CONFIGURATION) as any;
        } catch {
            throw new Error(
                `The CONFIGURATION environnement variable is not a valid JSONC string (JSONC = JSON + Comment support)\n${CONFIGURATION}`,
            );
        }

        zConfiguration.parse(configuration);

        return {
            ...configuration,
            "apiUrl": configuration.apiUrl ?? `${window.location.origin}/api`,
        };
    },
);

if (require.main === module) {
    console.log(getConfiguration());
}
