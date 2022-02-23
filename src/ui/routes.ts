import "minimal-polyfills/Object.fromEntries";
import { createRouter, defineRoute, param, noMatch } from "type-route";
import type { ValueSerializer } from "type-route";
import { id } from "tsafe/id";
import type { AccountTabId } from "ui/components/pages/Account/accountTabIds";
import { accountTabIds } from "ui/components/pages/Account/accountTabIds";

export const { RouteProvider, useRoute, routes } = createRouter({
    "home": defineRoute(["/", "/accueil"]),
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
        },
        () => `/catalogue`,
    ),
});
