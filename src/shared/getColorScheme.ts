const SESSION_STORAGE_KEY = "keycloak-theme-dsfr:isDark";

function getIsDark(params: {
    kcContextDarkMode: boolean | undefined;
}): boolean | undefined {
    const { kcContextDarkMode } = params;

    from_admin_policy: {
        if (kcContextDarkMode === undefined || kcContextDarkMode === true) {
            break from_admin_policy;
        }
        return false;
    }

    from_url: {
        const url = new URL(window.location.href);

        const value = url.searchParams.get("dark");

        if (value === null) {
            break from_url;
        }

        {
            url.searchParams.delete("dark");
            window.history.replaceState({}, "", url.toString());
        }

        const isDark = value === "true";

        sessionStorage.setItem(SESSION_STORAGE_KEY, `${isDark}`);

        return isDark;
    }

    from_session_storage: {
        const value = sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (value === null) {
            break from_session_storage;
        }

        return value === "true";
    }

    return undefined;
}

export function getColorScheme(params: { kcContextDarkMode: boolean | undefined }) {
    const { kcContextDarkMode } = params;

    const isDark = getIsDark({ kcContextDarkMode });

    if (isDark === undefined) {
        return undefined;
    }

    return isDark ? "dark" : "light";
}
