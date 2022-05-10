import { useState, memo } from "react";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { CompiledData } from "sill-api";
import { Markdown } from "ui/tools/Markdown";
import { Dialog } from "onyxia-ui/Dialog";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { NonPostableEvt, StatefulEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { Evt } from "evt";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useConst } from "powerhooks/useConst";
import { useStyles } from "ui/theme";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import type { TextFieldProps } from "onyxia-ui/TextField";
import { TextField } from "onyxia-ui/TextField";

export type ReferentDialogsProps = {
    evtAction: NonPostableEvt<"open" | "open declare referent">;
    softwareName: string;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    onAnswer: (params: { isExpert: boolean; useCaseDescription: string }) => void;
    onUserNoLongerReferent: () => void;
};

export const ReferentDialogs = memo((props: ReferentDialogsProps) => {
    const {
        evtAction,
        softwareName,
        referents,
        userIndexInReferents,
        onUserNoLongerReferent,
        onAnswer,
    } = props;

    const evtDeclareOneselfReferentDialogAction = useConst(() => Evt.create());

    const onOpenDeclareBeingReferent = useConstCallback(() =>
        evtDeclareOneselfReferentDialogAction.post(),
    );

    const evtReferentDialogAction = useConst(() =>
        evtAction.pipe((action, sideEffect) =>
            action === "open declare referent"
                ? (sideEffect(() => evtDeclareOneselfReferentDialogAction.post()), null)
                : [undefined as void],
        ),
    );

    return (
        <>
            <ReferentDialog
                referents={referents}
                userIndexInReferents={userIndexInReferents}
                evtAction={evtReferentDialogAction}
                onOpenDeclareBeingReferent={onOpenDeclareBeingReferent}
                onUserNoLongerReferent={onUserNoLongerReferent}
            />
            <DeclareOneselfReferentDialog
                softwareName={softwareName}
                evtOpen={evtDeclareOneselfReferentDialogAction}
                onAnswer={onAnswer}
            />
        </>
    );
});

const { ReferentDialog } = (() => {
    type Props = {
        evtAction: NonPostableEvt<void>;
        referents: CompiledData.Software.WithReferent["referents"] | undefined;
        userIndexInReferents: number | undefined;
        onUserNoLongerReferent: () => void;
        onOpenDeclareBeingReferent: () => void;
    };

    const ReferentDialog = memo((props: Props) => {
        const {
            evtAction,
            referents,
            userIndexInReferents,
            onOpenDeclareBeingReferent,
            onUserNoLongerReferent: onUserNoLongerReferent_prop,
        } = props;

        const [isOpen, setIsOpen] = useState(false);

        const onClose = useConstCallback(() => setIsOpen(false));

        const { t } = useTranslation({ ReferentDialogs });

        useEvt(ctx => evtAction.attach(ctx, () => setIsOpen(true)), [evtAction]);

        const { css, theme } = useStyles();

        const onDeclareOneselfReferentClick = useConstCallback(() => {
            onClose();

            onOpenDeclareBeingReferent();
        });

        const onUserNoLongerReferent = useConstCallback(() => {
            onClose();

            onUserNoLongerReferent_prop();
        });

        if (referents === undefined) {
            return null;
        }

        return (
            <Dialog
                body={
                    <Markdown
                        className={css({
                            "dialogBody": {
                                "& ul": {
                                    "paddingInlineStart": 0,
                                },
                                "margin": theme.spacing(4),
                            },
                        })}
                    >
                        {referents
                            .map(
                                ({ email, agencyName, isExpert }, i) =>
                                    "- " +
                                    [
                                        `**${email}**`,
                                        agencyName,
                                        ...(!isExpert ? [] : [`*${t("expert")}*`]),
                                        ...(i !== userIndexInReferents
                                            ? []
                                            : [`(${t("you")})`]),
                                    ].join(" - "),
                            )
                            .join("\n  ")}
                    </Markdown>
                }
                buttons={
                    <>
                        {userIndexInReferents === undefined ? (
                            <Button onClick={onDeclareOneselfReferentClick}>
                                {t("declare oneself referent")}
                            </Button>
                        ) : (
                            <Button onClick={onUserNoLongerReferent} variant="ternary">
                                {t("no longer referent")}
                            </Button>
                        )}
                        <Button onClick={onClose} variant="secondary">
                            {t("close")}
                        </Button>
                    </>
                }
                isOpen={isOpen}
                onClose={onClose}
            />
        );
    });

    return { ReferentDialog };
})();

