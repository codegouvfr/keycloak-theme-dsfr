import { memo } from "react";
import { DirectoryHeader } from "onyxia-ui/DirectoryHeader";
import type { CompiledData } from "sill-api";
import { Icon, makeStyles } from "ui/theme";
import { Card } from "onyxia-ui/Card";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { Link } from "type-route";
import { AccountField } from "ui/components/pages/Account/AccountField";
import { useResolveLocalizedString } from "ui/i18n/useResolveLocalizedString";
import { exclude } from "tsafe/exclude";
import { capitalize } from "tsafe/capitalize";
import { useFormattedDate } from "ui/i18n/useMoment";
import { Tag } from "onyxia-ui/Tag";
import { Tooltip } from "onyxia-ui/Tooltip";
import { useDomRect } from "powerhooks/useDomRect";
import MuiLink from "@mui/material/Link";
import { CatalogReferentDialogs } from "./CatalogReferentDialogs";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { useConstCallback } from "powerhooks/useConstCallback";

export type Props = {
    className?: string;
    software: CompiledData.Software;
    onGoBack: () => void;
    editLink: Link | undefined;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    onDeclareOneselfReferent: (params: { isExpert: boolean }) => void;
    onUserNoLongerReferent: () => void;
    onLogin: () => void;
    openLinkBySoftwareId: Record<number, Link>;
    softwareNameBySoftwareId: Record<number, string>;
};

