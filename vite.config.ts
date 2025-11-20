import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            themeName: "DSFR",
            accountThemeImplementation: "Multi-Page",
            environmentVariables: [
                { name: "DSFR_THEME_HOME_URL", default: "" },
                { name: "DSFR_THEME_SERVICE_TITLE", default: "" },
                { name: "DSFR_THEME_SERVICE_TAG_LINE", default: "" },
                { name: "DSFR_THEME_BRAND_TOP", default: "République<br/>Française" },
                { name: "DSFR_NOTICE_TITLE", default: "" },
                { name: "DSFR_NOTICE_DESCRIPTION", default: "" },
                { name: "DSFR_NOTICE_SEVERITY", default: "info" },
            ]
        })
    ]
});
