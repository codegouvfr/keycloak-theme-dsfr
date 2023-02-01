import { createGroup } from "type-route";
import type { Route } from "type-route";
import { routes } from "ui-dsfr/routes";

SoftwareCreationForm.routeGroup = createGroup([routes.softwareCreationForm]);

type PageRoute = Route<typeof SoftwareCreationForm.routeGroup>;

SoftwareCreationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function SoftwareCreationForm(props: Props) {
    const { className, route } = props;

    return (
        <div className={className}>
            <pre>{JSON.stringify(route.params, null, 2)}</pre>
        </div>
    );
}
