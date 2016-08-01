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
    '$window'
  ]
  
  function UrlConfigController($rootScope, $scope, $http, $base64, $cookies,
    OpenmrsSettings, sessionService, $log, AuthService, $window) {
    var restSuffix = 'ws/rest/v1/';
    
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
          $scope.authResult.authenticated = data.authenticated;
          AuthService.authenticated(data.authenticated);
          $cookies.put('sessionId',data.sessionId);
          
          // in case not authenticated
          if(!data.authenticated) {
            _setError(true, 'Invalid username and/or password')
          } else {
            // broadcast authentication event
            $rootScope.$broadcast('authenticated', data);
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
        $http.defaults.headers.common.Authorization = null;
        $scope.authResult.authenticated = false;
        $scope.authResult.hasError = false;
        AuthService.authenticated(false);
        $rootScope.$broadcast('deauthenticated');
      });
    }
    
    function _setCredentials(username, password) {
      $http.defaults.headers.common.Authorization = 'Basic ' + 
        $base64.encode(username + ':' + password);
    }
    
    function _setError(status, message) {
      $scope.authResult.hasError = status;
      $scope.authResult.message = message;
    }
    
  }
})();
