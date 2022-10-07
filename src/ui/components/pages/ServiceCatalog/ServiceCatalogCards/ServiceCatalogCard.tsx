import { useMemo, memo } from "react";
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
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import type { ServiceWithSoftwareInfo } from "core/usecases/serviceCatalog";
import { useState } from "react";
import { Dialog } from "onyxia-ui/Dialog";
import type { NonPostableEvt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { assert } from "tsafe/assert";
import { useDomRect } from "powerhooks/useDomRect";

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
        onRequestDelete: () => void;
    };

    export type UserNotLoggedIn = Common & {
        isUserLoggedIn: false;
        onLogin: () => void;
    };

}


export const ServiceCatalogCard = memo((props: Props) => {
    const {
        className,
        service,
        editLink,
        sillSoftwareLink,
        ...propsRest
    } = props;

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ ServiceCatalogCard });


    const evtConfirmDereferenceServiceDialogAction = useConst(() => Evt.create<ConfirmDereferenceServiceDialogProps["evtAction"]>());

    const onOpenConfirmDereferenceServiceDialog = useConstCallback(
        () => {

            if (!propsRest.isUserLoggedIn) {
                propsRest.onLogin();
                return;
            }

            evtConfirmDereferenceServiceDialogAction.post("open");
        }
    );

    const onConfirmDereferenceServiceDialogAnswer = useConstCallback<ConfirmDereferenceServiceDialogProps["onAnswer"]>(
        ({ doProceedToDereferencingTheService }) => {

            if (!doProceedToDereferencingTheService) {
                return;
            }

            assert(propsRest.isUserLoggedIn);

            propsRest.onRequestDelete();
        }
    );


    const softwareLink = useMemo(() =>
        sillSoftwareLink ??
        (
            (assert(!service.deployedSoftware.isInSill), service.deployedSoftware.comptoirDuLibreId === undefined) ? undefined : {
                "href": `https://comptoir-du-libre.org/softwares/${service.deployedSoftware.comptoirDuLibreId
                    }`,
                "onClick": () => { /* nothing */ },
                "_target": "blank" as const
            }),
        [service.deployedSoftware, sillSoftwareLink]
    );

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.aboveDivider}>

                <Text className={classes.title} typo="object heading">
                    {smartTrim({
                        "maxLength": 35,
                        "minCharAtTheEnd": 0,
                        "text": service.serviceName
                    })}
                </Text>

                <div style={{ "flex": 1 }} />

                {/* TODO */}
                <IconButton
                    iconId="edit"
                    href="#"
                    disabled={true}
                />
                <IconButton
                    iconId="delete"
                    onClick={onOpenConfirmDereferenceServiceDialog}
                />
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.body}>
                    <Text typo="label 1">{service.description} </Text>
                    <Software
                        logoUrl={!service.deployedSoftware.isInSill ? undefined : service.deployedSoftware.logoUrl}
                        name={service.deployedSoftware.softwareName}
                        link={softwareLink}
                    />
                </div>
                <div className={classes.buttonsWrapper}>
                    <Button
                        variant="primary"
                        href={service.serviceUrl}
                        doOpenNewTabIfHref={true}
                    >
                        {t("access service")}
                    </Button>
                </div>
            </div>
            <ConfirmDereferenceServiceDialog
                evtAction={evtConfirmDereferenceServiceDialogAction}
                serviceName={service.serviceName}
                onAnswer={onConfirmDereferenceServiceDialogAnswer}
            />
        </div>
    );
});

export const { i18n } = declareComponentKeys<
    | "confirm"
    | "abort"
    | { K: "confirm unregister service"; P: { serviceName: string; } }
    | "access service"
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
        "padding": theme.spacing({ "topBottom": 2, "rightLeft": 4 }),
        "paddingRight": 0,
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



type ConfirmDereferenceServiceDialogProps = {
    evtAction: NonPostableEvt<"open">;
    serviceName: string;
    onAnswer: (params: { doProceedToDereferencingTheService: boolean; }) => void;
};

const ConfirmDereferenceServiceDialog = memo((props: ConfirmDereferenceServiceDialogProps) => {
    const {
        evtAction,
        serviceName,
        onAnswer
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const onClose = useConstCallback(() => setIsOpen(false));

    const { t } = useTranslation({ ServiceCatalogCard });

    useEvt(ctx => evtAction.attach(action => action === "open", ctx, () => setIsOpen(true)), [evtAction]);

    const onAnswerFactory = useCallbackFactory((
        [doProceedToDereferencingTheService]: [boolean]
    ) => {
        onAnswer({ doProceedToDereferencingTheService })
        onClose();
    });

    return (
        <Dialog
            body={t("confirm unregister service", { serviceName })}
            buttons={
                <>
                    <Button onClick={onAnswerFactory(true)} variant="primary">
                        {t("confirm")}
                    </Button>
                    <Button onClick={onAnswerFactory(false)} variant="secondary">
                        {t("abort")}
                    </Button>
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
    );
});




const { Software } = (() => {

    type Props = {
        className?: string;
        logoUrl: string | undefined;
        link: (Link & { _target?: "blank" }) | undefined;
        name: string;
    };


    const Software = memo(
        (props: Props) => {

            const { className, logoUrl, name, link } = props;

            const { imgRef, isBanner } = (function useClosure() {
                const {
                    ref: imgRef,
                    domRect: { height, width },
                } = useDomRect();

                const isBanner = width === 0 || height === 0 ? undefined : width > height * 1.7;

                return { imgRef, isBanner };
            })();

            const { classes, css, cx } = useStyles();

            const innerNode = (
                <>
                    {logoUrl !== undefined && (
                        <img
                            ref={imgRef}
                            src={logoUrl}
                            alt=""
                            className={css({ "height": "100%" })}
                        />
                    )}
                    {(isBanner === false || logoUrl === undefined) && (
                        <Text className={classes.title} typo="object heading">
                            {smartTrim({
                                "maxLength": 23,
                                "minCharAtTheEnd": 0,
                                "text": capitalize(name),
                            })}
                        </Text>
                    )}
                </>
            );

            return (
                link === undefined ?
                    <div className={className}>{innerNode}</div> :
                    <a className={cx(classes.root, className)} {...link}>{innerNode}</a>
            );

        });

    const useStyles = makeStyles()(theme => ({
        "root": {
            "all": "unset",
            "display": "block",
        },
        "title": {
            "marginLeft": theme.spacing(3),
        },
    }));

    return { Software };

})();
