import { useEffect, useState, memo } from "react";
import type { ReactNode } from "react";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { NonPostableEvt } from "evt";
import type { TextFieldProps } from "onyxia-ui/TextField";
import { TextField } from "onyxia-ui/TextField";
import { Tooltip } from "onyxia-ui/Tooltip";
import { makeStyles, Text } from "ui/theme";
import { UnpackEvt } from "evt";
import { Evt } from "evt";
import type { Param0 } from "tsafe";
import { IconButton, LanguageSelect } from "ui/theme";
import Switch from "@mui/material/Switch";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";
import { useLang } from "ui/i18n";
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";

export type Props =
    | Props.ServicePassword
    | Props.Language
    | Props.Toggle
    | Props.Text
    | Props.EditableText;

export declare namespace Props {
    type Common = {
        className?: string;
    };

    export type ServicePassword = Common & {
        type: "service password";
        servicePassword: string;
        onRequestServicePasswordRenewal: () => void;
        isLocked: boolean;
    } & ICopyable;

    export type Language = Common & {
        type: "language";
    };

    export type Toggle = Common & {
        type: "toggle";
        isOn: boolean;
        onRequestToggle: () => void;
        isLocked: boolean;
    } & IGeneric;

    export type Text = Common & {
        type: "text";
        text: NonNullable<ReactNode>;
        isSensitiveInformation?: boolean;
    } & ICopyable &
        IGeneric;

    export type EditableText = Common & {
        type: "editable text";
        text: string | undefined;
        onRequestEdit: (newText: string) => void;
        onStartEdit?: () => void;
        evtAction?: NonPostableEvt<"SUBMIT EDIT">;
        getIsValidValue?: TextFieldProps["getIsValidValue"];
        isLocked: boolean;
        isSensitiveInformation?: boolean;
    } & ICopyable &
        IGeneric;

    type IGeneric = {
        title: string;
        helperText?: ReactNode;
    };

    type ICopyable = {
        onRequestCopy?: () => void;
    };
}

const flashDurationMs = 600;

