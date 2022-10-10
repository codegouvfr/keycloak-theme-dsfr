import { useMemo, useEffect, memo } from "react";
import { makeStyles, Text } from "ui/theme";
import { Button } from "ui/theme";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { capitalize } from "tsafe/capitalize";
import { smartTrim } from "ui/tools/smartTrim";
import type { Link } from "type-route";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { IconButton } from "ui/theme";
import type { ServiceWithSoftwareInfo } from "core/usecases/serviceCatalog";
import { useState } from "react";
import { Dialog } from "onyxia-ui/Dialog";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { assert } from "tsafe/assert";
import { useDomRect } from "powerhooks/useDomRect";
import { Markdown } from "onyxia-ui/Markdown";
import { TextField } from "onyxia-ui/TextField";
import type { TextFieldProps } from "onyxia-ui/TextField";
import { useRerenderOnStateChange } from "evt/hooks";
import type { StatefulReadonlyEvt } from "evt";

export type Props = Props.UserLoggedIn | Props.UserNotLoggedIn;

export namespace Props {
    export type Common = {
        className?: string;
        service: ServiceWithSoftwareInfo;
        editLink: Link;
        sillSoftwareLink?: Link;
    };

    export type UserLoggedIn = Common & {
        isUserLoggedIn: true;
        onRequestDelete: (params: { reason: string }) => void;
    };

    export type UserNotLoggedIn = Common & {
        isUserLoggedIn: false;
        onLogin: () => void;
    };
}

export const ServiceCatalogCard = memo((props: Props) => {
    const { className, service, editLink, sillSoftwareLink, ...propsRest } = props;

    const { classes, cx, css } = useStyles();

    const { t } = useTranslation({ ServiceCatalogCard });

    const evtConfirmDereferenceServiceDialogAction = useConst(() =>
        Evt.create<ConfirmDeleteServiceDialog["evtAction"]>(),
    );

    const onOpenConfirmDereferenceServiceDialog = useConstCallback(() => {
        if (!propsRest.isUserLoggedIn) {
            propsRest.onLogin();
            return;
        }

        evtConfirmDereferenceServiceDialogAction.post("open");
    });

    const onConfirmDeleteServiceDialogProceed = useConstCallback<
        ConfirmDeleteServiceDialog["onProceed"]
    >(({ reason }) => {
        assert(propsRest.isUserLoggedIn);

        propsRest.onRequestDelete({ reason });
    });

    const softwareLink = useMemo(
        () =>
            sillSoftwareLink ??
            ((assert(!service.deployedSoftware.isInSill),
            service.deployedSoftware.comptoirDuLibreId === undefined)
                ? undefined
                : {
                      "href": `https://comptoir-du-libre.org/softwares/${service.deployedSoftware.comptoirDuLibreId}`,
                      "onClick": () => {
                          /* nothing */
                      },
                      "_target": "blank" as const,
                  }),
        [service.deployedSoftware, sillSoftwareLink],
    );

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.aboveDivider}>
                <Text className={classes.title} typo="object heading">
                    {smartTrim({
                        "maxLength": 50,
                        "minCharAtTheEnd": 0,
                        "text": service.serviceName,
                    })}
                </Text>

                <div style={{ "flex": 1 }} />

                {/* TODO */}
                <IconButton iconId="edit" href="#" disabled={true} />
                <IconButton
                    iconId="delete"
                    onClick={onOpenConfirmDereferenceServiceDialog}
                />
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.body}>
                    <Markdown className={classes.description}>
                        {service.description}
                    </Markdown>
                    <Text typo="label 1" className={css({ "display": "inline" })}>
                        {" "}
                        {t("maintained by")} :{" "}
                    </Text>
                    <Text typo="body 1" className={css({ "display": "inline" })}>
                        {" "}
                        {service.agencyName}{" "}
                    </Text>
                    <Software
                        logoUrl={
                            !service.deployedSoftware.isInSill
                                ? undefined
                                : service.deployedSoftware.logoUrl
                        }
                        name={service.deployedSoftware.softwareName}
                        link={softwareLink}
                    />
                </div>
                <div className={classes.buttonsWrapper}>
                    <Button
                        className={classes.cardButtons}
                        variant="primary"
                        href={service.serviceUrl}
                        doOpenNewTabIfHref={true}
                    >
                        {t("access service")}
                    </Button>
                </div>
            </div>
            <ConfirmDeleteServiceDialog
                evtAction={evtConfirmDereferenceServiceDialogAction}
                serviceName={service.serviceName}
                onProceed={onConfirmDeleteServiceDialogProceed}
            />
        </div>
    );
});

