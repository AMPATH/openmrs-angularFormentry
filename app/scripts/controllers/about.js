/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name angularFormentryApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the angularFormentryApp
   */
  angular
        .module('angularFormentry')
        .controller('AboutCtrl', AboutCtrl);

  AboutCtrl.$inject = ['$location',  '$scope',
            'FormEntry', '$timeout', '$filter', 'UtilService', '$log', 'schemaValidatorService'
        ];

  function AboutCtrl($location, $scope, FormEntry,
        $timeout, $filter, UtilService, $log, schemaValidatorService) {
    $scope.vm = {};
    $scope.vm.model = {};
    $scope.vm.submitLabel = 'Save';

    _activate();
    function parseDate(value) {
      return $filter('date')(value || new Date(), 'yyyy-MM-dd HH:mm:ss', '+0300');
    }

    function _activate() {
      UtilService.getFormSchema('schema_encounter', function(schema) {
        FormEntry.createForm(schema, $scope.vm.model, function(tabs) {
          $scope.vm.tabs =tabs;
          $log.info('formly tabs created-->', tabs);
        });
      });
      UtilService.getFormSchema('schema_encounter', function(schema) {
        schemaValidatorService.validateSchema(schema, function(result) {
          $log.info('Schema Validation Ended with a ', result);
        });
      });
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    }
  }
})();
