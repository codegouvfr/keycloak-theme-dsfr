import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { fr } from "@codegouvfr/react-dsfr";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("pageExpiredTitle")}
        >
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                <div className={fr.cx("fr-col-12")}>
                    <div className={fr.cx("fr-callout")}>
                        <p className={fr.cx("fr-callout__text")}>{msg("pageExpiredMsg1")}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <a className={fr.cx("fr-btn", "fr-btn--secondary", "fr-btn--icon-right", "fr-icon-refresh-line")} href={url.loginRestartFlowUrl}>
                                {msg("doClickHere")}
                            </a>
                        </div>
                    </div>
                </div>

                <div className={fr.cx("fr-col-12")}>
                    <div className={fr.cx("fr-callout")}>
                        <p className={fr.cx("fr-callout__text")}>{msg("pageExpiredMsg2")}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <a className={fr.cx("fr-btn", "fr-btn--icon-right", "fr-icon-arrow-right-line")} href={url.loginAction}>
                                {msg("doClickHere")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Template>
    );
}
