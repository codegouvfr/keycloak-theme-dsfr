import React, { memo, useState } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Link } from "type-route";
import { DetailUsersAndReferents } from "../DetailUsersAndReferents";

import { useForm, useField } from "react-form";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { UserTypeStep } from "./UserTypeStep";
import { UserStep } from "./UserStep";
import { ReferentStep } from "./ReferentStep";

export type Props = {
    className?: string;
    softwareName: string;
    softwareLogoUrl?: string;
    seeUserAndReferent: Link;
    referentCount: number;
    userCount: number;
};

const STEP_COUNT = 2;

export const DeclareUserOrReferent = memo((props: Props) => {
    const {
        className,
        softwareName,
        softwareLogoUrl,
        userCount,
        referentCount,
        seeUserAndReferent,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ DeclareUserOrReferent });
    const { classes, cx } = useStyles();

    const [activeStep, setActiveStep] = useState(1);

    const title = (
        <legend className={fr.cx("fr-h6")} id="radio-hint-element-legend">
            Comment souhaitez-vous déclarer ?
        </legend>
    );

    const { Form, formContext } = useForm({
        debugForm: false,
    });

    /* TODO :
     *  - validation
     *  - responsive
     *  - Default Values
     *  - Dynamic title
     */

    const onBackStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setActiveStep(activeStep - 1);
    };

    const onNextStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setActiveStep(activeStep + 1);
    };

    const handleDisableBackButton = () => {
        switch (activeStep) {
            case 1:
                return true;
            default:
                return false;
        }
    };
    const handleDisableNextButton = () => {
        switch (activeStep) {
            case 1:
                return !formContext.values.type;
            default:
                return true;
        }
    };

    return (
        <div className={className}>
            <Breadcrumb
                links={[
                    {
                        linkProps: {
                            href: "/catalog",
                        },
                        text: t("catalog breadcrumb"),
                    },
                    {
                        linkProps: {
                            href: "/catalog/softwareName",
                        },
                        text: softwareName,
                    },
                    {
                        linkProps: {
                            href: "/catalog/softwareName/declareUser",
                        },
                        text: t("declare yourself user or referent breadcrumb"),
                        isActive: true,
                    },
                ]}
                className={classes.breadcrumb}
            />
            <div className={classes.headerDeclareUserOrReferent}>
                <a href={"/"} className={classes.backButton}>
                    <i className={fr.cx("fr-icon-arrow-left-s-line")} />
                </a>
                <h4 className={classes.title}>{t("title")}</h4>
            </div>
            <div className={classes.formContainer}>
                <div className={classes.leftCol}>
                    <div className={classes.softwareNameContainer}>
                        <img
                            className={cx(classes.logo)}
                            src={softwareLogoUrl}
                            alt="Logo du logiciel"
                        />
                        <h4 className={classes.softwareName}>{softwareName}</h4>
                    </div>
                    <DetailUsersAndReferents
                        className={cx(
                            fr.cx("fr-text--lg"),
                            classes.detailUserAndReferent,
                        )}
                        seeUserAndReferent={seeUserAndReferent}
                        referentCount={referentCount}
                        userCount={userCount}
                    />
                </div>

                <div className={cx("fr-form-group", classes.rightCol)}>
                    <Stepper
                        currentStep={activeStep}
                        stepCount={STEP_COUNT}
                        title={title}
                        className={classes.stepper}
                    />
                    <Form>
                        <fieldset className={fr.cx("fr-fieldset")}>
                            {activeStep === 1 && <UserTypeStep />}
                            {activeStep === 2 && formContext.values.type === "user" && (
                                <UserStep />
                            )}
                            {activeStep === 2 &&
                                formContext.values.type === "referent" && (
                                    <ReferentStep />
                                )}
                        </fieldset>
                        <div className={classes.buttons}>
                            <Button
                                onClick={onBackStep}
                                priority="secondary"
                                className={classes.back}
                                disabled={handleDisableBackButton()}
                            >
                                {t("back")}
                            </Button>
                            <Button
                                onClick={onNextStep}
                                priority="primary"
                                disabled={handleDisableNextButton()}
                            >
                                {activeStep === STEP_COUNT ? t("send") : t("next")}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { DeclareUserOrReferent },
})(theme => ({
    "breadcrumb": {
        "marginBottom": fr.spacing("4v"),
    },
    "headerDeclareUserOrReferent": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("10v"),
    },
    "backButton": {
        "background": "none",
        "marginRight": fr.spacing("4v"),

        "&>i": {
            "&::before": {
                "--icon-size": fr.spacing("8v"),
            },
        },
    },
    "title": {
        "marginBottom": fr.spacing("1v"),
    },
    "formContainer": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
    },
    "leftCol": {
        "marginLeft": fr.spacing("12v"),
        "paddingRight": fr.spacing("16v"),
        "borderRight": `1px ${theme.decisions.border.default.grey.default} solid`,
    },
    "softwareNameContainer": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("3v"),
    },
    "logo": {
        "width": "50px",
        "height": "50px",
        "marginRight": fr.spacing("2v"),
    },
    "softwareName": {
        "marginBottom": 0,
    },
    "detailUserAndReferent": {
        color: theme.decisions.text.actionHigh.blueFrance.default,
    },
    "rightCol": {
        "marginLeft": fr.spacing("6v"),
        "paddingLeft": fr.spacing("10v"),
    },
    "stepper": {
        "flex": "1",
    },
    "buttons": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end",
    },
    "back": {
        "marginRight": fr.spacing("4v"),
    },
    "formLine": {
        "marginBottom": fr.spacing("4v"),
    },
}));

export const { i18n } = declareComponentKeys<
    | "catalog breadcrumb"
    | "declare yourself user or referent breadcrumb"
    | "title"
    | "back"
    | "next"
    | "send"
>()({ DeclareUserOrReferent });
