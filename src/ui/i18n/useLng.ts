import type { fallbackLanguage } from "./translations";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { id } from "tsafe/id";
import { languages } from "sill-api";
import type { Language } from "sill-api";

export const { useLng, evtLng } = createUseGlobalState("lng", (): Language => {
    const iso2LanguageLike = navigator.language.split("-")[0].toLowerCase();

    const lng = languages.find(lng => lng.toLowerCase().includes(iso2LanguageLike));

    if (lng !== undefined) {
        return lng;
    }

    return id<typeof fallbackLanguage>("en");
});
