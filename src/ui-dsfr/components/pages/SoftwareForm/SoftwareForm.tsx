import React, { useEffect } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { SoftwareFormStep1 } from "./Step1";
import { SoftwareFormStep2 } from "./Step2";
import { SoftwareFormStep3 } from "./Step3";
import { SoftwareFormStep4 } from "./Step4";
import { makeStyles } from "tss-react/dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { useCoreFunctions, useCoreState, useCoreEvts, selectors } from "core-dsfr";
import { useEvt } from "evt/hooks";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { useTranslation } from "../../../i18n";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

SoftwareForm.routeGroup = createGroup([
    routes.softwareCreationForm,
    routes.softwareUpdateForm
]);

type PageRoute = Route<typeof SoftwareForm.routeGroup>;

SoftwareForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: PageRoute;
};

const STEP_COUNT = 4;

export function SoftwareForm(props: Props) {
    const { className, route, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { step } = useCoreState(selectors.softwareForm.step);
    const { formData } = useCoreState(selectors.softwareForm.formData);
    const { isSubmitting } = useCoreState(selectors.softwareForm.isSubmitting);
    const { isLastStep } = useCoreState(selectors.softwareForm.isLastStep);
    const { evtSoftwareForm } = useCoreEvts();

    const { softwareForm } = useCoreFunctions();

    useEffect(() => {
        softwareForm.initialize({
            "softwareName":
                route.name === "softwareUpdateForm" ? route.params.name : undefined
        });
    }, [route.name]);

    useEvt(
        ctx =>
            evtSoftwareForm.attach(
                action => action.action === "redirect",
                ctx,
                ({ softwareName }) =>
                    routes.softwareDetails({ "name": softwareName }).push()
            ),
        []
    );

    const { cx, classes } = useStyles({ step });
    const { t } = useTranslation({ SoftwareForm });
    const commoni18n = useTranslation({ "App": "App" });

    const evtActionSubmitStep = useConst(() => Evt.create());

    if (formData === undefined) {
        return <CircularProgress />;
    }

    return (
        <div className={className}>
            <div className={fr.cx("fr-container")}>
                <Breadcrumb
                    segments={[
                        {
                            "linkProps": {
                                "href": routes.addSoftwareLanding().link.href
                            },
                            "label": commoni18n.t("add software or service")
                        }
                    ]}
                    currentPageLabel={commoni18n.t("add software")}
                    className={classes.breadcrumb}
                />
                <div className={classes.headerDeclareUserOrReferent}>
                    <a
                        href={routes.addSoftwareLanding().link.href}
                        className={classes.backButton}
                    >
                        <i className={fr.cx("fr-icon-arrow-left-s-line")} />
                    </a>
                    <h4 className={classes.title}>
                        {(() => {
                            switch (route.name) {
                                case "softwareCreationForm":
                                    return commoni18n.t("add software");
                                case "softwareUpdateForm":
                                    return t("title software update form");
                            }
                        })()}
                    </h4>
                </div>
                <Stepper
                    currentStep={step ?? 1}
                    stepCount={STEP_COUNT}
                    title={t("stepper title", { "currentStepIndex": step ?? 1 })}
                    className={classes.stepper}
                />
                <SoftwareFormStep1
                    className={classes.step1}
                    initialFormData={formData.step1}
                    onSubmit={formData =>
                        softwareForm.setStep1Data({
                            "formDataStep1": formData
                        })
                    }
                    evtActionSubmit={evtActionSubmitStep.pipe(() => step === 1)}
                />
                <SoftwareFormStep2
                    className={classes.step2}
                    isUpdateForm={route.name === "softwareUpdateForm"}
                    initialFormData={formData.step2}
                    onSubmit={formData =>
                        softwareForm.setStep2Data({
                            "formDataStep2": formData
                        })
                    }
                    getAutofillDataFromWikidata={softwareForm.getAutofillData}
                    getWikidataOptions={softwareForm.getWikidataOptions}
                    evtActionSubmit={evtActionSubmitStep.pipe(() => step === 2)}
                />
                <SoftwareFormStep3
                    className={classes.step3}
                    initialFormData={formData.step3}
                    onSubmit={formData =>
                        softwareForm.setStep3Data({
                            "formDataStep3": formData
                        })
                    }
                    isCloudNativeSoftware={formData.step1?.softwareType === "cloud"}
                    evtActionSubmit={evtActionSubmitStep.pipe(() => step === 3)}
                />
                <SoftwareFormStep4
                    className={classes.step4}
                    initialFormData={formData.step4}
                    evtActionSubmit={evtActionSubmitStep.pipe(() => step === 4)}
                    onSubmit={formData =>
                        softwareForm.setStep4DataAndSubmit({
                            "formDataStep4": formData
                        })
                    }
                    getWikidataOptions={softwareForm.getWikidataOptions}
                />
            </div>
            <div className={classes.footer}>
                <div className={cx(fr.cx("fr-container"), classes.footerContainer)}>
                    <Button
                        onClick={() => softwareForm.returnToPreviousStep()}
                        priority="secondary"
                        className={classes.softwareDetails}
                        disabled={step === 1}
                    >
                        {commoni18n.t("previous")}
                    </Button>
                    <Button
                        onClick={() => evtActionSubmitStep.post()}
                        priority="primary"
                        disabled={isSubmitting}
                    >
                        {isLastStep ? (
                            isSubmitting ? (
                                <>
                                    {t("submit")}
                                    <CircularProgress
                                        className={classes.progressSubmit}
                                    />
                                </>
                            ) : (
                                t("submit")
                            )
                        ) : (
                            commoni18n.t("next")
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles<{ step: number | undefined }>({
    "name": { SoftwareForm }
})((theme, { step }) => ({
    "step1": {
        "display": step !== 1 ? "none" : undefined
    },
    "step2": {
        "display": step !== 2 ? "none" : undefined
    },
    "step3": {
        "display": step !== 3 ? "none" : undefined
    },
    "step4": {
        "display": step !== 4 ? "none" : undefined
    },
    "breadcrumb": {
        "marginBottom": fr.spacing("4v")
    },
    "headerDeclareUserOrReferent": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("10v")
    },
    "backButton": {
        "background": "none",
        "marginRight": fr.spacing("4v"),

        "&>i": {
            "&::before": {
                "--icon-size": fr.spacing("8v")
            }
        }
    },
    "title": {
        "marginBottom": fr.spacing("1v")
    },
    "stepper": {
        "flex": "1"
    },
    "footer": {
        "position": "sticky",
        "bottom": "0",
        "marginTop": fr.spacing("6v"),
        "boxShadow": `0 -5px 5px -5px ${theme.decisions.background.overlap.grey.active}`,
        ...fr.spacing("padding", {
            "top": "4v",
            "bottom": "6v"
        }),
        "background": theme.decisions.background.default.grey.default
    },
    "footerContainer": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end"
    },
    "softwareDetails": {
        "marginRight": fr.spacing("4v"),
        "&&::before": {
            "--icon-size": fr.spacing("6v")
        }
    },
    "progressSubmit": {
        "marginLeft": fr.spacing("4v")
    }
}));

export const { i18n } = declareComponentKeys<
    | "title software update form"
    | { K: "stepper title"; P: { currentStepIndex: number } }
    | "submit"
>()({ SoftwareForm });
