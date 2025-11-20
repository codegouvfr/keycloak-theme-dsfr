import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-verify-email.ftl" });

const meta = {
    title: "login/login-verify-email.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                user: {
                    email: "user@example.com"
                }
            }}
        />
    )
};

/**
 * WithCustomEmail:
 * - Purpose: Tests the page with a specific email address.
 * - Scenario: Simulates a user with a custom email address to verify the display.
 * - Key Aspect: Ensures the email is correctly displayed in the verification message.
 */
export const WithCustomEmail: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                user: {
                    email: "thais@hubee.com"
                }
            }}
        />
    )
};
