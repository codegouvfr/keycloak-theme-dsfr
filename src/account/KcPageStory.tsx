import type { DeepPartial } from "keycloakify/tools/DeepPartial";
import type {
    KcContext,
    KcContextExtension,
    KcContextExtensionPerPage
} from "./KcContext";
import { createGetKcContextMock } from "keycloakify/account/KcContext";
import KcPage from "./KcPage";
import { themeNames, kcEnvDefaults } from "../kc.gen";

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    properties: {
        ...kcEnvDefaults
    },
    darkMode: true
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {
    "account.ftl": {
        url: {
            getLogoutUrl: () => "#",
            accountUrl: "/realms/test/account",
            totpUrl: "/realms/test/account/totp",
            sessionsUrl: "/realms/test/account/sessions",
            applicationsUrl: "/realms/test/account/applications"
        },
        features: {
            identityFederation: false,
            log: false,
            authorization: false,
            passwordUpdateSupported: false
        },
        realm: {
            userManagedAccessAllowed: false
        },
        message: undefined,
        referrer: undefined
    }
};

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {},
    overridesPerPage: {}
});

export function createKcPageStory<PageId extends KcContext["pageId"]>(
    params: Readonly<{
        pageId: PageId;
    }>
) {
    const { pageId } = params;

    function KcPageStory(
        props: Readonly<{
            kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>>;
        }>
    ) {
        const { kcContext: overrides } = props;

        const kcContextMock = getKcContextMock({
            pageId,
            overrides
        });

        return <KcPage kcContext={kcContextMock} />;
    }

    return { KcPageStory };
}
