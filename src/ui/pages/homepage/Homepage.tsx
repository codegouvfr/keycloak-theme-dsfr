import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui/i18n";
import { routes } from "ui/routes";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Tile from "@codegouvfr/react-dsfr/Tile";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Card from "@codegouvfr/react-dsfr/Card";
import illustration_sill from "ui/assets/illustration_sill.svg";
import { useCoreState, selectors } from "core";
import type { PageRoute } from "./route";
import { useMetricCountUpAnimation } from "ui/tools/useMetricCountUpAnimation";

type Props = {
    className?: string;
    route: PageRoute;
};

export default function Homepage(props: Props) {
    const { className, route, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();
    const { t } = useTranslation({ Homepage });
    const { t: tCommon } = useTranslation({ "App": "App" });

    const { stats } = useCoreState(selectors.generalStats.stats);

    const softwareSelectionList = [
        {
            "title": t("last added"),
            "linkProps": routes.softwareCatalog({
                "sort": "added_time"
            }).link
        },
        {
            "title": t("most used"),
            "linkProps": routes.softwareCatalog({
                "sort": "user_count"
            }).link
        },
        {
            "title": t("essential"),
            "linkProps": routes.softwareCatalog({
                "prerogatives": ["isInstallableOnUserTerminal"]
            }).link
        },
        {
            "title": t("recently updated"),
            "linkProps": routes.softwareCatalog({
                "sort": "latest_version_publication_date"
            }).link
        },
        {
            "title": t("waiting for referent"),
            "linkProps": routes.softwareCatalog({
                "sort": "referent_count_ASC"
            }).link
        },
        {
            "title": t("in support market"),
            "linkProps": routes.softwareCatalog({
                "prerogatives": ["isPresentInSupportContract"]
            }).link
        }
    ];

    const whyUseSillAccordionList = [
        {
            "label": t("discover as agent label"),
            "description": t("discover as agent description")
        },
        {
            "label": t("discover as DSI label"),
            "description": t("discover as DSI description")
        },
        {
            "label": t("contribute as agent label"),
            "description": t("contribute as agent description")
        },
        {
            "label": t("contribute as DSI label"),
            "description": t("contribute as DSI description")
        }
    ];

    const helpUsCards = [
        {
            "imgUrl": "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png",
            "title": t("declare referent title"),
            "description": t("declare referent description"),
            "buttonLabel": t("search software"),
            "href": ""
        },
        {
            "imgUrl": "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png",
            "title": t("edit software title"),
            "description": t("edit software description"),
            "buttonLabel": t("search software"),
            "href": ""
        },
        {
            "imgUrl": "https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png",
            "title": tCommon("add software or service"),
            "description": t("add software or service description"),
            "buttonLabel": t("complete form"),
            "href": ""
        }
    ];

    return (
        <div className={className}>
            <div className={classes.section}>
                <div className={cx(fr.cx("fr-container"), classes.titleContainer)}>
                    <h2 className={classes.title}>{t("title")}</h2>
                    <img
                        src={illustration_sill}
                        alt="Illustration du SILL"
                        className={classes.clipart}
                    />
                </div>

                {/*
                <div className={cx(fr.cx("fr-container"), classes.searchForm)}>
                    <SearchByProfile route={route} />
                    <span className={""}>{t("or")}</span>
                    <Button iconId={"fr-icon-account-circle-fill"} priority={"tertiary"}>
                        {t("sign in")}
                    </Button>
                </div>
                */}
            </div>
            <section className={cx(classes.softwareSelectionBackground, classes.section)}>
                <div className={fr.cx("fr-container")}>
                    <h2 className={classes.titleSection}>{t("software selection")}</h2>
                    <div className={classes.softwareSelection}>
                        {softwareSelectionList.map(({ title, linkProps }) => (
                            <Tile key={title} title={title} linkProps={linkProps} />
                        ))}
                    </div>
                </div>
            </section>
            <section className={cx(fr.cx("fr-container"), classes.section)}>
                <h2 className={classes.titleSection}>{t("why use the SILL")}</h2>
                {whyUseSillAccordionList.map(accordion => (
                    <Accordion key={accordion.label} label={accordion.label}>
                        <p className={classes.accordionDescription}>
                            {accordion.description}
                        </p>
                    </Accordion>
                ))}
            </section>
            <section className={cx(classes.sillNumbersBackground, classes.section)}>
                <div className={cx(fr.cx("fr-container"), classes.sillNumbersContainer)}>
                    <h1 className={cx(classes.whiteText, classes.SillNumberTitle)}>
                        {t("SILL numbers")}
                    </h1>
                    <div className={classes.sillNumberList}>
                        {(
                            [
                                "softwareCount",
                                "registeredUserCount",
                                "agentReferentCount",
                                "organizationCount"
                            ] as const
                        ).map(metricName => (
                            <div key={metricName}>
                                <AnimatedMetric
                                    className={cx(
                                        fr.cx("fr-display--sm"),
                                        classes.whiteText,
                                        classes.numberText
                                    )}
                                    metricValue={stats[metricName]}
                                />
                                <h4 className={classes.whiteText}>{t(metricName)}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <div className={cx(classes.helpUsBackground, classes.section)}>
                <div className={cx(fr.cx("fr-container"))}>
                    <h2 className={classes.titleSection}>{t("help us")}</h2>
                    <div className={classes.helpUsCards}>
                        {helpUsCards.map(card => (
                            <Card
                                key={card.title}
                                title={card.title}
                                linkProps={{ href: card.href }}
                                desc={card.description}
                                imageAlt="Image d'illustration"
                                imageUrl={card.imgUrl}
                                footer={
                                    <Button priority="primary" type="button">
                                        {card.buttonLabel}
                                    </Button>
                                }
                                enlargeLink={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnimatedMetric(props: { className?: string; metricValue: number }) {
    const { metricValue, className } = props;

    const { ref, renderedMetricValue } = useMetricCountUpAnimation({
        metricValue
    });

    return (
        <p ref={ref} className={className}>
            {renderedMetricValue}
        </p>
    );
}

const useStyles = makeStyles({ "name": { Homepage } })(theme => ({
    "section": {
        ...fr.spacing("padding", {
            "topBottom": "30v"
        }),
        [fr.breakpoints.down("md")]: {
            ...fr.spacing("padding", {
                "topBottom": "10v"
            })
        }
    },
    "titleSection": {
        "marginBottom": fr.spacing("10v"),
        [fr.breakpoints.down("md")]: {
            "marginBottom": fr.spacing("8v")
        }
    },
    "titleContainer": {
        "marginBottom": fr.spacing("10v"),
        "display": "flex",
        [fr.breakpoints.down("md")]: {
            "flexDirection": "column"
        }
    },
    "title": {
        "marginRight": fr.spacing("30v"),
        "&>span": {
            color: theme.decisions.text.title.blueFrance.default
        },
        [fr.breakpoints.down("md")]: {
            ...fr.spacing("margin", {
                "right": 0,
                "bottom": "8v"
            })
        }
    },
    "clipart": {
        [fr.breakpoints.down("md")]: {
            "width": "50%",
            "margin": "0 auto"
        }
    },
    /*
    "searchForm": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center",
        "gap": fr.spacing("4v")
    },
    */
    "softwareSelectionBackground": {
        "backgroundColor": theme.decisions.background.alt.blueFrance.default
    },
    "softwareSelection": {
        "display": "grid",
        "gridTemplateColumns": "repeat(3, 1fr)",
        "columnGap": fr.spacing("6v"),
        "rowGap": fr.spacing("8v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    },
    "accordionDescription": {
        "marginBottom": 0
    },
    "sillNumbersBackground": {
        "backgroundColor": theme.decisions.background.actionHigh.blueFrance.default
    },
    "sillNumbersContainer": {
        "textAlign": "center"
    },
    "sillNumberList": {
        "display": "grid",
        "gridTemplateColumns": "repeat(4, 1fr)",
        "columnGap": fr.spacing("6v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
            "rowGap": fr.spacing("4v")
        }
    },
    "whiteText": {
        "color": theme.decisions.text.inverted.grey.default
    },
    "SillNumberTitle": {
        "marginBottom": fr.spacing("20v")
    },
    "numberText": {
        "marginBottom": fr.spacing("1v")
    },
    "helpUsBackground": {
        "backgroundColor": theme.decisions.background.default.grey.hover
    },
    "helpUsCards": {
        "display": "grid",
        "gridTemplateColumns": "repeat(3, 1fr)",
        "columnGap": fr.spacing("6v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
            "rowGap": fr.spacing("4v")
        }
    }
}));

export const { i18n } = declareComponentKeys<
    | {
          K: "title";
          R: JSX.Element;
      }
    | "or"
    | "sign in"
    | "software selection"
    | "last added"
    | "most used"
    | "essential"
    | "recently updated"
    | "waiting for referent"
    | "in support market"
    | "why use the SILL"
    | "discover as agent label"
    | "discover as agent description"
    | "discover as DSI label"
    | "discover as DSI description"
    | "contribute as agent label"
    | "contribute as agent description"
    | "contribute as DSI label"
    | "contribute as DSI description"
    | "SILL numbers"
    | "softwareCount"
    | "registeredUserCount"
    | "agentReferentCount"
    | "organizationCount"
    | "help us"
    | "declare referent title"
    | "declare referent description"
    | "search software"
    | "edit software title"
    | "edit software description"
    | "add software or service description"
    | "complete form"
>()({ Homepage });
