import { useState, useRef, useEffect, memo } from "react";
import type { FormEventHandler } from "react";
import type { KcProps } from "keycloakify/lib/components/KcProps";
import { useKcMessage } from "keycloakify/lib/i18n/useKcMessage";
import { useConstCallback } from "powerhooks/useConstCallback";
import { Template } from "../Template";
import { Button } from "ui/theme";
import Link from "@mui/material/Link";
import { makeStyles, Text } from "ui/theme";
import { TextField } from "onyxia-ui/TextField";
import type { TextFieldProps } from "onyxia-ui/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "onyxia-ui/Checkbox";
import { useSplashScreen } from "onyxia-ui";
import { getBrowser } from "ui/tools/getBrowser";
import { useEvt } from "evt/hooks";
import { Evt } from "evt";
import { LoginDivider } from "./LoginDivider";
import { AgentConnectButton } from "./AgentConnectButton";
import { useTranslation } from "ui/i18n/useTranslations";
import type { KcContext } from "../kcContext";
//import { assert } from "tsafe/assert";

type KcContext_Login = Extract<KcContext, { pageId: "login.ftl" }>;

export const Login = memo(
    ({ kcContext, ...props }: { kcContext: KcContext_Login } & KcProps) => {
        const { msg, msgStr } = useKcMessage();

        const {
            social,
            realm,
            url,
            usernameEditDisabled,
            login,
            auth,
            registrationDisabled,
        } = kcContext;

        const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

        const usernameInputRef = useRef<HTMLInputElement>(null);
        const passwordInputRef = useRef<HTMLInputElement>(null);
        const submitButtonRef = useRef<HTMLButtonElement>(null);

        const [areTextInputsDisabled, setAreTextInputsDisabled] = useState(
            () => getBrowser() === "safari",
        );

        useSplashScreen({
            "onHidden": () => {
                if (!areTextInputsDisabled) {
                    return;
                }
                setAreTextInputsDisabled(false);
                usernameInputRef.current!.focus();
            },
        });

        //TODO: Export useEvtFromElement to evt
        {
            const [passwordInput, setPasswordInput] = useState<HTMLInputElement | null>(
                null,
            );

            useEffect(() => {
                setPasswordInput(passwordInputRef.current);
            }, [passwordInputRef.current ?? {}]);

            useEvt(
                ctx => {
                    if (passwordInput === null) {
                        return;
                    }

                    switch (getBrowser()) {
                        case "chrome":
                        case "safari":
                            Evt.from(ctx, passwordInput, "change").attach(
                                () =>
                                    usernameInputRef.current?.matches(
                                        ":-webkit-autofill",
                                    ) ?? false,
                                () => {
                                    switch (getBrowser()) {
                                        case "chrome":
                                            //NOTE: Only works after user input
                                            submitButtonRef.current?.focus();
                                            break;
                                        case "safari":
                                            setTimeout(
                                                () => submitButtonRef.current?.focus(),
                                                100,
                                            );
                                            break;
                                    }
                                },
                            );
                            break;
                    }
                },
                [passwordInput],
            );
        }

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

        const { classes } = useStyles();

        const getUsernameIsValidValue = useConstCallback<
            TextFieldProps["getIsValidValue"]
        >(value => {
            if (value.includes(" ")) {
                return {
                    "isValidValue": false,
                    "message": "Can't contain spaces",
                };
            }

            return { "isValidValue": true };
        });

        const getPasswordIsValidValue = useConstCallback<
            TextFieldProps["getIsValidValue"]
        >(value => {
            if (value.includes(" ")) {
                return {
                    "isValidValue": false,
                    "message": "Can't contain spaces",
                };
            }

            return { "isValidValue": true };
        });

        const { t } = useTranslation({ Login });

        return (
            <Template
                {...{ kcContext, ...props }}
                onClickCross={window.history.back.bind(window.history)}
                doFetchDefaultThemeResources={false}
                displayInfo={social.displayInfo}
                displayWide={realm.password && social.providers !== undefined}
                headerNode={msg("doLogIn")}
                formNode={
                    <div className={classes.root}>
                        {realm.password && social.providers !== undefined && (
                            <>
                                <div>
                                    <ul className={classes.providers}>
                                        {social.providers.map(p => (
                                            <li key={p.providerId}>
                                                {p.displayName
                                                    .toLocaleLowerCase()
                                                    .replace(/ /g, "")
                                                    .includes("agentconnect") ? (
                                                    <AgentConnectButton
                                                        url={p.loginUrl}
                                                    />
                                                ) : (
                                                    <Button href={p.loginUrl}>
                                                        {p.displayName}
                                                    </Button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <LoginDivider className={classes.divider} />
                            </>
                        )}
                        <div>
                            {realm.password && (
                                <form
                                    onSubmit={onSubmit}
                                    action={url.loginAction}
                                    method="post"
                                >
                                    <div>
                                        {(() => {
                                            const label = !realm.loginWithEmailAllowed
                                                ? ("username" as const)
                                                : realm.registrationEmailAsUsername
                                                ? ("email" as const)
                                                : ("usernameOrEmail" as const);

                                            const autoCompleteHelper: typeof label =
                                                label === "usernameOrEmail"
                                                    ? "username"
                                                    : label;

                                            return (
                                                <TextField
                                                    disabled={
                                                        usernameEditDisabled ||
                                                        areTextInputsDisabled
                                                    }
                                                    defaultValue={login.username ?? ""}
                                                    id={autoCompleteHelper}
                                                    //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                    //the browser how to pre fill the form but before submit we put it back
                                                    //to username because it is what keycloak expects.
                                                    name={autoCompleteHelper}
                                                    inputProps_ref={usernameInputRef}
                                                    inputProps_aria-label={label}
                                                    inputProps_tabIndex={1}
                                                    inputProps_autoFocus={
                                                        !areTextInputsDisabled
                                                    }
                                                    inputProps_spellCheck={false}
                                                    label={msg(label)}
                                                    autoComplete="off"
                                                    getIsValidValue={
                                                        getUsernameIsValidValue
                                                    }
                                                />
                                            );
                                        })()}
                                    </div>
                                    <div>
                                        <TextField
                                            disabled={areTextInputsDisabled}
                                            type="password"
                                            defaultValue={""}
                                            id="password"
                                            name="password"
                                            inputProps_ref={passwordInputRef}
                                            inputProps_aria-label={"password"}
                                            inputProps_tabIndex={2}
                                            label={msg("password")}
                                            autoComplete="off"
                                            getIsValidValue={getPasswordIsValidValue}
                                        />
                                    </div>
                                    <div
                                        className={
                                            classes.rememberMeForgotPasswordWrapper
                                        }
                                    >
                                        <div>
                                            {realm.rememberMe && !usernameEditDisabled && (
                                                <div className="checkbox">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                tabIndex={3}
                                                                defaultChecked={
                                                                    !!login.rememberMe
                                                                }
                                                                name="rememberMe"
                                                                color="primary"
                                                            />
                                                        }
                                                        label={
                                                            <Text typo="body 2">
                                                                {msg("rememberMe")!}
                                                            </Text>
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className={classes.forgotPassword}>
                                            {realm.resetPasswordAllowed && (
                                                <Link
                                                    href={url.loginResetCredentialsUrl}
                                                    underline="hover"
                                                >
                                                    {msg("doForgotPassword")}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <div className={classes.buttonsWrapper}>
                                        <input
                                            type="hidden"
                                            name="credentialId"
                                            {...(auth?.selectedCredential !== undefined
                                                ? {
                                                      "value": auth.selectedCredential,
                                                  }
                                                : {})}
                                        />
                                        <Button
                                            ref={submitButtonRef}
                                            tabIndex={3}
                                            className={classes.buttonSubmit}
                                            name="login"
                                            type="submit"
                                            disabled={isLoginButtonDisabled}
                                        >
                                            {msgStr("doLogIn")}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                }
                infoNode={
                    realm.password &&
                    realm.registrationAllowed &&
                    !registrationDisabled && (
                        <div className={classes.linkToRegisterWrapper}>
                            <Text typo="body 2" color="secondary">
                                {msg("noAccount")!}
                            </Text>
                            <Link
                                href={url.registrationUrl}
                                className={classes.registerLink}
                                underline="hover"
                            >
                                {t("doRegister")}
                            </Link>
                        </div>
                    )
                }
            />
        );
    },
);

export declare namespace Login {
    export type I18nScheme = {
        "doRegister": undefined;
    };
}

const useStyles = makeStyles({ "name": { Login } })(theme => ({
    "root": {
        "& .MuiTextField-root": {
            "width": "100%",
            "marginTop": theme.spacing(5),
        },
    },
    "rememberMeForgotPasswordWrapper": {
        "display": "flex",
        "marginTop": theme.spacing(4),
    },
    "forgotPassword": {
        "flex": 1,
        "display": "flex",
        "justifyContent": "flex-end",
        "alignItems": "center",
    },
    "buttonsWrapper": {
        "marginTop": theme.spacing(4),
        "display": "flex",
        "justifyContent": "flex-end",
    },
    "buttonSubmit": {
        "marginLeft": theme.spacing(2),
    },
    "linkToRegisterWrapper": {
        "marginTop": theme.spacing(5),
        "textAlign": "center",
        "& > *": {
            "display": "inline-block",
        },
    },
    "registerLink": {
        "paddingLeft": theme.spacing(2),
    },
    "divider": {
        ...theme.spacing.topBottom("margin", 5),
    },
    "providers": {
        "listStyleType": "none",
        "padding": 0,
    },
}));