export const DescriptiveField = memo((props: Props) => {
    const { t } = useTranslation({ DescriptiveField });

    const { className } = props;

    const [isFlashing, setIsFlashing] = useState(false);

    useEffect(() => {
        if (!isFlashing) return;

        const timer = setTimeout(() => setIsFlashing(false), flashDurationMs);

        return () => clearTimeout(timer);
    }, [isFlashing]);

    const onRequestCopy = useConstCallback(() => {
        assert("onRequestCopy" in props && props.onRequestCopy !== undefined);

        setIsFlashing(true);

        props.onRequestCopy();
    });

    const { TextWd, toggleIsTextHidden, isTextHidden, isSensitiveInformation } =
        (function useClosure() {
            const isSensitiveInformation = (() => {
                switch (props.type) {
                    case "text":
                    case "editable text":
                        return props.isSensitiveInformation ?? false;
                    case "service password":
                        return true;
                    default:
                        return false;
                }
            })();

            const [isTextHidden, setIsTextHidden] = useState(isSensitiveInformation);

            useEffectOnValueChange(() => {
                setIsTextHidden(isSensitiveInformation);
            }, [isSensitiveInformation]);

            const toggleIsTextHidden = useConstCallback(() =>
                setIsTextHidden(!isTextHidden),
            );

            const { TextWd } = useGuaranteedMemo(() => {
                const TextWd = memo(
                    (props: { children: NonNullable<ReactNode>; className?: string }) => (
                        <Text typo="body 1" className={props.className}>
                            {isTextHidden && typeof props.children === "string"
                                ? new Array(props.children.length).fill("•")
                                : props.children}
                        </Text>
                    ),
                );

                return { TextWd };
            }, [isTextHidden]);

            return {
                TextWd,
                toggleIsTextHidden,
                isTextHidden,
                isSensitiveInformation,
            };
        })();

    const IconButtonCopyToClipboard = useGuaranteedMemo(
        () => (props: { onClick(): void; disabled?: boolean }) =>
            (
                <Tooltip title={t("copy tooltip")}>
                    <IconButton
                        iconId="filterNone"
                        onClick={props.onClick}
                        size="small"
                        disabled={props.disabled ?? false}
                    />
                </Tooltip>
            ),
        [],
    );

    const {
        isInEditingState,
        evtTextFieldAction,
        isValueBeingTypedValid,
        onEditableTextRequestCopy,
        onStartEditButtonClick,
        onTextFieldEscapeKeyDown,
        onSubmitButtonClick,
        onValueBeingTypedChange,
        onTextFieldSubmit,
    } = (function useClosure() {
        const [isInEditingState, setIsInEditingState] = useState(false);

        const [evtTextFieldAction] = useState(() =>
            Evt.create<UnpackEvt<NonNullable<TextFieldProps["evtAction"]>>>(),
        );

        useEvt(
            ctx => {
                if (props.type !== "editable text") {
                    return;
                }

                props.evtAction?.attach(
                    action => action === "SUBMIT EDIT",
                    ctx,
                    () => evtTextFieldAction.post("TRIGGER SUBMIT"),
                );
            },

            [props?.type === "editable text" ? props.evtAction : null],
        );

        const onStartEditButtonClick = useConstCallback(() => {
            setIsInEditingState(true);
            assert(props.type === "editable text");
            props.onStartEdit?.();
        });

        const onTextFieldEscapeKeyDown = useConstCallback(() =>
            evtTextFieldAction.post("RESTORE DEFAULT VALUE"),
        );

        const onSubmitButtonClick = useConstCallback(() =>
            evtTextFieldAction.post("TRIGGER SUBMIT"),
        );

        const { isValueBeingTypedValid, onValueBeingTypedChange } =
            (function useClosure() {
                const [isValueBeingTypedValid, setIsValueBeingTypedValid] =
                    useState(false);

                const onValueBeingTypedChange = useConstCallback(
                    ({
                        isValidValue,
                    }: Param0<TextFieldProps["onValueBeingTypedChange"]>) =>
                        setIsValueBeingTypedValid(isValidValue),
                );

                return { isValueBeingTypedValid, onValueBeingTypedChange };
            })();

        const [isCopyScheduled, setIsCopyScheduled] = useState(false);

        const onTextFieldSubmit = useConstCallback<TextFieldProps["onSubmit"]>(value => {
            assert(props.type === "editable text");
            if (props.isLocked) return;

            setIsInEditingState(false);

            if (value === props.text) {
                if (isCopyScheduled) {
                    setIsCopyScheduled(false);
                    onRequestCopy();
                }

                return;
            }

            props.onRequestEdit(value);
        });

        useEffect(() => {
            if (!isCopyScheduled) return;
            setIsCopyScheduled(false);
            onRequestCopy();
        }, [props.type === "editable text" ? props.text : null]);

        useEffect(() => {
            if (!isCopyScheduled) return;
            evtTextFieldAction.post("TRIGGER SUBMIT");
        }, [isCopyScheduled]);

        const onEditableTextRequestCopy = useConstCallback(() => {
            if (isInEditingState) {
                setIsCopyScheduled(true);
            } else {
                onRequestCopy();
            }
        });

        return {
            isInEditingState,
            evtTextFieldAction,
            isValueBeingTypedValid,
            onEditableTextRequestCopy,
            onStartEditButtonClick,
            onTextFieldEscapeKeyDown,
            onSubmitButtonClick,
            onValueBeingTypedChange,
            onTextFieldSubmit,
        };
    })();

    const helperText = (() => {
        switch (props.type) {
            case "text":
            case "editable text":
            case "toggle":
                return props.helperText;
            case "service password":
                return t("service password helper text");
            default:
                return undefined;
        }
    })();

    const { lang, setLang } = useLang();

    const { classes, cx } = useStyles({
        isFlashing,
        "isHelperTextVisible": !isInEditingState,
    });

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.mainLine}>
                <div className={classes.cellTitle}>
                    <Text typo="label 1">
                        {"title" in props ? props.title : t(props.type)}
                    </Text>
                </div>
                <div className={classes.cellMiddle}>
                    {(() => {
                        switch (props.type) {
                            case "language":
                                return (
                                    <LanguageSelect
                                        doShowIcon={false}
                                        variant="big"
                                        language={lang}
                                        onLanguageChange={setLang}
                                    />
                                );
                            case "toggle":
                                return null;
                            case "service password":
                                return <TextWd>{props.servicePassword}</TextWd>;
                            case "text":
                                return <TextWd>{props.text}</TextWd>;
                            case "editable text":
                                return !isInEditingState ? (
                                    props.text === undefined ? (
                                        <TextWd className={classes.noText}>
                                            {t("not yet defined")}
                                        </TextWd>
                                    ) : (
                                        <TextWd>{props.text}</TextWd>
                                    )
                                ) : (
                                    <TextField
                                        defaultValue={props.text}
                                        onEscapeKeyDown={onTextFieldEscapeKeyDown}
                                        onEnterKeyDown={onSubmitButtonClick}
                                        evtAction={evtTextFieldAction}
                                        onSubmit={onTextFieldSubmit}
                                        getIsValidValue={props.getIsValidValue}
                                        onValueBeingTypedChange={onValueBeingTypedChange}
                                        doOnlyValidateInputAfterFistFocusLost={false}
                                        isSubmitAllowed={!props.isLocked}
                                        inputProps_autoFocus={true}
                                        selectAllTextOnFocus={true}
                                        inputProps_spellCheck={false}
                                        helperText={helperText}
                                    />
                                );
                        }
                    })()}
                </div>
                <div className={classes.cellActions}>
                    {isSensitiveInformation && (
                        <IconButton
                            iconId={isTextHidden ? "visibility" : "visibilityOff"}
                            onClick={toggleIsTextHidden}
                        />
                    )}
                    {(() => {
                        switch (props.type) {
                            case "editable text":
                                return (
                                    <>
                                        <IconButton
                                            iconId={isInEditingState ? "check" : "edit"}
                                            disabled={
                                                props.isLocked ||
                                                (isInEditingState &&
                                                    !isValueBeingTypedValid)
                                            }
                                            onClick={
                                                isInEditingState
                                                    ? onSubmitButtonClick
                                                    : onStartEditButtonClick
                                            }
                                            size="small"
                                        />
                                        {props.onRequestCopy !== undefined && (
                                            <IconButtonCopyToClipboard
                                                disabled={props.text === undefined}
                                                onClick={onEditableTextRequestCopy}
                                            />
                                        )}
                                    </>
                                );
                            case "toggle":
                                return (
                                    <Switch
                                        checked={props.isOn}
                                        onChange={
                                            props.isLocked
                                                ? undefined
                                                : props.onRequestToggle
                                        }
                                        color="primary"
                                    />
                                );
                            case "service password":
                                return (
                                    <>
                                        <IconButton
                                            iconId="replay"
                                            size="small"
                                            disabled={props.isLocked}
                                            onClick={
                                                props.onRequestServicePasswordRenewal
                                            }
                                        />
                                        {props.onRequestCopy !== undefined && (
                                            <IconButtonCopyToClipboard
                                                onClick={onRequestCopy}
                                            />
                                        )}
                                    </>
                                );
                            case "text":
                                return (
                                    props.onRequestCopy !== undefined && (
                                        <IconButtonCopyToClipboard
                                            onClick={onRequestCopy}
                                        />
                                    )
                                );
                            case "language":
                                return null;
                        }
                    })()}
                </div>
            </div>
            {helperText !== undefined && (
                <Text typo="caption" className={classes.helperText}>
                    {" "}
                    {helperText}{" "}
                </Text>
            )}
        </div>
    );
});

