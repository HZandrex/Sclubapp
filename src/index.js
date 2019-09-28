var Auth0Cordova =  require('@auth0/cordova');
var TemplateManager = require('./templateManager');

function main() {
  var templateManager = new TemplateManager();
  function intentHandler(url) {
    Auth0Cordova.onRedirectUri(url);
  }
  window.handleOpenURL = intentHandler;
  templateManager.run('#templateManager');
}
  
document.addEventListener('deviceready', main);