import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, user } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("emailVerifyTitle")}
        >
            <Alert
                severity="info"
                description={msgStr("emailVerifyInstruction1", user?.email ?? "")}
                className={fr.cx("fr-mb-4w")}
                small
            />

            <div className={kcClsx("kcFormGroupClass")}>
                <p className={fr.cx("fr-text--sm", "fr-mb-3w")}>
                    {msgStr("emailVerifyInstruction2")}{" "}
                    <form action={url.loginAction} method="post" style={{ display: "inline" }}>
                        <input type="hidden" name="email" value={user?.email ?? ""} />
                        <button
                            type="submit"
                            className={fr.cx("fr-link")}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer"
                            }}
                        >
                            {msgStr("doClickHere")} {msgStr("emailVerifyInstruction3")}
                        </button>
                    </form>
                </p>
            </div>

            <div className={kcClsx("kcFormGroupClass")} style={{ display: "flex", justifyContent: "flex-end" }}>
                <a className={fr.cx("fr-link")} href={url.loginUrl}>
                    {msg("backToLogin")}
                </a>
            </div>
        </Template>
    );
}
