import { memo } from "react";
import { makeStyles, Text } from "ui/theme";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { capitalize } from "tsafe/capitalize";
import { Software } from "sill-api";
import { useDomRect } from "powerhooks/useDomRect";
import { Markdown } from "ui/tools/Markdown";
import { smartTrim } from "ui/tools/smartTrim";

export type Props = {
    className?: string;
    software: Software;
};

export const CatalogCard = memo((props: Props) => {
    const { className, software } = props;

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

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.aboveDivider}>
                {(() => {
                    const { logoUrl } = software.wikidata ?? {};

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
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.body}>
                    <Markdown>
                        {`${capitalize(software.name)}, ${software.function}`}
                    </Markdown>
                </div>
                <div className={classes.buttonsWrapper}>
                    {(() => {
                        const url =
                            software.wikidata?.sourceUrl ??
                            software.wikidata?.documentationUrl;

                        return (
                            url !== undefined && (
                                <Button
                                    className={classes.learnMoreButton}
                                    href={url}
                                    variant="ternary"
                                >
                                    {t("learn more")}
                                </Button>
                            )
                        );
                    })()}
                    {(() => {
                        const url = software.testUrl ?? undefined;

                        return (
                            url !== undefined && (
                                <Button
                                    className={classes.learnMoreButton}
                                    href={url}
                                    variant="ternary"
                                >
                                    {t("try it")}
                                </Button>
                            )
                        );
                    })()}
                </div>
            </div>
        </div>
    );
});

export declare namespace CatalogCard {
    export type I18nScheme = {
        "learn more": undefined;
        "try it": undefined;
    };
}

const useStyles = makeStyles<void, "learnMoreButton">({
    "name": { CatalogCard },
})((theme, _params, classes) => ({
    "root": {
        "borderRadius": 8,
        "boxShadow": theme.shadows[1],
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "&:hover": {
            "boxShadow": theme.shadows[6],
            [`& .${classes.learnMoreButton}`]: {
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
    "learnMoreButton": {
        "marginRight": theme.spacing(2),
        "visibility": "hidden",
    },
}));
