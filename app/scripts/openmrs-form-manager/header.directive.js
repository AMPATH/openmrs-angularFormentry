(function() {
  'use strict';
  
  angular
    .module('app.openmrsFormManager')
      .directive('header', header);
      
  function header() {
    return {
      restrict: 'E',
      replace: true,
      controller: headerController,
      templateUrl: 'views/openmrs-form-manager/header.htm',
    }  
  }
  
  headerController.$inject = [
    '$scope',
    '$log',
    'AuthService'
  ];
  
  //This controller is not called for some reason
  function headerController($scope, $log, AuthService) {
    $scope.logout = function() {
      AuthService.logout();
    };
  }
})();