export const { i18n } = declareComponentKeys<
    | "proceed"
    | "abort"
    | { K: "confirm unregister service"; P: { serviceName: string } }
    | "provide a reason for deleting the service"
    | "can't be empty"
    | "access service"
    | "maintained by"
    | "software"
>()({ ServiceCatalogCard });

const useStyles = makeStyles<void, "cardButtons">({
    "name": { ServiceCatalogCard },
})((theme, _params, classes) => ({
    "root": {
        "borderRadius": 8,
        "boxShadow": theme.shadows[1],
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "&:hover": {
            "boxShadow": theme.shadows[6],
            [`& .${classes.cardButtons}`]: {
                "visibility": "visible",
            },
        },
        "display": "flex",
        "flexDirection": "column",
    },
    "title": {
        "marginLeft": theme.spacing(3),
    },
    "aboveDivider": {
        ...theme.spacing.topBottom("padding", 2),
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
        "boxSizing": "border-box",
        "display": "flex",
        "alignItems": "center",
        "height": 45,
    },
    "belowDivider": {
        "padding": theme.spacing(4),
        "paddingTop": theme.spacing(3),
        "flex": 1,
        "display": "flex",
        "flexDirection": "column",
        "overflow": "hidden",
    },
    "description": {
        "marginBottom": theme.spacing(4),
    },
    "body": {
        "margin": 0,
        "flex": 1,
        //TODO: Commented out for mozilla (longer one always have scroll in a grid)
        //"overflow": "auto"
    },
    "buttonsWrapper": {
        "display": "flex",
        "justifyContent": "flex-end",
        "marginTop": theme.spacing(4),
    },
    "cardButtons": {
        "marginRight": theme.spacing(2),
        "visibility": "hidden",
    },
}));

const { Software } = (() => {
    type Props = {
        className?: string;
        logoUrl: string | undefined;
        link: (Link & { _target?: "blank" }) | undefined;
        name: string;
    };

    const Software = memo((props: Props) => {
        const { className, logoUrl, name, link } = props;

        const { imgRef, isBanner } = (function useClosure() {
            const {
                ref: imgRef,
                domRect: { height, width },
            } = useDomRect();

            const isBanner =
                width === 0 || height === 0 ? undefined : width > height * 1.7;

            return { imgRef, isBanner };
        })();

        const { classes, cx } = useStyles();

        const { t } = useTranslation({ ServiceCatalogCard });

        const innerNode = (
            <div className={classes.innerNode}>
                <Text typo="label 1" className={classes.label}>
                    {t("software")}:{" "}
                </Text>
                {logoUrl !== undefined && (
                    <img
                        style={{ "height": 30 }}
                        ref={imgRef}
                        src={logoUrl}
                        alt=""
                        className={classes.image}
                    />
                )}
                {(isBanner === false || logoUrl === undefined) && (
                    <Text className={classes.title} typo="body 1">
                        {capitalize(name)}
                    </Text>
                )}
            </div>
        );

        return link === undefined ? (
            <div className={className}>{innerNode}</div>
        ) : (
            <a className={cx(classes.rootWhenLink, className)} {...link}>
                {innerNode}
            </a>
        );
    });

    const useStyles = makeStyles()(theme => ({
        "rootWhenLink": {
            "all": "unset",
            "display": "block",
            "cursor": "pointer",
        },
        "title": {
            "marginLeft": theme.spacing(3),
        },
        "innerNode": {
            "display": "flex",
            "alignItems": "center",
            "marginTop": theme.spacing(4),
        },
        "label": {
            "marginRight": theme.spacing(4),
        },
        "image": {
            "height": "100%",
        },
    }));

    return { Software };
})();

type ConfirmDeleteServiceDialog = {
    evtAction: NonPostableEvt<"open">;
    serviceName: string;
    onProceed: (params: { reason: string }) => void;
};

