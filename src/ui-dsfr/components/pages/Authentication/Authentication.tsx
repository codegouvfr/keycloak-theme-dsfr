import { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useForm } from "react-form";
import { Inputs } from "./Inputs";

export type Props = {
    className?: string;
};

export const Authentication = memo((props: Props) => {
    const { className, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ Authentication });

    const { classes, cx } = useStyles();

    const { Form } = useForm({
        debugForm: false
    });

    return (
        <div className={classes.root}>
            <Button
                onClick={() => {}}
                priority="secondary"
                iconId="fr-icon-arrow-left-line"
            >
                {t("back")}
            </Button>
            <div className={classes.centerCol}>
                <h2>{t("connect")}</h2>
                <div className={fr.cx("fr-connect-group")}>
                    <button className={fr.cx("fr-connect")}>
                        <span className={fr.cx("fr-connect__login")}>
                            {t("log with")}
                        </span>
                        <span className={fr.cx("fr-connect__brand")}>
                            {t("franceConnect")}
                        </span>
                    </button>
                    <p>
                        <a
                            href="https://franceconnect.gouv.fr/"
                            target="_blank"
                            rel="noopener"
                            title={t("what is franceConnect title")}
                        >
                            {t("what is franceConnect")}
                        </a>
                    </p>
                </div>
                <h5>{t("selfCredentials")}</h5>
                <Form className={classes.form}>
                    <Inputs />
                    <Button
                        onClick={() => {}}
                        priority="primary"
                        className={classes.connectButton}
                    >
                        {t("connect")}
                    </Button>
                    <div className={classes.linksPassword}>
                        <a
                            className={cx(
                                fr.cx(
                                    "fr-link",
                                    "fr-icon-arrow-right-line",
                                    "fr-link--icon-right"
                                ),
                                classes.forgetPassword
                            )}
                            href="#"
                        >
                            {t("forget password")}
                        </a>
                        <a
                            className={fr.cx(
                                "fr-link",
                                "fr-icon-arrow-right-line",
                                "fr-link--icon-right"
                            )}
                            href="#"
                        >
                            {t("no account")}
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { Authentication }
})(() => ({
    "root": {
        "display": "grid",
        "gridTemplateColumns": "1fr 2fr 1fr",
        "alignItems": "flex-start"
    },
    "centerCol": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center"
    },
    "form": {
        "width": "100%",
        "display": "flex",
        "flexDirection": "column"
    },
    "forgetPassword": {
        "marginRight": fr.spacing("6v")
    },
    "connectButton": {
        "marginTop": fr.spacing("8v"),
        "alignSelf": "center"
    },
    "linksPassword": {
        "marginTop": fr.spacing("6v"),
        "textAlign": "center"
    }
}));

export const { i18n } = declareComponentKeys<
    | "back"
    | "connect"
    | "selfCredentials"
    | "forget password"
    | "no account"
    | "log with"
    | "franceConnect"
    | "what is franceConnect"
    | "what is franceConnect title"
>()({
    Authentication
});
