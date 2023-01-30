export type SillApiClient = {
    getSoftwares: {
        (): Promise<SillApiClient.Software[]>;
        clear: () => void;
    };
};

export namespace SillApiClient {
    export type Software = {
        logoUrl: string | undefined;
        softwareId: number;
        softwareName: string;
        softwareDescription: string;
        lastVersion:
            | {
                  semVer: string;
                  publicationTime: number;
              }
            | undefined;
        parentSoftwareName: string | undefined;
        testUrl: string | undefined;
        addedTime: number;
        updateTime: number;
        categories: string[];
        prerogatives: Pick<
            Record<Prerogative, boolean>,
            "isPresentInSupportContract" | "isFromFrenchPublicServices" | "doRespectRgaa"
        >;
        users: {
            type: "user" | "referent";
            userId: number;
            organization: string;
            environments: Record<Environment, boolean>;
        }[];
        authors: {
            authorName: string;
            authorUrl: string;
        }[];
        officialWebsiteUrl: string;
        codeRepositoryUrl: string;
        versionMin: string;
        license: string;
        serviceProviderCount: number;
        serviceProviderUrl: string;
        compotoirDuLibreUrl: string | undefined;
        wikidataUrl: string;
        instances: {
            instanceUrl: string;
            targetAudience: string;
        }[];
        alikeSoftwareNames: string[];
        proprietaryAlikeSoftwaresNames: string[];
    };

    export type Environment = "linux" | "windows" | "mac" | "browser" | "smartphone";

    export type Prerogative =
        | "isInstallableOnUserTerminal"
        | "isPresentInSupportContract"
        | "isFromFrenchPublicServices"
        | "doRespectRgaa"
        | "isTestable";
}
