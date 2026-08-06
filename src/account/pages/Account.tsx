import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useOidc } from "../oidc";

type AccountReferrer = {
    url: string;
    name?: string;
};

function getAccountReferrer(rawReferrer: unknown): AccountReferrer | undefined {
    if (typeof rawReferrer !== "object" || rawReferrer === null) {
        return undefined;
    }

    const candidate = rawReferrer as { url?: unknown; name?: unknown };

    if (typeof candidate.url !== "string") {
        return undefined;
    }

    const name = typeof candidate.name === "string" ? candidate.name : undefined;

    return {
        url: candidate.url,
        name
    };
}

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template } = props;

    const classes = {
        ...props.classes,
        kcBodyClass: clsx(props.classes?.kcBodyClass, "user")
    };

    const { goToAuthServer } = useOidc();
    const { referrer } = kcContext;
    const safeReferrer = getAccountReferrer(referrer);

    const { msg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">
            <h2 className={fr.cx("fr-h2")}>{msg("editAccountHtmlTitle")}</h2>
            <ButtonsGroup
                buttons={[
                    {
                        children: msg("updateProfile"),
                        onClick: () => {
                            void goToAuthServer({
                                extraQueryParams: { kc_action: "UPDATE_PROFILE" }
                            });
                        }
                    },
                    {
                        children: msg("updatePasswordTitle"),
                        onClick: () => {
                            void goToAuthServer({
                                extraQueryParams: { kc_action: "UPDATE_PASSWORD" }
                            });
                        }
                    },
                    {
                        children: msg("deleteAccount"),
                        onClick: () => {
                            void goToAuthServer({
                                extraQueryParams: { kc_action: "delete_account" }
                            });
                        },
                        priority: "secondary"
                    }
                ]}
            />

            {safeReferrer !== undefined && (
                <a className={fr.cx("fr-link")} href={safeReferrer.url}>
                    {msg("backTo", safeReferrer.name ?? safeReferrer.url)}
                </a>
            )}
        </Template>
    );
}
