import { createGetKcContext, type PageId } from "keycloakify/login";
import { Properties } from "Properties";

export const { getKcContext } = createGetKcContext<{
    pageId: PageId;
    properties: Properties;
}>({
    "mockData": [
        {
            "pageId": "login.ftl",
            "locale": {
                "currentLanguageTag": "fr"
            },
            "realm": {
                "loginWithEmailAllowed": true,
                "registrationEmailAsUsername": false
            }
        },
        {
            "pageId": "register-user-profile.ftl",
            "locale": {
                "currentLanguageTag": "fr"
            },
            "profile": {
                "attributes": [
                    {
                        "validators": {
                            "pattern": {
                                "pattern": "^[a-zA-Z0-9]+$",
                                "ignore.empty.value": true,
                                // eslint-disable-next-line no-template-curly-in-string
                                "error-message": "${alphanumericalCharsOnly}"
                            }
                        },
                        "value": undefined,
                        "name": "username"
                    },
                    {
                        "validators": {
                            "pattern": {
                                /* spell-checker: disable */
                                "pattern":
                                    "^[^@]+@([^.]+\\.)*((gouv\\.fr)|(sorbonne-universite\\.fr)|(ac-dijon\\.fr)|(insee\\.fr)|(montreuil\\.fr)|(ac-versailles\\.fr)|(inserm\\.fr)|(cnafmail\\.fr)|(ac-grenoble\\.fr)|(univ-lille\\.fr)|(univ-nantes\\.fr)|(obspm\\.fr)|(ac-orleans-tours\\.fr)|(ac-rennes\\.fr)|(adullactorg)|(ac-toulouse\\.fr)|(ac-paris\\.fr)|(pole-emploi\\.fr)|(unistra\\.fr)|(cea\\.fr)|(telecom-st-etienne\\.fr)|(assurance-maladie\\.fr)|(diderot\\.org)|(recia\\.fr))$"
                                /* spell-checker: enabled */
                            }
                        },
                        "name": "email"
                    }
                ]
            }
        }
    ],
    "mockProperties": {
        "homeUrl": "https://www.example.com",
        "serviceTitle": "Example",
        "brandTop": "Brand<br/>Top",
        "tosUrl": "https://www.example.com/tos",
        "contactEmail": "jhon@gouv.fr"
    }
});

export const { kcContext } = getKcContext({
    //"mockPageId": "login.ftl"
});

export type KcContext = NonNullable<ReturnType<typeof getKcContext>["kcContext"]>;
