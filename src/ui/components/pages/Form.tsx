import { useEffect, Fragment } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "ui/theme";
import { useThunks, selectors, useSelector, pure } from "ui/coreApi";
import { Button } from "ui/theme";
import type { FieldErrorMessageKey, FieldName } from "core/usecases/softwareForm";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { createGroup } from "type-route";
import { routes } from "ui/routes";
import type { Route } from "type-route";
import { assert } from "tsafe/assert";
import { useSplashScreen } from "onyxia-ui";
import { objectKeys } from "tsafe/objectKeys";
import { Equals } from "tsafe";
import { TextField } from "onyxia-ui/TextField";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import FormHelperText from "@mui/material/FormHelperText";
import { breakpointsValues } from "onyxia-ui";
import { PageHeader } from "ui/theme";
import type { Param0 } from "tsafe";
import type { TextFieldProps } from "onyxia-ui/TextField";
import { DeclareOneselfReferentDialog } from "ui/components/shared/ReferentDialogs";
import type { DeclareOneselfReferentDialogProps } from "ui/components/shared/ReferentDialogs";
import { useConstCallback } from "powerhooks/useConstCallback";

Form.routeGroup = createGroup([routes.form]);

type PageRoute = Route<typeof Form.routeGroup>;

Form.getDoRequireUserLoggedIn = () => true;

export type Props = {
    route: PageRoute;
    className?: string;
};

export function Form(props: Props) {
    const { className, route } = props;

    const { t } = useTranslation({ Form });

    const { softwareFormThunks } = useThunks();

    const { isSubmittable } = useSelector(selectors.softwareForm.isSubmittable);
    const { displayableFieldErrorByFieldName } = useSelector(
        selectors.softwareForm.displayableFieldErrorByFieldName,
    );
    const state = useSelector(state => state.softwareForm);

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        softwareFormThunks.initialize({ "softwareId": route.params.softwareId });
    }, [route.params.softwareId]);

    useEffect(() => {
        switch (state.stateDescription) {
            case "not initialized":
                break;
            case "form submitted":
                hideSplashScreen();
                softwareFormThunks.initialize({ "softwareId": undefined });
                routes
                    .card({
                        "software": state.softwareName,
                    })
                    .push();
                break;
            case "form ready":
                if (state.isSubmitting) {
                    showSplashScreen({ "enableTransparency": true });
                }
                break;
        }
    }, [
        state.stateDescription,
        state.stateDescription === "form ready" && state.isSubmitting,
    ]);

    const { classes, cx } = useStyles();

    const evtOpenDialogIsExpert = useConst(() => Evt.create());

    const onValueBeingTypedChangeFactory = useCallbackFactory(
        ([fieldName]: [FieldName], [{ value }]: [{ value: string | number | boolean }]) =>
            softwareFormThunks.changeFieldValue({
                fieldName,
                value,
            }),
    );

    const onEscapeKeyFactory = useCallbackFactory(([fieldName]: [FieldName]) =>
        softwareFormThunks.restoreFieldDefaultValue({ fieldName }),
    );

    const onBlurFactory = useCallbackFactory(([fieldName]: [FieldName]) =>
        softwareFormThunks.focusLost({ fieldName }),
    );

    const onDeclareOneselfReferentDialogAnswer = useConstCallback<
        DeclareOneselfReferentDialogProps["onAnswer"]
    >(createReferentParams => softwareFormThunks.submit({ createReferentParams }));

    if (state.stateDescription !== "form ready") {
        return null;
    }

    assert(isSubmittable !== undefined);
    assert(displayableFieldErrorByFieldName !== undefined);

    return (
        <>
            <div className={cx(classes.root, className)}>
                <PageHeader
                    mainIcon="add"
                    title={t(state.softwareId === undefined ? "title add" : "title edit")}
                    helpTitle={t(
                        state.softwareId === undefined
                            ? "help title add"
                            : "help title edit",
                    )}
                    helpContent={t("help")}
                    helpIcon="sentimentSatisfied"
                />
                <div className={classes.fields}>
                    {objectKeys(state.valueByFieldName)
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
                                    const value = state.valueByFieldName[fieldName];

                                    switch (typeof value) {
                                        case "string":
                                        case "number":
                                            return (
                                                <TextField
                                                    label={`${t(fieldName)}${
                                                        !pure.softwareForm.getIsOptionalField(
                                                            fieldName,
                                                        )
                                                            ? " *"
                                                            : ""
                                                    }`}
                                                    defaultValue={
                                                        typeof value !== "number"
                                                            ? value
                                                            : value === -1 || isNaN(value)
                                                            ? ""
                                                            : `${value}`
                                                    }
                                                    onValueBeingTypedChange={(() => {
                                                        const cb =
                                                            onValueBeingTypedChangeFactory(
                                                                fieldName,
                                                            );

                                                        if (typeof value === "number") {
                                                            return ({
                                                                value,
                                                            }: Param0<
                                                                TextFieldProps["onValueBeingTypedChange"]
                                                            >) =>
                                                                cb({
                                                                    "value":
                                                                        value === ""
                                                                            ? -1
                                                                            : parseInt(
                                                                                  value,
                                                                              ),
                                                                });
                                                        }

                                                        return cb;
                                                    })()}
                                                    onEscapeKeyDown={onEscapeKeyFactory(
                                                        fieldName,
                                                    )}
                                                    isCircularProgressShown={
                                                        state.isAutofillInProgress
                                                    }
                                                    helperText={t(
                                                        fieldError.hasError
                                                            ? fieldError.errorMessageKey
                                                            : (`${fieldName} helper` as const),
                                                    )}
                                                    inputProps_aria-invalid={
                                                        fieldError.hasError
                                                    }
                                                    onBlur={onBlurFactory(fieldName)}
                                                />
                                            );
                                        case "boolean":
                                            return (
                                                <div>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={value}
                                                                onChange={(
                                                                    ...[, isChecked]
                                                                ) =>
                                                                    softwareFormThunks.changeFieldValue(
                                                                        {
                                                                            fieldName,
                                                                            "value":
                                                                                isChecked,
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label={t(fieldName)}
                                                    />
                                                    <FormHelperText>
                                                        {t(
                                                            `${fieldName} helper` as const,
                                                        )}
                                                    </FormHelperText>
                                                </div>
                                            );
                                    }

                                    assert<Equals<typeof value, never>>();
                                })()}
                            </Fragment>
                        ))}
                </div>
                <div className={classes.submitButtonWrapper}>
                    <Button
                        className={classes.submitButton}
                        disabled={!isSubmittable}
                        onClick={() => {
                            if (route.params.softwareId === undefined) {
                                evtOpenDialogIsExpert.post();
                            } else {
                                softwareFormThunks.submit({
                                    "createReferentParams": undefined,
                                });
                            }
                        }}
                    >
                        {t("send")}
                    </Button>
                </div>
            </div>
            <DeclareOneselfReferentDialog
                evtOpen={evtOpenDialogIsExpert}
                onAnswer={onDeclareOneselfReferentDialogAnswer}
            />
        </>
    );
}

const useStyles = makeStyles({ "name": { Form } })(theme => ({
    "root": {},
    "fields": {
        "padding": theme.spacing(7),
        "display": "grid",
        "gridTemplateColumns": "repeat(2, 1fr)",
        "gap": theme.spacing(6),
        "maxWidth": breakpointsValues.lg,
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
    | FieldErrorMessageKey
    | FieldName
    | `${FieldName} helper`
    | "send"
    | "cancel"
    | "title add"
    | "title edit"
    | "help title add"
    | "help title edit"
    | "help"
>()({ Form });
