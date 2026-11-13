import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { FranceConnectButton } from "@codegouvfr/react-dsfr/FranceConnectButton";
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import "./login.css";

const franceConnectProviderIds = ["franceconnect", "franceconnect-particulier"];
const proConnectProviderIds = ["agentconnect", "proconnect"];

/**
 * Page de la première étape d'un flow "Username Form" (login-username.ftl) :
 * saisie de l'identifiant uniquement (pas de mot de passe), avec au-dessus les
 * fournisseurs d'identité (ProConnect / FranceConnect / génériques).
 */
export default function UsernameForm(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const hasSocialProviders = social?.providers !== undefined && social.providers.length !== 0;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a className={fr.cx("fr-link")} href={url.registrationUrl} tabIndex={6}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                hasSocialProviders ? (
                    <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                        {social.providers!.map(p => {
                            if (proConnectProviderIds.includes(p.providerId)) {
                                return (
                                    <div key={p.alias}>
                                        <h2 className={fr.cx("fr-h5")}>{msg("login-with-proconnect")}</h2>
                                        <p className={fr.cx("fr-text--sm")}>{msg("proconnect-description")}</p>
                                        <ProConnectButton style={{ textAlign: "center" }} url={p.loginUrl} />
                                    </div>
                                );
                            }

                            if (franceConnectProviderIds.includes(p.providerId)) {
                                return <FranceConnectButton key={p.alias} style={{ textAlign: "center" }} url={p.loginUrl} />;
                            }

                            return (
                                <div key={p.alias} style={{ display: "flex", justifyContent: "center" }}>
                                    <Button
                                        className={fr.cx("fr-m-1w")}
                                        iconId={(() => {
                                            switch (p.providerId) {
                                                case "github":
                                                    return "ri-github-fill";
                                                case "google":
                                                    return "ri-google-fill";
                                                case "facebook":
                                                    return "ri-facebook-fill";
                                                case "microsoft":
                                                    return "ri-microsoft-fill";
                                                case "twitter":
                                                    return "ri-twitter-fill";
                                                case "instagram":
                                                    return "ri-instagram-fill";
                                                case "linkedin":
                                                    return "ri-linkedin-fill";
                                                case "stackoverflow":
                                                    return "ri-stack-overflow-fill";
                                                case "gitlab":
                                                    return "ri-gitlab-fill";
                                            }
                                            return "ri-external-link-line";
                                        })()}
                                        linkProps={{ href: p.loginUrl }}
                                    >
                                        {p.displayName}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                ) : null
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {hasSocialProviders && <div className="separator">OU</div>}
                    <h2 className={fr.cx("fr-h5")}>{msg("login-with-email-title")}</h2>
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
                            <Input
                                label={
                                    !realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : !realm.registrationEmailAsUsername
                                          ? msg("usernameOrEmail")
                                          : msg("email")
                                }
                                hintText={msg("email-format-hint")}
                                state={messagesPerField.existsError("username") ? "error" : "default"}
                                stateRelatedMessage={messagesPerField.getFirstError("username")}
                                nativeInputProps={{
                                    name: "username",
                                    autoFocus: true,
                                    autoComplete: "username",
                                    defaultValue: login.username ?? "",
                                    tabIndex: 2
                                }}
                            />
                        )}

                        <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                            <Button
                                className={fr.cx("fr-my-2w")}
                                type="submit"
                                disabled={isLoginButtonDisabled}
                                nativeButtonProps={{
                                    tabIndex: 3,
                                    id: "kc-login",
                                    name: "login"
                                }}
                            >
                                {msgStr("doLogIn")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Template>
    );
}
