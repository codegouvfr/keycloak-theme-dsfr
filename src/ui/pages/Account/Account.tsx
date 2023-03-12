import React, { useEffect, useState } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui/routes";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { useTranslation } from "ui/i18n";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import Display from "@codegouvfr/react-dsfr/Display";
import { useCoreFunctions } from "core";

Account.routeGroup = createGroup([routes.account]);
type PageRoute = Route<typeof Account.routeGroup>;
Account.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function Account(props: Props) {
    const { className, route, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { userAuthentication } = useCoreFunctions();
    const [agencyNames, setAgencyNames] = useState<string[]>([]);
    const [keycloakAccountConfigurationUrl, setKeycloakAccountConfigurationUrl] =
        useState();

    const { classes, cx } = useStyles();
    const { t } = useTranslation({ Account });

    useEffect(() => {
        userAuthentication.getAgencyNames().then(names => {
            setAgencyNames(names);
        });
    }, []);

    return (
        <div className={cx(fr.cx("fr-container"), classes.root, className)}>
            <h2 className={classes.title}>{t("title")}</h2>
            <p>
                {t("mail")} : <span>address@foo.bar</span>
            </p>
            <p>
                {t("organization")} :{" "}
                {agencyNames.length ? (
                    agencyNames.map(name => <span key={name}>{name}, </span>)
                ) : (
                    <span>{t("no organization")}</span>
                )}
            </p>
            {/*TODO: Add link when auth is available*/}
            <a href={keycloakAccountConfigurationUrl} target="_blank">
                {t("update data")}
            </a>
            <Display />
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
    }
}));

export const { i18n } = declareComponentKeys<
    "title" | "mail" | "organization" | "update data" | "no organization"
>()({ Account });
