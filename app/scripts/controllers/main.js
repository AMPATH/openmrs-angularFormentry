/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name angularFormentryApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the angularFormentryApp
   */
  angular.module('angularFormentry')
    .controller('MainCtrl', MainCtrl);
  MainCtrl.$inject = ['$scope', 'UtilService', 'FormEntry', '$log'];
  function MainCtrl($scope, UtilService, FormEntry, $log) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      FormEntry.createForm();

      function otherHandler() {
        $log.log('cheers');
      }
    }
})();
