import { fr } from "@codegouvfr/react-dsfr";
import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import Button from "@codegouvfr/react-dsfr/Button";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { I18n } from "../i18n";
import type { KcContext } from "../KcContext";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <form id="kc-passwd-update-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <div className={kcClsx("kcFormGroupClass")}>
                    <PasswordInput
                        label={msg("passwordNew")}
                        messages={
                            messagesPerField.existsError("password", "password-confirm")
                                ? [{ message: messagesPerField.get("password"), severity: "error" }]
                                : []
                        }
                        nativeInputProps={{
                            autoFocus: true,
                            autoComplete: "new-password",
                            id: "password-new",
                            name: "password-new"
                        }}
                    />
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <PasswordInput
                        label={msg("passwordConfirm")}
                        messages={
                            messagesPerField.existsError("password-confirm")
                                ? [{ message: messagesPerField.get("password-confirm"), severity: "error" }]
                                : []
                        }
                        nativeInputProps={{
                            autoFocus: true,
                            autoComplete: "new-password",
                            id: "password-confirm",
                            name: "password-confirm"
                        }}
                    />
                </div>
                <div className={kcClsx("kcFormGroupClass")}>
                    <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    <div id="kc-form-buttons" className={fr.cx("fr-mt-3w")}>
                        <Button type="submit">{msgStr("doSubmit")}</Button>
                        {isAppInitiatedAction && (
                            <Button
                                type="submit"
                                className={fr.cx("fr-ml-2w")}
                                nativeButtonProps={{
                                    value: "true",
                                    name: "cancel-aia"
                                }}
                            >
                                {msg("doCancel")}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { i18n } = props;

    const { msg } = i18n;

    return (
        <div id="kc-form-options">
            <div className={fr.cx("fr-checkbox-group", "fr-checkbox-group--sm")}>
                <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                <label className={fr.cx("fr-label")} htmlFor="logout-sessions">
                    {msg("logoutOtherSessions")}
                </label>
            </div>
        </div>
    );
}
