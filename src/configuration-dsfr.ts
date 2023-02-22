import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import * as JSONC from "comment-json";
import { getEnv } from "./env";
import { z } from "zod";
import { FrClassName, FrIconClassName } from "@codegouvfr/react-dsfr";

const allowedCustomHeaderIcons = [
    "fr-icon-ancient-gate-fill",
    "fr-icon-ancient-gate-line",
    "ri-code-box-fill"
] as const;

assert<
    (typeof allowedCustomHeaderIcons)[number] extends FrClassName | FrIconClassName
        ? true
        : false
>();

export type Configuration = {
    /**
     * empty string means that we use a mock of the API
     * Default is `${location.origin}/api`
     * You can also pass an url to a json file like: https://code.gouv.fr/data/sill2.json
     * to enable à mock implementation.
     * */
    apiUrl?: "" | string;
};

const zConfiguration = z.object({
    "apiUrl": z.string().optional()
});

{
    type Got = ReturnType<(typeof zConfiguration)["parse"]>;
    type Expected = Configuration;

    assert<Equals<Got, Expected>>();
}

export const getConfiguration = memoize(
    (): Omit<Configuration, "apiUrl"> & { apiUrl: string } => {
        const { CONFIGURATION } = getEnv();

        if (CONFIGURATION === undefined) {
            throw new Error(
                `We need a ${symToStr({
                    CONFIGURATION
                })} environnement variable`
            );
        }

        let configuration: Configuration;

        try {
            configuration = JSONC.parse(CONFIGURATION) as any;
        } catch {
            throw new Error(
                `The CONFIGURATION environnement variable is not a valid JSONC string (JSONC = JSON + Comment support)\n${CONFIGURATION}`
            );
        }

        zConfiguration.parse(configuration);

        return {
            ...configuration,
            "apiUrl": configuration.apiUrl ?? `${window.location.origin}/api`
        };
    }
);

if (require.main === module) {
    console.log(getConfiguration());
}
