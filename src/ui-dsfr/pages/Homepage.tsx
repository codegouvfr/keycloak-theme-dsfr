import { useState, useTransition, FormEvent } from "react";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import { createGroup, Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import { fr } from "@codegouvfr/react-dsfr";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Tile from "@codegouvfr/react-dsfr/Tile";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Card from "@codegouvfr/react-dsfr/Card";
import illustration_sill from "ui-dsfr/assets/illustration_sill.svg";
import { useCoreState, selectors } from "../../core-dsfr";
import { AutocompleteInput } from "../shared/AutocompleteInput";

Homepage.routeGroup = createGroup([routes.home]);

type PageRoute = Route<typeof Homepage.routeGroup>;

Homepage.getDoRequireUserLoggedIn = () => false;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};

type Profile = "agent" | "DSI";

export function Homepage(props: Props) {
    const { className, route, ...rest } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();
    const { t } = useTranslation({ Homepage });
    const commoni18n = useTranslation({ "App": "App" });

    const [selectedUserProfile, setSelectedUserProfile] = useState<Profile>("agent");
    const [selectedSearchSubject, setSelectedSearchSubject] = useState(
        "Un type de logiciel libre spécifique"
    );
    const [search, setSearch] = useState<
        | { softwareName: string; softwareSillId: number; softwareDescription: string }
        | undefined
    >(undefined);

    const { stats } = useCoreState(selectors.generalStats.stats);

    const [, startTransition] = useTransition();

    const { allSillSoftwares } = useCoreState(
        selectors.searchSoftwareByNameForm.allSillSoftwares
    );

    const onProfileChange = (value: Profile) => {
        setSelectedUserProfile(value);
    };

    const onSearchSubjectChange = (value: string) => {
        setSelectedSearchSubject(value);
        searchOptions.search_subject[selectedUserProfile]
            .find(subject => subject.label === value)
            ?.action?.();
    };

    const onSearchChange = (
        value:
            | {
                  softwareName: string;
                  softwareSillId: number;
                  softwareDescription: string;
              }
            | undefined
    ) => {
        setSearch(value);
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchOptions.search_subject[selectedUserProfile]
            .find(subject => subject.label === selectedSearchSubject)
            ?.actionOnSubmit?.();
    };

    type searchOptionsType = {
        "profile": Profile[];
        "search_subject": {
            [key in Profile]: {
                "label": string;
                "action"?: () => void;
                "actionOnSubmit"?: () => void;
                "searchRequired": boolean;
            }[];
        };
    };

    const searchOptions: searchOptionsType = {
        "profile": ["agent", "DSI"],
        "search_subject": {
            "agent": [
                {
                    "label": "Un type de logiciel libre spécifique",
                    "actionOnSubmit": () => {
                        startTransition(() =>
                            routes
                                .softwareCatalog({
                                    ...route.params,
                                    search: search?.softwareName ?? ""
                                })
                                .replace()
                        );
                    },
                    "searchRequired": true
                },
                {
                    "label":
                        "Une alternative libre à mon logiciel de travail propriétaire",
                    "actionOnSubmit": () => {
                        startTransition(() =>
                            routes
                                .softwareCatalog({
                                    ...route.params,
                                    search: search?.softwareName ?? ""
                                })
                                .replace()
                        );
                    },
                    "searchRequired": true
                },
                {
                    "label": "À référencer un usage de logiciel",
                    "actionOnSubmit": () => {
                        if (search) {
                            startTransition(() =>
                                routes
                                    .softwareCatalog({
                                        ...route.params,
                                        search: search?.softwareName ?? ""
                                    })
                                    .replace()
                            );
                        } else {
                            startTransition(() =>
                                routes
                                    .softwareCatalog({
                                        ...route.params,
                                        sort: "user count"
                                    })
                                    .replace()
                            );
                        }
                    },
                    "searchRequired": false
                },
                {
                    "label": "À devenir référent d'un logiciel",
                    "actionOnSubmit": () => {
                        if (search) {
                            startTransition(() =>
                                routes
                                    .softwareCatalog({
                                        ...route.params,
                                        referentCount: 0
                                    })
                                    .replace()
                            );
                        } else {
                            startTransition(() =>
                                routes
                                    .softwareCatalog({
                                        ...route.params,
                                        sort: "user count"
                                    })
                                    .replace()
                            );
                        }
                    },
                    "searchRequired": false
                },
                {
                    "label": "À ajouter un logiciel",
                    "action": () => {
                        /*console.log(selectedSearchSubject)*/
                        startTransition(() => routes.softwareCreationForm().replace());
                    },
                    "searchRequired": false
                }
            ],
            "DSI": [
                {
                    "label":
                        "Un type de logiciel spécifique (avec des contraintes spécifiques)",
                    "actionOnSubmit": () => {
                        startTransition(() =>
                            routes
                                .softwareCatalog({
                                    ...route.params,
                                    search: search?.softwareName ?? ""
                                })
                                .replace()
                        );
                    },
                    "searchRequired": true
                },
                {
                    "label": "Une alternative libre au logiciel de tracail de mes agents",
                    "actionOnSubmit": () => {
                        startTransition(() =>
                            routes
                                .softwareCatalog({
                                    ...route.params,
                                    search: search?.softwareName ?? ""
                                })
                                .replace()
                        );
                    },
                    "searchRequired": true
                },
                {
                    "label":
                        "À référencer un usage de logiciels au sein de mon établissement",
                    "actionOnSubmit": () => {
                        if (search) {
                            startTransition(() =>
                                routes
                                    .softwareCatalog({
                                        ...route.params,
                                        search: search?.softwareName ?? ""
                                    })
                                    .replace()
                            );
                        } else {
                            startTransition(() =>
                                routes
                                    .softwareCatalog({
                                        ...route.params,
                                        sort: "user count"
                                    })
                                    .replace()
                            );
                        }
                    },
                    "searchRequired": false
                },
                {
                    "label":
                        "À référencer l'instance d'un service et son usage au sein de mon établissement",
                    "action": () => {
                        startTransition(() => routes.instanceCreationForm().replace());
                    },
                    "searchRequired": false
                },
                {
                    "label": "Un accompagnement vers la transition vers le libre",
                    "action": () => {
                        window.location.href = "mailto:contact@code.gouv.fr";
                    },
                    "searchRequired": false
                }
            ]
        }
    };

    const softwareSelectionList = [
        {
            "title": t("last added"),
            "href": routes.softwareCatalog({
                ...route.params,
                sort: "added time"
            }).href
        },
        {
            "title": t("most used"),
            "href": routes.softwareCatalog({
                ...route.params,
                sort: "user count"
            }).href
        },
        {
            "title": t("essential"),
            "href": routes.softwareCatalog({
                ...route.params,
                prerogatives: ["isInstallableOnUserTerminal"]
            }).href
        },
        {
            "title": t("selection of the month"),
            "href": ""
        },
        {
            "title": t("waiting for referent"),
            "href": routes.softwareCatalog({
                ...route.params,
                referentCount: 0
            }).href
        },
        {
            "title": t("in support market"),
            "href": routes.softwareCatalog({
                ...route.params,
                prerogatives: ["isPresentInSupportContract"]
            }).href
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
            "number": stats.softwareCount,
            "label": t("referenced software")
        },
        {
            "number": stats.registeredUserCount,
            "label": t("user")
        },
        {
            "number": stats.agentReferentCount,
            "label": t("referent")
        },
        {
            "number": stats.organizationCount,
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
            "title": commoni18n.t("add software or service"),
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
                    <form className={classes.searchInputs} onSubmit={onSubmit}>
                        <Select
                            label={t("agent label")}
                            nativeSelectProps={{
                                "onChange": event =>
                                    onProfileChange(event.target.value as Profile),
                                "defaultValue": selectedUserProfile ?? ""
                            }}
                            className={classes.searchGroup}
                        >
                            {searchOptions.profile.map(option => (
                                <option key={option}>{option}</option>
                            ))}
                        </Select>
                        <Select
                            label={t("search label")}
                            nativeSelectProps={{
                                "onChange": event =>
                                    onSearchSubjectChange(event.target.value),
                                "defaultValue": selectedSearchSubject ?? ""
                            }}
                            className={classes.searchGroup}
                        >
                            {searchOptions.search_subject[selectedUserProfile].map(
                                option => (
                                    <option key={option.label}>{option.label}</option>
                                )
                            )}
                        </Select>
                        <div className={fr.cx("fr-search-bar")}>
                            <AutocompleteInput
                                value={search}
                                options={allSillSoftwares ?? []}
                                onValueChange={value => onSearchChange(value)}
                                getOptionLabel={entry => entry.softwareName}
                                renderOption={(liProps, entry) => (
                                    <li {...liProps}>
                                        <div>
                                            <span>{entry.softwareName}</span>
                                        </div>
                                    </li>
                                )}
                                noOptionText="No result"
                                dsfrInputProps={{
                                    "label": undefined,
                                    "nativeInputProps": {
                                        "name": "search",
                                        "role": "search",
                                        "required": searchOptions.search_subject[
                                            selectedUserProfile
                                        ].find(
                                            subject =>
                                                subject.label === selectedSearchSubject
                                        )?.searchRequired
                                    }
                                }}
                            />
                            <button className="fr-btn" title="Rechercher" type={"submit"}>
                                Chercher
                            </button>
                        </div>
                    </form>
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

const useStyles = makeStyles()(theme => ({
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
    | "add software or service description"
    | "complete form"
>()({ Homepage });
