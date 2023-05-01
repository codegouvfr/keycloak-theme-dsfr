import { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { fr } from "@codegouvfr/react-dsfr";
import { useTranslation, useGetOrganizationFullName } from "ui/i18n";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useCoreFunctions, useCoreState, selectors } from "core";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { z } from "zod";
import { AutocompleteFreeSoloInput } from "ui/shared/AutocompleteFreeSoloInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import type { PageRoute } from "./route";
import { LoadingFallback } from "ui/shared/LoadingFallback";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
    className?: string;
    route: PageRoute;
};

export default function Account(props: Props) {
    const { className, route, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { userAccountManagement } = useCoreFunctions();
    const { readyState } = useCoreState(selectors.userAccountManagement.readyState);

    useEffect(() => {
        userAccountManagement.initialize();
    }, []);

    if (readyState === undefined) {
        return <LoadingFallback />;
    }

    return <AccountReady className={className} />;
}

function AccountReady(props: { className?: string }) {
    const { className } = props;

    const { t } = useTranslation({ Account });

    const {
        allOrganizations,
        email,
        organization,
        doSupportPasswordReset,
        allowedEmailRegExp
    } = (function useClosure() {
        const { readyState } = useCoreState(selectors.userAccountManagement.readyState);

        assert(readyState !== undefined);

        const { allowedEmailRegexpStr, ...rest } = readyState;

        const allowedEmailRegExp = useMemo(
            () => new RegExp(allowedEmailRegexpStr),
            [allowedEmailRegexpStr]
        );

        return {
            ...rest,
            allowedEmailRegExp
        };
    })();

    const { userAccountManagement } = useCoreFunctions();

    const [emailInputValue, setEmailInputValue] = useState(email.value);
    /* prettier-ignore */
    const [organizationInputValue, setOrganizationInputValue] = useState(organization.value);

    const emailInputValueErrorMessage = (() => {
        try {
            z.string().email().parse(emailInputValue);
        } catch {
            return t("not a valid email");
        }

        if (!allowedEmailRegExp.test(emailInputValue)) {
            return t("email domain not allowed", {
                "domain": emailInputValue.split("@")[1]
            });
        }

        return undefined;
    })();

    const { classes, cx } = useStyles({
        "isEmailSubmitButtonVisible":
            email.value !== emailInputValue &&
            emailInputValueErrorMessage === undefined &&
            !email.isBeingUpdated,
        "isOrganizationSubmitButtonVisible":
            organization.value !== organizationInputValue && !organization.isBeingUpdated
    });

    const { getOrganizationFullName } = useGetOrganizationFullName();

    return (
        <div className={cx(fr.cx("fr-container"), classes.root, className)}>
            <h2 className={classes.title}>{t("title")}</h2>
            <div className={classes.inputAndPaddingBlockWrapper}>
                <div className={classes.inputWrapper}>
                    <Input
                        className={cx(classes.input)}
                        label={t("mail")}
                        nativeInputProps={{
                            "onChange": event => setEmailInputValue(event.target.value),
                            "value": emailInputValue,
                            "name": "email",
                            "type": "email",
                            "id": "email",
                            "onKeyDown": event => {
                                if (event.key === "Escape") {
                                    setEmailInputValue(email.value);
                                }
                            }
                        }}
                        state={
                            emailInputValueErrorMessage === undefined
                                ? undefined
                                : "error"
                        }
                        stateRelatedMessage={emailInputValueErrorMessage}
                        disabled={email.isBeingUpdated}
                    />

                    <div className={classes.submitButtonWrapper}>
                        {email.isBeingUpdated && (
                            <CircularProgress
                                className={classes.circularProgress}
                                size={30}
                            />
                        )}
                        <Button
                            className={classes.emailSubmitButton}
                            onClick={() =>
                                userAccountManagement.updateField({
                                    "fieldName": "email",
                                    "value": emailInputValue
                                })
                            }
                        >
                            {t("update")}
                        </Button>
                    </div>
                </div>
                <div className={classes.paddingBlock} />
            </div>
            <div className={classes.inputAndPaddingBlockWrapper}>
                <div className={classes.inputWrapper}>
                    <AutocompleteFreeSoloInput
                        className={classes.input}
                        options={allOrganizations}
                        getOptionLabel={organization =>
                            getOrganizationFullName(organization)
                        }
                        value={organization.value}
                        onValueChange={value => setOrganizationInputValue(value)}
                        dsfrInputProps={{
                            "label": t("organization"),
                            "disabled": organization.isBeingUpdated
                        }}
                    />
                    <div className={classes.submitButtonWrapper}>
                        {organization.isBeingUpdated && (
                            <CircularProgress
                                className={classes.circularProgress}
                                size={30}
                            />
                        )}
                        <Button
                            className={classes.organizationSubmitButton}
                            onClick={() =>
                                userAccountManagement.updateField({
                                    "fieldName": "organization",
                                    "value": organizationInputValue
                                })
                            }
                            disabled={organization.value === organizationInputValue}
                        >
                            {t("update")}
                        </Button>
                    </div>
                </div>
                <div className={classes.paddingBlock} />
            </div>
            {doSupportPasswordReset && (
                <a
                    className={classes.resetPasswordLink}
                    href={userAccountManagement.getPasswordResetUrl()}
                >
                    {t("change password")}
                </a>
            )}
        </div>
    );
}

const useStyles = makeStyles<{
    isEmailSubmitButtonVisible: boolean;
    isOrganizationSubmitButtonVisible: boolean;
}>({
    "name": { Account }
})((_theme, { isEmailSubmitButtonVisible, isOrganizationSubmitButtonVisible }) => ({
    "root": {
        "paddingTop": fr.spacing("6v"),
        "maxWidth": 650,
        "paddingBottom": fr.spacing("6v")
    },
    "title": {
        "marginBottom": fr.spacing("10v"),
        [fr.breakpoints.down("md")]: {
            "marginBottom": fr.spacing("8v")
        }
    },
    "inputAndPaddingBlockWrapper": {
        "position": "relative"
    },
    "inputWrapper": {
        "position": "absolute",
        "display": "flex",
        "width": "100%",
        [fr.breakpoints.down("md")]: {
            "flexDirection": "column"
        }
    },
    "input": {
        "flex": 1,
        [fr.breakpoints.down("md")]: {
            "width": "100%"
        }
    },
    "submitButtonWrapper": {
        "alignSelf": "flex-start",
        "marginLeft": fr.spacing("3v"),
        "position": "relative",
        "top": 32,
        [fr.breakpoints.down("md")]: {
            "top": -5,
            "marginLeft": "unset",
            "width": "100%",
            "display": "flex",
            "justifyContent": "flex-end"
        }
    },
    "circularProgress": {
        "position": "absolute",
        "left": "calc(50% - 15px)",
        "top": 5
    },
    "emailSubmitButton": {
        "visibility": isEmailSubmitButtonVisible ? undefined : "hidden"
    },
    "organizationSubmitButton": {
        "visibility": isOrganizationSubmitButtonVisible ? undefined : "hidden"
    },
    "paddingBlock": {
        "height": 125,
        [fr.breakpoints.down("md")]: {
            "height": 150
        }
    },
    "resetPasswordLink": {
        "marginTop": fr.spacing("6v")
    }
}));

export const { i18n } = declareComponentKeys<
    | "title"
    | "mail"
    | "organization"
    | "change password"
    | "no organization"
    | "update"
    | "not a valid email"
    | {
          K: "email domain not allowed";
          P: { domain: string };
      }
>()({ Account });
