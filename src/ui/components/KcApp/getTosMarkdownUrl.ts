import type { KcLanguageTag } from "keycloakify";
import type { fallbackLanguage } from "ui/i18n/translations";
import { id } from "tsafe/id";
import { createResolveLocalizedString } from "core/tools/resolveLocalizedString";

export function getTosMarkdownUrl(params: {
    kcLanguageTag: KcLanguageTag;
    termsOfServices: string | Partial<Record<KcLanguageTag, string>> | undefined;
}): string | undefined {
    const { kcLanguageTag, termsOfServices } = params;

    if (termsOfServices === undefined) {
        return undefined;
    }

    const { resolveLocalizedString } = createResolveLocalizedString<KcLanguageTag>({
        "currentLanguage": kcLanguageTag,
        "fallbackLanguage": id<typeof fallbackLanguage>("en"),
    });

    return resolveLocalizedString(termsOfServices);
}
