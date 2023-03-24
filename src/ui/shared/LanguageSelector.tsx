import React, { memo, useState, MouseEventHandler } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";

type LangOption = {
    hrefLang: "fr" | "en" | "es" | "de";
    lang: "fr" | "en" | "es" | "de";
    langFull: "Français" | "English" | "Español" | "Deutsch";
};

const languageOptionDefault: LangOption = {
    "hrefLang": "fr",
    "lang": "fr",
    "langFull": "Français"
};

const languageOptions: LangOption[] = [
    languageOptionDefault,
    {
        "hrefLang": "en",
        "lang": "en",
        "langFull": "English"
    }
];

type Props = {
    selectedLanguage: string;
    onChangeLanguage: MouseEventHandler<HTMLAnchorElement>;
};

/**
 * The button controlling the component must specify 2 attributes
 * - "aria-controls": "translate-select",
 * - "aria-expanded": false,
 */
export const LanguageSelector = memo((props: Props) => {
    const { selectedLanguage, onChangeLanguage } = props;

    const { cx, classes } = useStyles();

    const ActiveLanguage = () => {
        const findActiveLanguage =
            languageOptions.find(language => language.lang === selectedLanguage) ??
            languageOptionDefault;

        return (
            <>
                {" "}
                <span className={classes.langShort}>{findActiveLanguage.lang}</span>
                <span className={fr.cx("fr-hidden-lg")}>
                    {" "}
                    - {findActiveLanguage.langFull}
                </span>{" "}
            </>
        );
    };

    return (
        <>
            <div>
                <ActiveLanguage />
            </div>
            <div
                className={cx(fr.cx("fr-collapse", "fr-menu"), classes.menuLanguage)}
                id="translate-select"
            >
                <ul className={fr.cx("fr-menu__list")}>
                    {languageOptions.map(language => (
                        <li key={language.lang}>
                            <a
                                className={fr.cx(
                                    "fr-translate__language",
                                    "fr-nav__link"
                                )}
                                hrefLang={language.hrefLang}
                                lang={language.lang}
                                href="#"
                                aria-current={
                                    language.lang === selectedLanguage
                                        ? "true"
                                        : undefined
                                }
                                onClick={onChangeLanguage}
                            >
                                <span className={classes.langShort}>{language.lang}</span>{" "}
                                - {language.langFull}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
});

const useStyles = makeStyles()(() => ({
    "menuLanguage": {
        "right": 0
    },
    "langShort": {
        "textTransform": "uppercase"
    }
}));
