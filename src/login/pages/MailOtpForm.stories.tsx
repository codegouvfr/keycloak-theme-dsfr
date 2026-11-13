import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "mail-otp-form.ftl" });

const meta = {
    title: "login/mail-otp-form.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithInvalidCode: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => [fieldName, ...otherFieldNames].includes("otp_code"),
                    get: (fieldName: string) => (fieldName === "otp_code" ? "Le code saisi est invalide." : "")
                }
            }}
        />
    )
};

export const WithInvalidCodeAndAttemptedUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: {
                    attemptedUsername: "max.mustermann@mail.com",
                    showUsername: true
                },
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => [fieldName, ...otherFieldNames].includes("otp_code"),
                    get: (fieldName: string) => (fieldName === "otp_code" ? "Le code saisi est invalide." : "")
                }
            }}
        />
    )
};
