import { Fragment, memo } from "react";
import { DirectoryHeader } from "onyxia-ui/DirectoryHeader";
import type { CompiledData } from "sill-api";
import { Icon, makeStyles } from "ui/theme";
import { Card } from "onyxia-ui/Card";
import { Button } from "ui/theme";
import { useTranslation } from "ui/i18n/useTranslations";
import { Link } from "type-route";
import { DescriptiveField } from "ui/components/shared/DescriptiveField";
import { useResolveLocalizedString } from "ui/i18n/useResolveLocalizedString";
import { exclude } from "tsafe/exclude";
import { capitalize } from "tsafe/capitalize";
import { useFormattedDate } from "ui/i18n/useMoment";
import { Tag } from "onyxia-ui/Tag";
import { Tooltip } from "onyxia-ui/Tooltip";
import { useDomRect } from "powerhooks/useDomRect";
import MuiLink from "@mui/material/Link";
import { ReferentDialogs } from "../../shared/ReferentDialogs";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { useConstCallback } from "powerhooks/useConstCallback";
import { assert } from "tsafe/assert";
import type { ReferentDialogsProps } from "ui/components/shared/ReferentDialogs";
import type { UnpackEvt } from "evt";

export type Props = {
    className?: string;
    software: CompiledData.Software;
    onGoBack: () => void;
    editLink: Link | undefined;
    referents: CompiledData.Software.WithReferent["referents"] | undefined;
    userIndexInReferents: number | undefined;
    onDeclareReferentAnswer: (params: {
        isExpert: boolean;
        useCaseDescription: string;
    }) => void;
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
        onDeclareReferentAnswer,
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

    const evtReferentDialogAction = useConst(() =>
        Evt.create<UnpackEvt<ReferentDialogsProps["evtAction"]>>(),
    );

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
                <DescriptiveField
                    type="text"
                    title={t("software name")}
                    text={capitalize(
                        [software.wikidataData?.label]
                            .filter(exclude(undefined))
                            .map(resolveLocalizedString)[0] ?? software.name,
                    )}
                />
                <DescriptiveField
                    type="text"
                    title={t("software's function")}
                    text={softwareFunction}
                />
                {software.testUrls.length !== 0 && (
                    <DescriptiveField
                        type="text"
                        title={t("test url")}
                        helperText={t("test url helper")}
                        text={
                            <Button
                                href={
                                    (assert(
                                        software.testUrls.length === 1,
                                        "Implement view for multiple urls",
                                    ),
                                    software.testUrls[0].url)
                                }
                                doOpenNewTabIfHref={true}
                                variant="ternary"
                            >
                                {t("launch")}
                            </Button>
                        }
                    />
                )}
                <DescriptiveField
                    type="text"
                    title={t("sill id")}
                    helperText={t("sill id helper")}
                    text={`${software.id}`}
                />
                <DescriptiveField
                    type="text"
                    title={t("in sill from date")}
                    text={referencedSincePrettyPrint}
                />
                <DescriptiveField
                    type="text"
                    title={t("dev by public service")}
                    text={software.isFromFrenchPublicService ? "Oui" : "Non"}
                />
                <DescriptiveField
                    type="text"
                    title={t("present in support contract")}
                    helperText={
                        <>
                            {t("learn more about the")}&nbsp;
                            <MuiLink
                                underline="hover"
                                href="https://communs.numerique.gouv.fr/utiliser/marches-interministeriels-support-expertise-logiciels-libres/"
                            >
                                {t("MISEULL")}
                            </MuiLink>
                        </>
                    }
                    text={t(software.isPresentInSupportContract ? "yes" : "no")}
                />
                {software.wikidataData?.sourceUrl && (
                    <DescriptiveField
                        type="text"
                        title={t("repo")}
                        text={
                            <MuiLink
                                target="_blank"
                                underline="hover"
                                href={software.wikidataData.sourceUrl}
                            >
                                {software.wikidataData.sourceUrl
                                    .replace(/^https:\/\//, "")
                                    .replace(/\/$/, "")}
                            </MuiLink>
                        }
                    />
                )}
                {software.wikidataData?.websiteUrl && (
                    <DescriptiveField
                        type="text"
                        title={t("website of the software")}
                        text={
                            <MuiLink
                                target="_blank"
                                underline="hover"
                                href={software.wikidataData.websiteUrl}
                            >
                                {software.wikidataData.websiteUrl
                                    .replace(/^https:\/\//, "")
                                    .replace(/\/$/, "")}
                            </MuiLink>
                        }
                    />
                )}
                <DescriptiveField
                    type="text"
                    title={t("minimal version")}
                    helperText={t("minimal version helper")}
                    text={software.versionMin}
                />
                <DescriptiveField
                    type="text"
                    title={t("license")}
                    text={software.license}
                />
                <DescriptiveField
                    type="text"
                    title={t("referents")}
                    helperText={t("referents helper")}
                    text={
                        <Button onClick={onShowReferentClick} variant="ternary">
                            {t("see referents")}
                        </Button>
                    }
                />
                {software.parentSoftware?.isKnown && (
                    <DescriptiveField
                        type="text"
                        title={t("parent software")}
                        helperText={t("parent software helper")}
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
                {software.alikeSoftwares.length !== 0 && (
                    <DescriptiveField
                        type="text"
                        title={t("alike softwares")}
                        helperText={t("alike softwares helper")}
                        text={software.alikeSoftwares.map((softwareRef, i) => (
                            <Fragment key={i}>
                                {softwareRef.isKnown ? (
                                    <MuiLink
                                        {...openLinkBySoftwareId[softwareRef.softwareId]}
                                        underline="hover"
                                    >
                                        {softwareNameBySoftwareId[softwareRef.softwareId]}
                                    </MuiLink>
                                ) : (
                                    softwareRef.softwareName
                                )}{" "}
                                &nbsp;
                            </Fragment>
                        ))}
                    />
                )}
                <DescriptiveField
                    type="text"
                    title={t("workstation")}
                    helperText={t("workstation helper")}
                    text={software.agentWorkstation ? "Oui" : "Non"}
                />
                {!!software.wikidataData?.developers.length && (
                    <DescriptiveField
                        type="text"
                        title={t("authors")}
                        helperText={t("authors helper")}
                        text={software.wikidataData.developers.map(developer => (
                            <Fragment key={developer.id}>
                                <MuiLink
                                    key={developer.id}
                                    href={`https://www.wikidata.org/wiki/${developer.id}`}
                                    target="_blank"
                                    underline="hover"
                                >
                                    {developer.name}
                                </MuiLink>
                                &nbsp;
                            </Fragment>
                        ))}
                    />
                )}

                {!!software.comptoirDuLibreSoftware?.providers.length && (
                    <DescriptiveField
                        type="text"
                        title={t("service provider")}
                        helperText={t("service provider helper")}
                        text={
                            <MuiLink
                                href={`https://comptoir-du-libre.org/en/softwares/servicesProviders/${software.comptoirDuLibreSoftware.id}`}
                                underline="hover"
                            >
                                {t("total service provider", {
                                    "howMany": `${software.comptoirDuLibreSoftware.providers.length}`,
                                })}
                            </MuiLink>
                        }
                    />
                )}
                {software.comptoirDuLibreSoftware !== undefined && (
                    <DescriptiveField
                        type="text"
                        title={t("comptoir page")}
                        helperText={t("comptoir page helper")}
                        text={
                            <MuiLink
                                href={`https://comptoir-du-libre.org/fr/softwares/${software.comptoirDuLibreSoftware.id}`}
                                underline="hover"
                            >
                                {t("see on comptoir")}
                            </MuiLink>
                        }
                    />
                )}
                {software.wikidataData !== undefined && (
                    <DescriptiveField
                        type="text"
                        title={t("wikidata page")}
                        helperText={t("wikidata page helper")}
                        text={
                            <MuiLink
                                href={`https://www.wikidata.org/wiki/${software.wikidataData.id}`}
                                underline="hover"
                            >
                                {t("see on wikidata")}
                            </MuiLink>
                        }
                    />
                )}
                {software.workshopUrls.length !== 0 && (
                    <DescriptiveField
                        type="text"
                        title={t("workshops replay")}
                        helperText={
                            <>
                                {t("workshops replay helper")}&nbsp;
                                <MuiLink
                                    href="https://github.com/blue-hats/ateliers"
                                    underline="hover"
                                >
                                    {t("see all workshops")}
                                </MuiLink>
                            </>
                        }
                        text={software.workshopUrls.map((url, i) => (
                            <Fragment key={url}>
                                <MuiLink
                                    key={url}
                                    href={url}
                                    target="_blank"
                                    underline="hover"
                                >
                                    {t("workshop", { "n": `${i + 1}` })}
                                </MuiLink>
                                &nbsp;
                            </Fragment>
                        ))}
                    />
                )}
                {software.useCaseUrls.length !== 0 && (
                    <DescriptiveField
                        type="text"
                        title={t("use cases")}
                        helperText={t("use cases helper")}
                        text={software.useCaseUrls.map((url, i) => (
                            <Fragment key={url}>
                                <MuiLink
                                    key={url}
                                    href={url}
                                    target="_blank"
                                    underline="hover"
                                >
                                    {t("use case", { "n": `${i + 1}` })}
                                </MuiLink>
                                &nbsp;
                            </Fragment>
                        ))}
                    />
                )}
            </Card>
            <ReferentDialogs
                referents={referents}
                userIndexInReferents={userIndexInReferents}
                evtAction={evtReferentDialogAction}
                onAnswer={onDeclareReferentAnswer}
                onUserNoLongerReferent={onUserNoLongerReferent}
                softwareName={software.name}
            />
        </div>
    );
});

export namespace CatalogSoftwareDetails {
    export type I18nScheme = {
        "update software information": undefined;
        "software name": undefined;
        "software's function": undefined;
        "sill id": undefined;
        "sill id helper": undefined;
        "in sill from date": undefined;
        "dev by public service": undefined;
        "present in support contract": undefined;
        "learn more about the": undefined;
        "MISEULL": undefined;
        "yes": undefined;
        "no": undefined;
        "repo": undefined;
        "website of the software": undefined;
        "minimal version": undefined;
        "minimal version helper": undefined;
        "referents": undefined;
        "referents helper": undefined;
        "see referents": undefined;
        "parent software": undefined;
        "parent software helper": undefined;
        "alike softwares": undefined;
        "alike softwares helper": undefined;
        "workstation": undefined;
        "workstation helper": undefined;
        "authors": undefined;
        "authors helper": undefined;
        "service provider": undefined;
        "service provider helper": undefined;
        "total service provider": { howMany: string };
        "comptoir page": undefined;
        "comptoir page helper": undefined;
        "see on comptoir": undefined;
        "wikidata page": undefined;
        "wikidata page helper": undefined;
        "see on wikidata": undefined;
        "license": undefined;
        "workshops replay": undefined;
        "workshops replay helper": undefined;
        "see all workshops": undefined;
        "test url": undefined;
        "test url helper": undefined;
        "launch": undefined;
        "workshop": { n: string };
        "use cases": undefined;
        "use cases helper": undefined;
        "use case": { n: string };
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
