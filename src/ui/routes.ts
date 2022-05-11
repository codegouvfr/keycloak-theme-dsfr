import { createRouter, defineRoute, param, noMatch } from "type-route";
import type { ValueSerializer } from "type-route";
import { id } from "tsafe/id";
import type { AccountTabId } from "ui/components/pages/Account/accountTabIds";
//NOTE: This import needs to stay relative for github-pages-plugin-for-type-route
import { accountTabIds } from "./components/pages/Account/accountTabIds";
import { makeThisModuleAnExecutableRouteLister } from "github-pages-plugin-for-type-route";

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
        () => `/compte`,
    ),
    "catalogExplorer": defineRoute(
        {
            "search": param.query.optional.string.default(""),
            /** Can be the software name (string) or it's `${id}`  */
            "software": param.query.optional.string,
        },
        () => `/catalogue`,
    ),
    "form": defineRoute(
        {
            "softwareId": param.query.optional.number,
        },
        () => `/formulaire`,
    ),
    "legacyRoute": defineRoute(
        {
            "lang": param.path.string,
            "id": param.query.optional.number,
        },
        ({ lang }) => `/${lang}/software`,
    ),
    "fourOhFour": defineRoute("/404"),
};

export const { RouteProvider, useRoute, routes } = createRouter(routeDefs);

makeThisModuleAnExecutableRouteLister(routeDefs);