const { ConfirmDeleteServiceDialog } = (() => {
    const ConfirmDeleteServiceDialog = memo((props: ConfirmDeleteServiceDialog) => {
        const { evtAction, serviceName, onProceed } = props;

        useEvt(
            ctx =>
                evtAction.attach(
                    action => action === "open",
                    ctx,
                    () => setIsOpen(true),
                ),
            [evtAction],
        );

        const [isOpen, setIsOpen] = useState(false);

        const onClose = useConstCallback(() => setIsOpen(false));

        const evtOnProceedClick = useConst(() =>
            Evt.create<ButtonsProps["evtOnProceedClick"]>(null),
        );

        const setOnProceedClick = useConstCallback<BodyProps["setOnProceedClick"]>(
            ({ onProceedClick }) => (evtOnProceedClick.state = onProceedClick),
        );

        const { t } = useTranslation({ ServiceCatalogCard });

        return (
            <Dialog
                title={t("confirm unregister service", { serviceName })}
                body={
                    isOpen && (
                        <Body
                            onClose={onClose}
                            onProceed={onProceed}
                            setOnProceedClick={setOnProceedClick}
                        />
                    )
                }
                isOpen={isOpen}
                onClose={onClose}
                buttons={
                    <Buttons onClose={onClose} evtOnProceedClick={evtOnProceedClick} />
                }
            />
        );
    });

    type BodyProps = {
        onClose: () => void;
        onProceed: ConfirmDeleteServiceDialog["onProceed"];
        setOnProceedClick: (params: { onProceedClick: (() => void) | null }) => void;
    };

    const Body = memo((props: BodyProps) => {
        const { onProceed, onClose } = props;

        const { classes } = useStyles();

        const { t } = useTranslation({ ServiceCatalogCard });

        const getIsValidValue = useConstCallback<TextFieldProps["getIsValidValue"]>(
            text => {
                if (text === "") {
                    return {
                        "isValidValue": false,
                        "message": t("can't be empty"),
                    };
                }

                return {
                    "isValidValue": true,
                };
            },
        );

        const [{ onProceedClick }, setOnProceedClick] = useState<{
            onProceedClick: (() => void) | null;
        }>({
            "onProceedClick": null,
        });

        const onValueBeingTypedChange = useConstCallback<
            TextFieldProps["onValueBeingTypedChange"]
        >(({ value, isValidValue }) =>
            setOnProceedClick({
                "onProceedClick": isValidValue
                    ? () => {
                          onProceed({ "reason": value });
                          onClose();
                      }
                    : null,
            }),
        );

        useEffect(() => {
            props.setOnProceedClick({ onProceedClick });
        }, [onProceedClick]);

        const evtAction = useConst(() => Evt.create<TextFieldProps["evtAction"]>());

        const onEnterKeyDown = useConstCallback<TextFieldProps["onEnterKeyDown"]>(
            ({ preventDefaultAndStopPropagation }) => {
                preventDefaultAndStopPropagation();
                evtAction.post("TRIGGER SUBMIT");
            },
        );

        const onSubmit = useConstCallback<TextFieldProps["onSubmit"]>(() => {
            assert(onProceedClick !== null);
            onProceedClick();
        });

        return (
            <>
                <Text typo="body 1">
                    {t("provide a reason for deleting the service")}
                </Text>
                <TextField
                    inputProps_autoFocus={true}
                    selectAllTextOnFocus={true}
                    className={classes.textField}
                    getIsValidValue={getIsValidValue}
                    onValueBeingTypedChange={onValueBeingTypedChange}
                    doOnlyValidateInputAfterFistFocusLost={false}
                    evtAction={evtAction}
                    onEnterKeyDown={onEnterKeyDown}
                    onSubmit={onSubmit}
                />
            </>
        );
    });

    type ButtonsProps = {
        onClose: () => void;
        evtOnProceedClick: StatefulReadonlyEvt<(() => void) | null>;
    };

    const Buttons = memo((props: ButtonsProps) => {
        const { onClose, evtOnProceedClick } = props;

        const { t } = useTranslation({ ServiceCatalogCard });

        useRerenderOnStateChange(evtOnProceedClick);

        return (
            <>
                <Button variant="secondary" onClick={onClose}>
                    {t("abort")}
                </Button>
                <Button
                    onClick={evtOnProceedClick.state ?? undefined}
                    disabled={evtOnProceedClick.state === null}
                >
                    {t("proceed")}
                </Button>
            </>
        );
    });

    const useStyles = makeStyles({
        "name": { CreateS3DirectoryDialog: ConfirmDeleteServiceDialog },
    })(theme => ({
        "textField": {
            //"width": 250,
            "display": "block",
            "margin": theme.spacing(5),
            "& > div": {
                "width": "100%",
            },
        },
    }));

    return { ConfirmDeleteServiceDialog };
})();
