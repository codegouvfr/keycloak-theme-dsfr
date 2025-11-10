import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, message, client } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <Alert
                severity="error"
                description={message?.summary}
                className={fr.cx("fr-mb-4w")}
                small
            />

            <div className={kcClsx("kcFormGroupClass")} style={{ display: "flex", justifyContent: "flex-end" }}>
                {client.baseUrl !== undefined ? (
                    <a className={fr.cx("fr-link")} href={client.baseUrl}>
                        {msg("backToApplication")}
                    </a>
                ) : (
                    <a className={fr.cx("fr-link")} href={url.loginUrl}>
                        {msg("backToLogin")}
                    </a>
                )}
            </div>
        </Template>
    );
}
