import type { fallbackLanguage } from "./translations";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { getEvtKcLanguage } from "keycloakify";
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

//NOTE: When we change langue in the main APP we change as well for the login pages
evtLng.toStateless().attach(lng => (getEvtKcLanguage().state = lng));
