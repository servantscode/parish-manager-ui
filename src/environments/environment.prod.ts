export const environment = {
  production: true,
  apiUrl: window["env"]["apiUrl"],
  whitelistedDomains: [ window["env"]["apiUrl"].split("\/")[2] ]
};
