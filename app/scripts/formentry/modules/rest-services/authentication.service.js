/*jshint -W003, -W117, -W098, -W026 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
        .module('openmrs.RestServices')
        .factory('AuthService', AuthService);

  AuthService.$inject = ['$base64', '$http', 'SessionResService', '$state',
  'SessionModel', '$rootScope'];

  function AuthService(base64, $http, session, $state, SessionModel,
    $rootScope) {
    var service = {
      isAuthenticated: isAuthenticated,
      setCredentials: setCredentials,
      logOut: logOut,
      clearCredentials: clearCredentials,
      authenticated: false
    };

    return service;

    function isAuthenticated(CurrentUser, callback) {
      //authenticate user
      setCredentials(CurrentUser);
      session.getSession(function(data) {
        //console.log(data);
        var session = new SessionModel.session(data.sessionId, data.authenticated);
        service.authenticated = session.isAuthenticated();
        if (service.authenticated)
        {
           console.log('authentication success');
        } else {
          console.log('authentication Failed');
        }

        $rootScope.$broadcast('onUserAuthenticationDetermined');
        callback(data.authenticated); //return authentication status (true/false)

        //console.log(service.authenticated);
      },

      function(error) {
        console.log(error);
        callback(error);
      });

    }

    function logOut() {
      session.deleteSession(function() {});

      clearCredentials();
      service.authenticated = false;
      $rootScope.$broadcast('onUserLoggedOut');
      $state.go('login');
    }

    function setCredentials(CurrentUser) {
      //set user credentials
      //console.log('set credentials base64 log');
      //console.log(base64.encode(CurrentUser.username + ':' + CurrentUser.password));
      $http.defaults.headers.common.Authorization = 'Basic ' + base64.encode(CurrentUser.username + ':' + CurrentUser.password);

    }

    function clearCredentials() {
      //clear user credentials
      $http.defaults.headers.common.Authorization = 'Basic';
    }

  }
})();
