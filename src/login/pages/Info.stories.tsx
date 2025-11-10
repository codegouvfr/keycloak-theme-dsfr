import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "info.ftl" });

const meta = {
    title: "login/info.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "Your email has been verified successfully."
                },
                pageRedirectUri: "https://hubee.com"
            }}
        />
    )
};

/**
 * WithRequiredActions:
 * - Purpose: Tests the info page when certain actions are required from the user.
 * - Scenario: Simulates a scenario where the user needs to complete specific actions (e.g., verify email, update password).
 * - Key Aspect: Displays a list of required actions that the user must complete.
 */
export const WithRequiredActions: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messageHeader: "Action Required",
                message: {
                    summary: "Please complete the following actions to continue."
                },
                requiredActions: ["VERIFY_EMAIL", "UPDATE_PASSWORD"],
                actionUri: "/auth/realms/hubee/login-actions/required-action"
            }}
        />
    )
};

/**
 * WithActionUri:
 * - Purpose: Tests the page with an action URI link.
 * - Scenario: Simulates an info page that provides a link to proceed with a specific action.
 * - Key Aspect: Displays a "proceed with action" link instead of "back to application".
 */
export const WithActionUri: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "Your profile has been updated."
                },
                actionUri: "/auth/realms/hubee/account"
            }}
        />
    )
};

/**
 * WithClientBaseUrl:
 * - Purpose: Tests the page with only a client base URL available.
 * - Scenario: Simulates when no specific redirect URI is provided, falling back to the client's base URL.
 * - Key Aspect: Uses the client base URL as the "back to application" link.
 */
export const WithClientBaseUrl: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "Your settings have been saved."
                },
                client: {
                    baseUrl: "https://hubee.com"
                }
            }}
        />
    )
};

/**
 * EmailVerificationSuccess:
 * - Purpose: Tests a typical email verification success message.
 * - Scenario: User clicks on email verification link and sees success message.
 * - Key Aspect: Shows success message with redirect to application.
 */
export const EmailVerificationSuccess: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messageHeader: "Email verified",
                message: {
                    summary: "Your email address has been verified successfully."
                },
                pageRedirectUri: "https://hubee.com/dashboard"
            }}
        />
    )
};
