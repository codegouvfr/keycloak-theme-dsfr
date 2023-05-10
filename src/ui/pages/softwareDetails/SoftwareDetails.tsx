import { useEffect } from "react";
import { selectors, useCoreState, useCoreFunctions } from "core";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { HeaderDetailCard } from "ui/pages/softwareDetails/HeaderDetailCard";
import { PreviewTab } from "ui/pages/softwareDetails/PreviewTab";
import { ReferencedInstancesTab } from "ui/pages/softwareDetails/ReferencedInstancesTab";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { AlikeSoftwareTab } from "ui/pages/softwareDetails/AlikeSoftwareTab";
import { ActionsFooter } from "ui/shared/ActionsFooter";
import { DetailUsersAndReferents } from "ui/shared/DetailUsersAndReferents";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { exclude } from "tsafe/exclude";
import type { PageRoute } from "./route";
import softwareLogoPlaceholder from "ui/assets/software_logo_placeholder.png";
import { LoadingFallback } from "ui/shared/LoadingFallback";
import { routes, getPreviousRouteName, session } from "ui/routes";
import {
    openDeclarationRemovalModal,
    DeclarationRemovalModal
} from "ui/shared/DeclarationRemovalModal";

type Props = {
    className?: string;
    route: PageRoute;
};

