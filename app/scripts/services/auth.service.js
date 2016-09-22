(function(){
  'use strict';
  
  angular
    .module('angularFormentry')
      .service('AuthService', AuthService);
    
    AuthService.$inject = [
      '$rootScope',
      '$http',
      '$base64',
      '$cookies',
      '$state',
      'SessionResService',
      'FormentryUtilService'
    ];
    
    function AuthService($rootScope, $http, $base64, $cookies, $state,
      sessionService, utilService) {

      var _this = this;
      var authData = {
        user: {
          name: null,
        },
        authenticated: false,
        sessionId: null,
      };

      _this.authenticated = function(value) {
        if(angular.isDefined(value)) {
          if(typeof value != 'boolean') {
            authData = value;
          } else {
            authData.authenticated = value;
          }
        } else {
          return authData.authenticated;
        }
      }

      _this.clearAuthentication = function() {
        authData = {
          user: {
            name: null,
          },
          authenticated: false,
          sessionId: null,
        };
      };

      _this.setCredentials = function(username, password) {
        if(arguments.length == 1) {
          var base64Credos = username;
        } else {
          var base64Credos = $base64.encode(username + ':' + password);
        }
        $http.defaults.headers.common.Authorization = 'Basic ' + base64Credos;
        base64Credos = null;
      };

      _this.clearCredentials = function() {
        $http.defaults.headers.common.Authorization = null;
      };

      _this.logout = function() {
        $cookies.putObject('userSession', {authenticated:false}, { 
          expires: utilService.getSessionExpiryDate(1),
        });
        sessionService.deleteSession(function(response) {
          _this.clearCredentials();
          _this.clearAuthentication();
          $rootScope.$broadcast('deauthenticated');
          $state.go('openmrs-authenticate');
        });
      };

    }
})();
