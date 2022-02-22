import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { arrDiff } from "evt/tools/reducers/diff";
import * as commentJson from "comment-json";
import { getEnv } from "./env";
import type { KcLanguageTag } from "keycloakify";
import { kcLanguageTags } from "keycloakify/lib/i18n/KcLanguageTag";
import { id } from "tsafe/id";

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
            email: string;
            familyName: string;
            firstName: string;
            username: string;
            groups: string[];
            /** example: 'en' 'fr' ... */
            local: KcLanguageTag;
        };
    };
};

export const getConfiguration = memoize(
    (): Omit<Configuration, "apiUrl"> & {
        apiUrl: string;
    } => {
        const { CONFIGURATION } = getEnv();

        const m = (reason: string) =>
            [
                `The ${symToStr({
                    CONFIGURATION,
                })} environnement variable is malformed:`,
                reason,
            ].join(" ");

        if (CONFIGURATION === undefined) {
            throw new Error(
                `We need a ${symToStr({
                    CONFIGURATION,
                })} environnement variable`,
            );
        }

        let configuration: Configuration;

        try {
            configuration = commentJson.parse(CONFIGURATION) as any;
        } catch {
            throw new Error(
                m(
                    `It's not a valid JSONC string (JSONC = JSON + Comment support)\n${CONFIGURATION}`,
                ),
            );
        }

        assert(configuration instanceof Object, m("Should be a JSON object"));

        {
            const { apiUrl, mockAuthentication } = configuration;

            const propertiesNames = [
                symToStr({ apiUrl }),
                symToStr({ mockAuthentication }),
            ] as const;

            assert<Equals<typeof propertiesNames[number], keyof Configuration>>();

            const { added } = arrDiff(propertiesNames, Object.keys(configuration));

            assert(
                added.length === 0,
                m(`The following properties are not recognized: ${added.join(" ")}`),
            );
        }

        let resolvedApiUrl: string;

        scope: {
            const { apiUrl } = configuration;

            if (apiUrl === undefined) {
                resolvedApiUrl = `${window.location.origin}/api`;
                break scope;
            }
            assert(
                typeof apiUrl === "string",
                m(`${symToStr({ apiUrl })} is supposed to be a string`),
            );
            assert(
                apiUrl !== "",
                m(`${symToStr({ apiUrl })} is supposed to be a non empty string`),
            );

            resolvedApiUrl = apiUrl;
        }

        scope: {
            const { mockAuthentication } = configuration;

            if (mockAuthentication === undefined) {
                break scope;
            }

            const m_1 = (reason: string) =>
                m(`${symToStr({ mockAuthentication })}: ${reason}`);

            assert(
                mockAuthentication instanceof Object,
                m_1("Is supposed to be an object"),
            );

            const { isUserInitiallyLoggedIn, user } = mockAuthentication;

            {
                const propertiesNames = [
                    symToStr({ isUserInitiallyLoggedIn }),
                    symToStr({ user }),
                ] as const;

                assert<
                    Equals<
                        typeof propertiesNames[number],
                        keyof NonNullable<Configuration["mockAuthentication"]>
                    >
                >();

                const { added } = arrDiff(
                    propertiesNames,
                    Object.keys(mockAuthentication),
                );

                assert(
                    added.length === 0,
                    m_1(
                        `The following properties are not recognized: ${added.join(" ")}`,
                    ),
                );
            }

            assert(
                typeof isUserInitiallyLoggedIn === "boolean",
                m_1(`${symToStr({ isUserInitiallyLoggedIn })} should be a string`),
            );

            {
                const { email, familyName, firstName, groups, local, username } = user;

                const m_2 = (reason: string) => m_1(`${symToStr({ user })}: ${reason}`);

                {
                    const propertiesNames = [
                        symToStr({ email }),
                        symToStr({ familyName }),
                        symToStr({ firstName }),
                        symToStr({ groups }),
                        symToStr({ local }),
                        symToStr({ username }),
                    ] as const;

                    assert<
                        Equals<
                            typeof propertiesNames[number],
                            keyof NonNullable<Configuration["mockAuthentication"]>["user"]
                        >
                    >();

                    const { added } = arrDiff(propertiesNames, Object.keys(user));

                    assert(
                        added.length === 0,
                        m_2(
                            `The following properties are not recognized: ${added.join(
                                " ",
                            )}`,
                        ),
                    );
                }

                for (const [propertyName, propertyValue] of [
                    [symToStr({ email }), email],
                    [symToStr({ familyName }), familyName],
                    [symToStr({ firstName }), firstName],
                    [symToStr({ username }), username],
                ] as const) {
                    assert(propertyValue !== undefined, m_1(`${propertyName} missing`));
                    assert(
                        typeof propertyValue === "string",
                        m_1(`${propertyName} is supposed to be a string`),
                    );
                    assert(
                        propertyValue !== "",
                        m_1(`${propertyName} is supposed to be a non empty string`),
                    );
                }

                assert(groups !== undefined, m_1(`${symToStr({ groups })} missing`));
                assert(
                    groups instanceof Array &&
                        groups.find(group => typeof group !== "string") === undefined,
                    m_1(`${symToStr({ local })} is supposed to be a non empty string`),
                );

                assert(local !== undefined, m_1(`${symToStr({ local })} missing`));
                assert(
                    id<readonly string[]>(kcLanguageTags).indexOf(local) >= 0,
                    m_1(
                        `${symToStr({ local })} must be one of: ${kcLanguageTags.join(
                            ", ",
                        )}`,
                    ),
                );
            }
        }

        return {
            "apiUrl": resolvedApiUrl,
            ...configuration,
        };
    },
);
