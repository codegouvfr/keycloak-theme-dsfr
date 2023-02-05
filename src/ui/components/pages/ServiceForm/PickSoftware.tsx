import { memo, useEffect, useState, useMemo } from "react";
import { CustomTag } from "ui/components/shared/Tags/CustomTag";
import { makeStyles } from "ui/theme";
import { Evt } from "evt";
import { useConst } from "powerhooks/useConst";
import type { GitHubPickerProps } from "onyxia-ui/GitHubPicker";
import { GitHubPicker } from "onyxia-ui/GitHubPicker";
import { useStateRef } from "powerhooks/useStateRef";
import { useTranslation, declareComponentKeys } from "ui/i18n";
import { Button, Text } from "ui/theme";
import { assert } from "tsafe/assert";
import { getTagColor } from "ui/components/shared/Tags/TagColor";
import { useConstCallback } from "powerhooks/useConstCallback";
import { Icon } from "ui/theme";
import { Tooltip } from "onyxia-ui/Tooltip";

type Props = {
    sillSoftwareNames: string[];
    selectedSoftwareName: string | undefined;
    onSelectedSoftware: (selectedSoftwareName: string | undefined) => void;
};

export const PickSoftware = memo((props: Props) => {
    const { sillSoftwareNames, selectedSoftwareName, onSelectedSoftware } = props;

    const [softwareNames, setSoftwareNames] = useState(sillSoftwareNames);

    useEffect(() => {
        setSoftwareNames(sillSoftwareNames);
    }, [sillSoftwareNames]);

    const evtGitHubPickerAction = useConst(() =>
        Evt.create<GitHubPickerProps["evtAction"]>()
    );

    const buttonRef = useStateRef<HTMLButtonElement>(null);

    const { t } = useTranslation({ PickSoftware });

    const { classes, theme } = useStyles();

    const onSelectedTags = useConstCallback<GitHubPickerProps["onSelectedTags"]>(
        params => {
            if (params.isSelect && params.isNewTag) {
                setSoftwareNames([params.tag, ...softwareNames]);
            }
            onSelectedSoftware(params.isSelect ? params.tag : undefined);

            if (params.isSelect) {
                evtGitHubPickerAction.post({
                    "action": "close"
                });
            }
        }
    );

    const onCustomTagRemove = useConstCallback(() => {
        assert(selectedSoftwareName !== undefined);
        onSelectedTags({
            "isSelect": false,
            "tag": selectedSoftwareName
        });
    });

    const doDisplayWarningNotInSill = useMemo(
        () =>
            selectedSoftwareName === undefined
                ? false
                : sillSoftwareNames.indexOf(selectedSoftwareName) < 0,
        [selectedSoftwareName, sillSoftwareNames]
    );

    return (
        <div>
            <div className={classes.labelWrapper}>
                <Text typo="caption" className={classes.caption}>
                    {t("deployed software")}
                </Text>
                {doDisplayWarningNotInSill &&
                    (assert(selectedSoftwareName !== undefined),
                    (
                        <Tooltip
                            title={t("consider registering this software in the sill", {
                                selectedSoftwareName
                            })}
                        >
                            <Icon
                                size="small"
                                className={classes.warningIcon}
                                iconId="errorOutline"
                            />
                        </Tooltip>
                    ))}
            </div>
            {selectedSoftwareName !== undefined ? (
                <CustomTag
                    tag={selectedSoftwareName}
                    className={classes.tag}
                    onRemove={onCustomTagRemove}
                />
            ) : null}

            {selectedSoftwareName === undefined && (
                <Button
                    className={classes.addButton}
                    ref={buttonRef}
                    startIcon={"add"}
                    variant="secondary"
                    onClick={() =>
                        evtGitHubPickerAction.post({
                            "action": "open",
                            "anchorEl":
                                (assert(buttonRef.current !== null), buttonRef.current)
                        })
                    }
                >
                    {t("select the software")}
                </Button>
            )}
            <GitHubPicker
                evtAction={evtGitHubPickerAction}
                getTagColor={tag => getTagColor({ tag, theme }).color}
                texts={{
                    "create tag": ({ tag }) =>
                        t("validate unknown software name", { "softwareName": tag })
                }}
                tags={softwareNames}
                selectedTags={
                    selectedSoftwareName === undefined ? [] : [selectedSoftwareName]
                }
                onSelectedTags={onSelectedTags}
            />
        </div>
    );
});

export const { i18n } = declareComponentKeys<
    | { K: "validate unknown software name"; P: { softwareName: string } }
    | "select the software"
    | "deployed software"
    | {
          K: "consider registering this software in the sill";
          P: { selectedSoftwareName: string };
      }
>()({ PickSoftware });

const useStyles = makeStyles()(theme => ({
    "labelWrapper": {
        "marginBottom": theme.spacing(3)
    },
    "caption": {
        "marginBottom": theme.spacing(2),
        "display": "inline"
    },
    "warningIcon": {
        "marginLeft": theme.spacing(2),
        "color": theme.colors.useCases.alertSeverity.warning.main
    },
    "tag": {
        "marginRight": theme.spacing(1),
        "marginBottom": theme.spacing(1)
    },
    "addButton": {
        "marginBottom": theme.spacing(1)
    }
}));
