import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { formatLabel, getStateForAccountField } from "../../utils";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template } = props;

    const classes = {
        ...props.classes,
        kcBodyClass: clsx(props.classes?.kcBodyClass, "user")
    };

    const { url, realm, messagesPerField, stateChecker, account, referrer } = kcContext;

    const { msg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">
            <h2 className={fr.cx("fr-h2")}>{msg("editAccountHtmlTitle")}</h2>

            <form action={url.accountUrl} className="form-horizontal" method="post">
                <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                {!realm.registrationEmailAsUsername && (
                    <Input
                        {...getStateForAccountField(messagesPerField, "username")}
                        label={formatLabel(msg("username"), realm.editUsernameAllowed)}
                        id="username"
                        disabled={!realm.editUsernameAllowed}
                        nativeInputProps={{
                            name: "username",
                            defaultValue: account.username ?? ""
                        }}
                    />
                )}

                <Input
                    {...getStateForAccountField(messagesPerField, "email")}
                    label={formatLabel(msg("email"), true)}
                    id="email"
                    nativeInputProps={{
                        name: "email",
                        autoFocus: true,
                        defaultValue: account.email ?? ""
                    }}
                />

                {/* TODO get all fields configured un keycloak */}

                {/* <div className={clsx("form-group", messagesPerField.printIfExists("firstName", "has-error"))}>
                    <div className="col-sm-2 col-md-2">
                        <label htmlFor="firstName" className="control-label">
                            {msg("firstName")}
                        </label>{" "}
                        <span className="required">*</span>
                    </div>

                    <div className="col-sm-10 col-md-10">
                        <input type="text" className="form-control" id="firstName" name="firstName" defaultValue={account.firstName ?? ""} />
                    </div>
                </div>

                <div className={clsx("form-group", messagesPerField.printIfExists("lastName", "has-error"))}>
                    <div className="col-sm-2 col-md-2">
                        <label htmlFor="lastName" className="control-label">
                            {msg("lastName")}
                        </label>{" "}
                        <span className="required">*</span>
                    </div>

                    <div className="col-sm-10 col-md-10">
                        <input type="text" className="form-control" id="lastName" name="lastName" defaultValue={account.lastName ?? ""} />
                    </div>
                </div> */}

                <div className="form-group">
                    {referrer !== undefined && (
                        <a className={fr.cx("fr-link", "fr-mr-2w")} href={referrer?.url}>
                            {msg("backToApplication")}
                        </a>
                    )}
                    <Button type="submit" value="Save">
                        {msg("doSave")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
