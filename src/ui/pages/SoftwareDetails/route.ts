import { createGroup, type Route } from "type-route";
import { routes } from "ui/routes";

export const routeGroup = createGroup([routes.softwareDetails]);

export type PageRoute = Route<typeof routeGroup>;

export const getDoRequireUserLoggedIn: (route: PageRoute) => boolean = () => false;
