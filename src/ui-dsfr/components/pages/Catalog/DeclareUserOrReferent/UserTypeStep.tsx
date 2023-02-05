import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { fr } from "@codegouvfr/react-dsfr";
import { useField } from "react-form";

export type Props = {
    className?: string;
};

export const UserTypeStep = memo((props: Props) => {
    const { className, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { getInputProps } = useField("type", {});

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ UserTypeStep });

    return (
        <>
            <div className={fr.cx("fr-fieldset__content")}>
                <div className={fr.cx("fr-radio-group")}>
                    <input
                        type="radio"
                        id="radio-user"
                        name="radio-type"
                        {...getInputProps()}
                        value="user"
                    />
                    <label className={fr.cx("fr-label")} htmlFor="radio-user">
                        {" "}
                        {t("user type label")}
                        <span className={fr.cx("fr-hint-text")}>
                            Au sein de mon établissement
                        </span>
                    </label>
                </div>

                <div className={fr.cx("fr-radio-group")}>
                    <input
                        type="radio"
                        id="radio-referent"
                        name="radio-type"
                        {...getInputProps()}
                        value="referent"
                    />
                    <label className={fr.cx("fr-label")} htmlFor="radio-referent">
                        Je souhaite devenir référent de ce logiciel
                        <span className={fr.cx("fr-hint-text")}>
                            Comme garant et référence de l'utilisation du logiciel au sein
                            de mon établissement
                        </span>
                    </label>
                </div>
            </div>
        </>
    );
});

const useStyles = makeStyles({
    "name": { UserTypeStep }
})(() => ({}));

export const { i18n } = declareComponentKeys<
    "user type label" | "user type hint" | "referent type label" | "referent type hint"
>()({
    UserTypeStep
});
