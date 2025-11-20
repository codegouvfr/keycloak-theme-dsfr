import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import LoginOtp from "./pages/LoginOtp";
import LoginConfigTOTP from "./pages/LoginConfigTotp";
const Template = lazy(() => import("./Template"));
const DefaultTemplate = lazy(() => import("keycloakify/login/Template"));
const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));
const DefaultUserProfileFormFields = lazy(() => import("./UserProfileFormFields"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LoginUpdateProfile = lazy(() => import("./pages/LoginUpdateProfile"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));

const Error = lazy(() => import("./pages/Error"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));


const doMakeUserConfirmPassword = false;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login-otp.ftl":
                        return (
                            <LoginOtp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-config-totp.ftl":
                        return (
                            <LoginConfigTOTP
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-update-profile.ftl":
                        return (
                            <LoginUpdateProfile
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "error.ftl":
                        return (
                            <Error
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                          );
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                          );
                    case "login-page-expired.ftl":
                        return (
                            <LoginPageExpired
                                 {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                          );
                    case "login-verify-email.ftl":
                        return (
                            <LoginVerifyEmail
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={DefaultTemplate}
                                doUseDefaultCss={true}
                                UserProfileFormFields={DefaultUserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
