import { useState, memo } from "react";
import { Fragment } from "react";
import type { ChangeEvent } from "react";
import { Button } from "ui/theme";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { CompiledData } from "sill-api";
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
import type { Param0 } from "tsafe";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { makeStyles } from "ui/theme";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import Box from "@mui/material/Box";
import { capitalize } from "tsafe/capitalize";
import { Tooltip } from "onyxia-ui/Tooltip";
import MuiLink from "@mui/material/Link";
import { Text } from "ui/theme";
import { Icon } from "ui/theme";

export type ReferentDialogsProps = {
    evtAction: NonPostableEvt<"open" | "open declare referent">;
    softwareName: string;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    onAnswer: (params: {
        isExpert: boolean;
        useCaseDescription: string;
        isPersonalUse: boolean;
    }) => void;
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
                softwareName={softwareName}
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
        softwareName: string;
        evtAction: NonPostableEvt<void>;
        referents: CompiledData.Software.WithReferent["referents"] | undefined;
        userIndexInReferents: number | undefined;
        onUserNoLongerReferent: () => void;
        onOpenDeclareBeingReferent: () => void;
    };

    const ReferentDialog = memo((props: Props) => {
        const {
            softwareName,
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

        const { css } = useStyles();

        const onDeclareOneselfReferentClick = useConstCallback(() => {
            onClose();

            onOpenDeclareBeingReferent();
        });

        const onUserNoLongerReferent = useConstCallback(() => {
            onClose();

            onUserNoLongerReferent_prop();
        });

        const { isOpenByEmail, toggleIsOpenFactory } = (function useClosure() {
            const [isOpenByEmail, setIsOpenByEmail] = useState<Record<string, boolean>>(
                {},
            );

            const toggleIsOpenFactory = useCallbackFactory(([email]: [string]) =>
                setIsOpenByEmail({
                    ...isOpenByEmail,
                    [email]: !isOpenByEmail[email],
                }),
            );

            return { isOpenByEmail, toggleIsOpenFactory };
        })();

        if (referents === undefined) {
            return null;
        }

        return (
            <Dialog
                className={css({
                    "maxWidth": "unset",
                })}
                body={
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>{t("email")}</TableCell>
                                    <TableCell align="right">
                                        {t("establishment")}
                                    </TableCell>
                                    <TableCell align="right">{t("expert")}</TableCell>
                                    <TableCell align="right">
                                        {t("institutional referent")}
                                        <Tooltip title={t("institutional referent help")}>
                                            <Icon
                                                className={css({
                                                    "fontSize": "inherit",
                                                    ...(() => {
                                                        const factor = 1;

                                                        return {
                                                            "width": `${factor}em`,
                                                            "height": `${factor}em`,
                                                        };
                                                    })(),
                                                })}
                                                iconId="help"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {referents.map(
                                    ({
                                        email,
                                        agencyName,
                                        isExpert,
                                        useCaseDescription,
                                        isPersonalUse,
                                    }) => (
                                        <Fragment key={email}>
                                            <TableRow
                                                sx={{
                                                    "& > *": { "borderBottom": "unset" },
                                                }}
                                            >
                                                <TableCell>
                                                    {useCaseDescription !== "" && (
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={toggleIsOpenFactory(
                                                                email,
                                                            )}
                                                        >
                                                            {isOpenByEmail[email] ? (
                                                                <KeyboardArrowUpIcon />
                                                            ) : (
                                                                <KeyboardArrowDownIcon />
                                                            )}
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <MuiLink
                                                        href={`mailto:${email}?subject=${encodeURIComponent(
                                                            t("mail subject", {
                                                                softwareName,
                                                            }),
                                                        )}&body=${encodeURIComponent(
                                                            t("mail body", {
                                                                softwareName,
                                                            }),
                                                        )}`}
                                                    >
                                                        {email}
                                                    </MuiLink>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {capitalize(agencyName)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {t(isExpert ? "yes" : "no")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {t(isPersonalUse ? "no" : "yes")}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    style={{
                                                        "paddingBottom": 0,
                                                        "paddingTop": 0,
                                                    }}
                                                    colSpan={6}
                                                >
                                                    <Collapse
                                                        in={isOpenByEmail[email]}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box
                                                            sx={{
                                                                "margin": 1,
                                                                "& > *": {
                                                                    "display": "inline",
                                                                },
                                                            }}
                                                        >
                                                            <Text typo="label 2">
                                                                {t(
                                                                    "use case description",
                                                                )}
                                                                :
                                                            </Text>
                                                            &nbsp;
                                                            <Text typo="body 3">
                                                                {" "}
                                                                {useCaseDescription}{" "}
                                                            </Text>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </Fragment>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export type DeclareOneselfReferentDialogProps = {
    softwareName?: string;
    evtOpen: NonPostableEvt<void>;
    onAnswer: (params: {
        isExpert: boolean;
        useCaseDescription: string;
        isPersonalUse: boolean;
    }) => void;
};

export const { DeclareOneselfReferentDialog } = (() => {
    const DeclareOneselfReferentDialog = memo(
        (props: DeclareOneselfReferentDialogProps) => {
            const { evtOpen, onAnswer, softwareName } = props;

            const [isOpen, setIsOpen] = useState(false);

            useEvt(ctx => evtOpen.attach(ctx, () => setIsOpen(true)), [evtOpen]);

            const evtAnswer = useConst(() =>
                Evt.create<Param0<typeof onAnswer>>({
                    "isExpert": false,
                    "useCaseDescription": "",
                    "isPersonalUse": true,
                }),
            );
            const { t } = useTranslation({ ReferentDialogs });

            return (
                <Dialog
                    title={
                        softwareName !== undefined
                            ? t("declare oneself referent of", { softwareName })
                            : undefined
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
        },
    );

    const { Buttons } = (() => {
        type BodyProps = {
            evtAnswer: StatefulEvt<Param0<DeclareOneselfReferentDialogProps["onAnswer"]>>;
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
            evtAnswer: StatefulEvt<Param0<DeclareOneselfReferentDialogProps["onAnswer"]>>;
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

            const { classes } = useStyles();

            const onRadioGroupChange = useConstCallback(
                (event: ChangeEvent<HTMLInputElement>) => {
                    evtAnswer.state = {
                        ...evtAnswer.state,
                        "isPersonalUse":
                            (event.target as HTMLInputElement).value === "true",
                    };
                },
            );

            return (
                <>
                    <TextField
                        type="text"
                        className={classes.textField}
                        doRenderAsTextArea={true}
                        defaultValue={evtAnswer.state.useCaseDescription}
                        onValueBeingTypedChange={onValueBeingTypedChange}
                        inputProps_spellCheck={false}
                        label={t("use case description")}
                        helperText={t("use case description helper")}
                    />
                    {(() => {
                        const id = "referent-level";

                        return (
                            <FormControl className={classes.radio}>
                                <FormLabel id={id}>
                                    {t("on behalf of who are you referent")}
                                </FormLabel>
                                <RadioGroup
                                    aria-labelledby={id}
                                    value={`${evtAnswer.state.isPersonalUse}`}
                                    onChange={onRadioGroupChange}
                                >
                                    <FormControlLabel
                                        value="true"
                                        control={<Radio />}
                                        label={t("on my own behalf")}
                                    />
                                    <FormControlLabel
                                        value="false"
                                        control={<Radio />}
                                        label={t("on my establishment behalf")}
                                    />
                                </RadioGroup>
                            </FormControl>
                        );
                    })()}

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

        const useStyles = makeStyles()(theme => ({
            "textField": {
                "marginTop": theme.spacing(3),

                "display": "block",
                "& textarea": {
                    "minWidth": 460,
                },
            },
            "radio": {
                "display": "block",
                "marginTop": theme.spacing(6),
                "marginBottom": theme.spacing(4),
            },
        }));

        return { Body };
    })();

    return { DeclareOneselfReferentDialog };
})();

export const { i18n } = declareComponentKeys<
    | "close"
    | "declare oneself referent"
    | { K: "declare oneself referent of"; P: { softwareName: string } }
    | "cancel"
    | "send"
    | "no longer referent"
    | "use case description"
    | "use case description helper"
    | "i am a technical expert"
    | "on behalf of who are you referent"
    | "on my own behalf"
    | "on my establishment behalf"
    | "yes"
    | "no"
    | "email"
    | "establishment"
    | "expert"
    | "institutional referent"
    | "institutional referent help"
    | { K: "mail subject"; P: { softwareName: string } }
    | { K: "mail body"; P: { softwareName: string } }
>()({ ReferentDialogs });
