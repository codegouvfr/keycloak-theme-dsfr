# Keycloak DSFR Theme

Welcome to the Keycloak DSFR Theme. No need to clone this repository, simply use the [keycloak-theme.jar](https://todo.com) directly.

This project is constructed using [Keycloakify](https://keycloakify.dev) and [@codegouvfr/react-dsfr](https://github.com/codegouvfr/react-dsfr). To see the theme in action, please visit [the SILL](https://sill.code.gouv.fr) and attempt to log in.

## Preview

Here are some screenshots showcasing the theme:

<img width="1728" alt="image" src="https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/36b5e4fa-12c8-4451-aabe-62165eab0d22">
<img width="1728" alt="image" src="https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/d21b905d-4823-4dc1-9e93-d757c6b97e1b">
<img width="1728" alt="image" src="https://github.com/codegouvfr/keycloak-theme-dsfr/assets/6702424/e6ab34bd-6a66-4d6f-8b1d-082decae3e96">

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

## Development

You can refer to the [keycloakify-starter repo](https://github.com/keycloakify/keycloakify-starter) and the [Keycloakify documentation](https://docs.keycloakify.dev) for more information on how to develop a Keycloak theme.

# License

This project is licensed under the [MIT License](LICENSE), courtesy of the Direction interministérielle du numérique.
