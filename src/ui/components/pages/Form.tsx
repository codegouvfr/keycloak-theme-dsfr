import { useEffect, Fragment, memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "ui/theme";
import { useThunks, selectors, useSelector, pure } from "ui/coreApi";
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
import { Equals } from "tsafe";
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
import { GitHubPicker } from "onyxia-ui/GitHubPicker";
import type { GitHubPickerProps } from "onyxia-ui/GitHubPicker";
import { Tag } from "onyxia-ui/Tag";
import type { UnpackEvt } from "evt";
import { useStateRef } from "powerhooks/useStateRef";
import { Text } from "ui/theme";

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
    const { displayableFieldErrorByFieldName } = useSelector(
        selectors.softwareForm.displayableFieldErrorByFieldName,
    );
    const state = useSelector(state => state.softwareForm);

    const { showSplashScreen, hideSplashScreen } = useSplashScreen();

    useEffect(() => {
        softwareFormThunks.initialize({ "softwareId": route.params.softwareId });
    }, [route.params.softwareId]);

    useEffect(() => {
        switch (state.stateDescription) {
            case "not initialized":
                break;
            case "form submitted":
                hideSplashScreen();
                softwareFormThunks.initialize({ "softwareId": undefined });

                //DODO: Remove delay, push immediately, after we update to react 18
                queueMicrotask(() =>
                    routes
                        .card({
                            "name": state.softwareName,
                        })
                        .push(),
                );
                break;
            case "form ready":
                if (state.isSubmitting) {
                    showSplashScreen({ "enableTransparency": true });
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

    const onDeclareOneselfReferentDialogAnswer = useConstCallback<
        DeclareOneselfReferentDialogProps["onAnswer"]
    >(createReferentParams => softwareFormThunks.submit({ createReferentParams }));

    if (state.stateDescription !== "form ready") {
        return null;
    }

    assert(isSubmittable !== undefined);
    assert(displayableFieldErrorByFieldName !== undefined);

    return (
        <>
            <div className={cx(classes.root, className)}>
                <PageHeader
                    mainIcon="add"
                    title={t(state.softwareId === undefined ? "title add" : "title edit")}
                    helpTitle={t(
                        state.softwareId === undefined
                            ? "help title add"
                            : "help title edit",
                    )}
                    helpContent={t("help")}
                    helpIcon="sentimentSatisfied"
                />
                <div className={classes.fields}>
                    {objectKeys(state.valueByFieldName)
                        .map(
                            fieldName =>
                                [
                                    fieldName,
                                    displayableFieldErrorByFieldName[fieldName],
                                ] as const,
                        )
                        .map(([fieldName, fieldError]) => (
                            <Fragment key={fieldName}>
                                {(() => {
                                    const value = state.valueByFieldName[fieldName];

                                    switch (typeof value) {
                                        case "string":
                                        case "number":
                                            return (
                                                <TextField
                                                    label={`${t(fieldName)}${
                                                        !pure.softwareForm.getIsOptionalField(
                                                            fieldName,
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
                                                                fieldName,
                                                            );

                                                        if (typeof value === "number") {
                                                            return ({
                                                                value,
                                                            }: Param0<
                                                                TextFieldProps["onValueBeingTypedChange"]
                                                            >) =>
                                                                cb({
                                                                    "value":
                                                                        value === ""
                                                                            ? -1
                                                                            : parseInt(
                                                                                  value,
                                                                              ),
                                                                });
                                                        }

                                                        return cb;
                                                    })()}
                                                    onEscapeKeyDown={onEscapeKeyFactory(
                                                        fieldName,
                                                    )}
                                                    isCircularProgressShown={
                                                        state.isAutofillInProgress
                                                    }
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
                                        case "object":
                                            return (
                                                <Tags
                                                    tags={state.tags}
                                                    selectedTags={value}
                                                    onSelectedTags={selectedTags =>
                                                        softwareFormThunks.changeFieldValue(
                                                            {
                                                                "fieldName": "tags",
                                                                "value": selectedTags,
                                                            },
                                                        )
                                                    }
                                                />
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
                                softwareFormThunks.submit({
                                    "createReferentParams": undefined,
                                });
                            }
                        }}
                    >
                        {t("send")}
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
        "maxWidth": breakpointsValues.lg,
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

const { Tags } = (() => {
    type Props = {
        tags: string[];
        selectedTags: string[];
        onSelectedTags: (selectedTags: string[]) => void;
    };

    function Tags(props: Props) {
        const { tags, selectedTags, onSelectedTags } = props;

        const evtGitHubPickerAction = useConst(() =>
            Evt.create<UnpackEvt<GitHubPickerProps["evtAction"]>>(),
        );

        const buttonRef = useStateRef<HTMLButtonElement>(null);

        const { t } = useTranslation({ Form });

        const { classes } = useStyles();

        return (
            <div>
                <Text typo="caption" className={classes.caption}>
                    {t("tags")}
                </Text>
                {selectedTags.map(tag => (
                    <CustomTag key={tag} tag={tag} className={classes.tag} />
                ))}
                <Button
                    className={classes.button}
                    ref={buttonRef}
                    startIcon="add"
                    variant="ternary"
                    onClick={() =>
                        evtGitHubPickerAction.post({
                            "action": "open",
                            "anchorEl":
                                (assert(buttonRef.current !== null), buttonRef.current),
                            onSelectedTags,
                            "preSelectedTags": selectedTags,
                            tags,
                        })
                    }
                >
                    {t("change tags", { "selectedTagsCount": selectedTags.length })}
                </Button>
                <GitHubPicker
                    evtAction={evtGitHubPickerAction}
                    getTagColor={tag => getTagColor(tag).color}
                    //TODO: i18n
                    t={(_, { tag }) => `Create tag ${tag}`}
                    label="Software tags"
                />
            </div>
        );
    }

    const useStyles = makeStyles()(theme => ({
        "caption": {
            "marginBottom": theme.spacing(2),
        },
        "tag": {
            "marginRight": theme.spacing(1),
        },
        "button": {
            "marginTop": theme.spacing(2),
        },
    }));

    return { Tags };
})();

export const { i18n } = declareComponentKeys<
    | FieldErrorMessageKey
    | FieldName
    | `${FieldName} helper`
    | "send"
    | "cancel"
    | "title add"
    | "title edit"
    | "help title add"
    | "help title edit"
    | "help"
    | { K: "change tags"; P: { selectedTagsCount: number } }
>()({ Form });

type TagColor = {
    color: string;
    isContrastTextWhite: boolean;
};

const tagColors: TagColor[] = [
    {
        "color": "#ee0701",
        "isContrastTextWhite": true,
    },
    {
        "color": "#84b6eb",
        "isContrastTextWhite": false,
    },
    {
        "color": "#bfe5bf",
        "isContrastTextWhite": false,
    },
    {
        "color": "#bcf5db",
        "isContrastTextWhite": false,
    },
    {
        "color": "#e99695",
        "isContrastTextWhite": false,
    },
    {
        "color": "#fbca04",
        "isContrastTextWhite": false,
    },
    {
        "color": "#ff7619",
        "isContrastTextWhite": true,
    },
    {
        "color": "#0e8a16",
        "isContrastTextWhite": true,
    },
    {
        "color": "#eeeeee",
        "isContrastTextWhite": false,
    },
    {
        "color": "#cc317c",
        "isContrastTextWhite": true,
    },
    {
        "color": "#5319e7",
        "isContrastTextWhite": true,
    },
    {
        "color": "#d4c5f9",
        "isContrastTextWhite": false,
    },
    {
        "color": "#b4a8d1",
        "isContrastTextWhite": false,
    },
    {
        "color": "#000000",
        "isContrastTextWhite": true,
    },
    {
        "color": "#555555",
        "isContrastTextWhite": true,
    },
];

function getTagColor(tag: string): TagColor {
    return tagColors[
        Array.from(tag)
            .map(char => char.charCodeAt(0))
            .reduce((p, c) => p + c, 0) % tagColors.length
    ];
}

const { CustomTag } = (() => {
    type Props = {
        className?: string;
        tag: string;
    };

    const CustomTag = memo((props: Props) => {
        const { tag, className } = props;

        const { classes, cx } = useStyles({ "tagColor": getTagColor(tag) });

        return <Tag className={cx(classes.root, className)} text={tag} />;
    });

    const useStyles = makeStyles<{ tagColor: TagColor }>({ "name": { CustomTag } })(
        (theme, { tagColor }) => ({
            "root": {
                "backgroundColor": tagColor.color,
                "& > *": {
                    "color":
                        theme.colors.palette[
                            tagColor.isContrastTextWhite ? "light" : "dark"
                        ].main,
                },
            },
        }),
    );

    return { CustomTag };
})();
