import { useEffect, useState, useReducer, useTransition } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { SoftwareCreationFormStep1, type Step1Props } from "./Step1";
import { SoftwareCreationFormStep2, type Step2Props } from "./Step2";
import { SoftwareCreationFormStep3, type Step3Props } from "./Step3";
import { SoftwareCreationFormStep4, type Step4Props } from "./Step4";
import { core } from "./coreMock";
import { makeStyles } from "tss-react/dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { assert } from "tsafe/assert";

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

const submittingStep = 5;

export function SoftwareForm(props: Props) {
    const { className, route } = props;

    const [, startTransition] = useTransition();

    const [state, dispatch] = useReducer(
        (
            state: {
                step: number;
                formData: {
                    step1?: Step1Props.FormData;
                    step2?: Step2Props.FormData;
                    step3?: Step3Props.FormData;
                    step4?: Step4Props.FormData;
                };
                softwareSillId?: number;
            },
            action:
                | {
                      actionName: "initialize for update";
                      payload: {
                          formData: Required<typeof state>["formData"];
                          softwareSillId: number;
                      };
                  }
                | {
                      actionName: "submit step 1";
                      payload: Step1Props.FormData;
                  }
                | {
                      actionName: "submit step 2";
                      payload: Step2Props.FormData;
                  }
                | {
                      actionName: "submit step 3";
                      payload: Step3Props.FormData;
                  }
                | {
                      actionName: "submit step 4";
                      payload: Step4Props.FormData;
                  }
                | {
                      actionName: "previous";
                  }
        ): typeof state => ({
            "step":
                state.step +
                (() => {
                    switch (action.actionName) {
                        case "initialize for update":
                            return 0;
                        case "previous":
                            return -1;
                        default:
                            return 1;
                    }
                })(),
            "formData": (() => {
                switch (action.actionName) {
                    case "previous":
                        return state.formData;
                    case "initialize for update":
                        return action.payload.formData;
                    case "submit step 1":
                        return {
                            ...state.formData,
                            "step1": action.payload
                        };
                    case "submit step 2":
                        return {
                            ...state.formData,
                            "step2": action.payload
                        };
                    case "submit step 3":
                        return {
                            ...state.formData,
                            "step3": action.payload
                        };
                    case "submit step 4":
                        return {
                            ...state.formData,
                            "step4": action.payload
                        };
                }
            })(),
            "softwareSillId":
                action.actionName === "initialize for update"
                    ? action.payload.softwareSillId
                    : state.softwareSillId
        }),
        {
            "step": 1,
            "formData": {}
        }
    );

    useEffect(() => {
        startTransition(() =>
            routes[route.name]({
                ...route.params,
                "step": state.step
            }).push()
        );
    }, [state.step]);

    useEffect(() => {
        if (route.params.step !== submittingStep) {
            return;
        }

        let isActive = true;

        (async () => {
            const { step1, step2, step3, step4 } = state.formData;

            assert(step1 !== undefined);
            assert(step2 !== undefined);
            assert(step3 !== undefined);
            assert(step4 !== undefined);

            const formData = { step1, step2, step3, step4 };

            if (state.softwareSillId === undefined) {
                await core.createSoftware({ formData });
            } else {
                await core.updateSoftware({
                    "softwareSillId": state.softwareSillId,
                    formData
                });
            }

            if (!isActive) {
                return;
            }

            routes.softwareDetails({ "name": step2.softwareName }).push();
        })();

        return () => {
            isActive = false;
        };
    }, [route.params.step, state.softwareSillId]);

    const { isPrefillingForSoftwareUpdate } = (() => {
        const softwareName =
            route.name === "softwareUpdateForm" ? route.params.name : undefined;

        const [isPrefillingForSoftwareUpdate, setIsPrefillingForSoftwareUpdate] =
            useState(softwareName !== undefined ? true : false);

        useEffect(() => {
            if (softwareName === undefined) {
                return;
            }

            let isActive = true;

            (async () => {
                setIsPrefillingForSoftwareUpdate(true);

                const { formData, softwareSillId } = await core.getSoftwareUpdateData({
                    softwareName
                });

                if (!isActive) {
                    return;
                }

                dispatch({
                    "actionName": "initialize for update",
                    "payload": {
                        softwareSillId,
                        formData
                    }
                });

                setIsPrefillingForSoftwareUpdate(false);
            })();

            return () => {
                isActive = false;
            };
        }, []);

        return { isPrefillingForSoftwareUpdate };
    })();

    const { classes } = useStyles({ "step": route.params.step });

    const evtActionSubmitStep = useConst(() => Evt.create());

    if (isPrefillingForSoftwareUpdate) {
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
            <SoftwareCreationFormStep1
                className={classes.step1}
                initialFormData={state.formData.step1}
                onSubmit={formData =>
                    dispatch({
                        "actionName": "submit step 1",
                        "payload": formData
                    })
                }
                evtActionSubmit={evtActionSubmitStep.pipe(() => route.params.step === 1)}
            />
            <SoftwareCreationFormStep2
                className={classes.step2}
                isUpdateForm={route.name === "softwareUpdateForm"}
                initialFormData={state.formData.step2}
                evtActionSubmit={evtActionSubmitStep.pipe(() => route.params.step === 2)}
                onSubmit={formData =>
                    dispatch({
                        "actionName": "submit step 2",
                        "payload": formData
                    })
                }
                getAutofillDataFromWikidata={core.getAutofillDataFromWikidata}
                getWikidataOptions={core.getWikidataOptions}
            />
            <SoftwareCreationFormStep3
                className={classes.step3}
                initialFormData={state.formData.step3}
                isCloudNativeSoftware={state.formData.step1?.softwareType === "cloud"}
                evtActionSubmit={evtActionSubmitStep.pipe(() => route.params.step === 3)}
                onSubmit={formData =>
                    dispatch({
                        "actionName": "submit step 3",
                        "payload": formData
                    })
                }
            />
            <SoftwareCreationFormStep4
                className={classes.step4}
                initialFormData={state.formData.step4}
                evtActionSubmit={evtActionSubmitStep.pipe(() => route.params.step === 4)}
                onSubmit={formData =>
                    dispatch({
                        "actionName": "submit step 4",
                        "payload": formData
                    })
                }
                getWikidataOptions={core.getWikidataOptions}
            />
            <div className={classes.submittingProgress}>
                <CircularProgress />
            </div>
            {route.params.step !== submittingStep && (
                <>
                    {route.params.step !== 1 && (
                        <Button
                            style={{
                                ...fr.spacing("margin", {
                                    "top": "4v",
                                    "right": "4v"
                                })
                            }}
                            onClick={() => dispatch({ "actionName": "previous" })}
                        >
                            Prev
                        </Button>
                    )}
                    <Button
                        style={{ "marginTop": fr.spacing("4v") }}
                        onClick={() => evtActionSubmitStep.post()}
                    >
                        {route.params.step === submittingStep - 1 ? "Submit" : "Next"}
                    </Button>
                </>
            )}
        </div>
    );
}

const useStyles = makeStyles<{ step: number }>()((_theme, { step }) => ({
    "step1": {
        "display": step === 1 ? undefined : "none"
    },
    "step2": {
        "display": step === 2 ? undefined : "none"
    },
    "step3": {
        "display": step === 3 ? undefined : "none"
    },
    "step4": {
        "display": step === 4 ? undefined : "none"
    },
    "submittingProgress": {
        "display": step === submittingStep ? "flex" : "none",
        "justifyContent": "center",
        "alignItems": "center"
    }
}));
