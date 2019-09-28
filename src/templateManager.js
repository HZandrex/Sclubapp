var Auth0 = require('auth0-js');
var Auth0Cordova = require('@auth0/cordova');

function getAllBySelector(arg) {
  return document.querySelectorAll(arg);
}

function getBySelector(arg) {
  return document.querySelector(arg);
}

function getById(id) {
  return document.getElementById(id);
}

function App() {
  this.auth0 = new Auth0.Authentication({
    domain: 'zandrox.eu.auth0.com',
    clientID: 'mwfVsig34wKU6SNpZXgMPi40dSZVso30'
  });
  this.login = this.login.bind(this);
  this.logout = this.logout.bind(this);
}

App.prototype.state = {
  authenticated: false,
  accessToken: false,
  currentRoute: '/',
  routes: {
    '/': {
      id: 'onStartUp',
      onMount: function(page) {
        if(localStorage.getItem('has_run') == null) {
          localStorage.setItem('has_run', 'true');
          return this.redirectTo('/register');
        }
        return this.redirectTo('/home');
      }
    },
    '/home': {
      id: 'home',
      onMount: function(page) {
        //laad startpagina met token
        if (this.state.authenticated === true) {
          
          //gegevens opslaan
          var mobileAppsClient = new WindowsAzure.MobileServiceClient("https://sclubapp.azurewebsites.net");
          
          this.loadProfile(function(err, profile) {
            if(!err){
              App.prototype.saveUserData(profile.name, mobileAppsClient);
              App.prototype.getMemberId(JSON.parse(localStorage.getItem("profileData")).Id, mobileAppsClient); //momenteel ingesteld dat er maar één groeprelatie kan worden opgeslagen
              if(JSON.parse(localStorage.getItem("memberData")).id){
                App.prototype.saveGroupData(JSON.parse(localStorage.getItem("memberData")).groupId, mobileAppsClient);
                App.prototype.saveThemeColor(JSON.parse(localStorage.getItem("groupData")).themeColorId, mobileAppsClient);
              }
              else
                alert("Je behoort tot geen groep!");
            }
            else
              alert("Token werkt niet meer! Neem contact op met support.");
            
          });
          $(".themeColor").css("background-color", JSON.parse(localStorage.getItem("themeColor")).hexCode);
          $('.groupTitle').text(JSON.parse(localStorage.getItem("groupData")).name);
          $(".dropdown-content").append('<li><a class="btn-profile" href="#!">Profiel</a></li><li class="divider" tabindex="-1"></li><li><a class="btn-logout">Uitloggen</a></li>');
          if(JSON.parse(localStorage.getItem("profileData")).imageUrl){
            $('.profileAvatar').attr('src', JSON.parse(localStorage.getItem("profileData")).imageUrl);
          }
          
          $('.btn-logout').on('click', this.logout);
          $('.btn-profile').on('click', () => this.redirectTo("/profile"));
          
          //alleen voor testen
          $(".dropdown-content").append('<li><a class="btn-getToken red lighten-5">Get token</a></li>');
          $('.btn-getToken').on('click', this.getToken);
        }



        //laad startpagina zonder token
        else{
          $(".dropdown-content").append('<li><a class="btn-login">Inloggen</a></li>');

          $('.btn-login').on('click', this.login);

          //alleen voor testen
          $(".dropdown-content").append('<li><a class="btn-firstRun red lighten-5">First run</a></li><li><a class="btn-bypass red lighten-5">Bypass</a></li>');
          $('.btn-bypass').on('click', this.bypass);
          $('.btn-firstRun').on('click', this.firstRun);
        }
        
        $('ul.tabs').tabs({
          swipeable: true
        });

        $('.profielMenu').dropdown({
          inDuration: 300,
          outDuration: 225,
          belowOrigin: true 
        });
      }
    },
    '/profile': {
      id: 'profile',
      onMount: function(page) {
        
        $(".themeColor").css("background-color", JSON.parse(localStorage.getItem("themeColor")).hexCode);
        //profiel gegevens tonen vanuit azure database
        var profileData = JSON.parse(localStorage.getItem("profileData"));
        $('.profileName').text(profileData.name);
        if(profileData.imageUrl){
          $('.profileAvatar').attr('src', profileData.imageUrl);
        }

        if(profileData.email_Verified == true){
          $('.profileEmail').text(profileData.email);
        }else{
          $('.profileEmail').text("Check je mail!");
        }

        $('.profileYearOfBirth').text(profileData.yearOfBirth);
        $('.profilePhoneNumber').text(profileData.phoneNumber)
                  .attr("href", "tel: "+ profileData.phoneNumber);

        $('.btn-back').on('click', () => this.redirectTo("/home"));
        
        
      }
    },
    '/register': {
      id: 'register',
      onMount: function(page) {
        //laad home pagina bij token
        if (this.state.authenticated === true) {
          return this.redirectTo('/home');
        }
        $('.btn-register').on('click', this.login);
        $('.slider').slider();
        
        
      }
    }
  }
};


   ////////////////////////
  ///     EVENTS       ///
 ////////////////////////

