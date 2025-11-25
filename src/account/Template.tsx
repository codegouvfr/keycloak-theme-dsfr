import "@codegouvfr/react-dsfr/main.css";
import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/account/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/account/Template.useInitialize";
import type { TemplateProps } from "keycloakify/account/TemplateProps";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { Header as DsfrHeader } from "@codegouvfr/react-dsfr/Header";
import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import { SideMenu } from "@codegouvfr/react-dsfr/SideMenu";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { fr } from "@codegouvfr/react-dsfr";
import { getColorScheme } from "../shared/getColorScheme";
import { getNoticeSeverityOrDefault } from "../shared/noticeSeverity";

startReactDsfr({ defaultColorScheme: getColorScheme() ?? "system" });

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, active, classes, children } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { url, features, realm, message, referrer } = kcContext;

    useEffect(() => {
        document.title = msgStr("accountManagementTitle");
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: clsx("admin-console", "user", kcClsx("kcBodyClass"))
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <DsfrHeader
                brandTop={
                    <div
                        dangerouslySetInnerHTML={{
                            __html: kcContext.properties.DSFR_THEME_BRAND_TOP
                        }}
                    />
                }
                homeLinkProps={{
                    href: referrer?.url ?? "#",
                    title: "Accueil"
                }}
                serviceTitle={
                    <span
                        dangerouslySetInnerHTML={{
                            __html: kcContext.properties.DSFR_THEME_SERVICE_TITLE || ""
                        }}
                    />
                }
                serviceTagline={
                  <span
                      dangerouslySetInnerHTML={{
                        __html:
                            kcContext.properties.DSFR_THEME_SERVICE_TAG_LINE || ""
                      }}
                  />
                }
                quickAccessItems={[
                    ...(referrer?.url
                        ? [
                              <a key="back-to-link" href={referrer.url} id="referrer" className={fr.cx("fr-btn", "fr-btn--tertiary-no-outline")}>
                                  {msg("backTo", referrer.name)}
                              </a>
                          ]
                        : []),
                    <a key="logout-link" className={fr.cx("fr-btn", "fr-btn--tertiary-no-outline")} href={url.getLogoutUrl()}>
                        {msg("doSignOut")}
                    </a>
                ]}
            />

            {(kcContext.properties.DSFR_NOTICE_TITLE || kcContext.properties.DSFR_NOTICE_DESCRIPTION) && (
                <Notice
                    severity={getNoticeSeverityOrDefault(kcContext.properties.DSFR_NOTICE_SEVERITY)}
                    title={
                        <span
                            dangerouslySetInnerHTML={{
                                __html: kcContext.properties.DSFR_NOTICE_TITLE
                            }}
                        />
                    }
                    description={
                        <span
                            dangerouslySetInnerHTML={{
                                __html: kcContext.properties.DSFR_NOTICE_DESCRIPTION
                            }}
                        />
                    }
                />
            )}

            <div
                className={fr.cx("fr-container")}
                style={{
                    flex: 1,
                    margin: "auto",
                    maxWidth: 1000,
                    ...fr.spacing("padding", { topBottom: "10v" })
                }}
            >
                <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                    <div className={fr.cx("fr-col-12", "fr-col-md-3")}>
                        <SideMenu
                            align="left"
                            burgerMenuButtonText={"Menu"}
                            items={[
                                { text: msg("account"), linkProps: { href: url.accountUrl }, isActive: active === "account" },
                                // ...(features.passwordUpdateSupported
                                //     ? [{ text: msg("password"), linkProps: { href: url.passwordUrl }, isActive: active === "password" }]
                                //     : []),
                                { text: msg("authenticator"), linkProps: { href: url.totpUrl }, isActive: active === "totp" },
                                ...(features.identityFederation
                                    ? [{ text: msg("federatedIdentity"), linkProps: { href: url.socialUrl }, isActive: active === "social" }]
                                    : []),
                                { text: msg("sessions"), linkProps: { href: url.sessionsUrl }, isActive: active === "sessions" },
                                { text: msg("applications"), linkProps: { href: url.applicationsUrl }, isActive: active === "applications" },
                                ...(features.log ? [{ text: msg("log"), linkProps: { href: url.logUrl }, isActive: active === "log" }] : []),
                                ...(realm.userManagedAccessAllowed && features.authorization
                                    ? [{ text: msg("myResources"), linkProps: { href: url.resourceUrl }, isActive: active === "authorization" }]
                                    : [])
                            ]}
                        />
                    </div>

                    <div className={fr.cx("fr-col-12", "fr-col-md-9")}>
                        {message !== undefined && (
                            <Alert
                                className={fr.cx("fr-mb-4w")}
                                severity={message.type}
                                small
                                description={
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(message.summary)
                                        }}
                                    />
                                }
                            />
                        )}

                        {children}
                    </div>
                </div>
            </div>

            <DsfrFooter accessibility="fully compliant" bottomItems={[kcContext.darkMode ? headerFooterDisplayItem : undefined]} />
        </div>
    );
}
