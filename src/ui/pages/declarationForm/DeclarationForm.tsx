import { useEffect, type MouseEvent } from "react";
import { routes, session } from "ui/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useCoreFunctions, useCoreState, useCoreEvts, selectors } from "core";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { DeclarationFormStep1 } from "ui/pages/declarationForm/Step1";
import { DeclarationFormStep2User } from "ui/pages/declarationForm/Step2User";
import { DeclarationFormStep2Referent } from "ui/pages/declarationForm/Step2Referent";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { fr } from "@codegouvfr/react-dsfr";
import { DetailUsersAndReferents } from "ui/shared/DetailUsersAndReferents";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { useTranslation } from "ui/i18n";
import { declareComponentKeys } from "i18nifty";
import { ActionsFooter } from "ui/shared/ActionsFooter";
import type { PageRoute } from "./route";
import softwareLogoPlaceholder from "ui/assets/software_logo_placeholder.png";

type Props = {
    className?: string;
    route: PageRoute;
};

const stepCount = 2;

export default function DeclarationForm(props: Props) {
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
        return () => declarationForm.clear();
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

    const { classes, cx } = useStyles({ step, declarationType });

    const { t } = useTranslation({ DeclarationForm });
    const { t: tCommon } = useTranslation({ "App": "App" });

    if (step === undefined) {
        return <CircularProgress />;
    }

    const onBackStep = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        declarationForm.navigateToPreviousStep();
    };

    const onNextStep = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        evtActionSubmitStep.post();
    };

    const handleDisableBackButton = () => {
        switch (step) {
            case 1:
                return true;
            default:
                return false;
        }
    };
    const handleDisableNextButton = () => {
        return isSubmitting;
    };

    const getActiveStep = (): "type" | "user" | "referent" => {
        if (step === 1) {
            return "type";
        }

        if (step === 2 && declarationType === "user") {
            return "user";
        }

        if (step === 2 && declarationType === "referent") {
            return "referent";
        }

        return "type";
    };

    const title = (
        <legend className={fr.cx("fr-h6")} id="radio-hint-element-legend">
            {getActiveStep() === "type" && t("title step 1")}
            {getActiveStep() === "user" && t("title step 2 user")}
            {getActiveStep() === "referent" && t("title step 2 referent")}
        </legend>
    );

    if (software === undefined) {
        return null;
    }

    return (
        <div className={className}>
            <div className={fr.cx("fr-container")}>
                <Breadcrumb
                    segments={[
                        {
                            "linkProps": {
                                ...routes.softwareCatalog().link
                            },
                            "label": t("catalog breadcrumb")
                        },
                        {
                            "linkProps": {
                                ...routes.softwareDetails({
                                    "name": software.softwareName
                                }).link
                            },
                            "label": software.softwareName
                        }
                    ]}
                    currentPageLabel={t("declare yourself user or referent breadcrumb")}
                    className={classes.breadcrumb}
                />
                <div className={classes.headerDeclareUserOrReferent}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                        href={"#"}
                        onClick={() => session.back()}
                        className={classes.backButton}
                    >
                        <i className={fr.cx("fr-icon-arrow-left-s-line")} />
                    </a>
                    <h4 className={classes.title}>
                        {t("declare yourself user or referent breadcrumb")}
                    </h4>
                </div>
                <div className={classes.formContainer}>
                    <div className={classes.leftCol}>
                        <div className={classes.softwareNameContainer}>
                            <div className={classes.logoWrapper}>
                                <img
                                    className={classes.logo}
                                    src={software.logoUrl ?? softwareLogoPlaceholder}
                                    alt="Logo du logiciel"
                                />
                            </div>
                            <h4 className={classes.softwareName}>
                                {software.softwareName}
                            </h4>
                        </div>
                        <DetailUsersAndReferents
                            className={cx(
                                fr.cx("fr-text--lg"),
                                classes.detailUserAndReferent
                            )}
                            seeUserAndReferent={
                                routes.softwareUsersAndReferents({
                                    "name": software.softwareName
                                }).link
                            }
                            referentCount={software.referentCount}
                            userCount={software.userCount}
                        />
                    </div>

                    <div className={cx("fr-form-group", classes.rightCol)}>
                        <Stepper
                            currentStep={step}
                            stepCount={stepCount}
                            title={title}
                            className={classes.stepper}
                        />
                        <fieldset className={fr.cx("fr-fieldset")}>
                            <DeclarationFormStep1
                                className={classes.step1}
                                evtActionSubmit={evtActionSubmitStep.pipe(
                                    () => step === 1
                                )}
                                onSubmit={({ declarationType }) =>
                                    declarationForm.setDeclarationType({
                                        declarationType
                                    })
                                }
                            />
                            <DeclarationFormStep2User
                                className={classes.step2User}
                                evtActionSubmit={evtActionSubmitStep.pipe(
                                    () => step === 2 && declarationType === "user"
                                )}
                                onSubmit={formData =>
                                    declarationForm.submit({ formData })
                                }
                                softwareType={software.softwareType}
                            />
                            <DeclarationFormStep2Referent
                                className={classes.step2Referent}
                                evtActionSubmit={evtActionSubmitStep.pipe(
                                    () => step === 2 && declarationType === "referent"
                                )}
                                onSubmit={formData =>
                                    declarationForm.submit({ formData })
                                }
                                softwareType={(() => {
                                    switch (software.softwareType) {
                                        case "cloud":
                                            return "cloud";
                                        default:
                                            return "other";
                                    }
                                })()}
                            />
                        </fieldset>
                    </div>
                </div>
            </div>
            <ActionsFooter className={classes.buttons}>
                <Button
                    onClick={onBackStep}
                    priority="secondary"
                    className={classes.back}
                    disabled={handleDisableBackButton()}
                >
                    {tCommon("previous")}
                </Button>
                <Button
                    onClick={onNextStep}
                    priority="primary"
                    disabled={handleDisableNextButton()}
                >
                    {step === stepCount ? t("send") : tCommon("next")}
                </Button>
            </ActionsFooter>
        </div>
    );
}

