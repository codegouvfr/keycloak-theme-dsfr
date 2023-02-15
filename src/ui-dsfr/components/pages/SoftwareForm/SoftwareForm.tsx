import { useEffect } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { SoftwareCreationFormStep1 } from "./Step1";
import { SoftwareCreationFormStep2 } from "./Step2";
import { SoftwareCreationFormStep3 } from "./Step3";
import { SoftwareCreationFormStep4 } from "./Step4";
import { makeStyles } from "tss-react/dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { useCoreFunctions, useCoreState, useCoreEvts, selectors } from "core-dsfr";
import { useEvt } from "evt/hooks";

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

export function SoftwareForm(props: Props) {
    const { className, route } = props;

    const { step } = useCoreState(selectors.softwareForm.step);
    const { formData } = useCoreState(selectors.softwareForm.formData);
    const { isSubmitting } = useCoreState(selectors.softwareForm.isSubmitting);
    const { isLastStep } = useCoreState(selectors.softwareForm.isLastStep);
    const { evtSoftwareForm } = useCoreEvts();

    const { softwareForm } = useCoreFunctions();

    useEffect(() => {
        console.log("initialize", route.params);

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
    const { classes } = useStyles({ step });

    const evtActionSubmitStep = useConst(() => Evt.create());

    if (formData === undefined) {
        return <CircularProgress />;
    }

    return (
        <div className={className}>
            <h1>
                {(() => {
                    switch (route.name) {
                        case "softwareCreationForm":
                            return "Ajouter un logiciel";
                        case "softwareUpdateForm":
                            return "Mettre a jour un logiciel";
                    }
                })()}
            </h1>
            {(() => {
                switch (step) {
                    case 1:
                        return (
                            <SoftwareCreationFormStep1
                                initialFormData={formData.step1}
                                onSubmit={formData =>
                                    softwareForm.setStep1Data({
                                        "formDataStep1": formData
                                    })
                                }
                                evtActionSubmit={evtActionSubmitStep}
                            />
                        );
                    case 2:
                        return (
                            <SoftwareCreationFormStep2
                                isUpdateForm={route.name === "softwareUpdateForm"}
                                initialFormData={formData.step2}
                                onSubmit={formData =>
                                    softwareForm.setStep2Data({
                                        "formDataStep2": formData
                                    })
                                }
                                getAutofillDataFromWikidata={softwareForm.getAutofillData}
                                getWikidataOptions={softwareForm.getWikidataOptions}
                                evtActionSubmit={evtActionSubmitStep}
                            />
                        );
                    case 3:
                        return (
                            <SoftwareCreationFormStep3
                                initialFormData={formData.step3}
                                onSubmit={formData =>
                                    softwareForm.setStep3Data({
                                        "formDataStep3": formData
                                    })
                                }
                                isCloudNativeSoftware={
                                    formData.step1?.softwareType === "cloud"
                                }
                                evtActionSubmit={evtActionSubmitStep}
                            />
                        );
                    case 4:
                        return (
                            <SoftwareCreationFormStep4
                                initialFormData={formData.step4}
                                evtActionSubmit={evtActionSubmitStep.pipe(
                                    () => step === 4
                                )}
                                onSubmit={formData =>
                                    softwareForm.setStep4DataAndSubmit({
                                        "formDataStep4": formData
                                    })
                                }
                                getWikidataOptions={softwareForm.getWikidataOptions}
                            />
                        );
                }
            })()}
            {isSubmitting ? (
                <div className={classes.submittingProgress}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {step !== 1 && (
                        <Button
                            style={{
                                ...fr.spacing("margin", {
                                    "top": "4v",
                                    "right": "4v"
                                })
                            }}
                            onClick={() => softwareForm.returnToPreviousStep()}
                        >
                            Prev
                        </Button>
                    )}
                    <Button
                        style={{ "marginTop": fr.spacing("4v") }}
                        onClick={() => evtActionSubmitStep.post()}
                    >
                        {isLastStep ? "Submit" : "Next"}
                    </Button>
                </>
            )}
        </div>
    );
}

const useStyles = makeStyles<{ step: number | undefined }>()({
    "submittingProgress": {
        "justifyContent": "center",
        "alignItems": "center"
    }
});
