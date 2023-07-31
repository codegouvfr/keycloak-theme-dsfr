import { getKcContext, type KcContext } from "account/kcContext";
import KcApp from "account/KcApp";
import type { DeepPartial } from "keycloakify/tools/DeepPartial";

export function createPageStory<PageId extends KcContext["pageId"]>(params: {
    pageId: PageId;
}) {
    const { pageId } = params;

    function PageStory(params: {
        kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>>;
    }) {
        const { kcContext } = getKcContext({
            "mockPageId": pageId,
            "storyPartialKcContext": params.kcContext
        });

        return <KcApp kcContext={kcContext} />;
    }

    return { PageStory };
}
