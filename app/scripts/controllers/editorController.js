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
        .controller('EditorCtrl', RecursiveTestCtrl);

  RecursiveTestCtrl.$inject = ['$log', '$location', '$scope','FormEntry', '$timeout',
    '$filter','TestService', 'FormentryUtilService', '$rootScope', 'configService',
     'SearchDataService', 'EncounterDataService'
  ];

  function RecursiveTestCtrl($log, $location, $scope, FormEntry,
      $timeout, $filter, TestService, FormentryUtilService, $rootScope, configService,
      SearchDataService, EncounterDataService) {
    $scope.vm = {};
    $scope.vm.model = {};
    $scope.vm.questionMap = {};
    $scope.vm.hasClickedSubmit = false;
    $scope.vm.errors = [];
    var schema;
    var newForm;
    //  var testSchema = 'schema_encounter';
    var testSchema = 'editor';

    FormentryUtilService.getFormSchema(testSchema, function (data) {
        schema = data;

        //set up historical data for triage form
        // setUpHistoricalData();

        $log.info('Schema Controller', schema);
        var formObject = FormEntry.createForm(schema, $scope.vm.model);
        newForm = formObject.formlyForm;
        $log.debug('schema xxx', newForm);
        $scope.vm.tabs = newForm;
        $scope.vm.questionMap = formObject.questionMap;
        console.log('final question map', $scope.vm.questionMap);
        $scope.schema = angular.toJson(schema,true);
        $scope.vm.errors = formObject.error;
    });

    $scope.renderForm = function() {
      var schema = angular.fromJson($scope.schema);
      var payload = angular.fromJson($scope.payload);
      console.log(payload);
      var formObject = FormEntry.createForm(schema, $scope.vm.model);
      newForm = formObject.formlyForm;
      $log.debug('schema xxx', newForm);
      $scope.vm.tabs = newForm;
      $scope.vm.questionMap = formObject.questionMap;
      $log.log('Form Errors:', formObject.error);
      $scope.vm.errors = formObject.error;
    }

    $scope.updatePayload = function() {


    }

    function parseDate(value) {
      return $filter('date')(value || new Date(), 'yyyy-MM-dd HH:mm:ss', '+0300');
    }
  }
})();
