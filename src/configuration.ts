import { symToStr } from "tsafe/symToStr";
import memoize from "memoizee";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { arrDiff } from "evt/tools/reducers/diff";
import * as JSONC from "comment-json";
import { getEnv } from "./env";
import type { KcLanguageTag } from "keycloakify";
import { kcLanguageTags } from "keycloakify/lib/i18n/KcLanguageTag";
import { id } from "tsafe/id";
import { SupportedLanguage } from "ui/i18n/translations";
import { objectKeys } from "tsafe/objectKeys";
import { IconId } from "ui/theme";
import { iconIds } from "ui/theme";

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
            configuration = JSONC.parse(CONFIGURATION) as any;
        } catch {
            throw new Error(
                m(
                    `It's not a valid JSONC string (JSONC = JSON + Comment support)\n${CONFIGURATION}`,
                ),
            );
        }

        assert(configuration instanceof Object, m("Should be a JSON object"));

        {
            const { apiUrl, mockAuthentication, headerLinks } = configuration;

            const propertiesNames = [
                symToStr({ apiUrl }),
                symToStr({ mockAuthentication }),
                symToStr({ headerLinks }),
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

        scope_mockAuthentication: {
            const { mockAuthentication } = configuration;

            if (mockAuthentication === undefined) {
                break scope_mockAuthentication;
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
                const { email, agencyName, locale } = user;

                const m_2 = (reason: string) => m_1(`${symToStr({ user })}: ${reason}`);

                {
                    const propertiesNames = [
                        symToStr({ email }),
                        symToStr({ agencyName }),
                        symToStr({ locale }),
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
                    [symToStr({ agencyName }), agencyName],
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

                assert(locale !== undefined, m_1(`${symToStr({ locale })} missing`));
                assert(
                    id<readonly string[]>(kcLanguageTags).indexOf(locale) >= 0,
                    m_1(
                        `${symToStr({ locale })} must be one of: ${kcLanguageTags.join(
                            ", ",
                        )}`,
                    ),
                );
            }
        }

        scope_headerLinks: {
            const { headerLinks } = configuration;

            if (headerLinks === undefined) {
                break scope_headerLinks;
            }

            const m_1 = (reason: string) => m(`${symToStr({ headerLinks })}: ${reason}`);

            assert(headerLinks instanceof Array, m_1("Is supposed to be an array"));

            for (const headerLink of headerLinks) {
                const m_2 = (reason: string) =>
                    m(`${JSON.stringify(headerLink)} malformed: ${reason}`);

                assert(headerLink instanceof Object, m_2("Should be an object"));

                const { url, iconId, label } = headerLink;

                {
                    const propertiesNames = [
                        symToStr({ url }),
                        symToStr({ iconId }),
                        symToStr({ label }),
                    ] as const;

                    assert<
                        Equals<
                            typeof propertiesNames[number],
                            keyof NonNullable<
                                NonNullable<Configuration["headerLinks"]>[number]
                            >
                        >
                    >();

                    const { added } = arrDiff(propertiesNames, Object.keys(headerLink));

                    assert(
                        added.length === 0,
                        m_1(
                            `The following properties are not recognized: ${added.join(
                                " ",
                            )}`,
                        ),
                    );
                }

                for (const [propertyName, propertyValue] of [
                    [symToStr({ url }), url],
                    [symToStr({ iconId }), iconId],
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

                assert(
                    id<readonly string[]>(iconIds).includes(iconId),
                    m_1(
                        `${symToStr({
                            iconId,
                        })}: ${iconId} is not a known icon available icons are: ${iconIds.join(
                            ", ",
                        )}`,
                    ),
                );

                assert(
                    /^http/.test(url),
                    m_1(
                        `${symToStr({
                            url,
                        })} should be an url (starting with 'http') ${url}`,
                    ),
                );

                scope_label: {
                    if (typeof label === "string") {
                        break scope_label;
                    }

                    {
                        const languages = objectKeys(label);

                        assert(
                            languages.length !== 0,
                            m_1(
                                `${symToStr({
                                    label,
                                })} if an object is provided it should have at least one label for one language`,
                            ),
                        );

                        const supportedLanguages = ["en", "fr"] as const;

                        assert<
                            Equals<SupportedLanguage, typeof supportedLanguages[number]>
                        >();

                        languages.forEach(lng =>
                            assert(
                                id<readonly string[]>(supportedLanguages).includes(lng),
                                m_1(
                                    `${symToStr({
                                        label,
                                    })}: ${lng} is not a supported languages, supported languages are: ${supportedLanguages.join(
                                        ", ",
                                    )}`,
                                ),
                            ),
                        );

                        languages.forEach(lng => {
                            const url = label[lng];
                            assert(
                                typeof url === "string",
                                m_1(
                                    `${symToStr({
                                        label,
                                    })} malformed (${lng}). It is supposed to be a string`,
                                ),
                            );
                        });
                    }
                }
            }
        }

        return {
            "apiUrl": resolvedApiUrl,
            ...configuration,
        };
    },
);
