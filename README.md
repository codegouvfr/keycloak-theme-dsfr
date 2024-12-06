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
    ...
```


# License

This project is licensed under the [MIT License](LICENSE), courtesy of the Direction interministérielle du numérique.