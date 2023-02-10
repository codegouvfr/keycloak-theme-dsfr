import React, { useState } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import type { Link } from "type-route";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { DetailUsersAndReferents } from "./DetailUsersAndReferents";

export type Instance = {
    name: string;
    description: string;
    instanceLink: Link;
};

export type Organization = {
    name: string;
    maintainedInstances: Instance[];
};

export type Props = {
    className?: string;
    organizationList?: any[];
    instanceCount?: number;
};

export const ReferencedInstancesTab = (props: Props) => {
    const { className, organizationList, instanceCount, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ ReferencedInstancesTab });
    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(false);

    const instanceCard = (instance: Instance) => {
        const { name, description } = instance;
        return (
            <div className={cx(fr.cx("fr-card"), classes.card)}>
                <h6 className={cx(classes.name)}>{name}</h6>
                <p className={cx(fr.cx("fr-text--xs"), classes.concernedPublic)}>
                    {t("concerned public")}
                </p>
                <p className={cx(fr.cx("fr-text--sm"), classes.description)}>
                    {description}
                </p>
                <div className={classes.footer}>
                    <Button onClick={() => {}} priority="secondary">
                        {t("go to instance")}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={cx(classes.root, className)}>
                <p className={fr.cx("fr-text--bold")}>
                    {t("instanceCount", {
                        instanceCount: instanceCount ?? 0,
                        publicOrganisationCount: organizationList?.length ?? 0
                    })}
                </p>
                {organizationList?.map(organization => {
                    const { name, maintainedInstances } = organization;

                    return (
                        <Accordion
                            key={name}
                            label={`${name} (${maintainedInstances.length})`}
                            onExpandedChange={value => setExpanded(!value)}
                            expanded={expanded}
                        >
                            <div className={classes.accordionGrid}>
                                {maintainedInstances.map((instance: any) =>
                                    instanceCard(instance)
                                )}
                            </div>
                        </Accordion>
                    );
                })}
            </div>
        </>
    );
};

const useStyles = makeStyles({
    "name": { ReferencedInstancesTab }
})(theme => ({
    "root": {},
    "accordionGrid": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("7v"),
        "rowGap": fr.spacing("3v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    },
    "card": {
        "padding": fr.spacing("6v")
    },
    "name": {
        "marginBottom": fr.spacing("3v"),
        "color": theme.decisions.text.title.grey.default
    },
    "concernedPublic": {
        "color": theme.decisions.text.mention.grey.default,
        "marginBottom": fr.spacing("2v")
    },
    "description": {
        "marginBottom": fr.spacing("3v")
    },
    "detailUsersAndReferents": {
        "marginBottom": fr.spacing("8v")
    },
    "footer": {
        "display": "flex",
        "justifyContent": "flex-end"
    }
}));

export const { i18n } = declareComponentKeys<
    | {
          K: "instanceCount";
          P: { instanceCount: number; publicOrganisationCount: number };
      }
    | "concerned public"
    | "go to instance"
>()({ ReferencedInstancesTab });
