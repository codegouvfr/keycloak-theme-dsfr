import { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { AccountSectionHeader } from "../AccountSectionHeader";
import { DescriptiveField } from "../../../shared/DescriptiveField";
import type { Props as DescriptiveFieldProps } from "../../../shared/DescriptiveField";
import Link from "@mui/material/Link";
import { makeStyles } from "ui/theme";
import { useThunks, useSelector } from "ui/coreApi";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { z } from "zod";

export type Props = {
    className?: string;
};

export const AccountInfoTab = memo((props: Props) => {
    const { className } = props;

    const { t } = useTranslation({ AccountInfoTab });

    const { userAuthenticationThunks } = useThunks();

    const { value: agencyName, isBeingUpdated: isAgencyNameBeingUpdated } = useSelector(
        state => state.userAuthentication.agencyName,
    );
    const { value: email, isBeingUpdated: isEmailBeingUpdated } = useSelector(
        state => state.userAuthentication.email,
    );

    const keycloakAccountConfigurationUrl =
        userAuthenticationThunks.getKeycloakAccountConfigurationUrl();

    const { classes } = useStyles();

    const onRequestUpdateFieldFactory = useCallbackFactory(
        ([fieldName]: ["agencyName" | "email"], [value]: [string]) =>
            userAuthenticationThunks.updateField({ fieldName, value }),
    );

    const getIsValidEmailValue = useConstCallback<
        DescriptiveFieldProps.EditableText["getIsValidValue"]
    >(value => {
        try {
            z.string().email().parse(value);
        } catch {
            return {
                "isValidValue": false,
                "message": t("not a valid email"),
            };
        }

        return { "isValidValue": true };
    });

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
    "divider": {
        ...theme.spacing.topBottom("margin", 4),
    },
    "link": {
        "marginTop": theme.spacing(2),
        "display": "inline-block",
    },
}));
