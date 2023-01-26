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
                            "softwareDescription": "Partage de fichiers",
                            "lastVersion": {
                                "semVer": "25.0.2",
                                "publicationTime": 0,
                            },
                            "parentSoftwareId": undefined,
                            "testUrl": undefined,
                            "addedTime": 1674739365178,
                            "updateTime": 1674739365178,
                            "categories": ["cloud"],
                            "prerogatives": {
                                "doRespectRgaa": false,
                                "isFromFrenchPublicServices": false,
                                "isPresentInSupportContract": true,
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
                                        "smartphone": false,
                                    },
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
                                        "smartphone": false,
                                    },
                                },
                            ],
                        },
                    ]),
                ),
            { "promise": true },
        ),
    };
}
