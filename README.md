# Keycloak DSFR Theme

Welcome to the Keycloak DSFR Theme. No need to clone this repository, simply use the [keycloak-theme.jar](https://todo.com) directly.

This project is constructed using [Keycloakify](https://keycloakify.dev) and [@codegouvfr/react-dsfr](https://github.com/codegouvfr/react-dsfr). To see the theme in action, please visit [the SILL](https://sill.code.gouv.fr) and attempt to log in.

## Preview

Here are some screenshots showcasing the theme:

![image](https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/68fa56ab-8e12-441b-8400-fa657b51d400)
![image](https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/0ef3b7f8-96f8-4f79-b956-9cc96dde67f9)
![image](https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/f3797b8d-7111-4199-a587-af26641c30e3)

## Setup and Configuration

For guidance on importing a theme into Keycloak or configuring AgentConnect/FranceConnect, you can refer to our comprehensive [setup guide](https://github.com/codegouvfr/sill-docs/blob/main/deploying.md#installing-keycloak).

We have customized the modern `register-user-profile.ftl` registration page, which allows you to implement features such as an accept list of email domains for registration. This feature can be highly useful, for instance, if you want to restrict registration to your service to public servants. [Here](#) is the regular expression used for the SILL's email domain accept list.

Although the `register.ftl` page has been somewhat superseded by Keycloak, it remains the default. Hence, we recommend enabling the `User Profile` feature in Keycloak. Instructions for doing so can be found [here](https://docs.keycloakify.dev/realtime-input-validation).

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
      value: '{ "fr": "https://sill.code.gouv.fr/tos_fr.md", "en": "https://sill.code.gouv.fr/tos_en.md" }'
    - name: DSFR_THEME_CONTACT_EMAIL
      value: sill@code.gouv.fr
    - name: JAVA_OPTS
      value: >-
        -Dkeycloak.profile=preview
    ...
```

### i18n

To enable in the theme you must first enable it in Keycloak.

The theme is available in French and English but there's no language select provided in the login and registration pages.  
It's up to you to redirect your user to the login page in the correct language by adding the `ui_locales` parameter to the login URL. (e.g.: `https://sso.code.gouv.fr/auth/realms/sill/protocol/openid-connect/auth?client_id=sill&redirect_uri=https%3A%2F%2Fsill.code.gouv.fr%2Flogin%2Fcallback&response_type=code&scope=openid&ui_locales=fr`)

## Development

You can refer to the [keycloakify-starter repo](https://github.com/keycloakify/keycloakify-starter) and the [Keycloakify documentation](https://docs.keycloakify.dev) for more information on how to develop a Keycloak theme.

# License

This project is licensed under the [MIT License](LICENSE), courtesy of the Direction interministérielle du numérique.
