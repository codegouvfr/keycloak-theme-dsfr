import memoize from "memoizee";
import type { SillApiClient } from "../../ports/SillApiClient";
import { id } from "tsafe/id";

export function createMockSillApiClient(): SillApiClient {
    return {
        "getSoftwares": memoize(
            () =>
                Promise.resolve(
                    id<SillApiClient.Software[]>([
                        {
                            "logoUrl": undefined,
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
                                "publicationTime": 0
                            },
                            "parentSoftwareName": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
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
