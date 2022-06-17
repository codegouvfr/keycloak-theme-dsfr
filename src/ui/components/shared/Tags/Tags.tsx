import { useEffect, useState, memo } from "react";
import { CustomTag } from "./CustomTag";
import { makeStyles } from "ui/theme";
import { Evt } from "evt";
import type { UnpackEvt } from "evt";
import { useConst } from "powerhooks/useConst";
import type { GitHubPickerProps } from "onyxia-ui/GitHubPicker";
import { GitHubPicker } from "onyxia-ui/GitHubPicker";
import { useStateRef } from "powerhooks/useStateRef";
import { useTranslation, declareComponentKeys } from "ui/i18n";
import { Button, Text } from "ui/theme";
import { assert } from "tsafe/assert";
import { getTagColor } from "./TagColor";
import { useConstCallback } from "powerhooks/useConstCallback";

type Props = {
    tags: string[];
    selectedTags: string[];
    onSelectedTags: (selectedTags: string[]) => void;
};

export const Tags = memo((props: Props) => {
    const {
        tags: tags_props,
        selectedTags,
        onSelectedTags: onSelectedTags_props,
    } = props;

    const [tags, setTags] = useState(tags_props);

    useEffect(() => {
        setTags(tags_props);
    }, [tags_props]);

    const evtGitHubPickerAction = useConst(() =>
        Evt.create<UnpackEvt<GitHubPickerProps["evtAction"]>>(),
    );

    const buttonRef = useStateRef<HTMLButtonElement>(null);

    const { t } = useTranslation({ Tags });

    const { classes, theme } = useStyles();

    const onSelectedTags = useConstCallback<GitHubPickerProps["onSelectedTags"]>(
        params => {
            if (params.isSelect && params.isNewTag) {
                setTags([params.tag, ...tags]);
            }

            onSelectedTags_props(
                params.isSelect
                    ? [...selectedTags, params.tag]
                    : selectedTags.filter(tag => tag !== params.tag),
            );
        },
    );

    return (
        <div>
            <Text typo="caption" className={classes.caption}>
                {t("tags")}
            </Text>
            {selectedTags.map(tag => (
                <CustomTag key={tag} tag={tag} className={classes.tag} />
            ))}
            <br />
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
                    })
                }
            >
                {t("change tags", { "isThereTagsAlready": selectedTags.length !== 0 })}
            </Button>
            <GitHubPicker
                evtAction={evtGitHubPickerAction}
                getTagColor={tag => getTagColor({ tag, theme }).color}
                t={t}
                tags={tags}
                selectedTags={selectedTags}
                onSelectedTags={onSelectedTags}
            />
        </div>
    );
});

export const { i18n } = declareComponentKeys<
    | { K: "change tags"; P: { isThereTagsAlready: boolean } }
    | { K: "create tag"; P: { tag: string } }
    | "github picker label"
    | { K: "github picker create tag"; P: { tag: string } }
    | "github picker done"
    | "tags"
>()({ Tags });

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
