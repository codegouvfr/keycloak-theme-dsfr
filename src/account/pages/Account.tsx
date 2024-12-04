import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useOidc } from "../oidc";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template } = props;

    const classes = {
        ...props.classes,
        kcBodyClass: clsx(props.classes?.kcBodyClass, "user")
    };

    const { goToAuthServer } = useOidc();
    const { referrer } = kcContext;

    const { msg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">
            <h2 className={fr.cx("fr-h2")}>{msg("editAccountHtmlTitle")}</h2>
            <ButtonsGroup
                buttons={[
                    {
                        children: msg("updateProfile"),
                        onClick: () =>
                            goToAuthServer({
                                extraQueryParams: { kc_action: "UPDATE_PROFILE" }
                            })
                    },
                    {
                        children: msg("updatePasswordTitle"),
                        onClick: () =>
                            goToAuthServer({
                                extraQueryParams: { kc_action: "UPDATE_PASSWORD" }
                            })
                    },
                    {
                        children: msg("deleteAccount"),
                        onClick: () =>
                            goToAuthServer({
                                extraQueryParams: { kc_action: "delete_account" }
                            }),
                        priority: "secondary"
                    }
                ]}
            />

            {referrer && (
                <a className={fr.cx("fr-link")} href={referrer?.url}>
                    {msg("backTo", referrer.name)}
                </a>
            )}
        </Template>
    );
}
