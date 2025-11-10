import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-page-expired.ftl" });

const meta = {
    title: "login/login-page-expired.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

/**
 * WithCustomUrl:
 * - Purpose: Tests the page with a custom restart flow URL.
 * - Scenario: Simulates a page expired scenario with a specific URL to restart the authentication flow.
 * - Key Aspect: Ensures the "click here to login" link points to the correct restart URL.
 */
export const WithCustomUrl: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                url: {
                    loginRestartFlowUrl: "https://hubee.com/auth/restart"
                }
            }}
        />
    )
};
