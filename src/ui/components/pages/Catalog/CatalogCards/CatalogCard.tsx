import { memo } from "react";
import { makeStyles, Text } from "ui/theme";
import { Button } from "ui/theme";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { capitalize } from "tsafe/capitalize";
import { CompiledData } from "sill-api";
import { useDomRect } from "powerhooks/useDomRect";
import { Markdown } from "ui/tools/Markdown";
import { smartTrim } from "ui/tools/smartTrim";
import type { Link } from "type-route";
import { useResolveLocalizedString } from "ui/i18n";
import { Tag } from "onyxia-ui/Tag";
import { assert } from "tsafe/assert";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { Icon } from "ui/theme";
import { Tooltip } from "onyxia-ui/Tooltip";
import MuiLink from "@mui/material/Link";
import { ReferentDialogs } from "ui/components/shared/ReferentDialogs";
import type { ReferentDialogsProps } from "ui/components/shared/ReferentDialogs";
import type { UnpackEvt } from "evt";
import { IconButton } from "ui/theme";
import { CustomTag } from "ui/components/shared/Tags/CustomTag";

export type Props = {
    className?: string;
    software: CompiledData.Software;
    openLink: Link;
    editLink: Link;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    parentSoftware:
        | {
              name: string;
              link: Link | undefined;
          }
        | undefined;
    onDeclareReferentAnswer: (params: {
        isExpert: boolean;
        useCaseDescription: string;
        isPersonalUse: boolean;
    }) => void;
    onUserNoLongerReferent: () => void;
    onLogin: () => void;
};

export const CatalogCard = memo((props: Props) => {
    const {
        className,
        software,
        openLink,
        editLink,
        referents,
        userIndexInReferents,
        parentSoftware,
        onLogin,
        onUserNoLongerReferent,
        onDeclareReferentAnswer,
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

    const evtReferentDialogAction = useConst(() =>
        Evt.create<UnpackEvt<ReferentDialogsProps["evtAction"]>>(),
    );

    const onShowReferentClick = useConstCallback(async () => {
        if (referents === undefined) {
            onLogin();
            return;
        }

        evtReferentDialogAction.post("open");
    });

    const onOpenDeclareBeingReferent = useConstCallback(() =>
        evtReferentDialogAction.post("open declare referent"),
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
                                        "maxLength": 23,
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
                        <div onClick={onShowReferentClick} className={classes.tagWrapper}>
                            <Tag
                                text={t("you are referent", {
                                    "isOnlyReferent": referents.length === 1,
                                })}
                            />
                            <IconButton iconId="edit" {...editLink} />
                        </div>
                    );
                })()}
                {referents !== undefined && referents.length === 0 && (
                    <div
                        onClick={onOpenDeclareBeingReferent}
                        className={classes.tagWrapper}
                    >
                        <Tag
                            className={classes.warningTag}
                            text={t("this software has no referent")}
                        />
                    </div>
                )}
                {software.agentWorkstation && (
                    <Tooltip title={t("to install on the computer of the agent")}>
                        <Icon iconId="phonelink" className={classes.agentWorkstation} />
                    </Tooltip>
                )}
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.body}>
                    {parentSoftware !== undefined && (
                        <Text typo="label 1">
                            {" "}
                            {t("parent software", parentSoftware)}{" "}
                        </Text>
                    )}
                    <Markdown>
                        {`${capitalize(software.name)}, ${
                            software.wikidataData?.description === undefined
                                ? software.function
                                : resolveLocalizedString(
                                      software.wikidataData?.description,
                                  )
                        }`}
                    </Markdown>
                    {(() => {
                        const developers = software.wikidataData?.developers ?? [];

                        if (developers.length === 0) {
                            return null;
                        }

                        return (
                            <div className={classes.developers}>
                                <Text typo="label 1">
                                    {t("authors", {
                                        "doUsePlural": developers.length !== 1,
                                    })}
                                    :&nbsp;
                                </Text>
                                {developers.map(({ id, name }, i) => (
                                    <span key={id}>
                                        <MuiLink
                                            target="_blank"
                                            href={`https://www.wikidata.org/wiki/${id}`}
                                        >
                                            {name}
                                        </MuiLink>
                                        {i !== developers.length - 1 && <>,&nbsp;</>}
                                    </span>
                                ))}
                            </div>
                        );
                    })()}

                    {software.tags.map(tag => (
                        <CustomTag key={tag} tag={tag} className={classes.softwareTag} />
                    ))}
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
                    {(() => {
                        //NOTE: referents undefined is when user isn't connected
                        const length = referents?.length ?? -1;

                        if (length === 0) {
                            return (
                                <Button
                                    className={classes.cardButtons}
                                    variant="primary"
                                    onClick={onOpenDeclareBeingReferent}
                                >
                                    {t("declare oneself referent")}
                                </Button>
                            );
                        }

                        if (length === 1 && userIndexInReferents !== undefined) {
                            return null;
                        }

                        return (
                            <Button
                                className={classes.cardButtons}
                                variant="secondary"
                                onClick={onShowReferentClick}
                            >
                                {t("show referents", {
                                    "isUserReferent": userIndexInReferents !== undefined,
                                    "referentCount": length,
                                })}
                            </Button>
                        );
                    })()}
                </div>
            </div>
            <ReferentDialogs
                referents={referents}
                userIndexInReferents={userIndexInReferents}
                evtAction={evtReferentDialogAction}
                onAnswer={onDeclareReferentAnswer}
                onUserNoLongerReferent={onUserNoLongerReferent}
                softwareName={software.name}
            />
        </div>
    );
});

export const { i18n } = declareComponentKeys<
    | {
          K: "parent software";
          P: { name: string; link: Link | undefined };
          R: JSX.Element;
      }
    | "learn more"
    | "try it"
    | { K: "you are referent"; P: { isOnlyReferent: boolean } }
    | "declare oneself referent"
    | "this software has no referent"
    | "no longer referent"
    | "to install on the computer of the agent"
    | { K: "authors"; P: { doUsePlural: boolean } }
    | { K: "show referents"; P: { isUserReferent: boolean; referentCount: number } }
>()({ CatalogCard });

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
        "paddingRight": 0,
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
    "buttonsWrapper": {
        "display": "flex",
        "justifyContent": "flex-end",
        "marginTop": theme.spacing(4),
    },
    "cardButtons": {
        "marginRight": theme.spacing(2),
        "visibility": "hidden",
    },
    "tagWrapper": {
        "cursor": "pointer",
    },
    "warningTag": {
        "backgroundColor": theme.colors.useCases.alertSeverity.warning.main,
        "& > p": {
            "color": theme.colors.palette.dark.main,
        },
    },
    "agentWorkstation": {
        "marginRight": theme.spacing(3),
        "marginLeft": theme.spacing(1),
    },
    "developers": {
        "& > *": {
            "display": "inline-block",
        },
    },
    "softwareTag": {
        "marginRight": theme.spacing(1),
        "marginTop": theme.spacing(3),
    },
}));
