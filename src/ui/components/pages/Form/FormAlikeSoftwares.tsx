import { useMemo, useState, memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "ui/theme";
import { Button } from "ui/theme";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { assert } from "tsafe/assert";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import type { SoftwareRef } from "sill-api";
import { exclude } from "tsafe/exclude";
import type { Link } from "type-route";
import { Picker } from "onyxia-ui/Picker";
import type { PickerProps } from "onyxia-ui/Picker";
import { useStateRef } from "powerhooks/useStateRef";
import { Text } from "ui/theme";
import { CustomTag } from "ui/components/shared/Tags/CustomTag";
import { Tag } from "onyxia-ui/Tag";
import { IconButton } from "ui/theme";

export type Props = {
    className?: string;
    alikeSoftwares: SoftwareRef[];
    onAlikeSoftwaresChange: (alikeSoftwares: SoftwareRef[]) => void;
    softwareRefs: SoftwareRef[];
    softwareNameBySoftwareId: Record<number, string>;
    getLinkToSoftwareCard: (softwareName: string) => Link;
};

export const FormAlikeSoftwares = memo((props: Props) => {
    const {
        className,
        alikeSoftwares,
        onAlikeSoftwaresChange,
        softwareRefs,
        getLinkToSoftwareCard,
        softwareNameBySoftwareId
    } = props;

    const { classes } = useStyles();

    const knownAlikeSoftwares = useMemo(
        () =>
            alikeSoftwares
                .map(softwareRef => (softwareRef.isKnown ? softwareRef : undefined))
                .filter(exclude(undefined)),
        [alikeSoftwares]
    );
    const unknownAlikeSoftwares = useMemo(
        () =>
            alikeSoftwares
                .map(softwareRef => (softwareRef.isKnown ? undefined : softwareRef))
                .filter(exclude(undefined)),
        [alikeSoftwares]
    );

    const knownSoftwareRefs = useMemo(
        () =>
            softwareRefs
                .map(softwareRef => (softwareRef.isKnown ? softwareRef : undefined))
                .filter(exclude(undefined)),
        [softwareRefs]
    );
    const unknownSoftwareRefs = useMemo(
        () =>
            softwareRefs
                .map(softwareRef => (softwareRef.isKnown ? undefined : softwareRef))
                .filter(exclude(undefined)),
        [softwareRefs]
    );

    const onKnownAlikeSoftwaresChange = useConstCallback<
        KnownProps["onAlikeSoftwaresChange"]
    >(knownAlikeSoftwares =>
        onAlikeSoftwaresChange([...knownAlikeSoftwares, ...unknownAlikeSoftwares])
    );

    const onUnknownAlikeSoftwaresChange = useConstCallback<
        UnknownProps["onAlikeSoftwaresChange"]
    >(unknownAlikeSoftwares =>
        onAlikeSoftwaresChange([...knownAlikeSoftwares, ...unknownAlikeSoftwares])
    );

    return (
        <div className={className}>
            <Known
                alikeSoftwares={knownAlikeSoftwares}
                softwareRefs={knownSoftwareRefs}
                onAlikeSoftwaresChange={onKnownAlikeSoftwaresChange}
                softwareNameBySoftwareId={softwareNameBySoftwareId}
                getLinkToSoftwareCard={getLinkToSoftwareCard}
            />
            <Unknown
                className={classes.unknown}
                alikeSoftwares={unknownAlikeSoftwares}
                softwareRefs={unknownSoftwareRefs}
                onAlikeSoftwaresChange={onUnknownAlikeSoftwaresChange}
            />
        </div>
    );
});

const useStyles = makeStyles({ "name": { FormAlikeSoftwares } })(theme => ({
    "unknown": {
        "marginTop": theme.spacing(4)
    }
}));

type KnownProps = {
    alikeSoftwares: SoftwareRef.Known[];
    onAlikeSoftwaresChange: (alikeSoftwares: SoftwareRef.Known[]) => void;
    softwareRefs: SoftwareRef.Known[];
    softwareNameBySoftwareId: Record<number, string>;
    getLinkToSoftwareCard: (softwareName: string) => Link;
};

const { Known } = (() => {
    const Known = memo((props: KnownProps) => {
        const {
            alikeSoftwares,
            onAlikeSoftwaresChange,
            softwareRefs,
            softwareNameBySoftwareId,
            getLinkToSoftwareCard
        } = props;

        const evtPickerAction = useConst(() => Evt.create<PickerProps["evtAction"]>());

        const buttonRef = useStateRef<HTMLButtonElement>(null);

        const { t } = useTranslation({ FormAlikeSoftwares });

        const { classes, css, cx } = useStyles();

        const onSelectOption = useConstCallback<PickerProps["onSelectedOption"]>(params =>
            onAlikeSoftwaresChange(
                params.isSelect
                    ? [
                          ...alikeSoftwares,
                          {
                              "isKnown": true,
                              "softwareId":
                                  (assert(!params.isNewOption), parseInt(params.optionId))
                          }
                      ]
                    : alikeSoftwares.filter(
                          softwareRef =>
                              softwareRef.softwareId !== parseInt(params.optionId)
                      )
            )
        );

        const onSoftwareTagRemoveFactory = useCallbackFactory(([softwareId]: [number]) =>
            onAlikeSoftwaresChange(
                alikeSoftwares.filter(
                    softwareRef => softwareRef.softwareId !== softwareId
                )
            )
        );

        const onSoftwareTagClickFactory = useCallbackFactory(([softwareId]: [number]) =>
            window.open(
                getLinkToSoftwareCard(softwareNameBySoftwareId[softwareId]).href,
                "_blank"
            )
        );

        return (
            <div>
                <Text typo="caption" className={classes.caption}>
                    {t("similar to")}
                </Text>
                {alikeSoftwares
                    .map(softwareRef => (softwareRef.isKnown ? softwareRef : undefined))
                    .filter(exclude(undefined))
                    .map(({ softwareId }) => (
                        <SoftwareTag
                            className={classes.tag}
                            key={softwareId}
                            softwareName={softwareNameBySoftwareId[softwareId]}
                            onClick={onSoftwareTagClickFactory(softwareId)}
                            onRemove={onSoftwareTagRemoveFactory(softwareId)}
                        />
                    ))}
                {alikeSoftwares.length === 0 && (
                    <Text
                        typo="body 1"
                        color="disabled"
                        className={css({ "display": "inline" })}
                    >
                        {t("no similar software")}
                    </Text>
                )}
                <SoftwareTag
                    softwareName={"X"}
                    onRemove={() => {
                        /*nothing"*/
                    }}
                    className={cx(classes.tag, css({ "opacity": 0 }))}
                />
                <br />
                <Button
                    className={classes.button}
                    ref={buttonRef}
                    startIcon="add"
                    variant="secondary"
                    onClick={() =>
                        evtPickerAction.post({
                            "action": "open",
                            "anchorEl":
                                (assert(buttonRef.current !== null), buttonRef.current)
                        })
                    }
                >
                    {t("add")}
                </Button>
                <Picker
                    evtAction={evtPickerAction}
                    onSelectedOption={onSelectOption}
                    options={softwareRefs.map(({ softwareId }) => ({
                        "id": `${softwareId}`,
                        "label": softwareNameBySoftwareId[softwareId]
                    }))}
                    selectedOptionIds={alikeSoftwares.map(
                        ({ softwareId }) => `${softwareId}`
                    )}
                    texts={{
                        "done": t("done")
                    }}
                />
            </div>
        );
    });

    const useStyles = makeStyles()(theme => ({
        "caption": {
            "marginBottom": theme.spacing(2)
        },
        "tag": {
            "marginRight": theme.spacing(1),
            "marginBottom": theme.spacing(1)
        },
        "button": {
            "marginTop": theme.spacing(2)
        }
    }));

    return { Known };
})();

type UnknownProps = {
    className?: string;
    alikeSoftwares: SoftwareRef.Unknown[];
    onAlikeSoftwaresChange: (alikeSoftwares: SoftwareRef.Unknown[]) => void;
    softwareRefs: SoftwareRef.Unknown[];
};

const { Unknown } = (() => {
    const Unknown = memo((props: UnknownProps) => {
        const {
            className,
            alikeSoftwares,
            onAlikeSoftwaresChange,
            softwareRefs: softwareRefs_props
        } = props;

        const [createdSoftwareNames, setCreatedSoftwareNames] = useState<string[]>([]);

        const softwareRefs = useMemo(
            () => [
                ...softwareRefs_props,
                ...createdSoftwareNames.map(softwareName => ({
                    "isKnown": false as const,
                    softwareName
                }))
            ],
            [softwareRefs_props, createdSoftwareNames]
        );

        const evtPickerAction = useConst(() => Evt.create<PickerProps["evtAction"]>());

        const buttonRef = useStateRef<HTMLButtonElement>(null);

        const { t } = useTranslation({ FormAlikeSoftwares });

        const { classes, css, cx } = useStyles();

        const onSelectOption = useConstCallback<PickerProps["onSelectedOption"]>(
            params => {
                if (params.isSelect && params.isNewOption) {
                    setCreatedSoftwareNames([
                        ...createdSoftwareNames,
                        params.optionLabel
                    ]);
                }

                onAlikeSoftwaresChange(
                    params.isSelect
                        ? [
                              ...alikeSoftwares,
                              {
                                  "isKnown": false,
                                  "softwareName": params.isNewOption
                                      ? params.optionLabel
                                      : params.optionId
                              }
                          ]
                        : alikeSoftwares.filter(
                              softwareRef => softwareRef.softwareName !== params.optionId
                          )
                );
            }
        );

        const onSoftwareTagRemoveFactory = useCallbackFactory(
            ([softwareName]: [string]) =>
                onAlikeSoftwaresChange(
                    alikeSoftwares.filter(
                        softwareRef => softwareRef.softwareName !== softwareName
                    )
                )
        );

        return (
            <div className={className}>
                <Text typo="caption" className={classes.caption}>
                    {t("alternative to")}
                </Text>
                {alikeSoftwares.map(({ softwareName }) => (
                    <SoftwareTag
                        className={classes.tag}
                        key={softwareName}
                        softwareName={softwareName}
                        onRemove={onSoftwareTagRemoveFactory(softwareName)}
                    />
                ))}
                {alikeSoftwares.length === 0 && (
                    <Text
                        typo="body 1"
                        color="disabled"
                        className={css({ "display": "inline" })}
                    >
                        {t("no alternative")}
                    </Text>
                )}
                <SoftwareTag
                    softwareName={"X"}
                    onRemove={() => {
                        /*nothing"*/
                    }}
                    className={cx(classes.tag, css({ "opacity": 0 }))}
                />
                <br />
                <Button
                    className={classes.button}
                    ref={buttonRef}
                    startIcon="add"
                    variant="secondary"
                    onClick={() =>
                        evtPickerAction.post({
                            "action": "open",
                            "anchorEl":
                                (assert(buttonRef.current !== null), buttonRef.current)
                        })
                    }
                >
                    {t("add")}
                </Button>
                <Picker
                    evtAction={evtPickerAction}
                    onSelectedOption={onSelectOption}
                    options={softwareRefs.map(({ softwareName }) => ({
                        "id": softwareName,
                        "label": softwareName
                    }))}
                    selectedOptionIds={alikeSoftwares.map(
                        ({ softwareName }) => softwareName
                    )}
                    texts={{
                        "done": t("done"),
                        "create option": ({ optionLabel }) => `${t("add")} ${optionLabel}`
                    }}
                />
            </div>
        );
    });

    const useStyles = makeStyles()(theme => ({
        "caption": {
            "marginBottom": theme.spacing(2)
        },
        "tag": {
            "marginRight": theme.spacing(1),
            "marginBottom": theme.spacing(1)
        },
        "button": {
            "marginTop": theme.spacing(2)
        }
    }));

    return { Unknown };
})();

const { SoftwareTag } = (() => {
    type Props = {
        className?: string;
        softwareName: string;
        onRemove: () => void;
        onClick?: () => void;
    };

    const SoftwareTag = memo((props: Props) => {
        const { className, softwareName, onRemove, onClick } = props;

        const { classes, cx } = useStyles({ "isKnown": onClick !== undefined });

        return (
            <Tag
                className={cx(classes.root, className)}
                onClick={onClick}
                text={
                    <div className={classes.bodyWrapper}>
                        <Text className={classes.text} typo="body 3">
                            {softwareName}
                        </Text>
                        <IconButton
                            className={classes.icon}
                            iconId="cancel"
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        />
                    </div>
                }
            />
        );
    });

    const useStyles = makeStyles<{ isKnown: boolean }>({
        "name": { CustomTag }
    })((theme, { isKnown }) => ({
        "root": {
            "backgroundColor":
                theme.colors.palette[isKnown ? "greenSuccess" : "orangeWarning"].light
        },
        "text": {
            "color": theme.colors.palette.dark.main,
            "paddingLeft": theme.spacing(2)
        },
        "icon": {
            "& > svg": {
                "color": theme.colors.palette.dark.greyVariant2
            }
        },
        "bodyWrapper": {
            "display": "flex",
            "alignItems": "center"
        }
    }));

    return { SoftwareTag };
})();

export const { i18n } = declareComponentKeys<
    | "done"
    | "similar to"
    | "add"
    | "alternative to"
    | "no similar software"
    | "no alternative"
>()({ FormAlikeSoftwares });
