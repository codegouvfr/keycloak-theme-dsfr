import { FormEvent, useState, useTransition } from "react";
import { selectors, useCoreState } from "../../../core";
import { routes } from "../../routes";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { fr } from "@codegouvfr/react-dsfr";
import { AutocompleteInput } from "../../shared/AutocompleteInput";
import { useTranslation } from "../../i18n";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { declareComponentKeys } from "i18nifty";
import { Route } from "type-route";
type PageRoute = Route<any>;

export type Props = {
    className?: string;
    route: Pick<PageRoute, "params">;
};
export function SearchByProfile(props: Props) {
    const { route } = props;
    const { t } = useTranslation({ SearchByProfile });
    const commoni18n = useTranslation({ "App": null });

    type Profile = string;
    const [selectedUserProfile, setSelectedUserProfile] = useState<Profile>(t("agent"));
    const [selectedSearchSubject, setSelectedSearchSubject] = useState(
        t("specific free software")
    );
    const [search, setSearch] = useState<
        | { softwareName: string; softwareSillId: number; softwareDescription: string }
        | undefined
    >(undefined);

    const { classes } = useStyles();

    const [, startTransition] = useTransition();

    const { allSillSoftwares } = useCoreState(
        selectors.searchSoftwareByNameForm.allSillSoftwares
    );

    const onProfileChange = (value: Profile) => {
        setSelectedUserProfile(value);
    };

    const onSearchSubjectChange = (value: string) => {
        setSelectedSearchSubject(value);
        if (selectedUserProfile) {
            searchOptions.search_subject[selectedUserProfile]
                .find(subject => subject.label === value)
                ?.action?.();
        }
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
        if (selectedUserProfile) {
            searchOptions.search_subject[selectedUserProfile]
                .find(subject => subject.label === selectedSearchSubject)
                ?.actionOnSubmit?.();
        }
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
        "profile": [t("agent"), t("CIO")],
        "search_subject": {
            [t("agent")]: [
                {
                    "label": t("specific free software"),
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
                    "label": t("similar proprietary software"),
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
                    "label": t("reference software usage"),
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
                    "label": t("declare referent"),
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
                    "label": t("add software"),
                    "action": () => {
                        startTransition(() => routes.softwareCreationForm().replace());
                    },
                    "searchRequired": false
                }
            ],
            [t("CIO")]: [
                {
                    "label": t("specific software with constraint"),
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
                    "label": t("similar free software for agent"),
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
                    "label": t("reference software usage in my organization"),
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
                    "label": t("reference instance"),
                    "action": () => {
                        startTransition(() => routes.instanceCreationForm().replace());
                    },
                    "searchRequired": false
                },
                {
                    "label": t("need assistance"),
                    "action": () => {
                        window.location.href = "mailto:contact@code.gouv.fr";
                    },
                    "searchRequired": false
                }
            ]
        }
    };

    return (
        <form className={classes.searchInputs} onSubmit={onSubmit}>
            <Select
                label={t("agent label")}
                nativeSelectProps={{
                    "onChange": event => onProfileChange(event.target.value as Profile)
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
                    "onChange": event => onSearchSubjectChange(event.target.value),
                    "defaultValue": selectedSearchSubject ?? ""
                }}
                className={classes.searchGroup}
            >
                {selectedUserProfile &&
                    searchOptions.search_subject[selectedUserProfile].map(option => (
                        <option key={option.label}>{option.label}</option>
                    ))}
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
                            "placeholder": "",
                            "name": "search",
                            "role": "search",
                            "required": selectedUserProfile
                                ? searchOptions.search_subject[selectedUserProfile].find(
                                      subject => subject.label === selectedSearchSubject
                                  )?.searchRequired
                                : false
                        }
                    }}
                />
                <button className="fr-btn" title={commoni18n.t("search")} type={"submit"}>
                    {commoni18n.t("search")}
                </button>
            </div>
        </form>
    );
}

const useStyles = makeStyles()(theme => ({
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
    }
}));

export const { i18n } = declareComponentKeys<
    | "agent label"
    | "search label"
    | "agent"
    | "search placeholder"
    | "CIO"
    | "specific free software"
    | "similar proprietary software"
    | "reference software usage"
    | "declare referent"
    | "add software"
    | "specific software with constraint"
    | "similar free software for agent"
    | "reference software usage in my organization"
    | "reference instance"
    | "need assistance"
>()({ SearchByProfile });