const useStyles = makeStyles<{ isFlashing: boolean; isHelperTextVisible: boolean }>({
    "name": { DescriptiveField },
})((theme, { isFlashing, isHelperTextVisible }) => ({
    "root": {
        "marginBottom": theme.spacing(3),
    },
    "mainLine": {
        "display": "flex",
        "& > div": {
            "display": "flex",
            "alignItems": "center",
        },
        "marginBottom": theme.spacing(2),
    },
    "cellTitle": {
        "width": 360,
    },
    "cellMiddle": {
        "flex": 1,
        "overflow": "visible",
        "& .MuiTypography-root": {
            "overflow": "hidden",
            "whiteSpace": "nowrap",
            "textOverflow": "ellipsis",
            "color": !isFlashing ? undefined : theme.colors.useCases.buttons.actionActive,
        },
        "& .MuiTextField-root": {
            "width": "100%",
            "top": 2,
        },
    },
    "cellActions": {
        "marginRight": theme.spacing(2),
    },
    "noText": {
        "color": theme.colors.useCases.typography.textDisabled,
    },
    "helperText": {
        "opacity": isHelperTextVisible ? undefined : 0,
    },
}));

export const { i18n } = declareComponentKeys<
    | Exclude<Props["type"], "text" | "editable text" | "toggle">
    | "copy tooltip"
    | "service password helper text"
    | "not yet defined"
>()({ DescriptiveField });
