import type { ComponentMeta } from "@storybook/react";
import { createPageStory } from "./getKcPageStory";

const pageId = "login.ftl";

const { PageStory } = createPageStory({ pageId });

const meta: ComponentMeta<any> = {
    "title": `keycloak-theme/login/${pageId}`,
    "component": PageStory
};

export default meta;

export const Default = () => <PageStory />;

export const WithoutPasswordField = () => (
    <PageStory
        kcContext={{
            realm: { password: false }
        }}
    />
);

export const WithoutRegistration = () => (
    <PageStory
        kcContext={{
            realm: { registrationAllowed: false }
        }}
    />
);

export const WithoutRememberMe = () => (
    <PageStory
        kcContext={{
            realm: { rememberMe: false }
        }}
    />
);

export const WithoutPasswordReset = () => (
    <PageStory
        kcContext={{
            realm: { resetPasswordAllowed: false }
        }}
    />
);

export const WithEmailAsUsername = () => (
    <PageStory
        kcContext={{
            realm: { loginWithEmailAllowed: false }
        }}
    />
);

export const WithPresetUsername = () => (
    <PageStory
        kcContext={{
            login: { username: "max.mustermann@mail.com" }
        }}
    />
);

export const WithImmutablePresetUsername = () => (
    <PageStory
        kcContext={{
            login: { username: "max.mustermann@mail.com" },
            usernameHidden: true
        }}
    />
);

export const WithGithub = () => (
    <PageStory
        kcContext={{
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "github",
                        alias: "github",
                        providerId: "github",
                        displayName: "GitHub"
                    }
                ]
            }
        }}
    />
);

export const WithAgentConnect = () => (
    <PageStory
        kcContext={{
            social: {
                displayInfo: true,
                providers: [
                    {
                        alias: "agentconnect",
                        displayName: "Agent Connect",
                        loginUrl: "#",
                        providerId: "agentconnect"
                    }
                ]
            }
        }}
    />
);

export const WithSocialProviders = () => (
    <PageStory
        kcContext={{
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: "google",
                        alias: "google",
                        providerId: "google",
                        displayName: "Google"
                    },
                    {
                        loginUrl: "microsoft",
                        alias: "microsoft",
                        providerId: "microsoft",
                        displayName: "Microsoft"
                    },
                    {
                        loginUrl: "facebook",
                        alias: "facebook",
                        providerId: "facebook",
                        displayName: "Facebook"
                    },
                    {
                        loginUrl: "instagram",
                        alias: "instagram",
                        providerId: "instagram",
                        displayName: "Instagram"
                    },
                    {
                        loginUrl: "twitter",
                        alias: "twitter",
                        providerId: "twitter",
                        displayName: "Twitter"
                    },
                    {
                        loginUrl: "linkedin",
                        alias: "linkedin",
                        providerId: "linkedin",
                        displayName: "LinkedIn"
                    },
                    {
                        loginUrl: "stackoverflow",
                        alias: "stackoverflow",
                        providerId: "stackoverflow",
                        displayName: "Stackoverflow"
                    },
                    {
                        loginUrl: "github",
                        alias: "github",
                        providerId: "github",
                        displayName: "Github"
                    },
                    {
                        loginUrl: "gitlab",
                        alias: "gitlab",
                        providerId: "gitlab",
                        displayName: "Gitlab"
                    },
                    {
                        loginUrl: "bitbucket",
                        alias: "bitbucket",
                        providerId: "bitbucket",
                        displayName: "Bitbucket"
                    },
                    {
                        loginUrl: "paypal",
                        alias: "paypal",
                        providerId: "paypal",
                        displayName: "PayPal"
                    },
                    {
                        loginUrl: "openshift",
                        alias: "openshift",
                        providerId: "openshift",
                        displayName: "OpenShift"
                    }
                ]
            }
        }}
    />
);
