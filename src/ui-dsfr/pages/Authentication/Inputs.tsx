import { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { makeStyles } from "tss-react/dsfr";
import { useField } from "react-form";

export type Props = {
    className?: string;
};

export const Inputs = memo((props: Props) => {
    const { className, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ Inputs });

    const { classes } = useStyles();

    const { getInputProps: emailGetInputProps } = useField("email", {});
    const { getInputProps: passwordGetInputProps } = useField("password", {});

    return (
        <div className={classes.root}>
            <Input
                label={t("email")}
                hintText={t("email hint")}
                {...emailGetInputProps()}
            />
            <Input label={t("password")} {...passwordGetInputProps()} />
        </div>
    );
});

const useStyles = makeStyles({
    "name": { Inputs }
})(() => ({
    "root": {}
}));

export const { i18n } = declareComponentKeys<"email" | "email hint" | "password">()({
    Inputs
});
