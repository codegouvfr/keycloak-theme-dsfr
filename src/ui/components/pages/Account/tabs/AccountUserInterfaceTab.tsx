import { memo } from "react";
import { useTranslation } from "ui/i18n/useTranslations";
import { AccountSectionHeader } from "../AccountSectionHeader";
import { AccountField } from "../AccountField";
import { useIsDarkModeEnabled } from "onyxia-ui";
import { useConstCallback } from "powerhooks/useConstCallback";

export type Props = {
    className?: string;
};

export const AccountUserInterfaceTab = memo((props: Props) => {
    const { className } = props;

    const { t } = useTranslation({ AccountUserInterfaceTab });

    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const onRequestToggleIsDarkModeEnabled = useConstCallback(() =>
        setIsDarkModeEnabled(!isDarkModeEnabled),
    );

    return (
        <div className={className}>
            <AccountSectionHeader title={t("title")} />
            <AccountField
                type="toggle"
                title={t("enable dark mode")}
                helperText={t("dark mode helper")}
                isLocked={false}
                isOn={isDarkModeEnabled}
                onRequestToggle={onRequestToggleIsDarkModeEnabled}
            />
            <AccountField type="language" />
        </div>
    );
});

export declare namespace AccountUserInterfaceTab {
    export type I18nScheme = {
        "title": undefined;
        "enable dark mode": undefined;
        "dark mode helper": undefined;
    };
}
