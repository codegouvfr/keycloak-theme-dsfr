import { createGetKcContext, type PageId } from "keycloakify/account";
import type { Properties } from "Env";

export const { getKcContext } = createGetKcContext<{
    pageId: PageId;
    properties: Properties;
}>();

export const { kcContext } = getKcContext({
    //"mockPageId": "password.ftl"
});

export type KcContext = NonNullable<ReturnType<typeof getKcContext>["kcContext"]>;