export default function SoftwareDetails(props: Props) {
    const { route, className } = props;

    const { softwareDetails } = useCoreFunctions();

    const { cx, classes } = useStyles();

    const { t } = useTranslation({ SoftwareDetails });

    const { software } = useCoreState(selectors.softwareDetails.software);
    const { userDeclaration } = useCoreState(selectors.softwareDetails.userDeclaration);

    useEffect(() => {
        softwareDetails.initialize({
            "softwareName": route.params.name
        });

        return () => softwareDetails.clear();
    }, [route.params.name]);

    if (software === undefined) {
        return <LoadingFallback />;
    }

    return (
        <>
            <div className={className}>
                <div className={fr.cx("fr-container")}>
                    <Breadcrumb
                        segments={[
                            {
                                "linkProps": {
                                    ...routes.softwareCatalog().link
                                },
                                "label": t("catalog breadcrumb")
                            }
                        ]}
                        currentPageLabel={software.softwareName}
                        className={classes.breadcrumb}
                    />
                    <HeaderDetailCard
                        softwareLogoUrl={software.logoUrl ?? softwareLogoPlaceholder}
                        softwareName={software.softwareName}
                        authors={software.authors}
                        officialWebsite={software.officialWebsiteUrl}
                        sourceCodeRepository={software.codeRepositoryUrl}
                        onGoBackClick={() => {
                            const previousRouteName = getPreviousRouteName();

                            if (
                                previousRouteName === "softwareCatalog" ||
                                previousRouteName === undefined
                            ) {
                                //Restore scroll position
                                session.back();
                                return;
                            }

                            routes.softwareCatalog().push();
                        }}
                        userDeclaration={userDeclaration}
                    />
                    <Tabs
                        tabs={[
                            {
                                "label": t("tab title overview"),
                                "content": (
                                    <PreviewTab
                                        wikiDataUrl={software.wikidataUrl}
                                        comptoireDuLibreUrl={software.compotoirDuLibreUrl}
                                        serviceProviderUrl={software.serviceProviderUrl}
                                        license={software.license}
                                        isDesktop={
                                            software.prerogatives
                                                .isInstallableOnUserTerminal
                                        }
                                        isPresentInSupportMarket={
                                            software.prerogatives
                                                .isPresentInSupportContract
                                        }
                                        isFromFrenchPublicService={
                                            software.prerogatives
                                                .isFromFrenchPublicServices
                                        }
                                        isRGAACompliant={
                                            software.prerogatives.doRespectRgaa
                                        }
                                        minimalVersionRequired={software.versionMin}
                                        registerDate={software.addedTime}
                                        softwareDateCurrentVersion={
                                            software.latestVersion?.publicationTime
                                        }
                                        softwareCurrentVersion={
                                            software.latestVersion?.semVer
                                        }
                                    />
                                )
                            },
                            ...(software.instances === undefined
                                ? []
                                : [
                                      {
                                          "label": t("tab title instance", {
                                              "instanceCount": software.instances.length
                                          }),
                                          "content": (
                                              <ReferencedInstancesTab
                                                  instanceList={software.instances}
                                              />
                                          )
                                      }
                                  ]),
                            {
                                "label": t("tab title alike software", {
                                    alikeSoftwareCount:
                                        software.similarSoftwares.length ?? 0
                                }),
                                "content": (
                                    <AlikeSoftwareTab
                                        alikeExternalSoftwares={software.similarSoftwares
                                            .map(item =>
                                                item.isInSill ? item.software : undefined
                                            )
                                            .filter(exclude(undefined))}
                                        alikeInternalSoftwares={software.similarSoftwares
                                            .map(item =>
                                                item.isInSill === false ? item : undefined
                                            )
                                            .filter(exclude(undefined))}
                                        getLinks={({ softwareName }) => ({
                                            "declarationForm": routes.declarationForm({
                                                "name": softwareName
                                            }).link,
                                            "softwareDetails": routes.softwareDetails({
                                                "name": softwareName
                                            }).link,
                                            "softwareUsersAndReferents":
                                                routes.softwareUsersAndReferents({
                                                    "name": softwareName
                                                }).link
                                        })}
                                    />
                                )
                            }
                        ]}
                    />
                </div>
                <ActionsFooter className={classes.container}>
                    <DetailUsersAndReferents
                        className={cx(
                            fr.cx("fr-text--lg"),
                            classes.detailUsersAndReferents
                        )}
                        seeUserAndReferent={
                            software.referentCount > 0 || software.userCount > 0
                                ? routes.softwareUsersAndReferents({
                                      "name": software.softwareName
                                  }).link
                                : undefined
                        }
                        referentCount={software.referentCount ?? 0}
                        userCount={software.userCount ?? 0}
                    />
                    <div className={classes.buttons}>
                        <Button
                            priority="secondary"
                            linkProps={
                                routes.softwareUpdateForm({
                                    "name": software.softwareName
                                }).link
                            }
                        >
                            {t("edit software")}
                        </Button>
                        {(() => {
                            const declarationType = userDeclaration?.isReferent
                                ? "referent"
                                : userDeclaration?.isUser
                                ? "user"
                                : undefined;

                            if (declarationType === undefined) {
                                return (
                                    <Button
                                        linkProps={
                                            routes.declarationForm({
                                                "name": software.softwareName
                                            }).link
                                        }
                                    >
                                        {t("declare referent")}
                                    </Button>
                                );
                            }

                            return (
                                <>
                                    <Button
                                        priority="tertiary no outline"
                                        onClick={() =>
                                            openDeclarationRemovalModal({
                                                declarationType,
                                                "softwareName": software.softwareName
                                            })
                                        }
                                    >
                                        {t("stop being user/referent", {
                                            declarationType
                                        })}
                                    </Button>
                                    {declarationType === "user" && (
                                        <Button
                                            linkProps={
                                                routes.declarationForm({
                                                    "name": software.softwareName,
                                                    "declarationType": "referent"
                                                }).link
                                            }
                                        >
                                            {t("become referent")}
                                        </Button>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </ActionsFooter>
            </div>
            {userDeclaration !== undefined && <DeclarationRemovalModal />}
        </>
    );
}

const useStyles = makeStyles({
    "name": { SoftwareDetails }
})(theme => ({
    "breadcrumb": {
        "marginBottom": fr.spacing("4v")
    },
    "container": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("6v"),
        "marginBottom": fr.spacing("6v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
            "gridRowGap": fr.spacing("6v")
        }
    },
    "buttons": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end",
        "gap": fr.spacing("4v")
    },
    "detailUsersAndReferents": {
        color: theme.decisions.text.actionHigh.blueFrance.default
    }
}));

export const { i18n } = declareComponentKeys<
    | "catalog breadcrumb"
    | "tab title overview"
    | { K: "tab title instance"; P: { instanceCount: number } }
    | { K: "tab title alike software"; P: { alikeSoftwareCount: number } }
    | "use full links"
    | "prerogatives"
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | "register"
    | { K: "register date"; P: { date: string } }
    | "minimal version"
    | "license"
    | "declare oneself referent"
    | "isDesktop"
    | "isPresentInSupportMarket"
    | "isFromFrenchPublicService"
    | "isRGAACompliant"
    | "service provider"
    | "comptoire du libre sheet"
    | "wikiData sheet"
    | "share software"
    | "declare referent"
    | "edit software"
    | { K: "stop being user/referent"; P: { declarationType: "user" | "referent" } }
    | "become referent"
>()({ SoftwareDetails });
