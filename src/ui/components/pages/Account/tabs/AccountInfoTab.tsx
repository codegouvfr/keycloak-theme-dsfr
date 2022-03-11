import { memo } from "react";
import { useTranslation } from "ui/i18n/useTranslations";
import { AccountSectionHeader } from "../AccountSectionHeader";
import { AccountField } from "../AccountField";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { copyToClipboard } from "ui/tools/copyToClipboard";
import Link from "@mui/material/Link";
import { makeStyles } from "ui/theme";
import { useThunks } from "ui/coreApi";

export type Props = {
    className?: string;
};

export const AccountInfoTab = memo((props: Props) => {
    const { className } = props;

    const { t } = useTranslation({ AccountInfoTab });

    const { userAuthenticationThunks } = useThunks();

    const onRequestCopyFactory = useCallbackFactory(([textToCopy]: [string]) =>
        copyToClipboard(textToCopy),
    );

    const user = userAuthenticationThunks.getUser();

    const fullName = `${user.firstName} ${user.familyName}`;

    const keycloakAccountConfigurationUrl =
        userAuthenticationThunks.getKeycloakAccountConfigurationUrl();

    const { classes } = useStyles();

    return (
        <div className={className}>
            <AccountSectionHeader title={t("general information")} />
            <AccountField
                type="text"
                title={t("user id")}
                text={user.username}
                onRequestCopy={onRequestCopyFactory(user.username)}
            />
            <AccountField
                type="text"
                title={t("full name")}
                text={fullName}
                onRequestCopy={onRequestCopyFactory(fullName)}
            />
            <AccountField
                type="text"
                title={t("email")}
                text={user.email}
                onRequestCopy={onRequestCopyFactory(user.email)}
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

export declare namespace AccountInfoTab {
    export type I18nScheme = {
        "general information": undefined;
        "user id": undefined;
        "full name": undefined;
        "email": undefined;
        "change account info": undefined;
    };
}

const useStyles = makeStyles({ "name": { AccountInfoTab } })(theme => ({
    "divider": {
        ...theme.spacing.topBottom("margin", 4),
    },
    "link": {
        "marginTop": theme.spacing(2),
        "display": "inline-block",
    },
}));
