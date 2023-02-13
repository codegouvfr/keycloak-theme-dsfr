import React from "react";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../../../i18n";
import { createGroup, Route } from "type-route";
import { routes } from "../../../routes";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";

AddSoftwareLanding.routeGroup = createGroup([routes.addSoftwareLanding]);

type PageRoute = Route<typeof AddSoftwareLanding.routeGroup>;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function AddSoftwareLanding(props: Props) {
    const { className, route, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();
    const { t } = useTranslation({ AddSoftwareLanding });

    const whoCanAddAccordionList = [
        {
            label: t("discover as agent label"),
            description: t("discover as agent description")
        },
        {
            label: t("discover as DSI label"),
            description: t("discover as DSI description")
        },
        {
            label: t("contribute as agent label"),
            description: t("contribute as agent description")
        },
        {
            label: t("contribute as DSI label"),
            description: t("contribute as DSI description")
        }
    ];

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.section}>
                <div className={cx(fr.cx("fr-container"), classes.titleContainer)}>
                    <h2 className={classes.title}>{t("title")}</h2>
                    <p className={fr.cx("fr-text--lg")}>{t("subtitle")}</p>
                </div>
            </div>
            <section className={cx(classes.whoCanAddBackground, classes.section)}>
                <div className={fr.cx("fr-container")}>
                    <div
                        className={cx(
                            classes.titleSection,
                            classes.whoCanAddHeaderContainer
                        )}
                    >
                        <h2 className={classes.whoCanAddTitle}>
                            {t("who can add software")}
                        </h2>
                        <div className={classes.whoCanAddButtonContainer}>
                            <Button priority="primary">{t("add software")}</Button>
                            <Button priority="secondary">{t("add instance")}</Button>
                        </div>
                    </div>

                    {whoCanAddAccordionList.map(accordion => (
                        <Accordion key={accordion.label} label={accordion.label}>
                            <p className={classes.accordionDescription}>
                                {accordion.description}
                            </p>
                        </Accordion>
                    ))}
                </div>
            </section>
        </div>
    );
}

const useStyles = makeStyles({ "name": { AddSoftwareLanding } })(theme => ({
    "root": {},
    "section": {
        ...fr.spacing("padding", {
            "topBottom": "30v"
        }),
        [fr.breakpoints.down("md")]: {
            ...fr.spacing("padding", {
                "topBottom": "20v"
            })
        }
    },
    "titleSection": {
        "marginBottom": fr.spacing("10v"),
        [fr.breakpoints.down("md")]: {
            "marginBottom": fr.spacing("8v")
        }
    },
    "titleContainer": {
        "marginBottom": fr.spacing("10v")
    },
    "title": {
        "&::first-line": {
            color: theme.decisions.text.title.blueFrance.default
        }
    },
    "whoCanAddBackground": {
        "backgroundColor": theme.decisions.background.alt.blueFrance.default
    },
    "whoCanAddHeaderContainer": {
        "display": "flex",
        "alignItems": "center",
        "gap": fr.spacing("2v"),
        [fr.breakpoints.down("md")]: {
            "gap": fr.spacing("8v"),
            "flexDirection": "column"
        }
    },
    "whoCanAddTitle": {
        "marginBottom": 0
    },
    "whoCanAddButtonContainer": {
        "display": "flex",
        "gap": fr.spacing("2v"),
        "whiteSpace": "nowrap",
        [fr.breakpoints.down("md")]: {
            "whiteSpace": "normal"
        }
    },
    "accordionDescription": {
        "marginBottom": 0
    }
}));

export const { i18n } = declareComponentKeys<
    | "title"
    | "subtitle"
    | "who can add software"
    | "add software"
    | "add instance"
    | "discover as agent label"
    | "discover as agent description"
    | "discover as DSI label"
    | "discover as DSI description"
    | "contribute as agent label"
    | "contribute as agent description"
    | "contribute as DSI label"
    | "contribute as DSI description"
>()({ AddSoftwareLanding });
