import { useEffect } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useCoreFunctions, useCoreState, useCoreEvts, selectors } from "core-dsfr";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { DeclarationFormStep1 } from "./Step1";
import { DeclarationFormStep2User } from "./Step2User";
import { makeStyles } from "tss-react/dsfr";

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

    const evtActionSubmitStep = useConst(() => Evt.create());

    const { classes } = useStyles({ step, declarationType });

    if (step === undefined) {
        return <CircularProgress />;
    }

    assert(software !== undefined);

    return (
        <div className={className}>
            <pre>{JSON.stringify(software, null, 2)}</pre>
            <DeclarationFormStep1
                className={classes.step1}
                evtActionSubmit={evtActionSubmitStep.pipe(() => step === 1)}
                onSubmit={({ declarationType }) =>
                    declarationForm.setDeclarationType({ declarationType })
                }
            />
            <DeclarationFormStep2User
                className={classes.step2User}
                evtActionSubmit={evtActionSubmitStep.pipe(
                    () => step === 2 && declarationType === "user"
                )}
                onSubmit={formData => declarationForm.submit({ formData })}
                softwareType={software.softwareType}
            />
            <div className={classes.step2Referent}>TODO</div>
            {step === 2 && (
                <Button
                    onClick={() => declarationForm.navigateToPreviousStep()}
                    priority="secondary"
                >
                    back
                </Button>
            )}
            <Button
                onClick={() => evtActionSubmitStep.post()}
                priority="primary"
                disabled={isSubmitting}
            >
                {step === 1 ? "Next" : "Submit"}
            </Button>
        </div>
    );
}

const useStyles = makeStyles<{
    step: 1 | 2 | undefined;
    declarationType: "user" | "referent" | undefined;
}>()((_theme, { step, declarationType }) => ({
    "step1": {
        "display": step !== 1 ? "none" : undefined
    },
    "step2User": {
        "display": step !== 2 || declarationType !== "user" ? "none" : undefined
    },
    "step2Referent": {
        "display": step !== 2 || declarationType !== "referent" ? "none" : undefined
    }
}));
