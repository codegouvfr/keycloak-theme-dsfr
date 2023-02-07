import memoize from "memoizee";
import type { SillApiClient } from "../../ports/SillApiClient";
import { id } from "tsafe/id";
import LogoNextCloud from "../../assets/logo_nextcloud.png";
import LogoLibreOffice from "../../assets/logo_libreoffice.png";
import LogoWordpress from "../../assets/logo_wordpress.png";

export function createMockSillApiClient(): SillApiClient {
    return {
        "getSoftwares": memoize(
            () =>
                Promise.resolve(
                    id<SillApiClient.Software[]>([
                        {
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
                                    "authorUrl":
                                        "https://www.wikidata.org/wiki/Q110707544"
                                }
                            ],
                            "versionMin": "17.0.3",
                            "serviceProviderCount": 29,
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/117",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/117",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": ["Microsoft Teams"],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q25874683",
                            "instances": [],
                            "license": "AGPL-3.0-or-later",
                            "officialWebsiteUrl": "https://nextcloud.com/",
                            "softwareDescription": "Partage de fichiers",
                            "lastVersion": {
                                "semVer": "25.0.2",
                                "publicationTime": 1669985280
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1670416144,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": true
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "referent",
                                    "userId": 3,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
                            "logoUrl": LogoLibreOffice,
                            "softwareId": 1,
                            "softwareName": "LibreOffice",
                            "codeRepositoryUrl": "git.libreoffice.org/core",
                            "authors": [
                                {
                                    "authorName": "TDF",
                                    "authorUrl": "https://www.wikidata.org/wiki/Q313103"
                                }
                            ],
                            "versionMin": "17.0.3",
                            "serviceProviderCount": 22,
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/33",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/33",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q10135",
                            "instances": [],
                            "license": "MPL-2.0",
                            "officialWebsiteUrl": "https://www.libreoffice.org/",
                            "softwareDescription":
                                "LibreOffice, Suite bureautique (logiciel de traitement de texte, tableur ect)",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1670503742
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["text", "software"],
                            "prerogatives": {
                                "doRespectRgaa": true,
                                "isFromFrenchPublicServices": true,
                                "isPresentInSupportContract": true
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 1,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "referent",
                                    "userId": 3,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
                            "logoUrl": LogoWordpress,
                            "softwareId": 2,
                            "softwareName": "Wordpress",
                            "codeRepositoryUrl":
                                "https://core.trac.wordpress.org/browser",
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/38",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/38",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q10135",
                            "instances": [],
                            "license": "MPL-2.0",
                            "officialWebsiteUrl": "https://wordpress.org/",
                            "softwareDescription":
                                "Wordpress, Système de gestion de contenus web",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1667911742
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud", "software"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 1,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 2,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "referent",
                                    "userId": 3,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/62",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/62",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q171477",
                            "instances": [],
                            "license": "GPL-2.0-only",
                            "officialWebsiteUrl": "https://www.wikidata.org/wiki/Q171477",
                            "softwareDescription": "VLC, Lecteur multimédia",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1665233342
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/241",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/241",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q7715973",
                            "instances": [],
                            "license": "N/A",
                            "officialWebsiteUrl": "https://www.debian.org/",
                            "softwareDescription": "Debian, Distribution GNU/LINUX",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/80",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/80",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q483604",
                            "instances": [],
                            "license": "MPL-2.0",
                            "officialWebsiteUrl": "https://www.thunderbird.net/",
                            "softwareDescription": "Thunderbird, Courrielleur",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/60",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/60",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q1329181",
                            "instances": [],
                            "license": "GPL-2.0-or-later",
                            "officialWebsiteUrl": "https://qgis.org/fr/site/",
                            "softwareDescription":
                                "Qgis, Système d'information géographique",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
                            "logoUrl": LogoLibreOffice,
                            "softwareId": 7,
                            "softwareName": "Mozilla Firefox",
                            "codeRepositoryUrl":
                                "https://hg.mozilla.org/mozilla-central/",
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/82",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/82",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q698",
                            "instances": [],
                            "license": "MPL-2.0",
                            "officialWebsiteUrl":
                                "https://www.mozilla.org/fr/firefox/new/",
                            "softwareDescription":
                                "Mozilla Firefox (Extended Support Release), Navigateur",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
                            "logoUrl": LogoLibreOffice,
                            "softwareId": 8,
                            "softwareName": "PostgreSQL",
                            "codeRepositoryUrl":
                                "https://git.postgresql.org/gitweb/?p=postgresql.git",
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/123",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/123",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q192490",
                            "instances": [],
                            "license": "PostgreSQL",
                            "officialWebsiteUrl": "https://www.postgresql.org/",
                            "softwareDescription":
                                "PostgreSQL, Base de données transactionnelle",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
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
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/140",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/140",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q50938515",
                            "instances": [],
                            "license": "AGPL-3.0-or-later",
                            "officialWebsiteUrl": "https://joinpeertube.org/",
                            "softwareDescription":
                                "Peertube, Plateforme d'hébergement décentralisée de vidéos",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 1,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        },
                        {
                            "logoUrl": LogoLibreOffice,
                            "softwareId": 10,
                            "softwareName": "Archifiltre",
                            "codeRepositoryUrl":
                                "https://github.com/SocialGouv/archifiltre-docs",
                            "authors": [],
                            "versionMin": "2.0.x",
                            "serviceProviderCount": 1,
                            "serviceProviderUrl":
                                "https://comptoir-du-libre.org/fr/softwares/servicesProviders/368",
                            "compotoirDuLibreUrl":
                                "https://comptoir-du-libre.org/fr/softwares/368",
                            "alikeSoftwareNames": [],
                            "proprietaryAlikeSoftwaresNames": [],
                            "wikidataUrl": "https://www.wikidata.org/wiki/Q77064547",
                            "instances": [],
                            "license": "MIT",
                            "officialWebsiteUrl":
                                "https://archifiltre.fabrique.social.gouv.fr/",
                            "softwareDescription":
                                "Archifiltre, Système d'aide à l'archivage de fichiers",
                            "lastVersion": {
                                "semVer": "Dernière stable",
                                "publicationTime": 1633524542
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": false
                            },
                            "users": [
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                },
                                {
                                    "type": "user",
                                    "userId": 0,
                                    "organization": "DINUM",
                                    "environments": {
                                        "linux": true,
                                        "windows": true,
                                        "browser": false,
                                        "mac": false,
                                        "smartphone": false
                                    }
                                }
                            ]
                        }
                    ])
                ),
            { "promise": true }
        )
    };
}
