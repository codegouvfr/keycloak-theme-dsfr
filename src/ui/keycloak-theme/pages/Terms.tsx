import { clsx } from "keycloakify/lib/tools/clsx";
import { useRerenderOnStateChange } from "evt/hooks";
import { Markdown } from "keycloakify/lib/tools/Markdown";
import { evtTermMarkdown, useDownloadTerms } from "keycloakify/lib/pages/Terms";
import tos_en_url from "../assets/tos_en.md";
import tos_fr_url from "../assets/tos_fr.md";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { makeStyles } from "tss-react/dsfr";
import App from "../../App";
import { fr } from "@codegouvfr/react-dsfr";

export default function Terms(
    props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>
) {
    const {
        kcContext,
        i18n,
        doFetchDefaultThemeResources = true,
        Template,
        ...kcProps
    } = props;

    const { msg, msgStr } = i18n;
    const { classes, cx } = useStyles();

    useDownloadTerms({
        kcContext,
        "downloadTermMarkdown": async ({ currentLanguageTag }) => {
            const markdownString = await fetch(
                (() => {
                    switch (currentLanguageTag) {
                        case "fr":
                            return tos_fr_url;
                        default:
                            return tos_en_url;
                    }
                })()
            ).then(response => response.text());

            return markdownString;
        }
    });

    useRerenderOnStateChange(evtTermMarkdown);

    const { url } = kcContext;

    if (evtTermMarkdown.state === undefined) {
        return null;
    }

    return (
        <Template
            {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
            displayMessage={false}
            headerNode={msg("termsTitle")}
            formNode={
                <>
                    <div id="kc-terms-text">
                        {evtTermMarkdown.state && (
                            <Markdown>{evtTermMarkdown.state}</Markdown>
                        )}
                    </div>
                    <form
                        className={cx("form-actions", classes.formActions)}
                        action={url.loginAction}
                        method="POST"
                    >
                        <input
                            className={clsx(
                                kcProps.kcButtonClass,
                                kcProps.kcButtonClass,
                                kcProps.kcButtonClass,
                                kcProps.kcButtonPrimaryClass,
                                kcProps.kcButtonLargeClass
                            )}
                            name="accept"
                            id="kc-accept"
                            type="submit"
                            value={msgStr("doAccept")}
                        />
                        <input
                            className={clsx(
                                kcProps.kcButtonClass,
                                kcProps.kcButtonDefaultClass,
                                kcProps.kcButtonLargeClass
                            )}
                            name="cancel"
                            id="kc-decline"
                            type="submit"
                            value={msgStr("doDecline")}
                        />
                    </form>
                    <div className="clearfix" />
                </>
            }
        />
    );
}

const useStyles = makeStyles({
    "name": { Terms }
})({
    "formActions": {
        "display": "flex",
        "gap": fr.spacing("4v")
    }
});
