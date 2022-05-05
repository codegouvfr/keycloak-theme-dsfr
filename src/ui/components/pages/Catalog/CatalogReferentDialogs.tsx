import { useState, memo } from "react";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { CompiledData } from "sill-api";
import { Markdown } from "ui/tools/Markdown";
import { Dialog } from "onyxia-ui/Dialog";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { Evt } from "evt";
import Checkbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useConst } from "powerhooks/useConst";
import { useStyles } from "ui/theme";

export type Props = {
    evtAction: NonPostableEvt<"open">;
    softwareName: string;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    onDeclareOneselfReferent: (params: { isExpert: boolean }) => void;
    onUserNoLongerReferent: () => void;
};

export const CatalogReferentDialogs = memo((props: Props) => {
    const {
        evtAction,
        softwareName,
        referents,
        userIndexInReferents,
        onUserNoLongerReferent,
        onDeclareOneselfReferent,
    } = props;

    const evtDeclareOneselfReferentDialogAction = useConst(() => Evt.create<"open">());

    const onOpenDeclareBeingReferent = useConstCallback(() =>
        evtDeclareOneselfReferentDialogAction.post("open"),
    );

    return (
        <>
            <ReferentDialog
                referents={referents}
                userIndexInReferents={userIndexInReferents}
                evtAction={evtAction}
                onOpenDeclareBeingReferent={onOpenDeclareBeingReferent}
                onUserNoLongerReferent={onUserNoLongerReferent}
            />
            <DeclareOneselfReferentDialog
                softwareName={softwareName}
                evtAction={evtDeclareOneselfReferentDialogAction}
                onDeclareOneselfReferent={onDeclareOneselfReferent}
            />
        </>
    );
});

export const { ReferentDialog } = (() => {
    type Props = {
        evtAction: NonPostableEvt<"open">;
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
            onUserNoLongerReferent,
        } = props;

        const [isOpen, setIsOpen] = useState(false);

        const onClose = useConstCallback(() => setIsOpen(false));

        const { t } = useTranslation({ CatalogReferentDialogs });

        useEvt(
            ctx =>
                evtAction.attach(
                    action => action === "open",
                    ctx,
                    () => setIsOpen(true),
                ),
            [evtAction],
        );

        const { css, theme } = useStyles();

        const onDeclareOneselfReferentClick = useConstCallback(() => {
            onClose();

            onOpenDeclareBeingReferent();
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

const { DeclareOneselfReferentDialog } = (() => {
    type Props = {
        softwareName: string;
        evtAction: NonPostableEvt<"open">;
        onDeclareOneselfReferent: (params: { isExpert: boolean }) => void;
    };

    const DeclareOneselfReferentDialog = memo((props: Props) => {
        const { evtAction, onDeclareOneselfReferent, softwareName } = props;

        const [isOpen, setIsOpen] = useState(false);

        const onClose = useConstCallback(() => setIsOpen(false));

        const { t } = useTranslation({ CatalogReferentDialogs });

        useEvt(
            ctx =>
                evtAction.attach(
                    action => action === "open",
                    ctx,
                    () => setIsOpen(true),
                ),
            [evtAction],
        );

        const [isExpert, setIsExpert] = useState(false);

        const onCheckboxChange = useConstCallback<CheckboxProps["onChange"]>(
            (...[, isChecked]) => setIsExpert(isChecked),
        );

        const onDeclareOneselfReferentClick = useConstCallback(() => {
            onDeclareOneselfReferent({ isExpert });
            onClose();
        });

        return (
            <Dialog
                title={t("declare oneself referent of", { softwareName })}
                body={<></>}
                buttons={
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isExpert}
                                    onChange={onCheckboxChange}
                                />
                            }
                            label={t("expert")}
                        />
                        <Button onClick={onDeclareOneselfReferentClick}>
                            {t("send")}
                        </Button>
                        <Button onClick={onClose} variant="secondary">
                            {t("cancel")}
                        </Button>
                    </>
                }
                isOpen={isOpen}
                onClose={onClose}
            />
        );
    });

    return { DeclareOneselfReferentDialog };
})();

export declare namespace CatalogReferentDialogs {
    export type I18nScheme = {
        "expert": undefined;
        "you": undefined;
        "close": undefined;
        "declare oneself referent": undefined;
        "declare oneself referent of": { softwareName: string };
        "cancel": undefined;
        "send": undefined;
        "no longer referent": undefined;
    };
}
