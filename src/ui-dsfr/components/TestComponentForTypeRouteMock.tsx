import { createGroup } from "type-route";
import type { Route } from "type-route";
import { routes } from "ui/routes";
import { Input } from "@codegouvfr/react-dsfr/Input";

TestComponentForTypeRouteMock.routeGroup = createGroup([routes.catalog]);

type PageRoute = Route<typeof TestComponentForTypeRouteMock.routeGroup>;

TestComponentForTypeRouteMock.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function TestComponentForTypeRouteMock(props: Props) {
    const { className, route } = props;

    return (
        <div className={className}>
            <Input
                label="Query"
                nativeInputProps={{
                    "value": route.params.q,
                    "onChange": event =>
                        routes.catalog({ "q": event.target.value }).replace(),
                }}
            />
            <p>Query: {route.params.q} </p>
        </div>
    );
}
