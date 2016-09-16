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
      }
    }
})();
