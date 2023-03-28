import { useEffect, useState, useReducer } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { fr } from "@codegouvfr/react-dsfr";
import { useTranslation } from "ui/i18n";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useCoreFunctions, useCoreState } from "core";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { z } from "zod";
import { AutocompleteInput } from "ui/shared/AutocompleteInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import type { PageRoute } from "./route";

type Props = {
    className?: string;
    route: PageRoute;
};

export default function Account(props: Props) {
    const { className, route, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { userAuthentication } = useCoreFunctions();

    const { classes, cx } = useStyles();
    const { t } = useTranslation({ Account });
    const { t: tCommon } = useTranslation({ "App": null });

    useEffect(() => {
        triggerFetchAgencyNames();
    }, []);

    const { agencyNames, triggerFetchAgencyNames } = (function useClosure() {
        const [agencyNames, setAgencyNames] = useState<string[]>([]);
        const [isTriggered, triggerFetchAgencyNames] = useReducer(() => true, false);

        useEffect(() => {
            if (!isTriggered) {
                return;
            }

            let isCleanedUp = false;

            userAuthentication.getAgencyNames().then(agencyNames => {
                if (isCleanedUp) {
                    return;
                }

                //NOTE: Just so that we do not have infinite loading for the first user
                if (agencyNames.length === 0) {
                    agencyNames = [""];
                }

                setAgencyNames(agencyNames);
            });

            return () => {
                isCleanedUp = true;
            };
        }, [isTriggered]);

        return { agencyNames, triggerFetchAgencyNames };
    })();

    const { allowedEmailRegexp } = (function useClosure() {
        const [allowedEmailRegexp, setAllowedEmailRegexp] = useState<RegExp | undefined>(
            undefined
        );

        useEffect(() => {
            let isCleanedUp = false;

            userAuthentication.getAllowedEmailRegexp().then(allowedEmailRegexp => {
                if (isCleanedUp) {
                    return;
                }

                setAllowedEmailRegexp(allowedEmailRegexp);
            });

            return () => {
                isCleanedUp = true;
            };
        }, []);

        return { allowedEmailRegexp };
    })();

    const { value: agencyName, isBeingUpdated: isAgencyNameBeingUpdated } = useCoreState(
        state => state.userAuthentication.agencyName
    );

    const { value: email, isBeingUpdated: isEmailBeingUpdated } = useCoreState(
        state => state.userAuthentication.email
    );

    const [tempEmail, setTempEmail] = useState<string>(email);
    const [tempAgencyName, setTempAgencyName] = useState<string>(agencyName);

    const keycloakAccountConfigurationUrl =
        userAuthentication.getKeycloakAccountConfigurationUrl();

    const onRequestUpdateFieldFactory = (
        fieldName: "agencyName" | "email",
        value: string
    ) => userAuthentication.updateField({ fieldName, value });

    const isValidEmail = (value: string) => {
        assert(allowedEmailRegexp !== undefined);

        try {
            z.string().email().parse(value);
        } catch {
            return {
                "isValidValue": false,
                "message": "invalid email"
            };
        }

        if (!allowedEmailRegexp.test(value)) {
            return {
                "isValidValue": false,
                "message": "Your email domain isn't allowed yet"
            };
        }

        return { "isValidValue": true };
    };

    if (allowedEmailRegexp === undefined) {
        return null;
    }

    return (
        <div className={cx(fr.cx("fr-container"), classes.root, className)}>
            <h2 className={classes.title}>{t("title")}</h2>
            <div className={classes.emailContainer}>
                <Input
                    label={t("mail")}
                    nativeInputProps={{
                        "onChange": event => setTempEmail(event.target.value),
                        "value": tempEmail
                    }}
                    state={isValidEmail(tempEmail).isValidValue ? undefined : "error"}
                    stateRelatedMessage={isValidEmail(tempEmail).message}
                    disabled={isEmailBeingUpdated}
                />
                <Button
                    onClick={() => {
                        onRequestUpdateFieldFactory("email", tempEmail);
                        setTempEmail(email);
                    }}
                >
                    {tCommon("validate")}
                </Button>
            </div>
            <div>
                <AutocompleteInput
                    className={"fr-input-group"}
                    options={agencyNames}
                    value={agencyName}
                    onValueChange={value => setTempAgencyName(value ?? "")}
                    getOptionLabel={entry => entry}
                    renderOption={(liProps, entry) => (
                        <li {...liProps}>
                            <span>{entry}</span>
                        </li>
                    )}
                    noOptionText="No result"
                    dsfrInputProps={{
                        "label": t("organization"),
                        "disabled": isAgencyNameBeingUpdated
                    }}
                />
                <Button
                    onClick={() => {
                        onRequestUpdateFieldFactory("agencyName", tempAgencyName);
                        setTempAgencyName(agencyName);
                    }}
                >
                    {tCommon("validate")}
                </Button>
            </div>
            {keycloakAccountConfigurationUrl !== undefined && (
                <a
                    href={keycloakAccountConfigurationUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    {t("update data")}
                </a>
            )}
        </div>
    );
}

const useStyles = makeStyles({
    "name": { Account }
})(_theme => ({
    "root": {
        "paddingTop": fr.spacing("6v")
    },
    "title": {
        "marginBottom": fr.spacing("10v"),
        [fr.breakpoints.down("md")]: {
            "marginBottom": fr.spacing("8v")
        }
    },
    "emailContainer": {
        marginBottom: fr.spacing("6v")
    }
}));

export const { i18n } = declareComponentKeys<
    "title" | "mail" | "organization" | "update data" | "no organization"
>()({ Account });
