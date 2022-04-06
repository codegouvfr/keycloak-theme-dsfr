import { useState, memo } from "react";
import { makeStyles, Text } from "ui/theme";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { capitalize } from "tsafe/capitalize";
import { CompiledData } from "sill-api";
import { useDomRect } from "powerhooks/useDomRect";
import { Markdown } from "ui/tools/Markdown";
import { smartTrim } from "ui/tools/smartTrim";
import type { Link } from "type-route";
import { useResolveLocalizedString } from "ui/i18n/useResolveLocalizedString";
import { Tag } from "onyxia-ui/Tag";
import { assert } from "tsafe/assert";
import { Dialog } from "onyxia-ui/Dialog";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import Checkbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export type Props = {
    className?: string;
    software: CompiledData.Software;
    openLink: Link;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    onDeclareOneselfReferent: (params: { isExpert: boolean }) => void;
    onLogin: () => void;
};

export const CatalogCard = memo((props: Props) => {
    const {
        className,
        software,
        openLink,
        referents,
        userIndexInReferents,
        onLogin,
        onDeclareOneselfReferent,
    } = props;

    const { classes, cx, css } = useStyles();

    const { t } = useTranslation({ CatalogCard });

    const { imgRef, isBanner } = (function useClosure() {
        const {
            ref: imgRef,
            domRect: { height, width },
        } = useDomRect();

        const isBanner = width === 0 || height === 0 ? undefined : width > height * 1.7;

        return { imgRef, isBanner };
    })();

    const { resolveLocalizedString } = useResolveLocalizedString();

    const evtReferentDialogAction = useConst(() => Evt.create<"open">());

    const onShowReferentClick = useConstCallback(async () => {
        if (referents === undefined) {
            onLogin();
            return;
        }

        evtReferentDialogAction.post("open");
    });

    const evtDeclareOneselfReferentDialogAction = useConst(() => Evt.create<"open">());

    const onOpenDeclareBeingReferent = useConstCallback(() =>
        evtDeclareOneselfReferentDialogAction.post("open"),
    );

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.aboveDivider}>
                {(() => {
                    const { logoUrl } = software.wikidataData ?? {};

                    return (
                        <>
                            {logoUrl !== undefined && (
                                <img
                                    ref={imgRef}
                                    src={logoUrl}
                                    alt=""
                                    className={css({ "height": "100%" })}
                                />
                            )}
                            {(isBanner === false || logoUrl === undefined) && (
                                <Text className={classes.title} typo="object heading">
                                    {smartTrim({
                                        "maxLength": 28,
                                        "minCharAtTheEnd": 0,
                                        "text": capitalize(software.name),
                                    })}
                                </Text>
                            )}
                        </>
                    );
                })()}
                <div style={{ "flex": 1 }} />
                {(() => {
                    if (userIndexInReferents === undefined) {
                        return null;
                    }

                    assert(referents !== undefined);

                    return (
                        <Tag
                            text={t(
                                referents.length === 1
                                    ? "you are the referent"
                                    : "you are referent",
                            )}
                        />
                    );
                })()}
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.body}>
                    <Markdown>
                        {`${capitalize(software.name)}, ${resolveLocalizedString({
                            "en": software.wikidataData?.descriptionEn,
                            "fr":
                                software.wikidataData?.descriptionFr ?? software.function,
                        })}`}
                    </Markdown>
                </div>
                <div className={classes.buttonsWrapper}>
                    <Button
                        className={classes.cardButtons}
                        variant="ternary"
                        {...openLink}
                        doOpenNewTabIfHref={false}
                    >
                        {t("learn more")}
                    </Button>
                    {(() => {
                        const url = software.testUrls[0]?.url ?? undefined;

                        return (
                            url !== undefined && (
                                <Button
                                    className={classes.cardButtons}
                                    href={url}
                                    variant="ternary"
                                >
                                    {t("try it")}
                                </Button>
                            )
                        );
                    })()}
                    {referents === undefined || referents.length !== 0 ? (
                        <Button variant="secondary" onClick={onShowReferentClick}>
                            {t("show referents")}
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={onOpenDeclareBeingReferent}>
                            {t("declare oneself referent")}
                        </Button>
                    )}
                    <ReferentDialog
                        referents={referents}
                        userIndexInReferents={userIndexInReferents}
                        evtAction={evtReferentDialogAction}
                        onDeclareOneselfReferent={onOpenDeclareBeingReferent}
                    />
                    <DeclareOneselfReferentDialog
                        softwareName={software.name}
                        evtAction={evtDeclareOneselfReferentDialogAction}
                        onDeclareOneselfReferent={onDeclareOneselfReferent}
                    />
                </div>
            </div>
        </div>
    );
});

