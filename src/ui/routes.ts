import { createRouter, defineRoute, param, noMatch } from "type-route";
import type { ValueSerializer } from "type-route";
import { id } from "tsafe/id";
import type { AccountTabId } from "ui/components/pages/Account/accountTabIds";
//NOTE: This import needs to stay relative for github-pages-plugin-for-type-route
import { accountTabIds } from "./components/pages/Account/accountTabIds";
import { makeThisModuleAnExecutableRouteLister } from "github-pages-plugin-for-type-route";

const routeDefs = {
    "home": defineRoute(["/"]),
    "account": defineRoute(
        {
            "tabId": param.path.optional
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
        ({ tabId }) => `/compte/${tabId}`,
    ),
    "catalogExplorer": defineRoute(
        {
            "search": param.query.optional.string.default(""),
            "softwareName": param.path.optional.string,
        },
        ({ softwareName }) => `/catalogue/${softwareName}`,
    ),
};

export const { RouteProvider, useRoute, routes } = createRouter(routeDefs);

makeThisModuleAnExecutableRouteLister(routeDefs);
