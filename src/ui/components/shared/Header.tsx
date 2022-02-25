import { memo } from "react";
import { Button, ButtonBarButton } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { makeStyles, Text } from "ui/theme";
import marianneRoundUrl from "ui/assets/img/marianne_round.png";
import marianneRoundTransparentUrl from "ui/assets/img/marianne_round_transparent.png";
import { HEADER_ORGANIZATION, HEADER_USECASE_DESCRIPTION } from "ui/envCarriedOverToKc";
import { getConfiguration } from "configuration";
import { createResolveLocalizedString } from "ui/tools/resolveLocalizedString";
import { useLng } from "ui/i18n/useLng";
import { id } from "tsafe/id";
import type { fallbackLanguage } from "ui/i18n/translations";

export type Props = Props.LoginPages | Props.UserNotLoggedIn | Props.UserLoggedIn;
export declare namespace Props {
    export type Common = {
        className?: string;
        logoContainerWidth: number;
        onLogoClick(): void;
    };

    export type LoginPages = Common & {
        useCase: "login pages";
    };

    export type UserNotLoggedIn = Common & {
        useCase: "core app";
        isUserLoggedIn: false;
        onLoginClick: () => void;
    };

    export type UserLoggedIn = Common & {
        useCase: "core app";
        isUserLoggedIn: true;
        onLogoutClick: () => void;
    };
}

export const Header = memo((props: Props) => {
    const { className, logoContainerWidth, onLogoClick } = props;

    const { t } = useTranslation({ Header });

    const { classes, cx, css, theme } = useStyles({ logoContainerWidth });

    const { lng } = useLng();

    return (
        <header className={cx(classes.root, className)}>
            <div onClick={onLogoClick} className={classes.logoContainer}>
                <img
                    src={
                        theme.isDarkModeEnabled
                            ? marianneRoundUrl
                            : marianneRoundTransparentUrl
                    }
                    alt=""
                    className={classes.svg}
                />
            </div>
            <div onClick={onLogoClick} className={classes.mainTextContainer}>
                {HEADER_ORGANIZATION && (
                    <Text
                        typo="section heading"
                        className={css({
                            "fontWeight": 600,
                            "marginLeft": theme.spacing(3),
                            "marginRight": theme.spacing(2),
                        })}
                    >
                        {HEADER_ORGANIZATION}
                    </Text>
                )}
                {theme.windowInnerWidth > 450 && HEADER_USECASE_DESCRIPTION && (
                    <Text
                        typo="section heading"
                        className={css({ "fontWeight": 500 })}
                        color="focus"
                    >
                        {HEADER_USECASE_DESCRIPTION}
                    </Text>
                )}
            </div>
            <div className={classes.rightEndActionsContainer}>
                {props.useCase === "core app" && (
                    <>
                        {(() => {
                            const { headerLinks } = getConfiguration();

                            if (headerLinks === undefined) {
                                return null;
                            }

                            const { resolveLocalizedString } =
                                createResolveLocalizedString({
                                    "currentLanguage": lng,
                                    "fallbackLanguage": id<typeof fallbackLanguage>("en"),
                                });
                            return headerLinks.map(({ iconId, url, label }) => (
                                <ButtonBarButton
                                    key={url}
                                    className={classes.button}
                                    startIcon={iconId as any}
                                    href={url}
                                    doOpenNewTabIfHref={true}
                                >
                                    {resolveLocalizedString(label)}
                                </ButtonBarButton>
                            ));
                        })()}
                        <Button
                            onClick={
                                props.isUserLoggedIn
                                    ? props.onLogoutClick
                                    : props.onLoginClick
                            }
                            variant={props.isUserLoggedIn ? "secondary" : "primary"}
                            className={css({ "marginLeft": theme.spacing(3) })}
                        >
                            {t(props.isUserLoggedIn ? "logout" : "login")}
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
});

export declare namespace Header {
    export type I18nScheme = {
        logout: undefined;
        login: undefined;
        project: undefined;
        trainings: undefined;
        documentation: undefined;
    };
}

const useStyles = makeStyles<{ logoContainerWidth: number }>({ "name": { Header } })(
    (theme, { logoContainerWidth }) => ({
        "root": {
            "backgroundColor": theme.colors.useCases.surfaces.background,
            "overflow": "auto",
            "display": "flex",
            "alignItems": "center",
            ...theme.spacing.topBottom("padding", 2),
        },
        "logoContainer": {
            "cursor": "pointer",
            "width": logoContainerWidth,
            "textAlign": "center",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
        },
        "mainTextContainer": {
            "cursor": "pointer",
            "& > *": {
                "display": "inline",
            },
        },
        "svg": {
            "width": "80%",
        },
        "button": {
            "marginBottom": theme.spacing(1),
        },
        "rightEndActionsContainer": {
            "flex": 1,
            "display": "flex",
            "justifyContent": "flex-end",
            "alignItems": "center",
        },
        "projectSelect": {
            "marginLeft": theme.spacing(2),
        },
    }),
);
