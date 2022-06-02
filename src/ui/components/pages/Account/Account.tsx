import { Tabs } from "onyxia-ui/Tabs";
import { AccountInfoTab } from "./tabs/AccountInfoTab";
import { useMemo } from "react";
import { createGroup } from "type-route";
import { routes } from "ui/routes";
import { accountTabIds } from "./accountTabIds";
import type { AccountTabId } from "./accountTabIds";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { AccountUserInterfaceTab } from "./tabs/AccountUserInterfaceTab";
import { PageHeader } from "ui/theme";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { Route } from "type-route";
import { makeStyles } from "ui/theme";

Account.routeGroup = createGroup([routes.account]);

type PageRoute = Route<typeof Account.routeGroup>;

Account.getDoRequireUserLoggedIn = () => true;

export type Props = {
    route: PageRoute;
    className?: string;
};

export function Account(props: Props) {
    const { className, route } = props;

    const { t } = useTranslation({ Account });

    const tabs = useMemo(() => accountTabIds.map(id => ({ id, "title": t(id) })), [t]);

    const onRequestChangeActiveTab = useConstCallback((tabId: AccountTabId) =>
        routes.account({ tabId }).push(),
    );

    const { classes, cx } = useStyles();

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                mainIcon="account"
                title={t("text1")}
                helpTitle={t("text2")}
                helpContent={t("text3")}
                helpIcon="sentimentSatisfied"
            />
            <Tabs
                className={classes.tabs}
                classes={{ "tabsWrapper": classes.tabsWrapper }}
                size="big"
                tabs={tabs}
                activeTabId={route.params.tabId}
                maxTabCount={5}
                onRequestChangeActiveTab={onRequestChangeActiveTab}
            >
                {(() => {
                    switch (route.params.tabId) {
                        case "infos":
                            return <AccountInfoTab />;
                        case "user-interface":
                            return <AccountUserInterfaceTab />;
                    }
                })()}
            </Tabs>
        </div>
    );
}

export const { i18n } = declareComponentKeys<
    "text1" | "text2" | "text3" | "personal tokens tooltip" | AccountTabId
>()({ Account });

const useStyles = makeStyles({ "name": { Account } })(theme => ({
    "root": {
        "height": "100%",
        "overflow": "auto",
    },
    "tabs": {
        "borderRadius": 8,
        "overflow": "hidden",
        "boxShadow": theme.shadows[1],
    },
    //TODO: See if we can't adapt tab to work without it. Understand why it works with Onyxia and not here
    "tabsWrapper": {
        "width": "unset",
    },
}));
