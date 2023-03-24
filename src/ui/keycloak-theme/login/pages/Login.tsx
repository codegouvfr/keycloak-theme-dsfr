import React, { useState, type FormEventHandler } from "react";
import { clsx } from "keycloakify/lib/tools/clsx";
import { useConstCallback } from "keycloakify/lib/tools/useConstCallback";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "ui/i18n";
import { declareComponentKeys } from "i18nifty";
import { Input } from "@codegouvfr/react-dsfr/Input";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
    const {
        kcContext,
        i18n,
        doFetchDefaultThemeResources = true,
        Template,
        ...kcProps
    } = props;

    const {
        social,
        realm,
        url,
        usernameEditDisabled,
        login,
        auth,
        registrationDisabled
    } = kcContext;

    const { msg, msgStr } = i18n;
    const { t } = useTranslation({ Login });
    const { classes, cx } = useStyles();

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {
        e.preventDefault();

        setIsLoginButtonDisabled(true);

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement
            .querySelector("input[name='email']")
            ?.setAttribute("name", "username");

        formElement.submit();
    });

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("connect")}
            formNode={
                <div id="kc-form">
                    <div id="kc-form-wrapper">
                        {realm.password && (
                            <form
                                id="kc-form-login"
                                onSubmit={onSubmit}
                                action={url.loginAction}
                                method="post"
                                className={classes.centerCol}
                            >
                                {realm.password && social.providers !== undefined && (
                                    <div
                                        id="kc-social-providers"
                                        className={classes.agentConnect}
                                    >
                                        <ul
                                            className={clsx(
                                                kcProps.kcFormSocialAccountListClass,
                                                social.providers.length > 4 &&
                                                    kcProps.kcFormSocialAccountDoubleListClass
                                            )}
                                        >
                                            {social.providers.map(p => (
                                                <li key={p.providerId}>
                                                    {p.displayName
                                                        .toLocaleLowerCase()
                                                        .replace(/ /g, "")
                                                        .includes("agentconnect") ? (
                                                        <div
                                                            className={cx(
                                                                fr.cx("fr-connect-group"),
                                                                classes.franceConnect
                                                            )}
                                                        >
                                                            <button
                                                                className={fr.cx(
                                                                    "fr-connect"
                                                                )}
                                                            >
                                                                <span
                                                                    className={fr.cx(
                                                                        "fr-connect__login"
                                                                    )}
                                                                >
                                                                    {t("log with")}
                                                                </span>
                                                                <span
                                                                    className={fr.cx(
                                                                        "fr-connect__brand"
                                                                    )}
                                                                >
                                                                    {t("franceConnect")}
                                                                </span>
                                                            </button>
                                                            <p>
                                                                <a
                                                                    href="https://franceconnect.gouv.fr/"
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    title={t(
                                                                        "what is franceConnect title"
                                                                    )}
                                                                >
                                                                    {t(
                                                                        "what is franceConnect"
                                                                    )}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            linkProps={{
                                                                "href": p.loginUrl
                                                            }}
                                                        >
                                                            {p.displayName}
                                                        </Button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <h5>{msgStr("selfCredentials")}</h5>
                                <div className={classes.inputs}>
                                    {(() => {
                                        const label = !realm.loginWithEmailAllowed
                                            ? "username"
                                            : realm.registrationEmailAsUsername
                                            ? "email"
                                            : "usernameOrEmail";

                                        const autoCompleteHelper: typeof label =
                                            label === "usernameOrEmail"
                                                ? "username"
                                                : label;

                                        return (
                                            <Input
                                                nativeInputProps={{
                                                    "tabIndex": 1,
                                                    "id": autoCompleteHelper,
                                                    "name": autoCompleteHelper,
                                                    "type": "email",
                                                    "defaultValue": login.username ?? "",
                                                    ...(usernameEditDisabled
                                                        ? { "disabled": true }
                                                        : {
                                                              "autoFocus": true,
                                                              "autoComplete": "off"
                                                          })
                                                }}
                                                label={msgStr("email")}
                                                hintText={msgStr("email hint")}
                                            />
                                        );
                                    })()}
                                    <Input
                                        nativeInputProps={{
                                            "tabIndex": 2,
                                            "id": "password",
                                            "name": "password",
                                            "type": "password",
                                            "autoComplete": "off"
                                        }}
                                        label={msgStr("password")}
                                    />
                                    <div
                                        className={clsx(
                                            kcProps.kcFormGroupClass,
                                            kcProps.kcFormSettingClass
                                        )}
                                    >
                                        <div id="kc-form-options">
                                            {realm.rememberMe &&
                                                !usernameEditDisabled && (
                                                    <div className="checkbox">
                                                        <label>
                                                            <input
                                                                tabIndex={3}
                                                                id="rememberMe"
                                                                name="rememberMe"
                                                                type="checkbox"
                                                                {...(login.rememberMe
                                                                    ? {
                                                                          "checked": true
                                                                      }
                                                                    : {})}
                                                            />
                                                            {msg("rememberMe")}
                                                        </label>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="kc-form-buttons"
                                    className={clsx(kcProps.kcFormGroupClass)}
                                >
                                    <input
                                        type="hidden"
                                        id="id-hidden-input"
                                        name="credentialId"
                                        {...(auth?.selectedCredential !== undefined
                                            ? {
                                                  "value": auth.selectedCredential
                                              }
                                            : {})}
                                    />
                                    <input
                                        tabIndex={4}
                                        className={clsx(
                                            kcProps.kcButtonClass,
                                            kcProps.kcButtonPrimaryClass,
                                            kcProps.kcButtonBlockClass,
                                            kcProps.kcButtonLargeClass
                                        )}
                                        name="login"
                                        id="kc-login"
                                        type="submit"
                                        value={msgStr("connect")}
                                        disabled={isLoginButtonDisabled}
                                    />
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            }
            infoNode={
                <div className={classes.resetAndRegister}>
                    {realm.resetPasswordAllowed && (
                        <a
                            tabIndex={5}
                            href={url.loginResetCredentialsUrl}
                            className={cx(
                                fr.cx(
                                    "fr-link",
                                    "fr-icon-arrow-right-line",
                                    "fr-link--icon-right"
                                ),
                                classes.forgotPassword
                            )}
                        >
                            {msgStr("doForgotPassword")}
                        </a>
                    )}
                    {realm.password &&
                        realm.registrationAllowed &&
                        !registrationDisabled && (
                            <a
                                tabIndex={6}
                                href={url.registrationUrl}
                                className={fr.cx(
                                    "fr-link",
                                    "fr-icon-arrow-right-line",
                                    "fr-link--icon-right"
                                )}
                            >
                                {msgStr("noAccount")}
                            </a>
                        )}
                </div>
            }
        />
    );
}

const useStyles = makeStyles({
    "name": { Login }
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
    "agentConnect": {
        "&&&": {
            "borderRight": "none"
        }
    },
    "franceConnect": {
        "display": "flex",
        "alignItems": "center",
        "flexDirection": "column"
    },
    "forgotPassword": {
        "marginRight": fr.spacing("6v")
    },
    "resetAndRegister": {
        "display": "flex",
        "justifyContent": "center",
        "marginTop": fr.spacing("6v")
    }
}));

export const { i18n } = declareComponentKeys<
    | "back"
    | "connect"
    | "selfCredentials"
    | "forget password"
    | "no account"
    | "log with"
    | "franceConnect"
    | "what is franceConnect"
    | "what is franceConnect title"
>()({
    Login
});
