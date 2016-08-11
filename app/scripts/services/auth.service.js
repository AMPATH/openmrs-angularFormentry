(function(){
  'use strict';
  
  angular
    .module('angularFormentry')
      .service('AuthService', AuthService);
    
    AuthService.$inject = [
      '$rootScope'
    ];
    
    function AuthService($rootScope) {
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
          authData.authenticated = value;
        } else {
          return authData.authenticated;
        }
      }
      
      $rootScope.$on('authenticated', function(event, data) {
        if(data.user) {
          if(data.user.name) {
            authData.user.name = data.user.name;
          }
        }
        authData.authenticated = true;
      });
      
      $rootScope.$on('deauthenticated', function() {
        authData.authenticated = false;
      });
    }
})();
