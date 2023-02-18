import React, { useState } from "react";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../../i18n";
import { createGroup, Route } from "type-route";
import { routes } from "../../routes";
import { fr } from "@codegouvfr/react-dsfr";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Tile from "@codegouvfr/react-dsfr/Tile";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Card from "@codegouvfr/react-dsfr/Card";
import illustration_sill from "ui-dsfr/assets/illustration_sill.svg";

Homepage.routeGroup = createGroup([routes.home]);

type PageRoute = Route<typeof Homepage.routeGroup>;

Homepage.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

export function Homepage(props: Props) {
    const { className, route, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();
    const { t } = useTranslation({ Homepage });

    const [selectedUserType, setSelectedUserType] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState("");

    const onUserTypeChange = (value: string) => {
        setSelectedUserType(value);
    };

    const onSearchTypeChange = (value: string) => {
        setSelectedSearchType(value);
    };

    const softwareSelectionList = [
        {
            "title": t("last added"),
            "href": ""
        },
        {
            "title": t("most used"),
            "href": ""
        },
        {
            "title": t("essential"),
            "href": ""
        },
        {
            "title": t("selection of the month"),
            "href": ""
        },
        {
            "title": t("waiting for referent"),
            "href": ""
        },
        {
            "title": t("in support market"),
            "href": ""
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

    const sillNumbers = [
        {
            "number": 322,
            "label": t("referenced software")
        },
        {
            "number": 500,
            "label": t("user")
        },
        {
            "number": 100,
            "label": t("referent")
        },
        {
            "number": 37,
            "label": t("organization")
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
            "title": t("add software or service title"),
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
                    <img src={illustration_sill} alt="Illustration du SILL" />
                </div>

                <div className={cx(fr.cx("fr-container"), classes.searchForm)}>
                    <div className={classes.searchInputs}>
                        <Select
                            label={t("agent label")}
                            nativeSelectProps={{
                                "onChange": event => onUserTypeChange(event.target.value),
                                "defaultValue": selectedUserType ?? ""
                            }}
                            className={classes.searchGroup}
                        >
                            <option>Un agent</option>
                        </Select>
                        <Select
                            label={t("search label")}
                            nativeSelectProps={{
                                "onChange": event =>
                                    onSearchTypeChange(event.target.value),
                                "defaultValue": selectedSearchType ?? ""
                            }}
                            className={classes.searchGroup}
                        >
                            <option>Un agent</option>
                        </Select>

                        <SearchBar
                            className={classes.searchGroup}
                            label={t("research placeholder")}
                        />
                    </div>
                    <span className={""}>{t("or")}</span>
                    <Button iconId={"fr-icon-account-circle-fill"} priority={"tertiary"}>
                        {t("sign in")}
                    </Button>
                </div>
            </div>
            <section className={cx(classes.softwareSelectionBackground, classes.section)}>
                <div className={fr.cx("fr-container")}>
                    <h2 className={classes.titleSection}>{t("software selection")}</h2>
                    <div className={classes.softwareSelection}>
                        {softwareSelectionList.map(software => (
                            <Tile
                                key={software.title}
                                title={software.title}
                                linkProps={{ href: software.href }}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className={cx(fr.cx("fr-container"), classes.section)}>
                <h2 className={classes.titleSection}>{t("why use the STILL")}</h2>
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
                        {sillNumbers.map(item => (
                            <div key={item.label}>
                                <p
                                    className={cx(
                                        fr.cx("fr-display--sm"),
                                        classes.whiteText,
                                        classes.numberText
                                    )}
                                >
                                    {item.number}
                                </p>
                                <h4 className={classes.whiteText}>{item.label}</h4>
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

const useStyles = makeStyles({ "name": { Homepage } })(theme => ({
    "section": {
        ...fr.spacing("padding", {
            "topBottom": "30v"
        }),
        [fr.breakpoints.down("md")]: {
            ...fr.spacing("padding", {
                "topBottom": "20v"
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
        "display": "flex"
    },
    "title": {
        "marginRight": fr.spacing("30v"),
        "&>span": {
            color: theme.decisions.text.title.blueFrance.default
        }
    },
    "searchForm": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center",
        "gap": fr.spacing("4v")
    },
    "searchInputs": {
        "display": "grid",
        "gridTemplateColumns": "repeat(3, 1fr)",
        "columnGap": fr.spacing("4v"),
        "alignItems": "flex-end",
        "width": "100%",
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
            "rowGap": fr.spacing("4v")
        }
    },
    "searchGroup": {
        "&&": {
            "marginBottom": 0
        },
        "&:first-of-type": {
            "borderRight": `1px ${theme.decisions.border.default.grey.default} solid`,
            "paddingRight": fr.spacing("4v"),
            [fr.breakpoints.down("md")]: {
                "paddingRight": 0,
                "border": "none"
            }
        }
    },
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
    | "agent label"
    | "search label"
    | "research placeholder"
    | "or"
    | "sign in"
    | "software selection"
    | "last added"
    | "most used"
    | "essential"
    | "selection of the month"
    | "waiting for referent"
    | "in support market"
    | "why use the STILL"
    | "discover as agent label"
    | "discover as agent description"
    | "discover as DSI label"
    | "discover as DSI description"
    | "contribute as agent label"
    | "contribute as agent description"
    | "contribute as DSI label"
    | "contribute as DSI description"
    | "SILL numbers"
    | "referenced software"
    | "user"
    | "referent"
    | "organization"
    | "help us"
    | "declare referent title"
    | "declare referent description"
    | "search software"
    | "edit software title"
    | "edit software description"
    | "add software or service title"
    | "add software or service description"
    | "complete form"
>()({ Homepage });