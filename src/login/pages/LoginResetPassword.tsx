import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { I18n } from "../i18n";
import type { KcContext } from "../KcContext";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("emailForgotTitle")}
        >
            <form
                id="kc-reset-password-form"
                className={kcClsx("kcFormClass")}
                action={url.loginAction}
                method="post"
            >
                <div className={kcClsx("kcFormGroupClass")}>
                    <Input
                        label={msgStr("email")}
                        state={messagesPerField.existsError("username") ? "error" : "default"}
                        stateRelatedMessage={messagesPerField.getFirstError("username")}
                        nativeInputProps={{
                            type: "email",
                            id: "username",
                            name: "username",
                            autoFocus: true,
                            autoComplete: "email"
                        }}
                    />
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")} />
                    </div>
                    <div id="kc-form-buttons" className={fr.cx("fr-mt-3w")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button type="submit">{msgStr("doSubmit")}</Button>

                        <div>
                            <a className={fr.cx("fr-link")} href={url.loginUrl}>
                                {msg("backToLogin")}
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </Template>
    );
}
