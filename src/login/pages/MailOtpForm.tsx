import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { maskEmail } from "../shared/maskEmail";

// Durée de validité affichée à l'utilisateur (en minutes).
// ⚠️ L'extension `mail-otp-authenticator` utilise CODE_VALIDITY_DURATION = 300s (5 min)
// dans MailCodeService.java. Aligne cette constante (ou l'extension) pour rester cohérent.
const CODE_VALIDITY_MINUTES = 15;

/**
 * Saisie du code OTP reçu par email.
 * Template rendu par l'extension `mail-otp-authenticator` (createForm("mail-otp-form.ftl")).
 * Champs attendus côté serveur : `otp_code`, `code_control` (caché), `credentialId` (caché), `login`.
 */
export default function MailOtpForm(props: PageProps<Extract<KcContext, { pageId: "mail-otp-form.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, auth, code_control } = kcContext;

    // `auth.*` est présent dans le data_model freemarker (sérialisé par keycloakify)
    // mais réduit dans le type `auth` commun des pages custom.
    const { selectedCredential, attemptedUsername } = (auth as { selectedCredential?: string; attemptedUsername?: string } | undefined) ?? {};

    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const emailText = maskEmail(attemptedUsername) ?? msgStr("mail-otp-your-email");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("otp_code")}
            headerNode={msg("mail-otp-title")}
        >
            <p>{msg("mail-otp-code-info", String(CODE_VALIDITY_MINUTES), emailText)}</p>
            <form
                id="kc-totp-login-form"
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsLoginButtonDisabled(true);
                    return true;
                }}
            >
                <Input
                    label={msg("mail-otp-code-label")}
                    hintText={msg("mail-otp-code-hint")}
                    state={messagesPerField.existsError("otp_code") ? "error" : "default"}
                    stateRelatedMessage={messagesPerField.getFirstError("otp_code")}
                    nativeInputProps={{
                        id: "otp-code",
                        name: "otp_code",
                        autoFocus: true,
                        autoComplete: "one-time-code",
                        inputMode: "numeric",
                        maxLength: 6,
                        pattern: "[0-9]*",
                        tabIndex: 1
                    }}
                />

                <input type="hidden" name="code_control" value={code_control} />
                <input type="hidden" id="id-hidden-input" name="credentialId" value={selectedCredential ?? ""} />

                <div
                    id="kc-form-buttons"
                    className={kcClsx("kcFormGroupClass")}
                    style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", flexWrap: "wrap" }}
                >
                    {/* Renvoyer un code : l'extension régénère/renvoie le code à chaque entrée dans
                        l'authenticator. Sans support natif de "resend", on relance le flow (redemande
                        l'identifiant puis renvoie un nouveau code). */}
                    <Button priority="secondary" linkProps={{ href: url.loginRestartFlowUrl }}>
                        {msgStr("mail-otp-resend")}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoginButtonDisabled}
                        nativeButtonProps={{
                            tabIndex: 2,
                            id: "kc-login",
                            name: "login"
                        }}
                    >
                        {msgStr("mail-otp-validate")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
