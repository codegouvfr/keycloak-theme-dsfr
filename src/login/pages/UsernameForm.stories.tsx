import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-username.ftl" });

const meta = {
    title: "login/login-username.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithProConnect: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                social: {
                    displayInfo: true,
                    providers: [
                        {
                            loginUrl: "proConnect",
                            alias: "proconnect",
                            providerId: "agentconnect",
                            displayName: "ProConnect",
                            iconClasses: ""
                        }
                    ]
                }
            }}
        />
    )
};

export const WithInvalidUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                login: { username: "johndoe" },
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => [fieldName, ...otherFieldNames].includes("username"),
                    get: (fieldName: string) => (fieldName === "username" ? "Identifiant invalide." : "")
                }
            }}
        />
    )
};
