import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { useField } from "react-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { makeStyles } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
    className?: string;
};

export const UserStep = memo((props: Props) => {
    const { className, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { getInputProps: useCaseGetInputProps } = useField("user.useCase", {});

    const { getInputProps: environmentGetInputProps } = useField(
        "referent.environment",
        {},
    );

    const { getInputProps: versionGetInputProps } = useField("user.version", {});

    const { getInputProps: serviceGetInputProps } = useField("referent.service", {});

    const { t } = useTranslation({ UserStep });

    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Input label={t("useCase")} {...useCaseGetInputProps()} />
            <Select
                label={t("environment")}
                nativeSelectProps={environmentGetInputProps()}
            >
                <option>Environnement 1</option>
                <option>Environnement 2</option>
            </Select>
            <Input label={t("version")} {...versionGetInputProps()} />
            <Select label={t("service")} nativeSelectProps={serviceGetInputProps()}>
                <option>Service 1</option>
                <option>Service 2</option>
            </Select>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { UserStep },
})(() => ({
    "root": {
        "width": "100%",
        "paddingRight": fr.spacing("10v"),
    },
}));

export const { i18n } = declareComponentKeys<
    "useCase" | "environment" | "version" | "service"
>()({
    UserStep,
});
