import { Evt } from "evt";
import type { Param0 } from "tsafe";

export function createTypeRouteMock<
    Routes extends {
        [Name in string]: (params?: any) => { params: any };
    }
>(params: { routes: Routes }) {
    const { routes } = params;

    const evtRoutes = Evt.create<
        {
            [Name in keyof typeof routes]: {
                name: Name;
                params: Param0<typeof routes[Name]>;
            };
        }[keyof typeof routes]
    >();

    function createMockRouteFactory(params: { triggerStoriesReRender: () => void }) {
        const { triggerStoriesReRender } = params;

        function createMockRoute<Name extends keyof typeof routes>(
            name: Name,
            params: Param0<typeof routes[Name]>
        ): { params: ReturnType<typeof routes[Name]>["params"] } {
            evtRoutes.$attach(
                routeEvent =>
                    routeEvent.name === name
                        ? [routeEvent.params as Param0<typeof routes[Name]>]
                        : null,
                newParams => {
                    params = newParams;
                    triggerStoriesReRender();
                }
            );

            return Object.defineProperty(
                {} as { params: Param0<typeof routes[Name]> },
                "params",
                {
                    "enumerable": true,
                    "get": () => routes[name](params).params
                }
            );
        }

        return { createMockRoute };
    }

    const routesProxy = new Proxy(routes, {
        "get": (...args) => {
            const [, prop] = args;

            const name = prop;

            const out = function (params?: Record<string, unknown>) {
                return new Proxy(
                    {},
                    {
                        "get": (...args) => {
                            const [, prop] = args;

                            if (prop === "link") {
                                return (routes as any)[name](params).link;
                            }

                            if (prop !== "push" && prop !== "replace") {
                                throw new Error(`${String(prop)} not mocked yet `);
                            }

                            return () => {
                                evtRoutes.post({
                                    name,
                                    params
                                } as any);
                            };
                        }
                    }
                );
            };

            Object.defineProperty(out, "name", { "value": name });

            out["~internal"] = { "type": "RouteBuilder" };

            return out;
        }
    });

    return { createMockRouteFactory, routesProxy };
}
