import { createGroup, defineRoute, createRouter, param, type Route } from "type-route";

export const routeDefs = {
    "softwareUsersAndReferents": defineRoute(
        {
            "name": param.query.string
        },
        () => `/users-and-referents`
    )
};

export const routeGroup = createGroup(Object.values(createRouter(routeDefs).routes));

export type PageRoute = Route<typeof routeGroup>;

export const getDoRequireUserLoggedIn: (route: PageRoute) => boolean = () => false;
