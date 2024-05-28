import { useRerenderOnStateChange } from "evt/hooks";
import { Markdown } from "keycloakify/tools/Markdown";
import {
    evtTermMarkdown,
    useDownloadTerms
} from "keycloakify/login/lib/useDownloadTerms";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import {
    createResolveLocalizedString,
    type LocalizedString
} from "i18nifty/LocalizedString/reactless";

export default function Terms(
    props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes: classes_props } = props;

    const { msg, msgStr } = i18n;
    const { classes, cx } = useStyles();

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        "classes": classes_props
    });

    useDownloadTerms({
        kcContext,
        "downloadTermMarkdown": async ({ currentLanguageTag }) => {
            const markdownString = await fetch(
                (() => {
                    const tosUrl: LocalizedString<string> = (() => {
                        const { tosUrl } = kcContext.properties;

                        if (tosUrl === "") {
                            throw new Error("No URL to Terms of Service provided");
                        }

                        try {
                            return JSON.parse(tosUrl);
                        } catch {
                            return tosUrl;
                        }
                    })();

                    const { resolveLocalizedString } = createResolveLocalizedString({
                        "currentLanguage": currentLanguageTag,
                        "fallbackLanguage": "en"
                    });

                    return resolveLocalizedString(tosUrl);
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
            {...{ kcContext, i18n, doUseDefaultCss, "classes": classes_props }}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <div id="kc-terms-text">
                {evtTermMarkdown.state && <Markdown>{evtTermMarkdown.state}</Markdown>}
            </div>
            <form
                className={cx("form-actions", classes.formActions)}
                action={url.loginAction}
                method="POST"
            >
                <input
                    className={cx(
                        getClassName("kcButtonClass"),
                        getClassName("kcButtonClass"),
                        getClassName("kcButtonClass"),
                        getClassName("kcButtonPrimaryClass"),
                        getClassName("kcButtonLargeClass")
                    )}
                    name="accept"
                    id="kc-accept"
                    type="submit"
                    value={msgStr("doAccept")}
                />
                <input
                    className={cx(
                        getClassName("kcButtonClass"),
                        getClassName("kcButtonDefaultClass"),
                        getClassName("kcButtonLargeClass")
                    )}
                    name="cancel"
                    id="kc-decline"
                    type="submit"
                    value={msgStr("doDecline")}
                />
            </form>
            <div className="clearfix" />
        </Template>
    );
}

const useStyles = tss.withName({ Terms }).create({
    "formActions": {
        "display": "flex",
        "gap": fr.spacing("4v")
    }
});
