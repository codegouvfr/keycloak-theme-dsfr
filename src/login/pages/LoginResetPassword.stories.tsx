import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
    title: "login/login-reset-password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

/**
 * WithUsernameError:
 * - Purpose: Tests when there is an error with the email/username input (e.g., user not found).
 * - Scenario: Simulates the case where the user enters an invalid or non-existent email, and an error message is displayed.
 * - Key Aspect: Ensures the email input field shows an error message when validation fails.
 */
export const WithUsernameError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                url: {
                    loginAction: "/mock-reset-password-action"
                },
                messagesPerField: {
                    existsError: (field: string) => field === "username",
                    getFirstError: () => "User not found."
                }
            }}
        />
    )
};
