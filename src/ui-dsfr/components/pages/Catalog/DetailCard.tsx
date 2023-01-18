import React, { memo, ReactNode } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation, useResolveLocalizedString } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { fr, getColors } from "@codegouvfr/react-dsfr";
import { makeStyles } from "tss-react/dsfr";
import { shortEndMonthDate, monthDate } from "ui-dsfr/useMoment";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import Tooltip from "@mui/material/Tooltip";
import type { Props as CatalogCardProps } from "./CatalogCards/CatalogCard";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs"

export type Props = {
    className?: string;
    softwareLogoUrl?: string;
    softwareName: string;
    isFromFrenchPublicService: boolean;
    isDesktop: boolean;
    isPresentInSupportMarket: boolean;
    isRGAAComplient: boolean;
    softwareCurrentVersion: string;
    softwareDateCurrentVersion: number;
    registerDate: number;
    userCount: number;
    referentCount: number;
    seeUserAndReferent: Link;
    declareUserOrReferent: Link;
    authors: Link[];
    minimalVersionRequired: string;
    license: string;
    serviceProvider: Link;
    comptoireDuLibreSheet: Link
    wikiDataSheet: Link
    officialWebsite: Link
    sourceCodeRepository: Link
    referencedInstances: number
    alikeSoftware: CatalogCardProps[]
};

export const DetailCard = memo((props: Props) => {
    const {
        className,
        softwareCurrentVersion,
        softwareDateCurrentVersion,
        minimalVersionRequired,
        registerDate,
        license,
        serviceProvider,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    //assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ DetailCard });

    /**
     * Todo :
     * - Composant version
     */

    const previewTab =(
      <div>
        <p className={cx(fr.cx("fr-text--bold"))}>A propos</p>
        <p className={fr.cx('fr-text--regular')}>
          <span className={classes.labelDetail}>Dernière version : </span>
          <span
              className={cx(
                  fr.cx(
                      "fr-badge",
                      "fr-badge--yellow-tournesol",
                      "fr-badge--sm",
                  ),
                  classes.badgeVersion
              )}
          >
              {softwareCurrentVersion}
          </span>
          {t("last version date", {
              date: shortEndMonthDate({
                  time: softwareDateCurrentVersion,
              }),
          })}
        </p>
        <p className={fr.cx('fr-text--regular')}>
          <span className={classes.labelDetail}>Date de l'ajout : </span>
          <span>
            {t("register date", {date: monthDate({time: registerDate})})}
          </span>
        </p>

        <p className={fr.cx('fr-text--regular')}>
          <span className={classes.labelDetail}>Version minimale requise : </span>
          <span>{ minimalVersionRequired }</span>
        </p>
        <p className={fr.cx('fr-text--regular')}>
          <span className={classes.labelDetail}>License : </span>
          <span>{ license }</span>
        </p>
        <p className={cx(fr.cx("fr-text--bold"))}>Liens utiles</p>
        <a {...serviceProvider}>Voir les prestataires</a>
      </div>
      )


    return (
        <div className={cx(classes.root, className)}>
          <Tabs
              tabs={[
                  { "label": "Aperçu", "content": previewTab },
                  { "label": "Instance référencées", "content": <p>Content of tab2</p> },
                  { "label": "Logiciels similaires et équivalents propriétaires", "content": <p>Content of tab3</p> }
              ]}
          />
        </div>
    );
});

const useStyles = makeStyles({
    "name": { DetailCard },
})(theme => ({
    "root": {
        "backgroundColor": theme.decisions.background.default.grey.default,
    },
    "labelDetail": {
      "color": theme.decisions.text.mention.grey.default
    },
    "badgeVersion": {
      ...fr.spacing("margin", { rightLeft: "2v" }),
    },
}));

export const { i18n } = declareComponentKeys<
    | "last version"
    | { K: "last version date"; P: { date: string } }
    | { K: "register date"; P: { date: string } }
    | { K: "userAndReferentCount"; P: { userCount: number; referentCount: number } }
    | "declare oneself referent"
    | "isDesktop"
    | "isPresentInSupportMarket"
    | "isFromFrenchPublicService"
>()({ DetailCard });

