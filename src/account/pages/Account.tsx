import { fr } from "@codegouvfr/react-dsfr";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template } = props;

    const classes = {
        ...props.classes,
        kcBodyClass: clsx(props.classes?.kcBodyClass, "user")
    };

    const { url, realm, messagesPerField, stateChecker, account, referrer } = kcContext;
    console.log("referer", referrer);

    const { msg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">
            <h2 className={fr.cx("fr-h2")}>{msg("editAccountHtmlTitle")}</h2>

            {/* TODO buttons to edit profile, password and delete account */}
        </Template>
    );
}
