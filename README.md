# Lab1Auth
Za projekt je korišten auth0 Angular SDK
Za autorizaciju je u auth0 dodano pravilo koje za uspješan login šalje User Role kroz JWT token:

exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'URL';
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
}

Glavni kod aplikacije se nalazi u src/app/auth-initializer

Postavljanje auth0 varijabli se nalazi u src/app/app.module.ts

Varijable okruženja se nalaze u src/environments



