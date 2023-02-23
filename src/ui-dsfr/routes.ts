import { createRouter, defineRoute, param, noMatch } from "type-route";
import { createTypeRouteMock } from "ui-dsfr/tools/typeRouteMock";
import type { SoftwareCatalogState } from "core-dsfr/usecases/softwareCatalog";
import { isStorybook } from "ui-dsfr/tools/isStorybook";
import { z } from "zod";

const routeDefs = {
    "home": defineRoute("/"),
    "softwareCatalog": defineRoute(
        {
            "search": param.query.optional.string.default(""),
            "sort": param.query.optional.ofType({
                "parse": raw => {
                    const schema: z.Schema<SoftwareCatalogState.Sort> = z.union([
                        z.literal("added time"),
                        z.literal("update time"),
                        z.literal("last version publication date"),
                        z.literal("user count"),
                        z.literal("referent count"),
                        z.literal("user count ASC"),
                        z.literal("referent count ASC")
                    ]);

                    try {
                        return schema.parse(raw);
                    } catch {
                        return noMatch;
                    }
                },
                "stringify": value => value
            }),
            "organization": param.query.optional.string,
            "category": param.query.optional.string,
            "environment": param.query.optional.ofType({
                "parse": raw => {
                    const schema: z.Schema<SoftwareCatalogState.Environment> = z.union([
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
            "prerogatives": param.query.optional
                .ofType({
                    "parse": raw => {
                        const schema: z.Schema<
                            SoftwareCatalogState["prerogatives"][number][]
                        > = z.array(
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
    ),
    "softwareDetails": defineRoute(
        {
            "name": param.query.string
        },
        () => `/detail`
    ),
    "softwareCreationForm": defineRoute("/add"),
    "softwareUpdateForm": defineRoute({ "name": param.query.string }, () => "/update"),
    "addSoftwareLanding": defineRoute("/add-software"),
    "declarationForm": defineRoute(
        {
            "name": param.query.string
        },
        () => `/declaration`
    ),
    "softwareUsersAndReferents": defineRoute(
        {
            "name": param.query.string
        },
        () => `/users-and-referents`
    ),
    "account": defineRoute("/account"),
    "fourOhFour": defineRoute("/404"),
    "terms": defineRoute("/terms"),
    "readme": defineRoute("/readme")
};

const { RouteProvider, useRoute, routes: realRoutes, session } = createRouter(routeDefs);

export { RouteProvider, useRoute, session };

const { createMockRouteFactory, routesProxy } = createTypeRouteMock({
    "routes": realRoutes
});

export { createMockRouteFactory };

export const routes = isStorybook ? routesProxy : realRoutes;