const useStyles = makeStyles<{
    step: 1 | 2 | undefined;
    declarationType: "user" | "referent" | undefined;
}>({ "name": { DeclarationForm } })((theme, { step, declarationType }) => ({
    "step1": {
        "display": step !== 1 ? "none" : undefined
    },
    "step2User": {
        "display": step !== 2 || declarationType !== "user" ? "none" : undefined
    },
    "step2Referent": {
        "display": step !== 2 || declarationType !== "referent" ? "none" : undefined
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
    "formContainer": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,

        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    },
    "leftCol": {
        "marginLeft": fr.spacing("12v"),
        "paddingRight": fr.spacing("16v"),
        "borderRight": `1px ${theme.decisions.border.default.grey.default} solid`,

        [fr.breakpoints.down("md")]: {
            "borderRight": "none",
            "marginLeft": "0",
            "paddingRight": "0"
        }
    },
    "softwareNameContainer": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("3v")
    },
    "logoWrapper": {
        "height": fr.spacing("10v"),
        "width": fr.spacing("10v"),
        "minWidth": fr.spacing("10v"),
        "marginRight": fr.spacing("2v"),
        "overflow": "hidden",
        [fr.breakpoints.down("md")]: {
            "height": fr.spacing("5v"),
            "width": fr.spacing("5v")
        }
    },
    "logo": {
        "height": "100%"
    },
    "softwareName": {
        "marginBottom": 0
    },
    "detailUserAndReferent": {
        color: theme.decisions.text.actionHigh.blueFrance.default
    },
    "rightCol": {
        "marginLeft": fr.spacing("6v"),
        "paddingLeft": fr.spacing("10v"),
        [fr.breakpoints.down("md")]: {
            "marginLeft": "0",
            "paddingLeft": "0"
        }
    },
    "stepper": {
        "flex": "1"
    },
    "buttons": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end"
    },
    "back": {
        "marginRight": fr.spacing("4v")
    }
}));

export const { i18n } = declareComponentKeys<
    | "catalog breadcrumb"
    | "declare yourself user or referent breadcrumb"
    | "title step 1"
    | "title step 2 user"
    | "title step 2 referent"
    | "send"
>()({ DeclarationForm });
