import { memo, forwardRef } from "react";
import { makeStyles, Text, LanguageSelect } from "ui/theme";
import { ReactComponent as GitHubSvg } from "ui/assets/svg/GitHub.svg";
import { useLang, useTranslation } from "ui/i18n";
import { DarkModeSwitch } from "onyxia-ui/DarkModeSwitch";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Icon } from "ui/theme";
import { declareComponentKeys } from "i18nifty";

export type Props = {
    className?: string;
    packageJsonVersion: string;
    contributeUrl: string;
    tosUrl: string | undefined;
};

export const Footer = memo(
    forwardRef<any, Props>((props, ref) => {
        const {
            contributeUrl,
            tosUrl,
            packageJsonVersion,
            className,
            children,
            ...rest
        } = props;

        assert(!children);

        //For the forwarding, rest should be empty (typewise),
        // eslint-disable-next-line @typescript-eslint/ban-types
        assert<Equals<typeof rest, {}>>();

        const { classes, cx } = useStyles(props);

        const { t } = useTranslation({ Footer });

        const { lang, setLang } = useLang();

        const spacing = <div className={classes.spacing} />;

        return (
            <footer className={cx(classes.root, className)} ref={ref} {...rest}>
                <Text typo="body 2">2013 - 2022 SILL, DINUM</Text>
                {spacing}
                <a
                    href={contributeUrl}
                    className={classes.contributeAndRssFeed}
                    target="_blank"
                    rel="noreferrer"
                >
                    <GitHubSvg className={classes.icon} />
                    &nbsp;
                    <Text typo="body 2">{t("contribute")}</Text>
                </a>
                <div className={classes.sep} />
                <a
                    href={"https://code.gouv.fr/data/latest-sill.xml"}
                    className={classes.contributeAndRssFeed}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon iconId="rssFeed" className={classes.icon} />
                    &nbsp;
                    <Text typo="body 2">{t("rss feed")}</Text>
                </a>
                {spacing}
                <LanguageSelect
                    language={lang}
                    onLanguageChange={setLang}
                    variant="small"
                    changeLanguageText={t("change language")}
                />
                {spacing}
                {tosUrl !== undefined && (
                    <>
                        <a href={tosUrl} target="_blank" rel="noreferrer">
                            {" "}
                            <Text typo="body 2">{t("terms of service")}</Text>{" "}
                        </a>
                        {spacing}
                    </>
                )}
                <a
                    href={`https://github.com/etalab/sill-web/releases/tag/v${packageJsonVersion}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Text typo="body 2">v{packageJsonVersion} </Text>
                </a>
                {spacing}
                <DarkModeSwitch size="extra small" className={classes.darkModeSwitch} />
            </footer>
        );
    }),
);

export const { i18n } = declareComponentKeys<
    "contribute" | "terms of service" | "change language" | "rss feed"
>()({ Footer });

const useStyles = makeStyles<Props>({ "name": { Footer } })(theme => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.background,
        "display": "flex",
        "alignItems": "center",
        "& a": {
            "textDecoration": "none",
            "&:hover": {
                "textDecoration": "underline",
                "textDecorationColor": theme.colors.useCases.typography.textPrimary,
            },
        },
    },
    "icon": {
        "fill": theme.colors.useCases.typography.textPrimary,
    },
    "contributeAndRssFeed": {
        "display": "flex",
        "alignItems": "center",
    },
    "sep": {
        "flex": 1,
    },
    "spacing": {
        "width": theme.spacing(4),
    },
    "darkModeSwitch": {
        "padding": 0,
    },
}));
