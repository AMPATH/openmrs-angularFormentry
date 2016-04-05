/*
jshint -W106, -W098, -W109, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {

  'use strict';

  var mod =
    angular
    .module('openmrs.angularFormentry');

  mod.run(function(formlyConfig) {
    // Configure custom types
    formlyConfig.setType({
      name: 'kendo-select-multiple',
      // extends:"select",
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      template: '<div> ' +
        '<select multiple="multiple"  kendo-multi-select k-options="selectOptions" ' +
        'ng-model="$scope.model[$scope.options.key]" ></select> ' +
        '</div> ',

      controller: function($scope, $log, $timeout) {
        var x = $scope.model[$scope.options.key.split('.')[0]]
          //can be used when using getterSetter provided by model options
        $scope.selectModel = function(val) {
          if (angular.isDefined(val)) {
            x.value = val;
          } else {
            return x.value;
          }
        }; //$scope.model[$scope.options.key];


        $scope.selectOptions = {
          dataTextField: 'name',
          dataValueField: 'value',
          valuePrimitive: true,
          dataSource: $scope.to.options
        };
      }
    });

    formlyConfig.setType({
      name: 'kendo-select',
      // extends:"select",
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      template: '<div class="input-group"> ' +
        '<select kendo-drop-down-list k-options="selectOptions"' +
        'ng-model="$scope.model[$scope.options.key]" style="width: 100%;"></select>' +
        '<div class="input-group-addon" ng-click="clearValue()">' +
        '<span class="glyphicon glyphicon-remove"></span>' +
        '</div>' +
        '</div> ',

      controller: function($scope, $log, $timeout) {
        var x = $scope.model[$scope.options.key.split('.')[0]]
          //can be used when using getterSetter provided by model options
        $scope.selectModel = function(val) {
          if (angular.isDefined(val)) {
            x.value = val;
          } else {
            return x.value;
          }
        }; //$scope.model[$scope.options.key];

        $scope.clearValue = function() {
          x.value = null;
        };
        $scope.to.options.unshift({name:'',value:''});
        $scope.selectOptions = {
          dataTextField: 'name',
          dataValueField: 'value',
          valuePrimitive: true,
          dataSource: $scope.to.options
        };
      }
    });

  })



})();
