

const SESSION_STORAGE_KEY = "keycloak-theme-dsfr:redirectUriOrigin";

export const redirectUrlOrigin = ((): string =>{
    from_url: {
        const url = new URL(window.location.href);

        const value = url.searchParams.get("redirect_url");

        if (value === null) {
            // There was no &dark= query param in the URL,
            // so we check session storage next.
            break from_url;
        }


        const redirectUriOrigin = new URL(value).origin;

        sessionStorage.setItem(SESSION_STORAGE_KEY, redirectUriOrigin);

        return redirectUriOrigin;
    }

    from_session_storage: {
        const redirectUriOrigin = sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (redirectUriOrigin === null) {
            break from_session_storage;
        }

        return redirectUriOrigin;
    }

    return "#";
})();