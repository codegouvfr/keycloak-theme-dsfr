import React, { useState } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { Equals } from "tsafe";
import { assert } from "tsafe/assert";
import type { Link } from "type-route";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { DetailUsersAndReferents } from "./DetailUsersAndReferents";
import { SoftwareCatalogState } from "../../../../core-dsfr/usecases/softwareCatalog";
import { SoftwareCatalogCard } from "../SoftwareCatalog/SoftwareCatalogCard";

export type Props = {
    className?: string;
    alikeSoftwares?: SoftwareCatalogState.Software.External[];
};

export const AlikeSoftwareTab = (props: Props) => {
    const { className, alikeSoftwares, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ AlikeSoftwareTab });
    const { classes, cx } = useStyles();

    return (
        <>
            <div className={cx(classes.root, className)}>
                <p className={fr.cx("fr-text--bold")}>
                    {t("alike software sill")} ({alikeSoftwares?.length}) :
                </p>
                {alikeSoftwares?.map(software => {
                    const {
                        logoUrl,
                        softwareName,
                        lastVersion,
                        softwareDescription,
                        userCount,
                        referentCount,
                        testUrl,
                        prerogatives
                    } = software;

                    return (
                        <SoftwareCatalogCard
                            logoUrl={logoUrl}
                            softwareName={softwareName}
                            lastVersion={lastVersion}
                            softwareDescription={softwareDescription}
                            prerogatives={prerogatives}
                            testUrl={testUrl}
                            userCount={userCount}
                            referentCount={referentCount}
                            declareUsageForm={{
                                href: "",
                                onClick: () => {}
                            }}
                            softwareDetails={{
                                href: "",
                                onClick: () => {}
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
};

const useStyles = makeStyles({
    "name": { AlikeSoftwareTab }
})(theme => ({
    "root": {}
}));

export const { i18n } = declareComponentKeys<
    "alike software sill" | "alike software proprietary"
>()({ AlikeSoftwareTab });
