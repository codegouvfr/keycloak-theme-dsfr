# Keycloak DSFR Theme

Welcome to the Keycloak DSFR Theme, a Keycloak theme with [react-dsfr](https://github.com/codegouvfr/react-dsfr) and [Keycloakify](https://www.keycloakify.dev/).  
To see the theme in action, please visit [the SILL](https://code.gouv.fr/sill/) and attempt to log in.  
This theme is configurable at runtime, via providing environnement variable, there is no need to clone this repository.  
Simply use the bundled .jar file that is released an asset with every new [GitHub Release of this project](https://github.com/codegouvfr/keycloak-theme-dsfr/releases).

## Preview

Here are some screenshots showcasing the theme:

![image](https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/68fa56ab-8e12-441b-8400-fa657b51d400)
![image](https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/0ef3b7f8-96f8-4f79-b956-9cc96dde67f9)
![image](https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/f3797b8d-7111-4199-a587-af26641c30e3)

## Setup and Configuration

For instruction on how to load the theme into your Keycloak instance you can [refer to this guide](https://docs.keycloakify.dev/importing-your-theme-in-keycloak).

For guidance on how to configure ProConnect/FranceConnect, you can refer to our comprehensive [setup guide](https://github.com/codegouvfr/sill-docs/blob/main/deploying.md#installing-keycloak).

### Environment Variables

Several environment variables can be used to tailor the theme to your needs:

```env
DSFR_THEME_HOME_URL
DSFR_THEME_SERVICE_TITLE
DSFR_THEME_SERVICE_TAG_LINE
DSFR_THEME_BRAND_TOP
DSFR_NOTICE_TITLE
DSFR_NOTICE_DESCRIPTION
DSFR_NOTICE_SEVERITY
```

These variables should be made available to the process running Keycloak on your server.

If you are deploying Keycloak on Kubernetes using Helm, here's how to configure your settings:

```yaml
  ...
  extraEnv: |
    - name: DSFR_THEME_HOME_URL
      value: https://code.gouv.fr
    - name: DSFR_THEME_SERVICE_TITLE
      value: CodeGouv
    - name: DSFR_THEME_SERVICE_TAG_LINE
      value: My tag line
    - name: DSFR_THEME_BRAND_TOP
      value: "République<br/>Française"
    - name: DSFR_NOTICE_TITLE
      value: Title
    - name: DSFR_NOTICE_DESCRIPTION
      value: Description
    - name: DSFR_NOTICE_SEVERITY
      value: info
    ...
```

### Dark Mode

If you want to ensure the color scheme preference from your app to be carried when navigating to the Keycloak pages
you need to add `dark=true` or `dark=false` when redirecting to the login or account page.  

With [oidc-spa](https://oidc-spa.dev) and [react-dsfr](https://github.com/codegouvfr/react-dsfr), from your app you would do:  

`src/oidc.ts`
```tsx
import { getIsDark } from "@codegouvfr/react-dsfr/useIsDark";

// ...

bootstrapOidc({
    issuerUri: "...",
    clientId: "...",
    // ...
    extraQueryParams: {
        get dark(){ return getIsDark() ? "true" : "false"; }
    }
});
```

For the Account page: 

```
https://<your keycloak url>/realms/<your realm>/account?referrer={encodeURIComponent(location.href))}l&dark=true
```

Otherwise the themes will render in dark mode if the user prefers it.  
You can also prevent the login theme (not supported with the account theme) to ever render in dark mode
by disabling "dark mode" in the Keycloak Admin Console in the `Realm Configuration` -> `Themes` section.
If the "Dark Mode" option is disabled there, the "display setting" selector in the footer will no longer be displayed.

# License

This project is licensed under the [MIT License](LICENSE), courtesy of the Direction interministérielle du numérique.