const { ReferentDialog } = (() => {
    type Props = {
        evtAction: NonPostableEvt<"open">;
        referents: CompiledData.Software.WithReferent["referents"] | undefined;
        userIndexInReferents: number | undefined;
        onDeclareOneselfReferent: () => void;
    };

    const ReferentDialog = memo((props: Props) => {
        const { evtAction, referents, userIndexInReferents, onDeclareOneselfReferent } =
            props;

        const [isOpen, setIsOpen] = useState(false);

        const onClose = useConstCallback(() => setIsOpen(false));

        const { t } = useTranslation({ CatalogCard });

        useEvt(
            ctx =>
                evtAction.attach(
                    action => action === "open",
                    ctx,
                    () => setIsOpen(true),
                ),
            [evtAction],
        );

        const { classes } = useStyles();

        const onDeclareOneselfReferentClick = useConstCallback(() => {
            onClose();

            onDeclareOneselfReferent();
        });

        if (referents === undefined) {
            return null;
        }

        return (
            <Dialog
                body={
                    <Markdown className={classes.dialogBody}>
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
                        {userIndexInReferents === undefined && (
                            <Button onClick={onDeclareOneselfReferentClick}>
                                {t("declare oneself referent")}
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

        const { t } = useTranslation({ CatalogCard });

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

export declare namespace CatalogCard {
    export type I18nScheme = {
        "learn more": undefined;
        "try it": undefined;
        "you are referent": undefined;
        "you are the referent": undefined;
        "show referents": undefined;
        "close": undefined;
        "expert": undefined;
        "you": undefined;
        "declare oneself referent": undefined;
        "declare oneself referent of": { softwareName: string };
        "cancel": undefined;
        "send": undefined;
    };
}

const useStyles = makeStyles<void, "cardButtons">({
    "name": { CatalogCard },
})((theme, _params, classes) => ({
    "root": {
        "borderRadius": 8,
        "boxShadow": theme.shadows[1],
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "&:hover": {
            "boxShadow": theme.shadows[6],
            [`& .${classes.cardButtons}`]: {
                "visibility": "visible",
            },
        },
        "display": "flex",
        "flexDirection": "column",
    },
    "aboveDivider": {
        "padding": theme.spacing({ "topBottom": 2, "rightLeft": 4 }),
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
        "boxSizing": "border-box",
        "display": "flex",
        "alignItems": "center",
        "height": 45,
    },
    "title": {
        "marginLeft": theme.spacing(3),
    },
    "belowDivider": {
        "padding": theme.spacing(4),
        "paddingTop": theme.spacing(3),
        "flex": 1,
        "display": "flex",
        "flexDirection": "column",
        "overflow": "hidden",
    },
    "body": {
        "margin": 0,
        "flex": 1,
        //TODO: Commented out for mozilla (longer one always have scroll in a grid)
        //"overflow": "auto"
    },
    "bodyTypo": {
        "color": theme.colors.useCases.typography.textSecondary,
    },
    "buttonsWrapper": {
        "display": "flex",
        "justifyContent": "flex-end",
        "marginTop": theme.spacing(4),
    },
    "cardButtons": {
        "marginRight": theme.spacing(2),
        "visibility": "hidden",
    },
    "dialogBody": {
        "& ul": {
            "paddingInlineStart": 0,
        },
        "margin": theme.spacing(4),
    },
}));
