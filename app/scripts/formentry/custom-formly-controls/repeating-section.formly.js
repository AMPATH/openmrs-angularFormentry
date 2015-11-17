/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  var mod =
          angular
              .module('openmrs.angularFormentry');

  mod.run(function config(formlyConfig) {
    formlyConfig.setType({
      name: 'repeatSection',
      templateUrl: 'repeatSection.html',
      controller: function($scope, $log) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          return angular.copy(fields);
        }

        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          $log.log('Repeat section');
          $log.log($scope.model);
          var repeatsection = $scope.model[$scope.options.key];
          $log.log('Repeat section Val');
          $log.log(repeatsection);
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          // if (lastSection) {
          //   newsection = angular.copy(lastSection);
          // }

          repeatsection.push(newsection);
        }
      }
    });
  });
})();
