import { useMemo } from "react";
import { createResolveLocalizedString } from "i18nifty";
import { useLng } from "./useLng";
import type { fallbackLanguage } from "./translations";
import { id } from "tsafe/id";

export function useResolveLocalizedString() {
    const { lng } = useLng();

    const { resolveLocalizedString } = useMemo(
        () =>
            createResolveLocalizedString({
                "currentLanguage": lng,
                "fallbackLanguage": id<typeof fallbackLanguage>("en"),
            }),
        [lng],
    );

    return { resolveLocalizedString };
}
