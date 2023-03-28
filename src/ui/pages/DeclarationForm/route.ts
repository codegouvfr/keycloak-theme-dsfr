import { createGroup, defineRoute, createRouter, param, type Route } from "type-route";

export const routeDefs = {
    "declarationForm": defineRoute(
        {
            "name": param.query.string
        },
        () => `/declaration`
    )
};

export const routeGroup = createGroup(Object.values(createRouter(routeDefs).routes));

export type PageRoute = Route<typeof routeGroup>;

export const getDoRequireUserLoggedIn: (route: PageRoute) => boolean = () => true;
