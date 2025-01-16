import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { KcClsx, getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useState } from "react";

export default function LoginConfigTOTP(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, totp, mode, isAppInitiatedAction } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;
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
            <>
                <ol id="kc-totp-settings">
                    <li>
                        <p>{msg("loginTotpStep1")}</p>
                        <ul id="kc-totp-supported-apps">
                            {totp.supportedApplications.map(app => (
                                <li key={app}>{advancedMsg(app)}</li>
                            ))}
                        </ul>
                    </li>

                    {mode === "manual" ? (
                        <>
                            <li>
                                <p>{msg("loginTotpManualStep2")}</p>
                                <p>
                                    <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
                                </p>
                                <p>
                                    <a href={totp.qrUrl} id="mode-barcode">
                                        {msg("loginTotpScanBarcode")}
                                    </a>
                                </p>
                            </li>
                            <li>
                                <p>{msg("loginTotpManualStep3")}</p>
                                <p>
                                    <ul>
                                        <li id="kc-totp-type">
                                            {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                        </li>
                                        <li id="kc-totp-algorithm">
                                            {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                        </li>
                                        <li id="kc-totp-digits">
                                            {msg("loginTotpDigits")}: {totp.policy.digits}
                                        </li>
                                        {totp.policy.type === "totp" && (
                                            <li id="kc-totp-period">
                                                {msg("loginTotpInterval")}: {totp.policy.period}
                                            </li>
                                        )}
                                        {totp.policy.type === "hotp" && (
                                            <li id="kc-totp-counter">
                                                {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                            </li>
                                        )}
                                    </ul>
                                </p>
                            </li>
                        </>
                    ) : (
                        <li>
                            <p>{msg("loginTotpStep2")}</p>
                            <img id="kc-totp-secret-qr-code" src={`data:image/png;base64, ${totp.totpSecretQrCode}`} alt="Figure: Barcode" />
                            <br />
                            <p>
                                <a href={totp.manualUrl} id="mode-manual">
                                    {msg("loginTotpUnableToScan")}
                                </a>
                            </p>
                        </li>
                    )}
                    <li>
                        <p>{msg("loginTotpStep3")}</p>
                        <p>{msg("loginTotpStep3DeviceName")}</p>
                    </li>
                </ol>
                <form
                    action={url.loginAction}
                    className={kcClsx("kcFormClass")}
                    id="kc-totp-settings-form"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    method="post"
                >
                    <Input
                        label={msg("authenticatorCode")}
                        state={messagesPerField.existsError("totp") ? "error" : "default"}
                        stateRelatedMessage={messagesPerField.getFirstError("totp")}
                        nativeInputProps={{
                            name: "totp",
                            required: true,
                            autoFocus: true,
                            defaultValue: "",
                            tabIndex: 1
                        }}
                    />
                    <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                    {mode && <input type="hidden" id="mode" name="mode" value={mode} />}

                    <Input
                        label={msg("loginTotpDeviceName")}
                        state={messagesPerField.existsError("userLabel") ? "error" : "default"}
                        stateRelatedMessage={messagesPerField.getFirstError("userLabel")}
                        nativeInputProps={{
                            required: (totp.otpCredentials ?? []).length > 1,
                            name: "userLabel",
                            autoFocus: true,
                            defaultValue: "",
                            tabIndex: 2
                        }}
                    />
                    <div className={kcClsx("kcFormGroupClass")}>
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    </div>
                    {isAppInitiatedAction ? (
                        <ul className="fr-btns-group fr-btns-group--inline-lg">
                            <li>
                                <Button
                                    className={fr.cx("fr-my-2w")}
                                    type="submit"
                                    disabled={isLoginButtonDisabled}
                                    nativeButtonProps={{
                                        tabIndex: 3,
                                        id: "saveTOTPBtn"
                                    }}
                                >
                                    {msgStr("doSubmit")}
                                </Button>
                            </li>
                            <li>
                                <Button
                                    className={fr.cx("fr-my-2w")}
                                    type="submit"
                                    disabled={isLoginButtonDisabled}
                                    value="true"
                                    nativeButtonProps={{
                                        tabIndex: 4,
                                        id: "cancelTOTPBtn",
                                        name: "cancel-aia"
                                    }}
                                >
                                    {msgStr("doCancel")}
                                </Button>
                            </li>
                        </ul>
                    ) : (
                        <Button
                            className={fr.cx("fr-my-2w")}
                            type="submit"
                            disabled={isLoginButtonDisabled}
                            nativeButtonProps={{
                                tabIndex: 3,
                                id: "saveTOTPBtn"
                            }}
                        >
                            {msgStr("doSubmit")}
                        </Button>
                    )}
                </form>
            </>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { kcClsx, i18n } = props;

    const { msg } = i18n;

    return (
        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={kcClsx("kcFormOptionsWrapperClass")}>
                <div className={fr.cx("fr-checkbox-group", "fr-checkbox-group--sm")}>
                    <input id="logout-sessions" tabIndex={5} name="logout-sessions" type="checkbox" defaultChecked={true} />{" "}
                    <label htmlFor="logout-sessions">{msg("logoutOtherSessions")}</label>
                </div>
            </div>
        </div>
    );
}