//opslaan groepdata
App.prototype.saveThemeColor = function(colorId, mobileAppsClient){
  var colorTable = mobileAppsClient.getTable('Kleur');
  function success(results) {
    localStorage.setItem('themeColor', JSON.stringify(results[0]));
  }
 
  function failure(error) {
      throw new Error('Error bij het laden van de data: ', error);
  }
  colorTable
    .where({ id: colorId})
    .read()
    .then(success, failure);
}

App.prototype.saveGroupData = function(groupId, mobileAppsClient){
  var groupTable = mobileAppsClient.getTable('Groep');
  function success(results) {
    localStorage.setItem('groupData', JSON.stringify(results[0]));
  }
 
  function failure(error) {
      throw new Error('Error bij het laden van de data: ', error);
  }
 
  groupTable
    .where({ id: groupId})
    .read()
    .then(success, failure);
}

//opslaan profieldata
App.prototype.saveUserData = function(email, mobileAppsClient){
  var userTable = mobileAppsClient.getTable('Users');
  function success(results) {
    localStorage.setItem('profileData', JSON.stringify(results[0]));
  }
 
  function failure(error) {
      throw new Error('Error bij het laden van de data: ', error);
  }
 
 userTable
    .where({ email: email})
    .read()
    .then(success, failure);
}

App.prototype.getMemberId = function(userId, mobileAppsClient){
  var gebruikerGroepRelatieTable = mobileAppsClient.getTable('GebruikerGroepRelatie');
  function success(results) {
    localStorage.setItem('memberData', JSON.stringify(results[0]));
  }
 
  function failure(error) {
      throw new Error('Error bij het laden van de data: ', error);
  }
 
  gebruikerGroepRelatieTable
    .where({ userId: userId})
    .read()
    .then(success, failure);
}

//selecteer de template locatie
App.prototype.run = function(id) {
  this.container = getBySelector(id);
  this.resumeApp();
};

//laad profiel info
App.prototype.loadProfile = function(cb) {
  this.auth0.userInfo(this.state.accessToken, cb);
};

//alleen voor test
App.prototype.getToken = function() {
  var token = document.createElement("input");
  document.body.appendChild(token);
  token.setAttribute('value', localStorage.getItem("access_token"));
  token.select();
  document.execCommand("copy");
  document.body.removeChild(token);
  alert("Access token coppied (" + localStorage.getItem("access_token") + ")");
};

//genereer fake login
App.prototype.bypass = function(e) {
  localStorage.setItem('access_token', "tUN4HoFA87g4aJjdxcg92LQ84wHeLKR8");
  location.reload();
};

//inloggen
App.prototype.login = function(e) {
  e.target.disabled = true;

  var client = new Auth0Cordova({
    domain: 'zandrox.eu.auth0.com',
    clientId: 'mwfVsig34wKU6SNpZXgMPi40dSZVso30',
    packageIdentifier: 'ga.zandrox.sclubapp'
  });

  var options = {
    scope: 'openid profile',
    audience: 'https://zandrox.eu.auth0.com/userinfo'
  };
  var self = this;
  client.authorize(options, function(err, authResult) {
    if (err) {
      console.log(err);
      return (e.target.disabled = false);
    }
    localStorage.setItem('access_token', authResult.accessToken);
    self.resumeApp();
  });
};

//uitloggen
App.prototype.logout = function(e) {
  localStorage.removeItem('access_token');
  this.resumeApp();
};

//reset eerste gebruik
App.prototype.firstRun = function(e) {
  localStorage.removeItem('has_run');
  location.reload();
};

//veranderen currRoute
App.prototype.redirectTo = function(route) {
  if (!this.state.routes[route]) {
    throw new Error('Unknown route ' + route + '.');
  }
  this.state.currentRoute = route;
  this.render();
};

//automatisch inloggen
App.prototype.resumeApp = function() {
  var accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    this.state.authenticated = true;
    this.state.accessToken = accessToken;
  } else {
    this.state.authenticated = false;
    this.state.accessToken = null;
  }

  this.render();
};

//vernieuw template inhoud adhv currentRoute
App.prototype.render = function() {
  var currRoute = this.state.routes[this.state.currentRoute];
  var currRouteEl = getById(currRoute.id);
  var element = document.importNode(currRouteEl.content, true);
  this.container.innerHTML = '';
  this.container.appendChild(element);
  currRoute.onMount.call(this, this.container);
};

module.exports = App;