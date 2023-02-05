import { useEffect, Fragment } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "ui/theme";
import { useCoreFunctions, selectors, useCoreState } from "core";
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
import { Tags } from "ui/components/shared/Tags";
import { FormAlikeSoftwares } from "./FormAlikeSoftwares";

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

    const { softwareForm } = useCoreFunctions();

    const { sliceState } = useCoreState(selectors.softwareForm.sliceState);
    const { isSubmittable } = useCoreState(selectors.softwareForm.isSubmittable);
    const { displayableFieldErrorByFieldName } = useCoreState(
        selectors.softwareForm.displayableFieldErrorByFieldName
    );
    const { softwareRefs } = useCoreState(selectors.softwareForm.softwareRefs);
    const { softwareNameBySoftwareId } = useCoreState(
        selectors.softwareForm.softwareNameBySoftwareId
    );
    const { tags } = useCoreState(selectors.softwareForm.tags);
    const { softwareId } = useCoreState(selectors.softwareForm.softwareId);
    const { valueByFieldName } = useCoreState(selectors.softwareForm.valueByFieldName);
    const { isAutofillInProgress } = useCoreState(
        selectors.softwareForm.isAutofillInProgress
    );

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        softwareForm.initialize({ "softwareId": route.params.softwareId });
    }, [route.params.softwareId]);

    useEffect(() => {
        switch (sliceState.stateDescription) {
            case "not initialized":
                break;
            case "form submitted":
                hideSplashScreen();
                softwareForm.initialize({ "softwareId": undefined });

                routes.card({ "name": sliceState.softwareName }).push();
                break;
            case "form ready":
                if (sliceState.isSubmitting) {
                    showSplashScreen({ "enableTransparency": true });
                }
                break;
        }
    }, [
        sliceState.stateDescription,
        sliceState.stateDescription === "form ready" && sliceState.isSubmitting
    ]);

    const { classes, cx, css } = useStyles();

    const evtOpenDialogIsExpert = useConst(() => Evt.create());

    const onValueBeingTypedChangeFactory = useCallbackFactory(
        ([fieldName]: [FieldName], [{ value }]: [{ value: string | number | boolean }]) =>
            softwareForm.changeFieldValue({
                fieldName,
                value
            })
    );

    const onEscapeKeyFactory = useCallbackFactory(([fieldName]: [FieldName]) =>
        softwareForm.restoreFieldDefaultValue({ fieldName })
    );

    const onBlurFactory = useCallbackFactory(([fieldName]: [FieldName]) =>
        softwareForm.focusLost({ fieldName })
    );

    const onDeclareOneselfReferentDialogAnswer = useConstCallback<
        DeclareOneselfReferentDialogProps["onAnswer"]
    >(createReferentParams => softwareForm.submit({ createReferentParams }));

    if (sliceState.stateDescription !== "form ready") {
        return null;
    }

    assert(isSubmittable !== undefined);
    assert(displayableFieldErrorByFieldName !== undefined);
    assert(softwareNameBySoftwareId !== undefined);
    assert(tags !== undefined);
    assert(valueByFieldName !== undefined);
    assert(softwareRefs !== undefined);

    return (
        <>
            <div className={cx(classes.root, className)}>
                <PageHeader
                    mainIcon="add"
                    title={t(softwareId === undefined ? "title add" : "title edit")}
                    helpTitle={t(
                        softwareId === undefined ? "help title add" : "help title edit"
                    )}
                    helpContent={t("help")}
                    helpIcon="sentimentSatisfied"
                />
                <div className={classes.fields}>
                    {objectKeys(valueByFieldName)
                        .map(
                            fieldName =>
                                [
                                    fieldName,
                                    displayableFieldErrorByFieldName[fieldName]
                                ] as const
                        )
                        .map(([fieldName, fieldError]) => (
                            <Fragment key={fieldName}>
                                {(() => {
                                    const value = valueByFieldName[fieldName];

                                    if (fieldName === "tags") {
                                        const selectedTags = valueByFieldName[fieldName];

                                        return (
                                            <Tags
                                                tags={tags}
                                                selectedTags={selectedTags}
                                                onCreateNewTag={tag =>
                                                    softwareForm.createTag({
                                                        tag
                                                    })
                                                }
                                                onSelectedTags={selectedTags =>
                                                    softwareForm.changeFieldValue({
                                                        "fieldName": "tags",
                                                        "value": selectedTags
                                                    })
                                                }
                                            />
                                        );
                                    }
                                    if (fieldName === "alikeSoftwares") {
                                        const alikeSoftwares =
                                            valueByFieldName[fieldName];

                                        return (
                                            <FormAlikeSoftwares
                                                alikeSoftwares={alikeSoftwares}
                                                onAlikeSoftwaresChange={alikeSoftwares =>
                                                    softwareForm.changeFieldValue({
                                                        "fieldName": "alikeSoftwares",
                                                        "value": alikeSoftwares
                                                    })
                                                }
                                                softwareRefs={softwareRefs}
                                                softwareNameBySoftwareId={
                                                    softwareNameBySoftwareId
                                                }
                                                getLinkToSoftwareCard={softwareName =>
                                                    routes.card({ name: softwareName })
                                                        .link
                                                }
                                            />
                                        );
                                    }

                                    switch (typeof value) {
                                        case "string":
                                        case "number":
                                            return (
                                                <TextField
                                                    {...(fieldName !== "generalInfoMd"
                                                        ? undefined
                                                        : {
                                                              "className": css({
                                                                  "gridColumn": "span 2"
                                                              })
                                                          })}
                                                    doRenderAsTextArea={
                                                        fieldName === "generalInfoMd"
                                                    }
                                                    rows={
                                                        fieldName === "generalInfoMd"
                                                            ? 5
                                                            : undefined
                                                    }
                                                    label={`${t(fieldName)}${
                                                        !softwareForm.getIsOptionalField(
                                                            fieldName
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
                                                                fieldName
                                                            );

                                                        if (typeof value === "number") {
                                                            return ({
                                                                value
                                                            }: Param0<
                                                                TextFieldProps["onValueBeingTypedChange"]
                                                            >) =>
                                                                cb({
                                                                    "value":
                                                                        value === ""
                                                                            ? -1
                                                                            : parseInt(
                                                                                  value
                                                                              )
                                                                });
                                                        }

                                                        return cb;
                                                    })()}
                                                    onEscapeKeyDown={onEscapeKeyFactory(
                                                        fieldName
                                                    )}
                                                    isCircularProgressShown={
                                                        isAutofillInProgress
                                                    }
                                                    helperText={t(
                                                        fieldError.hasError
                                                            ? fieldError.errorMessageKey
                                                            : (`${fieldName} helper` as const)
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
                                                                    softwareForm.changeFieldValue(
                                                                        {
                                                                            fieldName,
                                                                            "value":
                                                                                isChecked
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label={t(fieldName)}
                                                    />
                                                    <FormHelperText>
                                                        {t(
                                                            `${fieldName} helper` as const
                                                        )}
                                                    </FormHelperText>
                                                </div>
                                            );
                                    }

                                    throw new Error("never");
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
                                softwareForm.submit({
                                    "createReferentParams": undefined
                                });
                            }
                        }}
                    >
                        {t(
                            route.params.softwareId === undefined
                                ? "create software"
                                : "update software"
                        )}
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
        "maxWidth": breakpointsValues.lg
        //"gridAutoRows": "minmax(100px, auto)"
    },
    "submitButtonWrapper": {
        "display": "flex",
        "justifyContent": "center"
    },
    "submitButton": {
        "width": 200
    }
}));

export const { i18n } = declareComponentKeys<
    | FieldErrorMessageKey
    | Exclude<FieldName, "alikeSoftwares">
    | `${Exclude<FieldName, "alikeSoftwares">} helper`
    | "update software"
    | "create software"
    | "cancel"
    | "title add"
    | "title edit"
    | "help title add"
    | "help title edit"
    | "help"
    | { K: "change tags"; P: { selectedTagsCount: number } }
    | "confirm give up"
>()({ Form });
