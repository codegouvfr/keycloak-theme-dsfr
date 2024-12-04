# Keycloak DSFR Theme

Welcome to the Keycloak DSFR Theme, a Keycloak theme with [react-dsfr](https://github.com/codegouvfr/react-dsfr) and [Keycloakify](https://www.keycloakify.dev/).  
To see the theme in action, please visit [the SILL](https://sill-preprod.lab.sspcloud.fr/) and attempt to log in.  
This theme is configurable at runtime, via providing environnement variable, there is no need to clone this repository.  
Simply use the bundled .jar file that is released an asset with every new [GitHub Release of this project](https://github.com/codegouvfr/keycloak-theme-dsfr/releases).

> NOTE: Keycloak 22 (and only this specific version) is not fully supported. In this version, only the Login theme works, not the Account theme.

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
DSFR_THEME_BRAND_TOP
DSFR_THEME_TOS_URL
DSFR_THEME_CONTACT_EMAIL
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
    - name: DSFR_THEME_BRAND_TOP
      value: "République<br/>Française"
    - name: DSFR_THEME_TOS_URL
      value: '{ "fr": "https://code.gouv.fr/sill/tos_fr.md", "en": "https://code.gouv.fr/sill/tos_en.md" }'
    - name: DSFR_THEME_CONTACT_EMAIL
      value: sill@code.gouv.fr
    - name: JAVA_OPTS
      value: >-
        -Dkeycloak.profile=preview
    ...
```

## i18n

To enable internationalization in the theme you must first enable it in Keycloak.

The theme is available in French and English but there's no language select provided in the login and registration pages.  
It's up to you to redirect your user to the login page in the correct language by adding the `ui_locales` parameter to the login URL. (e.g.: `https://sso.code.gouv.fr/auth/realms/sill/protocol/openid-connect/auth?client_id=sill&redirect_uri=https%3A%2F%2Fsill.code.gouv.fr%2Flogin%2Fcallback&response_type=code&scope=openid&ui_locales=fr`)

## Development

You can refer to the [keycloakify-starter repo](https://github.com/keycloakify/keycloakify-starter) and the [Keycloakify documentation](https://docs.keycloakify.dev) for more information on how to develop a Keycloak theme.

# License

This project is licensed under the [MIT License](LICENSE), courtesy of the Direction interministérielle du numérique.