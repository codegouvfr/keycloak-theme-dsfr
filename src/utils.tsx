import { KcContext } from "keycloakify/account/KcContext";

export function formatLabel(
    label: JSX.Element | undefined,
    required: boolean | undefined
) {
    return required && label ? <>{label} *</> : label;
}

export function getStateForAccountField(
    messagesPerField: KcContext["messagesPerField"],
    field: string
): { state: "error" | "info" | "default"; stateRelatedMessage: string | undefined } {
    return {
        state: messagesPerField.existsError(field)
            ? "error"
            : messagesPerField.exists(field)
              ? "info"
              : "default",
        stateRelatedMessage: messagesPerField.get(field)
    };
}
