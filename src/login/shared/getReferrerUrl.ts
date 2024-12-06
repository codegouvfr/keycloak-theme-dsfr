function getRefererUrlFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    const redirectUri = queryParams.get("redirect_uri");

    if (redirectUri === null) {
        return undefined;
    }

    const redirectUrl = new URL(redirectUri);

    return redirectUrl.origin;
}

const sessionStorageKey = "keycloak-theme-dsfr:referrer";

export function getReferrerUrl() {
    const refererUrl = getRefererUrlFromUrl();

    if (refererUrl === undefined) {
        return sessionStorage.getItem(sessionStorageKey) ?? undefined;
    }

    sessionStorage.setItem(sessionStorageKey, refererUrl);

    return refererUrl;
}
