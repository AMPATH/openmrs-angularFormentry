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
    .controller('FormDesignerCtrl', FormDesignerCtrl);

   FormDesignerCtrl.$inject = [
     '$log', '$location', '$scope','$rootScope',
     'CreateFormService',
     'FormDesignerService','FormentryUtilService'
  ];

  function FormDesignerCtrl($log, $location, $scope,$rootScope,
                            CreateFormService,FormDesignerService,FormentryUtilService) {

    $scope.vm = {};
    //window.vm = $scope.vm;
    $scope.vm.model = {};
    $scope.vm.questionMap = {};
    $scope.vm.hasClickedSubmit = false;
    $scope.vm.errors = [];
    $scope.vm.existingForms = ["adult","triage"];
    $scope.vm.existingComponents = ["art","lab-results","vitals","pcp-prophy","tb-prophy","tb-treatment"];
    $scope.vm.selectedForm = "";

    $scope.renderExistingFormSchema = function() {
      FormentryUtilService.getFormSchema($scope.vm.selectedForm, function (schema) {

        $scope.schema = angular.toJson(schema,true);
        $scope.renderForm();
      });
    }

    $scope.renderExistingComponentSchema = function() {
      FormentryUtilService.getFormSchema("component_" + $scope.vm.selectedComponent,
        function(schema) {
          $scope.schema = angular.toJson(schema,true);
          $scope.renderForm();
        })

    }

    $scope.renderForm = function() {
      var schema = angular.fromJson($scope.schema);

      var payload = angular.fromJson($scope.payload);
      var result = FormDesignerService.renderForm(schema,payload);
      $scope.vm.result = result;
      $scope.vm.tabs = result.newForm;
      $scope.vm.questionMap = result.formObject.questionMap;
      $scope.vm.model = result.model;
      $scope.vm.errors = result.formObject.error;
    }

    $scope.updatePayload = function() {


    }

    function parseDate(value) {
      return $filter('date')(value || new Date(), 'yyyy-MM-dd HH:mm:ss', '+0300');
    }
  }
})();