export const CatalogSoftwareDetails = memo((props: Props) => {
    const {
        className,
        software,
        onGoBack,
        editLink,
        referents,
        userIndexInReferents,
        onDeclareOneselfReferent,
        onUserNoLongerReferent,
        onLogin,
        openLinkBySoftwareId,
        softwareNameBySoftwareId,
    } = props;

    const { t } = useTranslation({ CatalogSoftwareDetails });

    const { resolveLocalizedString } = useResolveLocalizedString();

    const referencedSincePrettyPrint = useFormattedDate({
        "time": software.referencedSinceTime,
    });

    const softwareFunction = capitalize(
        [software.wikidataData?.description]
            .filter(exclude(undefined))
            .map(resolveLocalizedString)[0] ?? software.function,
    );

    const { imgRef, isBanner, imgWidth } = (function useClosure() {
        const {
            ref: imgRef,
            domRect: { height, width: imgWidth },
        } = useDomRect();

        const isBanner =
            imgWidth === 0 || height === 0 ? undefined : imgWidth > height * 1.7;

        return { imgRef, isBanner, imgWidth };
    })();

    const evtReferentDialogAction = useConst(() => Evt.create<"open">());

    const onShowReferentClick = useConstCallback(async () => {
        if (referents === undefined) {
            onLogin();
            return;
        }

        evtReferentDialogAction.post("open");
    });

    const { classes, cx, css } = useStyles({ imgWidth });

    return (
        <div className={cx(classes.root, className)}>
            <DirectoryHeader
                classes={{
                    "imageWrapper": classes.imageWrapper,
                }}
                onGoBack={onGoBack}
                title={
                    <>
                        {!isBanner && software.name}
                        {software.isStillInObservation && (
                            <>
                                &nbsp; &nbsp;
                                <Tag
                                    className={classes.warningTag}
                                    text={"En observations"}
                                />
                            </>
                        )}
                        {software.isFromFrenchPublicService && (
                            <>
                                &nbsp; &nbsp;
                                <Tooltip
                                    title={"Développer par le service publique français"}
                                >
                                    <span>🐓</span>
                                </Tooltip>
                            </>
                        )}
                    </>
                }
                subtitle={!isBanner && softwareFunction}
                image={
                    software?.wikidataData?.logoUrl !== undefined ? (
                        <img
                            ref={imgRef}
                            src={software.wikidataData.logoUrl}
                            alt=""
                            className={css({ "height": "100%" })}
                        />
                    ) : (
                        <Icon
                            iconId="airplay"
                            className={css({ "height": "100%", "width": "100%" })}
                        />
                    )
                }
            />
            {editLink !== undefined && (
                <Button
                    {...editLink}
                    doOpenNewTabIfHref={false}
                    className={classes.formLinkButton}
                >
                    {t("update software information")}
                </Button>
            )}
            <Card className={classes.card}>
                <AccountField
                    type="text"
                    title={"Nom du logiciel"}
                    text={capitalize(
                        [software.wikidataData?.label]
                            .filter(exclude(undefined))
                            .map(resolveLocalizedString)[0] ?? software.name,
                    )}
                />
                <AccountField
                    type="text"
                    title={"Fonction du logiciel"}
                    text={softwareFunction}
                />
                <AccountField
                    type="text"
                    title={"Identifiant SILL"}
                    text={software.id + ""}
                />
                <AccountField
                    type="text"
                    title={"Date d'entré dans le sill"}
                    text={referencedSincePrettyPrint}
                />
                <AccountField
                    type="text"
                    title={"Développer par le service publique"}
                    text={software.isFromFrenchPublicService ? "Oui" : "Non"}
                />
                <AccountField
                    type="text"
                    title={"Présent dans le marché de support"}
                    helperText={
                        <>
                            En savoir plus sur le{" "}
                            <MuiLink
                                underline="hover"
                                href="https://communs.numerique.gouv.fr/utiliser/marches-interministeriels-support-expertise-logiciels-libres/"
                            >
                                Marchés interministériels support et expertise à l'usage
                                des logiciels libres
                            </MuiLink>
                        </>
                    }
                    text={software.isPresentInSupportContract ? "Oui" : "Non"}
                />
                {software.wikidataData?.sourceUrl && (
                    <AccountField
                        type="text"
                        title={"Dépot de code source"}
                        text={
                            <MuiLink
                                target="_blank"
                                underline="hover"
                                href={software.wikidataData.sourceUrl}
                            >
                                {software.wikidataData.sourceUrl.replace(
                                    /^https:\/\//,
                                    "",
                                )}
                            </MuiLink>
                        }
                    />
                )}
                {software.wikidataData?.websiteUrl && (
                    <AccountField
                        type="text"
                        title={"Site web du logiciel"}
                        text={
                            <MuiLink
                                target="_blank"
                                underline="hover"
                                href={software.wikidataData.websiteUrl}
                            >
                                {software.wikidataData.websiteUrl.replace(
                                    /^https:\/\//,
                                    "",
                                )}
                            </MuiLink>
                        }
                    />
                )}
                <AccountField
                    type="text"
                    title={"Version minimum requise"}
                    helperText="Version la plus encienne qu'il est encore acceptable d'avoir en production"
                    text={software.versionMin}
                />
                <AccountField type="text" title={"Licence"} text={software.license} />
                <AccountField
                    type="text"
                    title={"Référents"}
                    helperText="Agents du service publique francais déclarant utiliser le logiciel"
                    text={
                        <Button onClick={onShowReferentClick} variant="ternary">
                            Voir les référents
                        </Button>
                    }
                />
                {software.parentSoftware?.isKnown && (
                    <AccountField
                        type="text"
                        title={"Parent software"}
                        helperText="Ce logiciel est un plugin ou une extention d'un autre logiciel"
                        text={
                            <MuiLink
                                {...openLinkBySoftwareId[
                                    software.parentSoftware.softwareId
                                ]}
                                underline="hover"
                            >
                                {
                                    softwareNameBySoftwareId[
                                        software.parentSoftware.softwareId
                                    ]
                                }
                            </MuiLink>
                        }
                    />
                )}
                {(() => {
                    const { comptoirDuLibreSoftware, ...rest } = software;

                    return <pre>{JSON.stringify(rest, null, 2)}</pre>;
                })()}
            </Card>
            <CatalogReferentDialogs
                referents={referents}
                userIndexInReferents={userIndexInReferents}
                evtAction={evtReferentDialogAction}
                onDeclareOneselfReferent={onDeclareOneselfReferent}
                onUserNoLongerReferent={onUserNoLongerReferent}
                softwareName={software.name}
            />
        </div>
    );
});

export namespace CatalogSoftwareDetails {
    export type I18nScheme = {
        "update software information": undefined;
    };
}

const useStyles = makeStyles<{ imgWidth: number }>({
    "name": { CatalogSoftwareDetails },
})((theme, { imgWidth }) => ({
    "root": {},
    "card": {
        "paddingTop": theme.spacing(2),
    },
    "formLinkButton": {
        ...theme.spacing.topBottom("margin", 4),
    },
    "warningTag": {
        "backgroundColor": theme.colors.useCases.alertSeverity.warning.main,
        "& > p": {
            "color": theme.colors.palette.dark.main,
        },
    },
    "imageWrapper": {
        "width": imgWidth,
    },
}));
