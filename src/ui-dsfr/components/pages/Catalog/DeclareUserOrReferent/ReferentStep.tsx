import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { fr } from "@codegouvfr/react-dsfr";
import { useField } from "react-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";

export type Props = {
    className?: string;
};

export const ReferentStep = memo((props: Props) => {
    const { className, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { getInputProps: isExpertGetInputProps } = useField("referent.isExpert", {});

    const { getInputProps: useCaseGetInputProps } = useField("referent.useCase", {});

    const { getInputProps: serviceGetInputProps } = useField("referent.service", {});

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ ReferentStep });

    return (
        <div className={classes.root}>
            <legend
                className={fr.cx("fr-fieldset__legend", "fr-text--regular")}
                id="radio-hint-legend"
            >
                {t("legend title")}
                <span className={fr.cx("fr-hint-text")}>{t("legend hint")}</span>
            </legend>
            <div className={fr.cx("fr-fieldset__content")}>
                <div className={fr.cx("fr-radio-group")}>
                    <input
                        type="radio"
                        id="radio-yes"
                        name="radio-isExpert"
                        {...isExpertGetInputProps()}
                        value="yes"
                    />
                    <label className={fr.cx("fr-label")} htmlFor="radio-yes">
                        {t("yes")}
                    </label>
                </div>
                <div className={fr.cx("fr-radio-group")}>
                    <input
                        type="radio"
                        id="radio-no"
                        name="radio-isExpert"
                        {...isExpertGetInputProps()}
                        value="no"
                    />
                    <label className={fr.cx("fr-label")} htmlFor="radio-no">
                        {" "}
                        {t("no")}
                    </label>
                </div>
            </div>
            <Input label={t("useCase")} {...useCaseGetInputProps()} />
            <Select label={t("service")} nativeSelectProps={serviceGetInputProps()}>
                <option>Service 1</option>
                <option>Service 2</option>
            </Select>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { ReferentStep }
})(() => ({
    "root": {
        "width": "100%",
        "paddingRight": fr.spacing("10v")
    }
}));

export const { i18n } = declareComponentKeys<
    "legend title" | "legend hint" | "yes" | "no" | "useCase" | "service"
>()({
    ReferentStep
});
