import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a className={fr.cx("fr-link")} href={url.registrationUrl} tabIndex={8}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <>
                                    <Input
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")
                                        }
                                        state={messagesPerField.existsError("username", "password") ? "error" : "default"}
                                        stateRelatedMessage={messagesPerField.getFirstError("username", "password")}
                                        nativeInputProps={{
                                            name: "username",
                                            autoFocus: true,
                                            autoComplete: "username",
                                            defaultValue: login.username ?? "",
                                            tabIndex: 2
                                        }}
                                    />
                                </>
                            )}

                            <PasswordInput
                                label={msg("password")}
                                nativeInputProps={{ id: "password", name: "password", autoComplete: "current-password", tabIndex: 3 }}
                                messages={
                                    messagesPerField.existsError("password")
                                        ? [{ message: messagesPerField.getFirstError("password"), severity: "error" }]
                                        : []
                                }
                            />

                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div>
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className={fr.cx("fr-checkbox-group", "fr-checkbox-group--sm")}>
                                            <input
                                                id="remember-me-toggle"
                                                tabIndex={5}
                                                name="rememberMe"
                                                type="checkbox"
                                                defaultChecked={!!login.rememberMe}
                                            />{" "}
                                            <label htmlFor="remember-me-toggle">{msg("rememberMe")}</label>
                                        </div>
                                    )}
                                </div>
                                {realm.resetPasswordAllowed && (
                                    <div>

                                    <a className={fr.cx("fr-link")} href={url.loginResetCredentialsUrl} tabIndex={6}>
                                        {msg("doForgotPassword")}
                                    </a>
                                    </div>
                                )}
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    className={fr.cx("fr-my-2w")}
                                    type="submit"
                                    disabled={isLoginButtonDisabled}
                                    nativeButtonProps={{
                                        tabIndex: 7,
                                        id: "kc-login",
                                        name: "login"
                                    }}
                                >
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
