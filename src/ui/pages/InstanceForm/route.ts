import { createGroup, defineRoute, createRouter, param, type Route } from "type-route";

export const routeDefs = {
    "instanceCreationForm": defineRoute(
        {
            "softwareName": param.query.optional.string
        },
        () => "/add-instance"
    ),
    "instanceUpdateForm": defineRoute(
        {
            "id": param.query.number
        },
        () => "/update-instance"
    )
};

export const routeGroup = createGroup(Object.values(createRouter(routeDefs).routes));

export type PageRoute = Route<typeof routeGroup>;

export const getDoRequireUserLoggedIn: (route: PageRoute) => boolean = () => false;
