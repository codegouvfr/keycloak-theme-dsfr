import { useEffect, useState, memo, Fragment } from "react";
import { useTranslation } from "ui/i18n/useTranslations";
import { makeStyles } from "ui/theme";
import { useThunks, selectors, useSelector, pure } from "ui/coreApi";
import { Button } from "ui/theme";
import type { FieldErrorMessageKey, FieldName } from "core/usecases/softwareForm";
import { Dialog } from "onyxia-ui/Dialog";
import type { NonPostableEvt, StatefulEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
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
    const { fieldErrorByFieldName } = useSelector(
        selectors.softwareForm.fieldErrorByFieldName,
    );
    const state = useSelector(state => state.softwareForm);

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        switch (state.stateDescription) {
            case "not initialized":
                if (state.isInitializing) {
                    return;
                }
                softwareFormThunks.initialize({ "softwareId": route.params.softwareId });
                break;
            case "form submitted":
                hideSplashScreen();

                routes
                    .catalogExplorer({
                        "softwareName": state.softwareName,
                    })
                    .push();
                break;
            case "form ready":
                if (state.isSubmitting) {
                    showSplashScreen({ "enableTransparency": true });
                } else {
                    hideSplashScreen();
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

    if (state.stateDescription !== "form ready") {
        return null;
    }

    assert(isSubmittable !== undefined);
    assert(fieldErrorByFieldName !== undefined);

    return (
        <>
            <div className={cx(classes.root, className)}>
                <div className={classes.fields}>
                    {objectKeys(state.valueByFieldName)
                        .map(
                            fieldName =>
                                [fieldName, fieldErrorByFieldName[fieldName]] as const,
                        )
                        .map(([fieldName, fieldError]) => (
                            <Fragment key={fieldName}>
                                {(() => {
                                    const value = state.valueByFieldName[fieldName];

                                    switch (typeof value) {
                                        case "string":
                                            return (
                                                <TextField
                                                    label={`${t(fieldName)}${
                                                        !pure.softwareForm.getIsOptionalField(
                                                            fieldName,
                                                        )
                                                            ? " *"
                                                            : ""
                                                    }`}
                                                    defaultValue={value}
                                                    onValueBeingTypedChange={onValueBeingTypedChangeFactory(
                                                        fieldName,
                                                    )}
                                                    onEscapeKeyDown={onEscapeKeyFactory(
                                                        fieldName,
                                                    )}
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
                                        case "number":
                                            return null;
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
                                softwareFormThunks.submit({ "isExpert": undefined });
                            }
                        }}
                    >
                        {t("send")}
                    </Button>
                </div>
            </div>
            <DialogIsExpert
                evtOpen={evtOpenDialogIsExpert}
                onAnswer={({ isExpert }) => softwareFormThunks.submit({ isExpert })}
            />
        </>
    );
}

const useStyles = makeStyles({ "name": { Form } })(theme => ({
    "root": {},
    "fields": {
        "padding": theme.spacing(7),
        "display": "grid",
        "gridTemplateColumns": "repeat(3, 1fr)",
        "gap": theme.spacing(5),
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

export declare namespace Form {
    export type I18nScheme = Record<FieldErrorMessageKey, undefined> &
        Record<FieldName, undefined> &
        Record<`${FieldName} helper`, undefined> & {
            "i am a technical expert": undefined;
            "send": undefined;
            "cancel": undefined;
        };
}

const { DialogIsExpert } = (() => {
    type Props = {
        evtOpen: NonPostableEvt<void>;
        onAnswer: (params: { isExpert: boolean }) => void;
    };

    const DialogIsExpert = memo((props: Props) => {
        const { evtOpen, onAnswer } = props;

        const [isOpen, setIsOpen] = useState(false);

        useEvt(ctx => evtOpen.attach(ctx, () => setIsOpen(true)), [evtOpen]);

        const evtIsExpert = useConst(() => Evt.create(false));

        const { t } = useTranslation({ Form });

        return (
            <Dialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                body={<Body evtIsExpert={evtIsExpert} />}
                buttons={
                    <>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsOpen(false);
                                onAnswer({ "isExpert": evtIsExpert.state });
                            }}
                        >
                            {t("send")}
                        </Button>
                    </>
                }
            />
        );
    });

    const { Body } = (() => {
        type BodyProps = {
            evtIsExpert: StatefulEvt<boolean>;
        };

        const Body = memo((props: BodyProps) => {
            const { evtIsExpert } = props;

            useRerenderOnStateChange(evtIsExpert);

            const { t } = useTranslation({ Form });

            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={evtIsExpert.state}
                            onChange={(...[, isChecked]) =>
                                (evtIsExpert.state = isChecked)
                            }
                        />
                    }
                    label={t("i am a technical expert")}
                />
            );
        });

        return { Body };
    })();

    return { DialogIsExpert };
})();
