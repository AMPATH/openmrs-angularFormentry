(function() {
  'use strict';
  
  angular
    .module('app.openmrsFormManager')
      .directive('serverUrlConfig', ServerUrlConfig);
  
  ServerUrlConfig.$inject = [
    '$window'
  ];
      
  function ServerUrlConfig($window) {
    return {
      restrict: 'E',
      controller: UrlConfigController,
      templateUrl: 'views/openmrs-form-manager/server-url-config.htm',
    }  
  }
  
  UrlConfigController.$inject = [
    '$rootScope',
    '$scope',
    '$http',
    '$base64',
    '$cookies',
    'OpenmrsSettings',
    'SessionResService',
    '$log',
    'AuthService',
    '$window',
    'dialogs',
    '$timeout'
  ]
  
  function UrlConfigController($rootScope, $scope, $http, $base64, $cookies,
    OpenmrsSettings, sessionService, $log, AuthService, $window, dialogs,
    $timeout) {
    var restSuffix = 'ws/rest/v1/';
    var SESSION_TTL_MIN = 10;
    
    $scope.openmrsUrl = $window.localStorage.getItem('openmrsUrl');
    if($scope.openmrsUrl === null || $scope.openmrsUrl == undefined || 
       $scope.openmrsUrl === 'undefined') {
      $scope.openmrsUrl = '';
    }
    
    $scope.authResult = {
      authenticated: AuthService.authenticated(),
      hasError: false,
    }
    
    $scope.busy = false;
    
    // Enable/Disable authenticate button
    $scope.enableAuthButton = function() {
      return $scope.openmrsUrl && $scope.username && $scope.password;
    };
    
    $scope.authenticate = function() {
      $scope.busy = true;
      
      if($scope.openmrsUrl === null || $scope.openmrsUrl === 'undefined' || 
        $scope.openmrsUrl === '') {
        _setError(true, 'Please provide Openmrs server base URL');
        $scope.busy = false;
      } else {
        
        // Set credos
        _setCredentials($scope.username, $scope.password);
        
        // Store the passed url to localStorage
        $window.localStorage.setItem('openmrsUrl', $scope.openmrsUrl);
        
        // Set the passed in openmrs server Url
        if(!$scope.openmrsUrl.endsWith('/')) {
          var openmrsUrl = $scope.openmrsUrl + '/';
        } else {
          var openmrsUrl = $scope.openmrsUrl;
        }
        
        OpenmrsSettings.setCurrentRestUrlBase(openmrsUrl + restSuffix);
        // Try to get session
        sessionService.getSession(function(data) {
          if(data.authenticated) {
            data.token = $base64.encode($scope.username + ':' + $scope.password);
            $cookies.putObject('userSession', data, {
              expires: _getSessionExpiryDate(SESSION_TTL_MIN),
            });
            $rootScope.$broadcast('authenticated', data);
          } else {
            _setError(true, 'Invalid username and/or password');
          }
          $scope.busy = false;
        }, function(err) {
          $scope.busy = false;
          _setError(true, 'Something went wrong, Check the logs for details')
          $scope.authResult.error = err;
          $log.error(err);
        });
      }  
    }; 
    
    $scope.logout = function() {
      sessionService.deleteSession(function(response) {
        _clearCredentials();
        $scope.authResult.authenticated = false;
        $scope.authResult.hasError = false;
        AuthService.clearAuthentication();
        $cookies.remove('userSession')
        $rootScope.$broadcast('deauthenticated');
      });
    }
    
    function _setCredentials(username, password) {
      if(arguments.length == 1) {
        var base64Credos = username;
      } else {
        var base64Credos = $base64.encode(username + ':' + password);
      }
      $http.defaults.headers.common.Authorization = 'Basic ' + base64Credos;
      base64Credos = null;
    }
    
    function _clearCredentials() {
      $http.defaults.headers.common.Authorization = null;
    }

    function _setError(status, message) {
      $scope.authResult.hasError = status;
      $scope.authResult.message = message;
    }
    
    function _checkIfSessionActive() {
      var authData = $cookies.getObject('userSession');
      if(authData) {
        _setCredentials(authData.token);
        $log.log('Credentials are set here');
        $rootScope.$broadcast('authenticated', authData);
      }
    }
    
    function _getSessionExpiryDate(minutes) {
      var d = new Date();

      var minutesToSet = d.getMinutes() + minutes;
      if(minutesToSet>59) {
        d.setHours(d.getHours() + Math.floor(minutesToSet/60));
        d.setMinutes(minutesToSet%60);
      } else {
        d.setMinutes(minutesToSet);
      }
      return d;
    }

    function _sessionTimeout(timeout, prevTimeoutPromise) {
      var canceledSuccessfully = true;
      if(prevTimeoutPromise) {
        canceledSuccessfully = $timeout.cancel(prevTimeoutPromise);
      }
      if(!AuthService.authenticated()) return;
      if(canceledSuccessfully) {
        return $timeout(function(){
          var TIME_WARNING_ACTIVE = 15; //seconds
          var message = 'Your session will expire in ' + TIME_WARNING_ACTIVE
                      + ' seconds, Stay in?'

          var dlg = dialogs.confirm('Session Timeout', message);
          var start = new Date();
          dlg.result.then(function(btn) {
            var end = new Date();
            var elapsed = Math.floor((end.getTime() - start.getTime())/1000);
            $log.debug('Time elapsed ' + elapsed);
            if(elapsed > 15) {
              $scope.logout();
              dialogs.error('Session Expired!', 'Login to proceed');
            }
          }, function(btn) {
            $scope.logout();
          });
        }, timeout, false);
      }
    }

    $scope.$on('authenticated', function(event, data) {
      $scope.authResult.authenticated = data.authenticated;
      AuthService.authenticated(data);

      var timeout = SESSION_TTL_MIN * 60 * 1000;    // to ms
      var prevTimeoutPromise = _sessionTimeout(timeout);

      document.addEventListener('mousemove', function(event) {
        var obj = $cookies.getObject('userSession') || data;
        $cookies.putObject('userSession', obj, {
          expires: _getSessionExpiryDate(SESSION_TTL_MIN),
        });

        prevTimeoutPromise = _sessionTimeout(timeout, prevTimeoutPromise);
      }, true);
    });

    if(!AuthService.authenticated()) {
      _checkIfSessionActive();
    }
  }
})();
