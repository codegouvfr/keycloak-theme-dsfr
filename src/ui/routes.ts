import { createRouter, defineRoute, param, noMatch } from "type-route";
import type { ValueSerializer } from "type-route";
import { id } from "tsafe/id";
import type { AccountTabId } from "ui/components/pages/Account/accountTabIds";
//NOTE: This import needs to stay relative for github-pages-plugin-for-type-route
import { accountTabIds } from "./components/pages/Account/accountTabIds";
import { makeThisModuleAnExecutableRouteLister } from "github-pages-plugin-for-type-route";
import { createTypeRouteMock } from "ui/tools/typeRouteMock";

const routeDefs = {
    "home": defineRoute("/"),
    "account": defineRoute(
        {
            "tabId": param.query.optional
                .ofType(
                    id<ValueSerializer<AccountTabId>>({
                        "parse": raw =>
                            !id<readonly string[]>(accountTabIds).includes(raw)
                                ? noMatch
                                : (raw as AccountTabId),
                        "stringify": value => value,
                    }),
                )
                .default(accountTabIds[0]),
        },
        () => `/account`,
    ),
    "catalog": defineRoute(
        {
            "q": param.query.optional.string.default(""),
        },
        () => `/software`,
    ),
    "serviceCatalog": defineRoute(
        {
            "q": param.query.optional.string.default(""),
        },
        () => `/services`,
    ),
    "card": defineRoute(
        {
            /** Can be the software name (string) or it's `${id}` (for legacy route compat)  */
            "name": param.query.string,
        },
        () => `/software`,
    ),
    "form": defineRoute(
        {
            "softwareId": param.query.optional.number,
        },
        () => `/form`,
    ),
    "serviceForm": defineRoute(
        {
            "serviceId": param.query.optional.number,
        },
        () => `/service-form`,
    ),
    "legacyRoute": defineRoute(
        {
            "lang": param.path.string,
            "id": param.query.optional.number,
        },
        ({ lang }) => `/${lang}/software`,
    ),
    "fourOhFour": defineRoute("/404"),
    "terms": defineRoute("/terms"),
    "readme": defineRoute("/readme"),
};

export const { RouteProvider, useRoute, routes: realRoutes } = createRouter(routeDefs);

const { createMockRouteFactory, routesProxy } = createTypeRouteMock({
    "routes": realRoutes,
});

export { createMockRouteFactory };

export const routes = (window as any)["IS_STORYBOOK"] ? routesProxy : realRoutes;

makeThisModuleAnExecutableRouteLister(routeDefs);
