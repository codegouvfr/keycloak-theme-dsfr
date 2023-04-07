import {
    createGroup,
    defineRoute,
    createRouter,
    param,
    noMatch,
    type Route
} from "type-route";
import type { State } from "core/usecases/softwareCatalog";
import { z } from "zod";
import { assert, type Equals } from "tsafe";

export const routeDefs = {
    "softwareCatalog": defineRoute(
        {
            "search": param.query.optional.string.default(""),
            "sort": param.query.optional
                .ofType({
                    "parse": raw => {
                        const schema = z.union([
                            z.literal("added time"),
                            z.literal("update time"),
                            z.literal("last version publication date"),
                            z.literal("user count"),
                            z.literal("referent count"),
                            z.literal("user count ASC"),
                            z.literal("referent count ASC"),
                            z.literal("best match")
                        ]);

                        assert<
                            Equals<ReturnType<(typeof schema)["parse"]>, State.Sort>
                        >();

                        try {
                            return schema.parse(raw);
                        } catch {
                            return noMatch;
                        }
                    },
                    "stringify": value => value
                })
                .default("referent count"),
            "organization": param.query.optional.string,
            "category": param.query.optional.string,
            "environment": param.query.optional.ofType({
                "parse": raw => {
                    const schema: z.Schema<State.Environment> = z.union([
                        z.literal("linux"),
                        z.literal("windows"),
                        z.literal("mac"),
                        z.literal("browser")
                    ]);

                    try {
                        return schema.parse(raw);
                    } catch {
                        return noMatch;
                    }
                },
                "stringify": value => value
            }),
            "referentCount": param.query.optional.number,
            "prerogatives": param.query.optional
                .ofType({
                    "parse": raw => {
                        const schema: z.Schema<State["prerogatives"][number][]> = z.array(
                            z.enum([
                                "isPresentInSupportContract",
                                "isFromFrenchPublicServices",
                                "doRespectRgaa",
                                "isInstallableOnUserTerminal",
                                "isTestable"
                            ] as const)
                        );

                        try {
                            return schema.parse(JSON.parse(raw));
                        } catch {
                            return noMatch;
                        }
                    },
                    "stringify": value => JSON.stringify(value)
                })
                .default([])
        },
        () => `/list`
    )
};

export const routeGroup = createGroup(Object.values(createRouter(routeDefs).routes));

export type PageRoute = Route<typeof routeGroup>;

export const getDoRequireUserLoggedIn: (route: PageRoute) => boolean = () => false;
