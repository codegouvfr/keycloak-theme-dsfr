import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useState } from "react";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, otpLogin } = kcContext;

    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("loginAccountTitle")}
        >
            <form
                id="kc-otp-login-form"
                action={url.loginAction}
                method="post"
                className={kcClsx("kcFormClass")}
                onSubmit={() => {
                    setIsLoginButtonDisabled(true);
                    return true;
                }}
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className={`${kcClsx("kcFormGroupClass")} fr-fieldset`}>
                        {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                            <div key={index} className={`${kcClsx("kcInputWrapperClass")} fr-fieldset__element`}>
                                <div className="fr-radio-group">
                                    <input
                                        id={`kc-otp-credential-${index}`}
                                        className={`${kcClsx("kcLoginOTPListInputClass")}`}
                                        type="radio"
                                        name="selectedCredentialId"
                                        value={otpCredential.id}
                                        defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                    />
                                    <label
                                        htmlFor={`kc-otp-credential-${index}`}
                                        className={`${kcClsx("kcLoginOTPListClass")} fr-label`}
                                        tabIndex={index}
                                    >
                                        <span className={kcClsx("kcLoginOTPListItemHeaderClass")}>
                                            <span className={kcClsx("kcLoginOTPListItemIconBodyClass")}>
                                                <i className={kcClsx("kcLoginOTPListItemIconClass")} aria-hidden="true"></i>
                                            </span>
                                            <span className={kcClsx("kcLoginOTPListItemTitleClass")}>{otpCredential.userLabel}</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Input
                    label={msg("loginOtpOneTime")}
                    state={messagesPerField.existsError("totp") ? "error" : "default"}
                    stateRelatedMessage={messagesPerField.getFirstError("totp")}
                    nativeInputProps={{
                        name: "otp",
                        autoFocus: true,
                        autoComplete: "otp",
                        defaultValue: "",
                        tabIndex: 1
                    }}
                />

                <div>
                    <div id="kc-form-options">
                        <div></div>
                    </div>

                    <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                        <Button
                            className={fr.cx("fr-my-2w")}
                            type="submit"
                            disabled={isLoginButtonDisabled}
                            nativeButtonProps={{
                                tabIndex: 2,
                                id: "kc-login",
                                name: "login"
                            }}
                        >
                            {msgStr("doLogIn")}
                        </Button>
                    </div>
                </div>
            </form>
        </Template>
    );
}
