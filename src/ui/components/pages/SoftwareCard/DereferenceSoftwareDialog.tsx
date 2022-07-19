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

export type DereferenceSoftwareDialogProps = {
    softwareName: string;
    evtOpen: NonPostableEvt<void>;
    onAnswer: (params: {
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
            "reason": undefined,
            "lastRecommendedVersion": undefined,
        }),
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

        const onReasonValueBeingTypedChange = useConstCallback<
            TextFieldProps["onValueBeingTypedChange"]
        >(
            ({ value }) =>
                (evtAnswer.state = {
                    ...evtAnswer.state,
                    "reason": value,
                }),
        );

        const onVersionValueBeingTypedChange = useConstCallback<
            TextFieldProps["onValueBeingTypedChange"]
        >(
            ({ value }) =>
                (evtAnswer.state = {
                    ...evtAnswer.state,
                    "lastRecommendedVersion": value,
                }),
        );

        const { classes } = useStyles();

        return (
            <>
                <TextField
                    type="text"
                    className={classes.textField}
                    doRenderAsTextArea={true}
                    defaultValue={evtAnswer.state.reason}
                    onValueBeingTypedChange={onReasonValueBeingTypedChange}
                    inputProps_spellCheck={true}
                    label={t("reason")}
                    helperText={t("reason helper text")}
                />
                <TextField
                    type="text"
                    className={classes.textField}
                    doRenderAsTextArea={false}
                    defaultValue={evtAnswer.state.lastRecommendedVersion}
                    onValueBeingTypedChange={onVersionValueBeingTypedChange}
                    inputProps_spellCheck={true}
                    label={t("last recommended version")}
                />
            </>
        );
    });

    const useStyles = makeStyles()(theme => ({
        "textField": {
            "marginTop": theme.spacing(6),
            "display": "block",
            "& textarea": {
                "minWidth": 460,
            },
        },
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
>()({ DereferenceSoftwareDialog });
