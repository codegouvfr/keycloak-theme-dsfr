import { useEffect } from "react";
import { createGroup } from "type-route";
import type { Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { selectors, useCoreState, useCoreFunctions } from "core-dsfr";

SoftwareDetails.routeGroup = createGroup([routes.softwareDetails]);

type PageRoute = Route<typeof SoftwareDetails.routeGroup>;

SoftwareDetails.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function SoftwareDetails(props: Props) {
    const { className, route } = props;

    const { softwareDetails } = useCoreFunctions();

    const { software } = useCoreState(selectors.softwareDetails.software);

    useEffect(() => {
        softwareDetails.setSoftware({
            "softwareName": route.params.name
        });

        return () =>
            softwareDetails.setSoftware({
                "softwareName": undefined
            });
    }, [route.params.name]);

    return (
        <div className={className}>
            <pre>{JSON.stringify(software, null, 2)}</pre>
        </div>
    );
}
