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
      name: 'ui-select-single',
      // extends:"select",
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      template: '<div><ui-select ng-model="model[options.key]" theme="bootstrap" ' +
      'ng-required="to.required" ng-disabled="to.disabled" ' +
      'reset-search-input="false"> ' +
      '<ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true"> ' +
      '{{$select.selected[to.labelProp || \'name\']}} </ui-select-match> ' +
      '<ui-select-choices group-by="to.groupBy" ' +
      'repeat="option[to.valueProp || \'value\'] ' +
      'as option in to.options | filter: $select.search"> ' +
      '<div ng-bind-html="option[to.labelProp || \'name\'] | highlight: $select.search"> ' +
      '</div> </ui-select-choices> </ui-select></div>',
        controller: function($scope, $log, $timeout) {
          // $scope.to.required = $scope.options.expressionProperties['templateOptions.required']
          // $scope.to.disabled = $scope.options.expressionProperties['templateOptions.disabled']
          // $scope.isRequired = function() {
          //   return $scope.to.required || $scope.options.expressionProperties['templateOptions.required']
          // };
          //
          // // $scope.isDisabled = false;
          // // $timeout(function () {
          // //   $scope.isDisabled = true;
          // // }, 10000);
          // $scope.isDisabled = function() {
          //   return $scope.to.disabled || $scope.options.expressionProperties['templateOptions.disabled']
          // };
        }
    });

    formlyConfig.setType({
      name: 'ui-select-multiple',
      // extends:"select",
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      template: '<ui-select multiple ng-model="model[options.key]" theme="bootstrap" ' +
     'ui-select-required="{{to.required}}" ng-disabled="{{to.disabled}}" ' +
     'reset-search-input="false"> ' +
     '<ui-select-match placeholder="{{to.placeholder}}"> ' +
     '{{$item[to.labelProp || \'name\']}} </ui-select-match> ' +
     '<ui-select-choices group-by="to.groupBy" ' +
     'repeat="option[to.valueProp || \'value\'] ' +
     'as option in to.options | filter: $select.search"> ' +
     '<div ng-bind-html="option[to.labelProp || \'name\'] | highlight: $select.search"> ' +
     '</div> </ui-select-choices> </ui-select>'
    });
  });

})();
