import type { User } from "./UserApiClient";
import type { Language } from "sill-api";
import type { LocalizedString } from "i18nifty";

export type SillApiClient = {
    getSoftwares: {
        (): Promise<SillApiClient.Software[]>;
        clear: () => void;
    };
    getInstances: {
        (): Promise<SillApiClient.Instance[]>;
        clear: () => void;
    };
    getSoftwareFormAutoFillDataFromWikidataAndOtherSources: (params: {
        wikidataId: string;
    }) => Promise<{
        comptoirDuLibreId: number | undefined;
        softwareName: string;
        softwareDescription: string;
        softwareLicense: string | undefined;
        softwareMinimalVersion: string | undefined;
    }>;
    getWikidataOptions: (params: {
        queryString: string;
    }) => Promise<SillApiClient.WikidataEntry[]>;
    createSoftware: (params: {
        formData: SillApiClient.SoftwareFormData;
    }) => Promise<void>;
    updateSoftware: (params: {
        softwareSillId: number;
        formData: SillApiClient.SoftwareFormData;
    }) => Promise<void>;
    createUserOrReferent: (params: {
        formData: SillApiClient.DeclarationFormData;
    }) => Promise<void>;
    createInstance: (params: CreateInstanceParam) => Promise<{ instanceId: number }>;
    updateInstance: (
        params: CreateInstanceParam & { instanceId: number }
    ) => Promise<void>;
    getOidcParams: {
        (): Promise<{
            keycloakParams:
                | {
                      url: string;
                      realm: string;
                      clientId: string;
                  }
                | undefined;
            jwtClaims: Record<keyof User, string>;
            termsOfServicesUrl: LocalizedString<Language>;
        }>;
        clear: () => void;
    };
    getVersion: {
        (): Promise<string>;
        clear: () => void;
    };
    updateAgencyName: (params: { newAgencyName: string }) => Promise<void>;
    updateEmail: (params: { newEmail: string }) => Promise<void>;
    getAllowedEmailRegexp: {
        (): Promise<string>;
        clear: () => void;
    };
    getAgencyNames: {
        (): Promise<string[]>;
        clear: () => void;
    };
};

type CreateInstanceParam = {
    mainSoftwareSillId: number;
    organization: string;
    targetAudience: string;
    publicUrl: string | undefined;
    otherSoftwareInvolvedWikidataIds: string[];
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
        parentSoftware: WikidataEntry | undefined;
        testUrl: string | undefined;
        addedTime: number;
        updateTime: number;
        categories: string[];
        prerogatives: Record<Prerogative, boolean>;
        users: {
            type: "user" | "referent";
            organization: string;
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
        compotoirDuLibreId: number | undefined;
        wikidataId: string;
        softwareType: SoftwareType;
        similarSoftwares: WikidataEntry[];
    };

    export type Instance = {
        instanceId: number;
        mainSoftwareSillId: number;
        organization: string;
        targetAudience: string;
        publicUrl: string;
        otherSoftwaresInvolved: WikidataEntry[];
    };

    export type SoftwareType =
        | SoftwareType.Desktop
        | SoftwareType.CloudNative
        | SoftwareType.Library;

    export namespace SoftwareType {
        export type Desktop = {
            type: "desktop";
            os: Record<"windows" | "linux" | "mac", boolean>;
        };

        export type CloudNative = {
            type: "cloud";
        };

        export type Library = {
            type: "library";
        };
    }

    export type Prerogative =
        | "isPresentInSupportContract"
        | "isFromFrenchPublicServices"
        | "doRespectRgaa";

    export type WikidataEntry = {
        wikidataLabel: string;
        wikidataDescription: string;
        wikidataId: string;
    };

    export type Os = "windows" | "linux" | "mac";

    export type SoftwareFormData = {
        softwareType:
            | {
                  softwareType: "cloud" | "library";
              }
            | {
                  softwareType: "desktop";
                  os: Record<Os, boolean>;
              };
        wikidataId: string | undefined;
        comptoirDuLibreId: number | undefined;
        softwareName: string;
        softwareDescription: string;
        softwareLicense: string;
        softwareMinimalVersion: string;
        isPresentInSupportContract: boolean | undefined;
        isFromFrenchPublicService: boolean;
        similarSoftwares: {
            wikidataLabel: string;
            wikidataDescription: string;
            wikidataId: string;
        }[];
    };

    export type DeclarationFormData =
        | DeclarationFormData.User
        | DeclarationFormData.Referent;

    export namespace DeclarationFormData {
        export type User = {
            declarationType: "user";
            usecaseDescription: string;
            /** NOTE: undefined if the software is not of type desktop */
            os: "windows" | "linux" | "mac" | undefined;
            version: string;
            /** NOTE: Defined only when software is cloud */
            serviceUrl: string | undefined;
        };

        export type Referent = {
            declarationType: "referent";
            isTechnicalExpert: boolean;
            usecaseDescription: string;
            /** NOTE: Can be not undefined only if cloud */
            serviceUrl: string | undefined;
        };
    }
}