export const { DeclareOneselfReferentDialog } = (() => {
    type Props = {
        softwareName?: string;
        evtOpen: NonPostableEvt<void>;
        onAnswer: (params: { isExpert: boolean; useCaseDescription: string }) => void;
    };

    const DeclareOneselfReferentDialog = memo((props: Props) => {
        const { evtOpen, onAnswer, softwareName } = props;

        const [isOpen, setIsOpen] = useState(false);

        useEvt(ctx => evtOpen.attach(ctx, () => setIsOpen(true)), [evtOpen]);

        const evtAnswer = useConst(() =>
            Evt.create({ "isExpert": false, "useCaseDescription": "" }),
        );
        const { t } = useTranslation({ ReferentDialogs });

        const { css } = useStyles();

        return (
            <Dialog
                title={
                    <span
                        className={css({
                            "display": "inline-block",
                            "minWidth": 500,
                        })}
                    >
                        {softwareName !== undefined
                            ? t("declare oneself referent of", { softwareName })
                            : null}
                    </span>
                }
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
            evtAnswer: StatefulEvt<{ isExpert: boolean; useCaseDescription: string }>;
            onSubmit: () => void;
            onCancel: () => void;
        };

        const Buttons = memo((props: BodyProps) => {
            const { evtAnswer, onSubmit, onCancel } = props;

            useRerenderOnStateChange(evtAnswer);

            const { t } = useTranslation({ ReferentDialogs });

            return (
                <>
                    <Button variant="secondary" onClick={onCancel}>
                        {t("cancel")}
                    </Button>
                    <Button
                        disabled={evtAnswer.state.useCaseDescription.length === 0}
                        onClick={onSubmit}
                    >
                        {t("send")}
                    </Button>
                </>
            );
        });

        return { Buttons };
    })();

    const { Body } = (() => {
        type BodyProps = {
            evtAnswer: StatefulEvt<{ isExpert: boolean; useCaseDescription: string }>;
        };

        const Body = memo((props: BodyProps) => {
            const { evtAnswer } = props;

            useRerenderOnStateChange(evtAnswer);

            const { t } = useTranslation({ ReferentDialogs });

            const onValueBeingTypedChange = useConstCallback<
                TextFieldProps["onValueBeingTypedChange"]
            >(
                ({ value }) =>
                    (evtAnswer.state = {
                        ...evtAnswer.state,
                        "useCaseDescription": value,
                    }),
            );

            const { css, theme } = useStyles();

            return (
                <>
                    <TextField
                        type="text"
                        className={css({
                            "display": "block",
                            ...theme.spacing.topBottom("margin", 5),
                            "& textarea": {
                                "minWidth": 460,
                            },
                        })}
                        doRenderAsTextArea={true}
                        defaultValue={evtAnswer.state.useCaseDescription}
                        onValueBeingTypedChange={onValueBeingTypedChange}
                        inputProps_spellCheck={false}
                        label={t("useCaseDescription")}
                        helperText={t("useCaseDescription helper")}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={evtAnswer.state.isExpert}
                                onChange={(...[, isChecked]) =>
                                    (evtAnswer.state = {
                                        ...evtAnswer.state,
                                        "isExpert": isChecked,
                                    })
                                }
                            />
                        }
                        label={t("i am a technical expert")}
                    />
                </>
            );
        });

        return { Body };
    })();

    return { DeclareOneselfReferentDialog };
})();

export declare namespace ReferentDialogs {
    export type I18nScheme = {
        "expert": undefined;
        "you": undefined;
        "close": undefined;
        "declare oneself referent": undefined;
        "declare oneself referent of": { softwareName: string };
        "cancel": undefined;
        "send": undefined;
        "no longer referent": undefined;
        "useCaseDescription": undefined;
        "useCaseDescription helper": undefined;
        "i am a technical expert": undefined;
    };
}
