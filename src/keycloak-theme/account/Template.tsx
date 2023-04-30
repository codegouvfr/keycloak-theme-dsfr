// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { clsx } from "keycloakify/tools/clsx";
import { usePrepareTemplate } from "keycloakify/lib/usePrepareTemplate";
import { type TemplateProps } from "keycloakify/account/TemplateProps";
import { useGetClassName } from "keycloakify/account/lib/useGetClassName";
import type { KcContext } from "./kcContext";
import type { I18n } from "./i18n";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem, Display } from "@codegouvfr/react-dsfr/Display";
import { fr } from "@codegouvfr/react-dsfr";
import { MuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, children } = props;

    const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

    const { msg } = i18n;

    const { url, message, referrer } = kcContext;

    const { isReady } = usePrepareTemplate({
        "doFetchDefaultThemeResources": doUseDefaultCss,
        url,
        "stylesCommon": [
            "node_modules/patternfly/dist/css/patternfly.min.css",
            "node_modules/patternfly/dist/css/patternfly-additions.min.css"
        ],
        "styles": ["css/account.css"],
        "htmlClassName": undefined,
        "bodyClassName": clsx("admin-console", "user", getClassName("kcBodyClass"))
    });

    if (!isReady) {
        return null;
    }

    const homeLinkProps = {
        "href": referrer?.url,
        "title": "Go back to the website"
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Header
                brandTop={brandTop}
                homeLinkProps={homeLinkProps}
                quickAccessItems={[
                    {
                        "iconId": "fr-icon-lock-line",
                        "linkProps": {
                            "href": url.getLogoutUrl()
                        },
                        "text": msg("doSignOut")
                    }
                ]}
                serviceTitle={serviceTitle}
            />
            <div
                className={fr.cx("fr-container")}
                style={{
                    "maxWidth": 600,
                    "flex": 1,
                    ...fr.spacing("padding", {
                        "topBottom": "10v"
                    })
                }}
            >
                <MuiDsfrThemeProvider>
                    {message !== undefined && (
                        <Alert
                            style={{
                                "marginBottom": fr.spacing("6v")
                            }}
                            small
                            severity={message.type}
                            description={message.summary}
                        />
                    )}
                    {children}
                </MuiDsfrThemeProvider>
            </div>

            <Footer
                brandTop={brandTop}
                homeLinkProps={homeLinkProps}
                accessibility="fully compliant"
                bottomItems={[headerFooterDisplayItem]}
            />
            <Display />
        </div>
    );
}

const brandTop = (
    /* cSpell:disable */
    <>
        République <br /> Française
    </>
    /* cSpell:enable */
);

const serviceTitle = "Socle interministériel de logiciels libres";
