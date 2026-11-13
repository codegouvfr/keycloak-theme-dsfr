import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

/**
 * Choix de la méthode OTP (application mobile / email).
 * Template rendu par l'extension `mail-otp-authenticator` (createForm("otp-choice.ftl")).
 * Champs attendus côté serveur : radio `choice_otp` (totp|mail), submit `confirm`.
 */
export default function OtpChoice(props: PageProps<Extract<KcContext, { pageId: "otp-choice.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg, msgStr } = i18n;
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("otpChoiceTitle")}>
            <p>{msg("otpChoiceDescription")}</p>
            <form
                id="otp-choice-form"
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitDisabled(true);
                    return true;
                }}
            >
                <RadioButtons
                    name="choice_otp"
                    options={[
                        {
                            label: msg("otpChoiceApp"),
                            hintText: msg("otpChoiceAppDescription"),
                            nativeInputProps: { value: "totp", defaultChecked: true }
                        },
                        {
                            label: msg("otpChoiceMail"),
                            hintText: msg("otpChoiceMailDescription"),
                            nativeInputProps: { value: "mail" }
                        }
                    ]}
                />

                <div id="kc-form-buttons">
                    <Button
                        className={fr.cx("fr-my-2w")}
                        type="submit"
                        disabled={isSubmitDisabled}
                        nativeButtonProps={{
                            id: "kc-login",
                            name: "confirm"
                        }}
                    >
                        {msgStr("doContinue")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
