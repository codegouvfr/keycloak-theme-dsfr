import { memo } from "react";
import { makeStyles, Text } from "ui/theme";
import { RoundLogo } from "ui/components/shared/RoundLogo";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { capitalize } from "tsafe/capitalize";
import { Software } from "sill-api";

export type Props = {
    className?: string;
    software: Software;
};

export const CatalogCard = memo((props: Props) => {
    const { className, software } = props;

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ CatalogCard });

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.aboveDivider}>
                {(() => {
                    const { logoUrl } = software.wikidata ?? {};

                    return (
                        logoUrl !== undefined && <RoundLogo url={logoUrl} size="large" />
                    );
                })()}
                <Text className={classes.title} typo="object heading">
                    {capitalize(software.name)}
                </Text>
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.body}>
                    <Text typo="body 1" className={classes.bodyTypo}>
                        {software.function}
                    </Text>
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
                </div>
            </div>
        </div>
    );
});

export declare namespace CatalogCard {
    export type I18nScheme = {
        "learn more": undefined;
        launch: undefined;
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
        "padding": theme.spacing({ "topBottom": 3, "rightLeft": 4 }),
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
        "boxSizing": "border-box",
        "display": "flex",
        "alignItems": "center",
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
