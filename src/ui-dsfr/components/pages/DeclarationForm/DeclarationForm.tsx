import { useEffect } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useCoreFunctions, useCoreState, useCoreEvts, selectors } from "core-dsfr";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
//import { DeclareUser } from "./DeclareUser";
//import { FormData } from "core-dsfr/usecases/declarationForm";

DeclarationForm.routeGroup = createGroup([routes.declarationForm]);

type PageRoute = Route<typeof DeclarationForm.routeGroup>;

DeclarationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function DeclarationForm(props: Props) {
    const { className, route, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { step } = useCoreState(selectors.declarationForm.step);
    const { declarationType } = useCoreState(selectors.declarationForm.declarationType);
    const { isSubmitting } = useCoreState(selectors.declarationForm.isSubmitting);
    const { software } = useCoreState(selectors.declarationForm.software);
    const { evtDeclarationForm } = useCoreEvts();

    const { declarationForm } = useCoreFunctions();

    useEffect(() => {
        declarationForm.initialize({ "softwareName": route.params.name });
    }, [route.name]);

    useEvt(
        ctx =>
            evtDeclarationForm.attach(
                action => action.action === "redirect",
                ctx,
                ({ softwareName }) =>
                    routes.softwareDetails({ "name": softwareName }).push()
            ),
        []
    );

    //const [userFromData, setUserFromData] = useState<FormData.User | undefined>(undefined);
    //const [referentFromData, setReferentFromData] = useState<FormData.Referent | undefined>(undefined);

    if (step === undefined) {
        return <CircularProgress />;
    }

    assert(software !== undefined);

    return (
        <div className={className}>
            <pre>{JSON.stringify(software, null, 2)}</pre>
            {(() => {
                switch (step) {
                    case 1:
                        return (
                            <RadioButtons
                                legend="Comment souhaitez-vous déclarer ?"
                                name="radio"
                                options={[
                                    {
                                        "label": "Je suis un utilisateur de ce logiciel",
                                        "hintText": "Au sein de mon établissement",
                                        "nativeInputProps": {
                                            "checked": declarationType === "user",
                                            "onChange": () =>
                                                declarationForm.setDeclarationType({
                                                    "declarationType": "user"
                                                })
                                        }
                                    },
                                    {
                                        "label":
                                            "Je souhaite devenir référent de ce logiciel",
                                        "hintText":
                                            "Comme garant et référence de l’utilisation du logiciel au sein de mon établissement",
                                        "nativeInputProps": {
                                            "checked": declarationType === "referent",
                                            "onChange": () =>
                                                declarationForm.setDeclarationType({
                                                    "declarationType": "referent"
                                                })
                                        }
                                    }
                                ]}
                            />
                        );
                    case 2:
                        switch (declarationType) {
                            case "user":
                                return <h1>TODO</h1>;
                            /*
                                return <DeclareUser
                                    softwareType={(() => {
                                        switch (software.softwareType) {
                                            case "cloud": return "cloud";
                                            case "desktop": return "desktop";
                                            default: return "other";
                                        }
                                    })()}
                                    initialFormData={userFromData}
                                    onSubmit={formData => { }}
                                    evtActionSubmit={null as any}
                                />;
                                */
                            case "referent":
                                return <h1>TODO</h1>;
                        }
                }
            })()}
            {step === 2 && (
                <Button
                    onClick={() => declarationForm.navigateToPreviousStep()}
                    priority="secondary"
                >
                    back
                </Button>
            )}
            <Button
                onClick={(() => {
                    switch (step) {
                        case 1:
                            return () => declarationForm.navigateToNextStep();
                        case 2:
                            return () =>
                                declarationForm.submit({
                                    "formData": null as any
                                });
                    }
                })()}
                priority="primary"
                disabled={isSubmitting || declarationType === undefined}
            >
                {step === 1 ? "Next" : "Submit"}
            </Button>
        </div>
    );
}
