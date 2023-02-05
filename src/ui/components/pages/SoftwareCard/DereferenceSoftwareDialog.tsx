import { useState, memo } from "react";
import { Button } from "ui/theme";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { Dialog } from "onyxia-ui/Dialog";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { NonPostableEvt, StatefulEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { Evt } from "evt";
import { useConst } from "powerhooks/useConst";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import type { TextFieldProps } from "onyxia-ui/TextField";
import { TextField } from "onyxia-ui/TextField";
import type { Param0 } from "tsafe";
import { makeStyles } from "ui/theme";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

export type DereferenceSoftwareDialogProps = {
    softwareName: string;
    evtOpen: NonPostableEvt<void>;
    onAnswer: (params: {
        isDeletion: boolean;
        reason: string | undefined;
        lastRecommendedVersion: string | undefined;
    }) => void;
};

export const DereferenceSoftwareDialog = memo((props: DereferenceSoftwareDialogProps) => {
    const { evtOpen, onAnswer, softwareName } = props;

    const [isOpen, setIsOpen] = useState(false);

    useEvt(ctx => evtOpen.attach(ctx, () => setIsOpen(true)), [evtOpen]);

    const evtAnswer = useConst(() =>
        Evt.create<Param0<typeof onAnswer>>({
            "isDeletion": false,
            "reason": undefined,
            "lastRecommendedVersion": undefined
        })
    );

    const { t } = useTranslation({ DereferenceSoftwareDialog });

    return (
        <Dialog
            title={t("remove from sill", { softwareName })}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            body={<Body evtAnswer={evtAnswer} />}
            buttons={
                <Buttons
                    evtAnswer={evtAnswer}
                    onSubmit={() => {
                        setIsOpen(false);
                        onAnswer(evtAnswer.state);
                    }}
                    onCancel={() => setIsOpen(false)}
                />
            }
        />
    );
});

const { Buttons } = (() => {
    type BodyProps = {
        evtAnswer: StatefulEvt<Param0<DereferenceSoftwareDialogProps["onAnswer"]>>;
        onSubmit: () => void;
        onCancel: () => void;
    };

    const Buttons = memo((props: BodyProps) => {
        const { evtAnswer, onSubmit, onCancel } = props;

        useRerenderOnStateChange(evtAnswer);

        const { t } = useTranslation({ DereferenceSoftwareDialog });

        return (
            <>
                <Button variant="secondary" onClick={onCancel}>
                    {t("cancel")}
                </Button>
                <Button onClick={onSubmit}>{t("confirm")}</Button>
            </>
        );
    });

    return { Buttons };
})();

const { Body } = (() => {
    type BodyProps = {
        evtAnswer: StatefulEvt<Param0<DereferenceSoftwareDialogProps["onAnswer"]>>;
    };

    const Body = memo((props: BodyProps) => {
        const { evtAnswer } = props;

        useRerenderOnStateChange(evtAnswer);

        const { t } = useTranslation({ DereferenceSoftwareDialog });

        const onRadioGroupChange = useConstCallback(
            (event: any) =>
                (evtAnswer.state = {
                    ...evtAnswer.state,
                    "isDeletion": event.target.value === "true"
                })
        );

        const onReasonValueBeingTypedChange = useConstCallback<
            TextFieldProps["onValueBeingTypedChange"]
        >(
            ({ value }) =>
                (evtAnswer.state = {
                    ...evtAnswer.state,
                    "reason": value
                })
        );

        const onVersionValueBeingTypedChange = useConstCallback<
            TextFieldProps["onValueBeingTypedChange"]
        >(
            ({ value }) =>
                (evtAnswer.state = {
                    ...evtAnswer.state,
                    "lastRecommendedVersion": value
                })
        );

        const { classes } = useStyles({ "isDeletion": evtAnswer.state.isDeletion });

        return (
            <>
                <FormControl className={classes.formControl}>
                    <RadioGroup defaultValue={false} onChange={onRadioGroupChange}>
                        <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label={t("enf of recommendation")}
                        />
                        <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label={t("complete deletion")}
                        />
                    </RadioGroup>
                </FormControl>
                <TextField
                    type="text"
                    className={classes.textField1}
                    doRenderAsTextArea={true}
                    defaultValue={evtAnswer.state.reason}
                    onValueBeingTypedChange={onReasonValueBeingTypedChange}
                    inputProps_spellCheck={true}
                    label={t("reason")}
                    helperText={t("reason helper text")}
                />
                <TextField
                    type="text"
                    className={classes.textField2}
                    doRenderAsTextArea={false}
                    defaultValue={evtAnswer.state.lastRecommendedVersion}
                    onValueBeingTypedChange={onVersionValueBeingTypedChange}
                    inputProps_spellCheck={true}
                    label={t("last recommended version")}
                />
            </>
        );
    });

    const useStyles = makeStyles<{ isDeletion: boolean }>()((theme, { isDeletion }) => ({
        "formControl": {
            "marginTop": theme.spacing(3)
        },
        "textField1": {
            "marginTop": theme.spacing(3),
            "display": "block",
            "& textarea": {
                "minWidth": 460
            }
        },
        "textField2": {
            "marginTop": theme.spacing(6),
            "display": "block",
            "& textarea": {
                "minWidth": 460
            },
            "visibility": isDeletion ? "hidden" : "visible"
        }
    }));

    return { Body };
})();

export const { i18n } = declareComponentKeys<
    | { K: "remove from sill"; P: { softwareName: string } }
    | "cancel"
    | "confirm"
    | "reason"
    | "reason helper text"
    | "last recommended version"
    | "enf of recommendation"
    | "complete deletion"
>()({ DereferenceSoftwareDialog });
