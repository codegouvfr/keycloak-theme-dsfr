import { useEffect, Fragment } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "ui/theme";
import { useCoreFunctions, selectors, useCoreState } from "core";
import { Button } from "ui/theme";
import type { FieldErrorMessageKey, ServiceFormData } from "core/usecases/serviceForm";
import { createGroup } from "type-route";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { useSplashScreen } from "onyxia-ui";
import { TextField } from "onyxia-ui/TextField";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { breakpointsValues } from "onyxia-ui";
import { PageHeader } from "ui/theme";
import type { Equals } from "tsafe";
import { PickSoftware } from "./PickSoftware";
import { useConstCallback } from "powerhooks/useConstCallback";

ServiceForm.routeGroup = createGroup([routes.serviceForm]);

type PageRoute = Route<typeof ServiceForm.routeGroup>;

ServiceForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    route: PageRoute;
    className?: string;
};

export function ServiceForm(props: Props) {
    const { className, route } = props;

    const { t } = useTranslation({ ServiceForm });

    const { serviceForm, serviceCatalog } = useCoreFunctions();

    const { sliceState } = useCoreState(selectors.serviceForm.sliceState);
    const { serviceId } = useCoreState(selectors.serviceForm.serviceId);
    const { formData } = useCoreState(selectors.serviceForm.formData);
    const { isSubmittable } = useCoreState(selectors.serviceForm.isSubmittable);
    const { displayableFieldErrorByFieldName } = useCoreState(
        selectors.serviceForm.displayableFieldErrorByFieldName,
    );
    const { sillSoftwareNames } = useCoreState(selectors.serviceForm.sillSoftwareNames);
    const { agencyNames } = useCoreState(selectors.serviceForm.agencyNames);
    const { shouldSplashScreenBeShown } = useCoreState(
        selectors.serviceForm.shouldSplashScreenBeShown,
    );

    useEffect(() => {
        serviceForm.initialize({ "serviceId": route.params.serviceId });
    }, [route.params.serviceId]);

    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (shouldSplashScreenBeShown) {
                showSplashScreen({ "enableTransparency": true });
            } else {
                hideSplashScreen();
            }
        }, [shouldSplashScreenBeShown]);
    }

    //TODO: ASAP! The core should be able to expose events
    //This should be an imperative action and not passed via the states.
    useEffect(() => {
        if (sliceState.stateDescription !== "form submitted") {
            return;
        }

        serviceForm.initialize({ "serviceId": undefined });

        routes
            .serviceCatalog({
                "q": serviceCatalog.stringifyQuery({
                    "search": sliceState.queryString,
                    "softwareName": undefined,
                }),
            })
            .push();
    }, [sliceState.stateDescription]);

    const { classes, cx } = useStyles();

    const onValueBeingTypedChangeFactory = useCallbackFactory(
        ([fieldName]: [keyof ServiceFormData], [{ value }]: [{ value: string }]) =>
            serviceForm.changeFieldValue({
                fieldName,
                value,
            }),
    );

    const onEscapeKeyFactory = useCallbackFactory(
        ([fieldName]: [keyof ServiceFormData]) =>
            serviceForm.restoreFieldDefaultValue({ fieldName }),
    );

    const onBlurFactory = useCallbackFactory(([fieldName]: [keyof ServiceFormData]) =>
        serviceForm.focusLost({ fieldName }),
    );

    const onTextFieldSelectedSoftware = useConstCallback(
        (softwareName: string | undefined) =>
            serviceForm.changeFieldValue({
                "fieldName": "softwareName",
                "value": softwareName ?? "",
            }),
    );

    const onSubmitButtonClick = useConstCallback(() => serviceForm.submit());

    if (sliceState.stateDescription !== "form ready") {
        return null;
    }

    assert(isSubmittable !== undefined);
    assert(displayableFieldErrorByFieldName !== undefined);
    assert(formData !== undefined);
    assert(sillSoftwareNames !== undefined);
    assert(agencyNames !== undefined);

    assert<Equals<typeof orderedFieldNames[number], keyof typeof formData>>();

    return (
        <>
            <div className={cx(classes.root, className)}>
                <PageHeader
                    mainIcon="add"
                    title={t(serviceId === undefined ? "title add" : "title edit")}
                    helpTitle={t(
                        serviceId === undefined ? "help title add" : "help title edit",
                    )}
                    helpContent={t("help")}
                    helpIcon="sentimentSatisfied"
                />
                <div className={classes.fields}>
                    {orderedFieldNames
                        .map(
                            fieldName =>
                                [
                                    fieldName,
                                    displayableFieldErrorByFieldName[fieldName],
                                ] as const,
                        )
                        .map(([fieldName, fieldError]) => (
                            <Fragment key={fieldName}>
                                {(() => {
                                    const value = formData[fieldName];

                                    if (fieldName === "softwareName") {
                                        return (
                                            <PickSoftware
                                                sillSoftwareNames={sillSoftwareNames}
                                                selectedSoftwareName={value || undefined}
                                                onSelectedSoftware={
                                                    onTextFieldSelectedSoftware
                                                }
                                            />
                                        );
                                    }

                                    switch (typeof value) {
                                        case "string":
                                            return (
                                                <TextField
                                                    freeSolo
                                                    options={
                                                        fieldName === "agencyName"
                                                            ? agencyNames
                                                            : undefined
                                                    }
                                                    label={`${t(fieldName)} *`}
                                                    defaultValue={
                                                        typeof value !== "number"
                                                            ? value
                                                            : value === -1 || isNaN(value)
                                                            ? ""
                                                            : `${value}`
                                                    }
                                                    onValueBeingTypedChange={onValueBeingTypedChangeFactory(
                                                        fieldName,
                                                    )}
                                                    onEscapeKeyDown={onEscapeKeyFactory(
                                                        fieldName,
                                                    )}
                                                    helperText={t(
                                                        fieldError.hasDisplayableError
                                                            ? fieldError.errorMessageKey
                                                            : (`${fieldName} helper` as const),
                                                    )}
                                                    inputProps_aria-invalid={
                                                        fieldError.hasDisplayableError
                                                    }
                                                    onBlur={onBlurFactory(fieldName)}
                                                />
                                            );
                                    }

                                    assert<Equals<typeof value, never>>(false);
                                })()}
                            </Fragment>
                        ))}
                </div>
                <div className={classes.submitButtonWrapper}>
                    <Button
                        className={classes.submitButton}
                        disabled={!isSubmittable}
                        onClick={onSubmitButtonClick}
                    >
                        {t(
                            route.params.serviceId === undefined
                                ? "create service"
                                : "update service",
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}

const useStyles = makeStyles({ "name": { ServiceForm } })(theme => ({
    "root": {},
    "fields": {
        "padding": theme.spacing(7),
        "display": "grid",
        "gridTemplateColumns": "repeat(1, 1fr)",
        "gap": theme.spacing(6),
        "maxWidth": breakpointsValues.md,
        //"gridAutoRows": "minmax(100px, auto)"
    },
    "submitButtonWrapper": {
        "display": "flex",
        "justifyContent": "center",
    },
    "submitButton": {
        "width": 200,
    },
}));

export const { i18n } = declareComponentKeys<
    | keyof ServiceFormData
    | FieldErrorMessageKey
    | `${keyof ServiceFormData} helper`
    | "update service"
    | "create service"
    | "cancel"
    | "title add"
    | "title edit"
    | "help title add"
    | "help title edit"
    | "help"
>()({ ServiceForm });

const orderedFieldNames = [
    "serviceUrl",
    "description",
    "agencyName",
    "softwareName",
] as const;
