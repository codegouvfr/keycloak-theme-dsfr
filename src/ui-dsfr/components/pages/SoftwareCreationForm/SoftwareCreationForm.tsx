import { useEffect, useState } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { SoftwareCreationFormStep1, type Step1Props } from "./Step1";
import { SoftwareCreationFormStep2, type Step2Props } from "./Step2";
import { core } from "./coreMock";
import { makeStyles } from "tss-react/dsfr";

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

    if (isPrefillingForSoftwareUpdate) {
        return <CircularProgress />;
    }

    const dispatchStep = (action: "next" | "prev") =>
        routes[route.name]({
            ...route.params,
            "step":
                route.params.step +
                (() => {
                    switch (action) {
                        case "next":
                            return 1;
                        case "prev":
                            return -1;
                    }
                })()
        }).push();

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
                onFormDataChange={formData => {
                    setFormDataStep1(formData);
                    dispatchStep("next");
                }}
            />
            <SoftwareCreationFormStep2
                className={classes.step2}
                isUpdateForm={route.name === "softwareUpdateForm"}
                defaultFormData={formDataStep2}
                onFormDataChange={formData => {
                    setFormDataStep2(formData);
                    dispatchStep("next");
                }}
                onPrev={() => dispatchStep("prev")}
                getAutofillData={core.getAutofillData}
                getWikidataOptions={core.getWikidataOptions}
            />
        </div>
    );
}

const useStyles = makeStyles<{ step: number }>()((_theme, { step }) => ({
    "step1": {
        "display": step === 1 ? undefined : "none"
    },
    "step2": {
        "display": step === 2 ? undefined : "none"
    }
}));
