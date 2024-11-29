import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Header as DsfrHeader } from "@codegouvfr/react-dsfr/Header";
import { getReferrerUrl } from "./shared/getReferrerUrl";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer as DSFRFooter } from "@codegouvfr/react-dsfr/Footer";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import "@codegouvfr/react-dsfr/main.css";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";

startReactDsfr({ defaultColorScheme: "system" });

type Props = TemplateProps<KcContext, I18n>;

export default function Template(props: Props) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header kcContext={kcContext} />
            <div
                style={{
                    flex: 1,
                    margin: "auto",
                    maxWidth: 1000,
                    ...fr.spacing("padding", { topBottom: "10v" })
                }}
            >
                <header className={kcClsx("kcFormHeaderClass")}>
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <h1 id="kc-page-title">{headerNode}</h1>
                        ) : (
                            <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                    <div className="kc-login-tooltip">
                                        <i className={kcClsx("kcResetFlowIcon")}></i>
                                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                    </div>
                                </a>
                            </div>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                        <span className="subtitle">
                                            <span className="required">*</span>
                                            {msg("requiredFields")}
                                        </span>
                                    </div>
                                    <div className="col-md-10">{node}</div>
                                </div>
                            );
                        }

                        return node;
                    })()}
                </header>
                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert
                                className={fr.cx("fr-mb-4w")}
                                severity={message.type}
                                small
                                description={
                                    <span
                                        className={kcClsx("kcAlertTitleClass")}
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(message.summary)
                                        }}
                                    />
                                }
                            />
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                    {infoNode}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DSFRFooter accessibility="fully compliant" bottomItems={[headerFooterDisplayItem]} />
        </div>
    );
}

export function Header({ kcContext }: { kcContext: Props["kcContext"] }) {
    return (
        <DsfrHeader
            brandTop={
                <div
                    dangerouslySetInnerHTML={{
                        __html: kcContext.properties.DSFR_THEME_BRAND_TOP
                    }}
                />
            }
            homeLinkProps={{
                href: getReferrerUrl(),
                title: kcContext.realm.displayName
            }}
            quickAccessItems={[headerFooterDisplayItem]}
            serviceTitle={
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcContext.properties.DSFR_THEME_SERVICE_TITLE || kcContext.realm.displayNameHtml || kcContext.realm.displayName || ""
                    }}
                />
            }
        />
    );
}
