import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-config-totp.ftl" });

const meta = {
    title: "login/login-config-totp.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const ManualMode: Story = {
    render: () => <KcPageStory kcContext={{ mode: "manual" }} />
};

export const WithAppInitiated: Story = {
    render: () => <KcPageStory kcContext={{ isAppInitiatedAction: true }} />
};
export const WithErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    // NOTE: The other functions of messagesPerField are derived from get() and
                    // existsError() so they are the only ones that need to mock.
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return fieldNames.includes("totp") || fieldNames.includes("userLabel");
                    },
                    get: (fieldName: string) => {
                        if (fieldName === "totp") {
                            return "Invalid code.";
                        }
                        if (fieldName === "userLabel") return "Aleardy used name";
                    }
                }
            }}
        />
    )
};
