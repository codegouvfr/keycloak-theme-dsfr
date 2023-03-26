import { Fzf } from "fzf";
import memoize from "memoizee";
import type { SillApi } from "../ports/SillApi";
import { id } from "tsafe/id";
import LogoNextCloud from "ui/assets/logo_nextcloud.png";
import LogoLibreOffice from "ui/assets/logo_libreoffice.png";
import LogoWordpress from "ui/assets/logo_wordpress.png";
import { assert } from "tsafe/assert";
import type { ApiTypes } from "@codegouvfr/sill";

export const sillApi: SillApi = {
    "getApiVersion": memoize(async () => "0.0.0", { "promise": true }),
    "getOidcParams": memoize(
        async () => ({
            "keycloakParams": undefined,
            "jwtClaimByUserKey": {
                "agencyName": "a",
                "email": "b",
                "id": "c",
                "locale": "d"
            },
            "termsOfServiceUrl": "https://example.com/tos.ms"
        }),
        { "promise": true }
    ),
    "getSoftwares": memoize(() => Promise.resolve([...softwares]), { "promise": true }),
    "getInstances": memoize(
        async () => {
            return id<ApiTypes.Instance[]>([
                {
                    "id": 0,
                    "mainSoftwareSillId": 9,
                    "organization": "CNRS",
                    "otherSoftwares": [],
                    "publicUrl": "https://videos.ahp-numerique.fr/",
                    "targetAudience": `Plateforme vidéos des Archives Henri-Poincaré (laboratoire du CNRS, de l'Université de Lorraine et de 
                l'Université de Strasbourg). Vous y trouverez des vidéos de philosophie et d'histoire des sciences et des techniques.`
                }
            ]);
        },
        { "promise": true }
    ),
    "getWikidataOptions": async ({ queryString }) => {
        if (queryString === "") {
            return [];
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const entries = fzf.find(queryString);

        return entries.map(({ item }) => item);
    },
    "getSoftwareFormAutoFillDataFromWikidataAndOtherSources": async ({ wikidataId }) => {
        await new Promise(resolve => setTimeout(resolve, 1));

        return {
            wikidataId,
            "comptoirDuLibreId": 123,
            "softwareName": `Software ${wikidataId}`,
            "softwareDescription": `Software ${wikidataId} description`,
            "softwareLicense": `Software ${wikidataId} license`,
            "softwareMinimalVersion": `1.3.4`
        };
    },
    "createSoftware": async ({ formData }) => {
        console.log(`Software created ${JSON.stringify(formData, null, 2)}`);

        const software: ApiTypes.Software = {
            "logoUrl": undefined,
            "softwareId":
                softwares
                    .map(({ softwareId }) => softwareId)
                    .sort()
                    .reverse()[0] + 1,
            "softwareName": formData.softwareName,
            "codeRepositoryUrl": undefined,
            "authors": [],
            "versionMin": "3.9.0",
            "serviceProviderCount": 0,
            "compotoirDuLibreId": formData.comptoirDuLibreId,
            "wikidataId": formData.wikidataId,
            "license": formData.softwareLicense,
            "officialWebsiteUrl": undefined,
            "softwareDescription": formData.softwareDescription,
            "lastVersion": undefined,
            "parentSoftware": undefined,
            "softwareType": formData.softwareType,
            "similarSoftwares": formData.similarSoftwares,
            "testUrl": undefined,
            "addedTime": Date.now(),
            "updateTime": Date.now(),
            "categories": [],
            "prerogatives": {
                "doRespectRgaa": false,
                "isFromFrenchPublicServices": formData.isFromFrenchPublicService,
                "isPresentInSupportContract": formData.isPresentInSupportContract ?? false
            },
            "userAndReferentCountByOrganization": {
                "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
                "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
                "DINUM": { "referentCount": 2, "userCount": 43 }
            }
        };

        softwares.push(software);
    },
    "updateSoftware": async ({ formData, softwareSillId }) => {
        const index = softwares.findIndex(
            software => software.softwareId === softwareSillId
        );

        assert(index !== -1);

        softwares[index] = {
            ...softwares[index],
            ...id<ApiTypes.Software>({
                "logoUrl": undefined,
                "softwareId":
                    softwares
                        .map(({ softwareId }) => softwareId)
                        .sort()
                        .reverse()[0] + 1,
                "softwareName": formData.softwareName,
                "codeRepositoryUrl": undefined,
                "authors": [],
                "versionMin": "3.9.0",
                "serviceProviderCount": 0,
                "compotoirDuLibreId": formData.comptoirDuLibreId,
                "wikidataId": formData.wikidataId,
                "license": formData.softwareLicense,
                "officialWebsiteUrl": undefined,
                "softwareDescription": formData.softwareDescription,
                "lastVersion": undefined,
                "parentSoftware": undefined,
                "softwareType": formData.softwareType,
                "similarSoftwares": formData.similarSoftwares,
                "testUrl": undefined,
                "addedTime": Date.now(),
                "updateTime": Date.now(),
                "categories": [],
                "prerogatives": {
                    "doRespectRgaa": false,
                    "isFromFrenchPublicServices": formData.isFromFrenchPublicService,
                    "isPresentInSupportContract":
                        formData.isPresentInSupportContract ?? false
                },
                "userAndReferentCountByOrganization": {
                    "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
                    "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
                    "DINUM": { "referentCount": 2, "userCount": 43 }
                }
            })
        };
    },
    "createUserOrReferent": async ({ formData }) => {
        console.log(`User or referent updated ${JSON.stringify(formData, null, 2)}`);
    },
    "createInstance": async params => {
        console.log(`Creating instance ${JSON.stringify(params)}`);
        return {
            "instanceId": 33
        };
    },
    "updateInstance": async params => {
        console.log(`Updating instance ${JSON.stringify(params)}`);
    },
    "getAgents": memoize(async () => ({ "agents": id<ApiTypes.Agent[]>([...agents]) }), {
        "promise": true
    }),
    "changeAgentOrganization": async ({ newOrganization }) => {
        console.log(`Update organization -> ${newOrganization}`);
    },
    "updateEmail": async ({ newEmail }) => {
        console.log(`Update email ${newEmail}`);
    },
    "getAllowedEmailRegexp": memoize(async () => "/gouv.fr$/", { "promise": true }),
    "getAgencyNames": memoize(async () => ["DINUM", "CNRS", "ESR"], {
        "promise": true
    }),
    "getTotalReferentCount": memoize(async () => ({ "referentCount": 322 }), {
        "promise": true
    }),
    "getRegisteredUserCount": memoize(async () => 500, { "promise": true }),
    "downloadCorsProtectedTextFile": ({ url }) => fetch(url).then(resp => resp.text())
};

const options: (ApiTypes.WikidataEntry & { isInSill: boolean })[] = [
    {
        "wikidataId": "Q110492908",
        "wikidataLabel": "Onyxia",
        "wikidataDescription": "A data science oriented container launcher",
        "isInSill": true
    },
    {
        "wikidataId": "Q107693197",
        "wikidataLabel": "Keycloakify",
        "wikidataDescription": "Build tool for creating Keycloak themes using React",
        "isInSill": true
    },
    {
        "wikidataId": "Q8038",
        "wikidataDescription": "image retouching and editing tool",
        "wikidataLabel": "GIMP",
        "isInSill": true
    },
    {
        "wikidataId": "Q10135",
        "wikidataDescription": "office suite supported by the free software community",
        "wikidataLabel": "LibreOffice",
        "isInSill": true
    },
    {
        "wikidataId": "Q19841877",
        "wikidataDescription": "source code editor developed by Microsoft",
        "wikidataLabel": "Visual Studio Code",
        "isInSill": true
    },
    {
        "wikidataId": "Q50938515",
        "wikidataDescription":
            "decentralized video hosting network, based on free/libre software",
        "wikidataLabel": "PeerTube",
        "isInSill": true
    }
];

const fzf = new Fzf(options, {
    "selector": item =>
        `${item.wikidataLabel} ${item.wikidataDescription} ${item.wikidataId}`
});

const softwares = [
    id<ApiTypes.Software>({
        "logoUrl": LogoNextCloud,
        "softwareId": 0,
        "softwareName": "NextCloud",
        "codeRepositoryUrl": "https://github.com/nextcloud/server",
        "authors": [
            {
                "authorName": "Frank Karlitschek",
                "authorUrl": "https://www.wikidata.org/wiki/Q5487635"
            },
            {
                "authorName": "Nextcloud GmbH",
                "authorUrl": "https://www.wikidata.org/wiki/Q110707544"
            }
        ],
        "versionMin": "17.0.3",
        "serviceProviderCount": 29,
        "compotoirDuLibreId": 117,
        "similarSoftwares": [
            {
                "wikidataDescription":
                    "team collaboration and videoconferencing application developed by Microsoft",
                "wikidataId": "Q28406404",
                "wikidataLabel": "Microsoft Teams"
            }
        ],
        "wikidataId": "Q25874683",
        "license": "AGPL-3.0-or-later",
        "officialWebsiteUrl": "https://nextcloud.com/",
        "softwareDescription": "Partage de fichiers",
        "lastVersion": {
            "semVer": "25.0.2",
            "publicationTime": 1669985280
        },
        "parentSoftware": undefined as any,
        "testUrl": undefined,
        "addedTime": 1670416144,
        "updateTime": 1674739365178,
        "categories": ["messaging"],
        "softwareType": {
            "type": "cloud"
        },
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": true
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
            "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 1,
        "softwareName": "LibreOffice",
        "codeRepositoryUrl": "https://git.libreoffice.org/core",
        "authors": [
            {
                "authorName": "TDF",
                "authorUrl": "https://www.wikidata.org/wiki/Q313103"
            }
        ],
        "versionMin": "17.0.3",
        "serviceProviderCount": 22,
        "compotoirDuLibreId": 33,
        "similarSoftwares": [
            {
                "wikidataDescription": "suite of office programs developed by Microsoft",
                "wikidataId": "Q11255",
                "wikidataLabel": "Microsoft Office"
            }
        ],
        "wikidataId": "Q10135",
        "license": "MPL-2.0",
        "officialWebsiteUrl": "https://www.libreoffice.org/",
        "softwareDescription":
            "LibreOffice, Suite bureautique (logiciel de traitement de texte, tableur ect)",
        "lastVersion": {
            "semVer": "10.1.3",
            "publicationTime": 1670503742
        },
        "parentSoftware": undefined,
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["traitement de texte"],
        "prerogatives": {
            "doRespectRgaa": true,
            "isFromFrenchPublicServices": true,
            "isPresentInSupportContract": true
        },
        "softwareType": {
            "type": "desktop",
            "os": {
                "linux": true,
                "mac": true,
                "windows": true
            }
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 1, "userCount": 0 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoWordpress,
        "softwareId": 2,
        "softwareName": "Wordpress",
        "codeRepositoryUrl": "https://core.trac.wordpress.org/browser",
        "authors": [
            {
                "authorName": "Matt Mullenweg",
                "authorUrl": "https://www.wikidata.org/wiki/Q92877"
            },
            {
                "authorName": "Mike Little",
                "authorUrl": "https://www.wikidata.org/wiki/Q16731558"
            },
            {
                "authorName": "Automattic",
                "authorUrl": "https://www.wikidata.org/wiki/Q2872634"
            }
        ],
        "versionMin": "Dernière stable",
        "serviceProviderCount": 24,
        "compotoirDuLibreId": 38,
        "similarSoftwares": [],
        "wikidataId": "Q10135",
        "softwareType": {
            "type": "cloud"
        },
        "license": "MPL-2.0",
        "officialWebsiteUrl": "https://wordpress.org/",
        "softwareDescription": "Wordpress, Système de gestion de contenus web",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1667911742
        },
        "parentSoftware": undefined,
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud", "software"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
            "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 3,
        "softwareName": "VLC",
        "codeRepositoryUrl": "https://code.videolan.org/videolan/vlc",
        "authors": [
            {
                "authorName": "VideoLAN",
                "authorUrl": "https://www.wikidata.org/wiki/Q1282963"
            },
            {
                "authorName": "Jean-Baptiste Kempf",
                "authorUrl": "https://www.wikidata.org/wiki/Q58879462"
            }
        ],
        "versionMin": "Dernière stable",
        "serviceProviderCount": 5,
        "compotoirDuLibreId": 62,
        "similarSoftwares": [],
        "wikidataId": "Q171477",
        "license": "GPL-2.0-only",
        "officialWebsiteUrl": "https://www.wikidata.org/wiki/Q171477",
        "softwareDescription": "VLC, Lecteur multimédia",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1665233342
        },
        "parentSoftware": undefined,
        "softwareType": {
            "type": "desktop",
            "os": {
                "linux": true,
                "mac": true,
                "windows": true
            }
        },
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["player"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {}
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 4,
        "softwareName": "Debian",
        "codeRepositoryUrl": "https://sources.debian.org/",
        "authors": [
            {
                "authorName": "The Debian Project",
                "authorUrl": "https://www.wikidata.org/wiki/Q55966784"
            }
        ],
        "versionMin": "10",
        "serviceProviderCount": 16,
        "compotoirDuLibreId": 241,
        "similarSoftwares": [
            {
                "wikidataId": "Q381",
                "wikidataLabel": "Ubuntu",
                "wikidataDescription": "Debian-based Linux operating system"
            }
        ],
        "wikidataId": "Q7715973",
        "license": "N/A",
        "officialWebsiteUrl": "https://www.debian.org/",
        "softwareDescription": "Debian, Distribution GNU/LINUX",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "parentSoftware": undefined,
        "softwareType": {
            "type": "stack"
        },
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
            "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 5,
        "softwareName": "Thunderbird",
        "codeRepositoryUrl": "https://hg.mozilla.org/comm-central",
        "authors": [
            {
                "authorName": "MZLA Technologies Corporation",
                "authorUrl": "https://www.wikidata.org/wiki/Q90137272"
            },
            {
                "authorName": "Mozilla Foundation",
                "authorUrl": "https://www.wikidata.org/wiki/Q55672"
            },
            {
                "authorName": "Mozilla Messaging",
                "authorUrl": "https://www.wikidata.org/wiki/Q1370678"
            }
        ],
        "versionMin": "68",
        "serviceProviderCount": 9,
        "compotoirDuLibreId": 80,
        "wikidataId": "Q483604",
        "license": "MPL-2.0",
        "officialWebsiteUrl": "https://www.thunderbird.net/",
        "softwareDescription": "Thunderbird, Courrielleur",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "parentSoftware": undefined,
        "softwareType": {
            "type": "desktop",
            "os": {
                "linux": true,
                "windows": true,
                "mac": true
            }
        },
        "similarSoftwares": [
            {
                "wikidataId": "Q80911",
                "wikidataLabel": "Microsoft Outlook",
                "wikidataDescription": "email, notes, task and calendar software"
            }
        ],
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
            "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 6,
        "softwareName": "Qgis",
        "codeRepositoryUrl": "https://github.com/qgis/QGIS",
        "authors": [
            {
                "authorName": "QGIS Development Team",
                "authorUrl": "https://www.wikidata.org/wiki/Q15952356"
            }
        ],
        "versionMin": "3.16",
        "serviceProviderCount": 14,
        "compotoirDuLibreId": 60,
        "similarSoftwares": [],
        "wikidataId": "Q1329181",
        "license": "GPL-2.0-or-later",
        "officialWebsiteUrl": "https://qgis.org/fr/site/",
        "softwareDescription": "Qgis, Système d'information géographique",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "testUrl": undefined,
        "softwareType": {
            "type": "desktop",
            "os": {
                "linux": true,
                "mac": true,
                "windows": true
            }
        },
        "parentSoftware": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 7,
        "softwareName": "Mozilla Firefox",
        "codeRepositoryUrl": "https://hg.mozilla.org/mozilla-central/",
        "authors": [
            {
                "authorName": "Mozilla Foundation",
                "authorUrl": "https://www.wikidata.org/wiki/Q55672"
            },
            {
                "authorName": "Dave Hyatt",
                "authorUrl": "https://www.wikidata.org/wiki/Q558130"
            },
            {
                "authorName": "Joe Hewitt",
                "authorUrl": "https://www.wikidata.org/wiki/Q4502689"
            },
            {
                "authorName": "Blake Ross",
                "authorUrl": "https://www.wikidata.org/wiki/Q92792"
            },
            {
                "authorName": "Mozilla Corporation",
                "authorUrl": "https://www.wikidata.org/wiki/Q169925"
            }
        ],
        "versionMin": "3.16",
        "serviceProviderCount": 3,
        "compotoirDuLibreId": 82,
        "wikidataId": "Q698",
        "license": "MPL-2.0",
        "officialWebsiteUrl": "https://www.mozilla.org/fr/firefox/new/",
        "softwareDescription": "Mozilla Firefox (Extended Support Release), Navigateur",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "parentSoftware": undefined,
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "softwareType": {
            "type": "desktop",
            "os": {
                "linux": true,
                "mac": true,
                "windows": true
            }
        },
        "similarSoftwares": [],
        "userAndReferentCountByOrganization": {
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 8,
        "softwareName": "PostgreSQL",
        "codeRepositoryUrl": "https://git.postgresql.org/gitweb/?p=postgresql.git",
        "authors": [
            {
                "authorName": "Michael Stonebraker",
                "authorUrl": "https://www.wikidata.org/wiki/Q92758"
            },
            {
                "authorName": "PostgreSQL Global Development Group",
                "authorUrl": "https://www.wikidata.org/wiki/Q65807102"
            }
        ],
        "versionMin": "10",
        "serviceProviderCount": 17,
        "compotoirDuLibreId": 123,
        "similarSoftwares": [],
        "wikidataId": "Q192490",
        "license": "PostgreSQL",
        "officialWebsiteUrl": "https://www.postgresql.org/",
        "softwareDescription": "PostgreSQL, Base de données transactionnelle",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "parentSoftware": undefined,
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "softwareType": {
            "type": "stack"
        },
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 9,
        "softwareName": "Peertube",
        "codeRepositoryUrl": "https://github.com/Chocobozzz/PeerTube",
        "authors": [
            {
                "authorName": "Framasoft",
                "authorUrl": "https://www.wikidata.org/wiki/Q3080414"
            }
        ],
        "versionMin": "3.x",
        "serviceProviderCount": 5,
        "compotoirDuLibreId": 140,
        "similarSoftwares": [],
        "wikidataId": "Q50938515",
        "license": "AGPL-3.0-or-later",
        "officialWebsiteUrl": "https://joinpeertube.org/",
        "softwareDescription":
            "Peertube, Plateforme d'hébergement décentralisée de vidéos",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "parentSoftware": undefined,
        "softwareType": {
            "type": "cloud"
        },
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {
            "CA du Puy-en-Velay": { "referentCount": 0, "userCount": 1 },
            "CC Pays de Pouzauges": { "referentCount": 1, "userCount": 0 },
            "DINUM": { "referentCount": 2, "userCount": 43 }
        }
    }),
    id<ApiTypes.Software>({
        "logoUrl": LogoLibreOffice,
        "softwareId": 10,
        "softwareName": "Archifiltre",
        "codeRepositoryUrl": "https://github.com/SocialGouv/archifiltre-docs",
        "authors": [],
        "versionMin": "2.0.x",
        "serviceProviderCount": 1,
        "compotoirDuLibreId": 368,
        "wikidataId": "Q77064547",
        "license": "MIT",
        "officialWebsiteUrl": "https://archifiltre.fabrique.social.gouv.fr/",
        "softwareDescription": "Archifiltre, Système d'aide à l'archivage de fichiers",
        "lastVersion": {
            "semVer": "Dernière stable",
            "publicationTime": 1633524542
        },
        "parentSoftware": undefined,
        "softwareType": {
            "type": "desktop",
            "os": {
                "windows": true,
                "mac": true,
                "linux": true
            }
        },
        "similarSoftwares": [],
        "testUrl": undefined,
        "addedTime": 1674739365178,
        "updateTime": 1674739365178,
        "categories": ["cloud"],
        "prerogatives": {
            "doRespectRgaa": false,
            "isFromFrenchPublicServices": false,
            "isPresentInSupportContract": false
        },
        "userAndReferentCountByOrganization": {}
    })
];

const agents: ApiTypes.Agent[] = [
    {
        "organization": "Développement durable",
        "email": "agent1@codegouv.fr",
        "declarations": [
            {
                "serviceUrl": "",
                "declarationType": "user",
                "os": "windows",
                "softwareName": "LibreOffice",
                "version": "1.1.1",
                "usecaseDescription": "Usecase description"
            }
        ]
    },
    {
        "organization": "Babel",
        "email": "agent2@codegouv.fr",
        "declarations": [
            {
                "serviceUrl": "",
                "declarationType": "referent",
                "softwareName": "LibreOffice",
                "isTechnicalExpert": true,
                "usecaseDescription": "Usecase description"
            }
        ]
    },
    {
        "organization": "Éducation nationale",
        "email": "agent3@codegouv.fr",
        "declarations": [
            {
                "serviceUrl": "",
                "declarationType": "referent",
                "softwareName": "LibreOffice",
                "isTechnicalExpert": true,
                "usecaseDescription": "Usecase description"
            }
        ]
    }
];
