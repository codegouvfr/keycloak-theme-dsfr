import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-otp.ftl" });

const meta = {
    title: "login/login-otp.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const OnlyOneOtp: Story = {
    render: () => <KcPageStory kcContext={{ otpLogin: { userOtpCredentials: [{ id: "id1", userLabel: "label" }] } }} />
};

export const WithErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                otpLogin: {
                    selectedCredentialId: "id1"
                },
                messagesPerField: {
                    // NOTE: The other functions of messagesPerField are derived from get() and
                    // existsError() so they are the only ones that need to mock.
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                        const fieldNames = [fieldName, ...otherFieldNames];
                        return fieldNames.includes("totp");
                    },
                    get: (fieldName: string) => {
                        if (fieldName === "totp") {
                            return "Invalid code.";
                        }
                        return "";
                    }
                }
            }}
        />
    )
};
