import { useEffect, useState } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { SoftwareCreationFormStep1, type Step1Props } from "./Step1";
import { SoftwareCreationFormStep2, type Step2Props } from "./Step2";
import { SoftwareCreationFormStep3, type Step3Props } from "./Step3";
import { core } from "./coreMock";
import { makeStyles } from "tss-react/dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";

SoftwareCreationForm.routeGroup = createGroup([
    routes.softwareCreationForm,
    routes.softwareUpdateForm
]);

type PageRoute = Route<typeof SoftwareCreationForm.routeGroup>;

SoftwareCreationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function SoftwareCreationForm(props: Props) {
    const { className, route } = props;

    const [formDataStep1, setFormDataStep1] = useState<Step1Props.FormData | undefined>(
        undefined
    );
    const [formDataStep2, setFormDataStep2] = useState<Step2Props.FormData | undefined>(
        undefined
    );
    const [formDataStep3, setFormDataStep3] = useState<Step3Props.FormData | undefined>(
        undefined
    );

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

                const {
                    softwareType,
                    wikidataEntry,
                    comptoirDuLibreId,
                    softwareDescription,
                    softwareLicense,
                    softwareMinimalVersion
                } = await core.getPrefillData({
                    softwareName
                });

                if (!isActive) {
                    return;
                }

                setFormDataStep1({ softwareType });
                setFormDataStep2({
                    softwareName,
                    wikidataEntry,
                    comptoirDuLibreId,
                    softwareDescription,
                    softwareLicense,
                    softwareMinimalVersion
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
                defaultFormData={formDataStep1}
                onSubmit={setFormDataStep1}
                evtActionSubmit={evtActionSubmitStep}
            />
            <SoftwareCreationFormStep2
                className={classes.step2}
                isUpdateForm={route.name === "softwareUpdateForm"}
                defaultFormData={formDataStep2}
                evtActionSubmit={evtActionSubmitStep}
                onSubmit={setFormDataStep2}
                getAutofillData={core.getAutofillData}
                getWikidataOptions={core.getWikidataOptions}
            />
            <SoftwareCreationFormStep3
                className={classes.step3}
                defaultFormData={formDataStep3}
                isCloudNativeSoftware={formDataStep1?.softwareType === "cloud"}
                evtActionSubmit={evtActionSubmitStep}
                onSubmit={setFormDataStep3}
            />
            {route.params.step !== 1 && (
                <Button
                    style={{
                        ...fr.spacing("margin", {
                            "top": "4v",
                            "right": "4v"
                        })
                    }}
                    linkProps={
                        routes[route.name]({
                            ...route.params,
                            "step": route.params.step - 1
                        }).link
                    }
                >
                    Prev
                </Button>
            )}
            <Button
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                linkProps={
                    routes[route.name]({
                        ...route.params,
                        "step": route.params.step + 1
                    }).link
                }
            >
                Next
            </Button>
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
    }
}));
