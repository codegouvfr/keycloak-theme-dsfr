import { useState } from "react";
import { clsx } from "keycloakify/lib/tools/clsx";
import { UserProfileCommons } from "./shared/UserProfileCommons";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";

export default function RegisterUserProfile(
    props: PageProps<Extract<KcContext, { pageId: "register-user-profile.ftl" }>, I18n>
) {
    const {
        kcContext,
        i18n,
        doFetchDefaultThemeResources = true,
        Template,
        ...kcProps
    } = props;

    const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey } = kcContext;

    const { msg, msgStr } = i18n;
    const { classes } = useStyles();

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            displayMessage={messagesPerField.exists("global")}
            headerNode={msg("registerTitle")}
            formNode={
                <form
                    id="kc-register-form"
                    className={classes.centerCol}
                    action={url.registrationAction}
                    method="post"
                >
                    <div className={classes.inputs}>
                        <UserProfileCommons
                            kcContext={kcContext}
                            onIsFormSubmittableValueChange={setIsFomSubmittable}
                            i18n={i18n}
                            {...kcProps}
                        />
                        {recaptchaRequired && (
                            <div className="form-group">
                                <div className={clsx(kcProps.kcInputWrapperClass)}>
                                    <div
                                        className="g-recaptcha"
                                        data-size="compact"
                                        data-sitekey={recaptchaSiteKey}
                                    />
                                </div>
                            </div>
                        )}
                        <div className={classes.buttons}>
                            <a
                                className={fr.cx("fr-btn", "fr-btn--secondary")}
                                href={url.loginUrl}
                            >
                                {msgStr("backToLogin")}
                            </a>
                            <input
                                className={fr.cx("fr-btn")}
                                type="submit"
                                value={msgStr("doRegister")}
                                disabled={!isFomSubmittable}
                            />
                        </div>
                    </div>
                </form>
            }
        />
    );
}

const useStyles = makeStyles({
    "name": { RegisterUserProfile }
})(() => ({
    "centerCol": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center"
    },
    "inputs": {
        "display": "flex",
        "flexDirection": "column",
        "width": "50%"
    },
    "buttons": {
        "display": "flex",
        "gap": fr.spacing("4v"),
        "justifyContent": "end"
    }
}));
