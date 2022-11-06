import { memo, useState, useEffect, useReducer } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { AccountSectionHeader } from "../AccountSectionHeader";
import { DescriptiveField } from "../../../shared/DescriptiveField";
import type { Props as DescriptiveFieldProps } from "../../../shared/DescriptiveField";
import Link from "@mui/material/Link";
import { makeStyles } from "ui/theme";
import { useCoreFunctions, useCoreState } from "core";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useEmailDomainNotAllowedErrorMessage } from "ui/components/KcApp/RegisterUserProfile";
import { assert } from "tsafe/assert";
import { z } from "zod";

export type Props = {
    className?: string;
};

export const AccountInfoTab = memo((props: Props) => {
    const { className } = props;

    const { t } = useTranslation({ AccountInfoTab });

    const { userAuthentication } = useCoreFunctions();

    const { allowedEmailRegexp } = (function useClosure() {
        const [allowedEmailRegexp, setAllowedEmailRegexp] = useState<RegExp | undefined>(
            undefined,
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

    const { agencyNames, triggerFetchAgencyNames } = (function useClosure() {
        const [agencyNames, setAgencyNames] = useState<string[] | undefined>(undefined);

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

    const { value: agencyName, isBeingUpdated: isAgencyNameBeingUpdated } = useCoreState(
        state => state.userAuthentication.agencyName,
    );
    const { value: email, isBeingUpdated: isEmailBeingUpdated } = useCoreState(
        state => state.userAuthentication.email,
    );

    const keycloakAccountConfigurationUrl =
        userAuthentication.getKeycloakAccountConfigurationUrl();

    const { classes } = useStyles();

    const onRequestUpdateFieldFactory = useCallbackFactory(
        ([fieldName]: ["agencyName" | "email"], [value]: [string]) =>
            userAuthentication.updateField({ fieldName, value }),
    );

    const emailDomainNotAllowedErrorMessage = useEmailDomainNotAllowedErrorMessage();

    const getIsValidEmailValue = useConstCallback<
        DescriptiveFieldProps.EditableText["getIsValidValue"]
    >(value => {
        assert(allowedEmailRegexp !== undefined);

        try {
            z.string().email().parse(value);
        } catch {
            return {
                "isValidValue": false,
                "message": t("not a valid email"),
            };
        }

        if (!allowedEmailRegexp.test(value)) {
            return {
                "isValidValue": false,
                "message": emailDomainNotAllowedErrorMessage,
            };
        }

        return { "isValidValue": true };
    });

    if (allowedEmailRegexp === undefined) {
        return null;
    }

    return (
        <div className={className}>
            <AccountSectionHeader title={t("general information")} />
            <DescriptiveField
                type="editable text"
                title={t("email")}
                helperText={t("email helper")}
                text={email}
                onRequestEdit={onRequestUpdateFieldFactory("email")}
                isLocked={isEmailBeingUpdated}
                getIsValidValue={getIsValidEmailValue}
            />
            <DescriptiveField
                type="editable text"
                title={t("agency name")}
                helperText={t("agency name helper")}
                text={agencyName}
                onRequestEdit={onRequestUpdateFieldFactory("agencyName")}
                isLocked={isAgencyNameBeingUpdated}
                onStartEdit={triggerFetchAgencyNames}
                options={agencyNames ?? []}
            />
            {keycloakAccountConfigurationUrl !== undefined && (
                <Link
                    className={classes.link}
                    href={keycloakAccountConfigurationUrl}
                    target="_blank"
                    underline="hover"
                >
                    {t("change account info")}
                </Link>
            )}
        </div>
    );
});

export const { i18n } = declareComponentKeys<
    | "general information"
    | "user id"
    | "full name"
    | "email"
    | "email helper"
    | "change account info"
    | "agency name"
    | "agency name helper"
    | "not a valid email"
>()({ AccountInfoTab });

const useStyles = makeStyles({ "name": { AccountInfoTab } })(theme => ({
    "link": {
        "marginTop": theme.spacing(2),
        "display": "inline-block",
    },
}));
