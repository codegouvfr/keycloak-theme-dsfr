import { createRouter, defineRoute, param, noMatch } from "type-route";
import { makeThisModuleAnExecutableRouteLister } from "github-pages-plugin-for-type-route";
import { createTypeRouteMock } from "ui/tools/typeRouteMock";
import type { SoftwareCatalogState } from "core-dsfr/usecases/softwareCatalog";
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
                        z.literal("browser"),
                        z.literal("smartphone")
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
                        const schema: z.Schema<SoftwareCatalogState.Prerogative[]> =
                            z.array(
                                z.union([
                                    z.literal("isInstallableOnUserTerminal"),
                                    z.literal("isPresentInSupportContract"),
                                    z.literal("isFromFrenchPublicServices"),
                                    z.literal("doRespectRgaa")
                                ])
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
    "declareUsageForm": defineRoute(
        {
            "name": param.query.string
        },
        () => `/declaration`
    ),
    "softwareCreationForm": defineRoute("/add"),
    "softwareUpdateForm": defineRoute(
        { "name": param.query.optional.string },
        () => `/update`
    )
};

export const { RouteProvider, useRoute, routes: realRoutes } = createRouter(routeDefs);

const { createMockRouteFactory, routesProxy } = createTypeRouteMock({
    "routes": realRoutes
});

export { createMockRouteFactory };

export const routes = (window as any)["IS_STORYBOOK"] ? routesProxy : realRoutes;

makeThisModuleAnExecutableRouteLister(routeDefs);
