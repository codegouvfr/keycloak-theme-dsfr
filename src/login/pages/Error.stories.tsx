import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" });

const meta = {
    title: "login/error.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "An unexpected error occurred. Please try again."
                }
            }}
        />
    )
};

/**
 * AccountLocked:
 * - Purpose: Tests the error page for account lockout scenarios.
 * - Scenario: Simulates a user whose account has been locked due to too many failed login attempts.
 * - Key Aspect: Displays a specific error message about account lockout.
 */
export const AccountLocked: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "Your account has been temporarily locked due to too many failed login attempts."
                }
            }}
        />
    )
};

/**
 * WithClientBaseUrl:
 * - Purpose: Tests the error page when a client base URL is available.
 * - Scenario: Simulates an error with the option to return to the application.
 * - Key Aspect: Displays a "Back to Application" button in addition to "Back to Login".
 */
export const WithClientBaseUrl: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "Session expired. Please log in again."
                },
                client: {
                    baseUrl: "https://hubee.com"
                }
            }}
        />
    )
};
