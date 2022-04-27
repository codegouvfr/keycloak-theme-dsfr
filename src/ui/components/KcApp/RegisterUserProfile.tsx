import { useMemo, memo, useEffect, Fragment } from "react";
import { Template } from "./Template";
import type { KcProps } from "keycloakify";
import type { KcContextBase } from "keycloakify";
import { getMsg } from "keycloakify";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useFormValidationSlice } from "keycloakify";
import { useTranslation } from "ui/i18n/useTranslations";
import { Button, makeStyles } from "ui/theme";
import { useConstCallback } from "powerhooks/useConstCallback";
import { Tooltip } from "onyxia-ui/Tooltip";
import { TextField } from "onyxia-ui/TextField";
import { regExpStrToEmailDomains } from "./emailDomainAcceptListHelper";
import MuiTextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const RegisterUserProfile = memo(
    ({
        kcContext,
        ...props_
    }: { kcContext: KcContextBase.RegisterUserProfile } & KcProps) => {
        const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey } = kcContext;

        const { msg, msgStr, advancedMsg } = getMsg(kcContext);

        const { classes, cx, css } = useStyles();

        const props = useMemo(
            () => ({
                ...props_,
                "kcFormGroupClass": cx(
                    props_.kcFormGroupClass,
                    css({ "marginBottom": 20 }),
                ),
            }),
            [cx, css],
        );

        const { t } = useTranslation({ RegisterUserProfile });

        const redirectToLogin = useConstCallback(
            () => (window.location.href = url.loginUrl),
        );

        const passwordValidators = useMemo(
            () => ({
                "_compareToOther": {
                    "error-message": t("must be different from email"),
                    "ignore.empty.value": true,
                    "name": "email",
                    "shouldBe": "different" as const,
                },
                "length": {
                    "min": "8" as const,
                    "ignore.empty.value": true,
                },
            }),
            [t],
        );

        const {
            formValidationState: { fieldStateByAttributeName, isFormSubmittable },
            formValidationReducer,
            attributesWithPassword: unorderedAttributesWithPassword,
        } = useFormValidationSlice({
            kcContext,
            passwordValidators,
        });

        const attributesWithPassword = useMemo(
            () =>
                unorderedAttributesWithPassword.sort(
                    (a, b) =>
                        getHardCodedFieldWeight(b.name) - getHardCodedFieldWeight(a.name),
                ),
            [unorderedAttributesWithPassword],
        );

        const onChangeFactory = useCallbackFactory(
            ([name]: [string], [{ value }]: [{ value: string }]) =>
                formValidationReducer({
                    "action": "update value",
                    name,
                    "newValue": value,
                }),
        );

        const onBlurFactory = useCallbackFactory(([name]: [string]) =>
            formValidationReducer({
                "action": "focus lost",
                name,
            }),
        );

        useEffect(() => {
            attributesWithPassword
                .filter(
                    ({ name }) =>
                        !["email", "password", "password-confirm"].includes(name),
                )
                .map(({ name }) =>
                    formValidationReducer({
                        "action": "focus lost",
                        name,
                    }),
                );
        }, []);

        const areAllFieldsRequired = useMemo(
            () => attributesWithPassword.every(({ required }) => required),
            [attributesWithPassword],
        );

        let currentGroup = "";

        const getIncrementedTabIndex = (() => {
            let counter = 1;
            return () => counter++;
        })();

        return (
            <Template
                {...{ kcContext, ...props }}
                displayMessage={messagesPerField.exists("global")}
                displayRequiredFields={false}
                doFetchDefaultThemeResources={false}
                headerNode={msg("registerTitle")}
                formNode={
                    <form
                        className={classes.root}
                        action={url.registrationAction}
                        method="post"
                    >
                        <>
                            {attributesWithPassword.map((attribute, i) => {
                                const {
                                    group = "",
                                    groupDisplayHeader = "",
                                    groupDisplayDescription = "",
                                } = attribute;

                                const { value, displayableErrors } =
                                    fieldStateByAttributeName[attribute.name];

                                const formGroupClassName = cx(
                                    props.kcFormGroupClass,
                                    displayableErrors.length !== 0 &&
                                        props.kcFormGroupErrorClass,
                                );

                                return (
                                    <Fragment key={i}>
                                        {group !== currentGroup &&
                                            (currentGroup = group) !== "" && (
                                                <div className={formGroupClassName}>
                                                    <div
                                                        className={cx(
                                                            props.kcContentWrapperClass,
                                                        )}
                                                    >
                                                        <label
                                                            id={`header-${group}`}
                                                            className={cx(
                                                                props.kcFormGroupHeader,
                                                            )}
                                                        >
                                                            {advancedMsg(
                                                                groupDisplayHeader,
                                                            ) || currentGroup}
                                                        </label>
                                                    </div>
                                                    {groupDisplayDescription !== "" && (
                                                        <div
                                                            className={cx(
                                                                props.kcLabelWrapperClass,
                                                            )}
                                                        >
                                                            <label
                                                                id={`description-${group}`}
                                                                className={`${cx(
                                                                    props.kcLabelClass,
                                                                )}`}
                                                            >
                                                                {advancedMsg(
                                                                    groupDisplayDescription,
                                                                )}
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        {(() => {
                                            const label = (
                                                <>
                                                    {advancedMsg(
                                                        attribute.displayName ?? "",
                                                    )}
                                                    &nbsp;
                                                    {!areAllFieldsRequired &&
                                                        attribute.required &&
                                                        "*"}
                                                </>
                                            );

                                            const { options } = attribute.validators;

                                            if (options !== undefined) {
                                                return (
                                                    <Autocomplete
                                                        disablePortal
                                                        value={value || null}
                                                        onChange={(...[, option]) => {
                                                            if (option === null) {
                                                                return;
                                                            }
                                                            onChangeFactory(
                                                                attribute.name,
                                                            )({ value: option });
                                                        }}
                                                        options={options.options}
                                                        renderInput={params => (
                                                            <MuiTextField
                                                                {...params}
                                                                label={label}
                                                            />
                                                        )}
                                                    />
                                                );
                                            }

                                            return (
                                                <TextField
                                                    type={(() => {
                                                        switch (attribute.name) {
                                                            case "password-confirm":
                                                            case "password":
                                                                return "password";
                                                            default:
                                                                return "text";
                                                        }
                                                    })()}
                                                    id={attribute.name}
                                                    name={attribute.name}
                                                    defaultValue={value}
                                                    className={cx(props.kcInputClass)}
                                                    aria-invalid={
                                                        displayableErrors.length !== 0
                                                    }
                                                    disabled={attribute.readOnly}
                                                    autoComplete={attribute.autocomplete}
                                                    onBlur={onBlurFactory(attribute.name)}
                                                    inputProps_aria-label={attribute.name}
                                                    inputProps_tabIndex={getIncrementedTabIndex()}
                                                    onValueBeingTypedChange={onChangeFactory(
                                                        attribute.name,
                                                    )}
                                                    inputProps_autoFocus={i === 0}
                                                    inputProps_spellCheck={false}
                                                    label={label}
                                                    helperText={(() => {
                                                        const displayableErrors =
                                                            fieldStateByAttributeName[
                                                                attribute.name
                                                            ].displayableErrors.filter(
                                                                ({ validatorName }) =>
                                                                    !(
                                                                        validatorName ===
                                                                            "pattern" &&
                                                                        attribute.name ===
                                                                            "email"
                                                                    ),
                                                            );

                                                        if (
                                                            displayableErrors.length !== 0
                                                        ) {
                                                            return displayableErrors.map(
                                                                ({ errorMessage }, i) => (
                                                                    <span key={i}>
                                                                        {errorMessage}
                                                                        &nbsp;
                                                                    </span>
                                                                ),
                                                            );
                                                        }

                                                        switch (attribute.name) {
                                                            case "email":
                                                                return t(
                                                                    "allowed email domains",
                                                                );
                                                            case "password": {
                                                                const { min } =
                                                                    attribute.validators
                                                                        .length ?? {};
                                                                if (min === undefined) {
                                                                    break;
                                                                }

                                                                return t(
                                                                    "minimum length",
                                                                    {
                                                                        "n": `${parseInt(
                                                                            min,
                                                                        )}`,
                                                                    },
                                                                );
                                                            }
                                                        }

                                                        {
                                                            const { pattern } =
                                                                attribute.validators;

                                                            if (pattern !== undefined) {
                                                                const {
                                                                    "error-message":
                                                                        errorMessageKey,
                                                                } = pattern;

                                                                return errorMessageKey !==
                                                                    undefined
                                                                    ? advancedMsg(
                                                                          errorMessageKey,
                                                                      )
                                                                    : t(
                                                                          "must respect the pattern",
                                                                      );
                                                            }
                                                        }

                                                        return undefined;
                                                    })()}
                                                    questionMarkHelperText={(() => {
                                                        const { pattern } =
                                                            attribute.validators
                                                                .pattern ?? {};

                                                        return pattern ===
                                                            undefined ? undefined : attribute.name ===
                                                          "email" ? (
                                                            <>
                                                                {formatEmailPattern(
                                                                    pattern,
                                                                )}
                                                                <br />
                                                                <br />
                                                                <b>
                                                                    {t(
                                                                        "your domain isn't listed yet?",
                                                                    )}
                                                                </b>
                                                                <br />
                                                                {t("contact us at")}&nbsp;
                                                                <b>
                                                                    logiciels-libres@data.gouv.fr
                                                                </b>
                                                            </>
                                                        ) : fieldStateByAttributeName[
                                                              attribute.name
                                                          ].displayableErrors.length ===
                                                          0 ? (
                                                            pattern
                                                        ) : undefined;
                                                    })()}
                                                    inputProps_aria-invalid={
                                                        fieldStateByAttributeName[
                                                            attribute.name
                                                        ].displayableErrors.length !== 0
                                                    }
                                                />
                                            );
                                        })()}
                                    </Fragment>
                                );
                            })}
                        </>
                        {recaptchaRequired && (
                            <div className="form-group">
                                <div className={cx(props.kcInputWrapperClass)}>
                                    <div
                                        className="g-recaptcha"
                                        data-size="compact"
                                        data-sitekey={recaptchaSiteKey}
                                    />
                                </div>
                            </div>
                        )}
                        <div className={classes.buttonsWrapper}>
                            <Button
                                variant="secondary"
                                onClick={redirectToLogin}
                                tabIndex={-1}
                            >
                                {t("go back")}
                            </Button>
                            {(() => {
                                const button = (
                                    <Button
                                        className={classes.buttonSubmit}
                                        disabled={!isFormSubmittable}
                                        type="submit"
                                        tabIndex={getIncrementedTabIndex()}
                                    >
                                        {msgStr("doRegister")}
                                    </Button>
                                );

                                return isFormSubmittable ? (
                                    button
                                ) : (
                                    <Tooltip title={t("form not filled properly yet")}>
                                        <span>{button}</span>
                                    </Tooltip>
                                );
                            })()}
                        </div>
                    </form>
                }
            />
        );
    },
);

export declare namespace RegisterUserProfile {
    export type I18nScheme = {
        "allowed email domains": undefined;
        "minimum length": { n: string };
        "must be different from email": undefined;
        "password mismatch": undefined;
        "go back": undefined;
        "form not filled properly yet": undefined;
        "must respect the pattern": undefined;
        "your domain isn't listed yet?": undefined;
        "contact us at": undefined;
    };
}

const { getHardCodedFieldWeight } = (() => {
    const orderedFields = ["agencyName", "email", "password", "password-confirm"].map(
        fieldName => fieldName.toLowerCase(),
    );

    function getHardCodedFieldWeight(fieldName: string) {
        for (let i = 0; i < orderedFields.length; i++) {
            if (fieldName.toLowerCase().includes(orderedFields[i])) {
                return orderedFields.length - i;
            }
        }

        return 0;
    }

    return { getHardCodedFieldWeight };
})();

function formatEmailPattern(pattern: string) {
    try {
        return regExpStrToEmailDomains(pattern).join(", ");
    } catch {
        return pattern;
    }
}

const useStyles = makeStyles({ "name": { RegisterUserProfile } })(theme => ({
    "root": {
        "& .MuiTextField-root": {
            "width": "100%",
            "marginTop": theme.spacing(6),
        },
    },
    "buttonsWrapper": {
        "marginTop": theme.spacing(8),
        "display": "flex",
        "justifyContent": "flex-end",
    },
    "buttonSubmit": {
        "marginLeft": theme.spacing(2),
    },
}));
