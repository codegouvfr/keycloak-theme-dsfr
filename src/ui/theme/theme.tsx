import {
    createThemeProvider,
    defaultPalette,
    francePalette,
    ultravioletPalette,
    defaultGetTypographyDesc,
} from "onyxia-ui";
import type { ThemeProviderProps } from "onyxia-ui";
import { createIcon } from "onyxia-ui/Icon";
import { createIconButton } from "onyxia-ui/IconButton";
import { createButton } from "onyxia-ui/Button";
import { createButtonBarButton } from "onyxia-ui/ButtonBarButton";
import { createButtonBar } from "onyxia-ui/ButtonBar";
import { createText } from "onyxia-ui/Text";
import { createPageHeader } from "onyxia-ui/PageHeader";
import { createMakeStyles } from "tss-react/compat";
import { createLanguageSelect } from "onyxia-ui/LanguageSelect";
import { createLeftBar } from "onyxia-ui/LeftBar";
import type { Param0 } from "tsafe/Param0";
import type { Language } from "sill-api";
import { THEME_ID } from "ui/valuesCarriedOverToKc/env";
import { CircularProgress } from "onyxia-ui/CircularProgress";
import { createIconParams, iconIds } from "./icons";

export { iconIds };

export const { ThemeProvider, useTheme } = createThemeProvider({
    "getTypographyDesc": params => ({
        ...defaultGetTypographyDesc(params),
        "fontFamily": `${(() => {
            switch (THEME_ID) {
                case "france":
                    return "Marianne";
                case "onyxia":
                case "ultraviolet":
                    return '"Work Sans"';
            }
        })()}, sans-serif`,
    }),
    "palette": {
        ...(() => {
            switch (THEME_ID) {
                case "onyxia":
                    return defaultPalette;
                case "france":
                    return francePalette;
                case "ultraviolet":
                    return ultravioletPalette;
            }
        })(),
        "limeGreen": {
            "main": "#BAFF29",
            "light": "#E2FFA6",
        },
        "agentConnectBlue": {
            "main": "#0579EE",
            "light": "#2E94FA",
            "lighter": "#E5EDF5",
        },
    },
});

export type Theme = ReturnType<typeof useTheme>;

export const { makeStyles, useStyles } = createMakeStyles({ useTheme });

/** @see: <https://next.material-ui.com/components/material-icons/> */
export const { Icon } = createIcon(createIconParams);

export type IconId = Param0<typeof Icon>["iconId"];

export const { IconButton } = createIconButton({ Icon });
export const { Button } = createButton({ Icon });
export const { Text } = createText({ useTheme });

export const splashScreen: ThemeProviderProps["splashScreen"] = {
    "Logo": () => <CircularProgress size={70} />,
    "minimumDisplayDuration": 0,
};

export let isViewPortAdapterEnabled = false;

/*export const getViewPortConfig: ThemeProviderProps["getViewPortConfig"] =
    !isViewPortAdapterEnabled
        ? undefined
        : ({ windowInnerWidth }) => ({
              "targetWindowInnerWidth": Math.max(1920, windowInnerWidth),
              "targetBrowserFontSizeFactor": 1,
          });*/

export const getViewPortConfig: ThemeProviderProps["getViewPortConfig"] = undefined;

export const { PageHeader } = createPageHeader({ Icon });

export const { ButtonBarButton } = createButtonBarButton({ Icon });
export const { ButtonBar } = createButtonBar({ Icon });
export const { LanguageSelect } = createLanguageSelect<Language>({
    "languagesPrettyPrint": {
        "en": "English",
        "fr": "Français",
    },
});

export const { LeftBar } = createLeftBar({
    Icon,
    "persistIsPanelOpen": true,
    "defaultIsPanelOpen": false,
});
