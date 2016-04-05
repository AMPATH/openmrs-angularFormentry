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
            template: '<div class="panel panel-default"> ' +
            '<div class="panel-heading"> ' +
            '{{to.label}}' +
            '</div> ' +
            '<div class="panel-body"> ' +
            // <!--loop through each element in model array-->
            '<div class="{{hideRepeat}}"> ' +
            '<div class="repeatsection" ng-repeat="element in model[options.key]" ' +
            'ng-init="fields = copyFields(to.fields)"> ' +
            '<formly-form fields="fields" ' +
            'model="element" bind-name="\'formly_ng_repeat\' + index + $parent.$index"> ' +
            '</formly-form> ' +
            '<p> ' +
            '<button type="button" class="btn btn-sm btn-danger" ng-click="model[options.key].splice($index, 1)"> ' +
            'Remove ' +
            '</button> ' +
            '</p> ' +
            '<hr> ' +
            '</div> ' +
            '<p class="AddNewButton"> ' +
            '<button type="button" class="btn btn-primary" ng-click="addNew()" >{{to.btnText}}</button> ' +
            '</p> ' +
            '</div> ' +
            '</div>',
            controller: function($scope, $log, CurrentLoadedFormService) {
                $scope.formOptions = { formState: $scope.formState };
                $scope.addNew = addNew;

                $scope.copyFields = copyFields;

                function copyFields(fields) {
                    var copy = angular.copy(fields);
                    addFieldsToQuestionMap(copy);
                    return copy;
                }

                function addFieldsToQuestionMap(groups) {
                    _.each(groups, function(group) {
                        _.each(group.fieldGroup, function(field) {
                            var id = field.data.id;
                            if (!_.isEmpty(id)) {
                                if (id in CurrentLoadedFormService.questionMap) {
                                    CurrentLoadedFormService.questionMap[id].push(field);
                                } else {
                                    CurrentLoadedFormService.questionMap[id] = [field];
                                }
                            }
                        });
                    });
                }

                function addNew() {
                    $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                    $log.log('Repeat section');
                    // $log.log($scope);
                    // $log.log($scope.to.createModelBluePrint(null,[{}]));
                    var repeatsection = $scope.model[$scope.options.key];
                    // $log.log('Repeat section Val');
                    // $log.log(repeatsection);
                    var lastSection = repeatsection[repeatsection.length - 1];
                    // $log.log('Model blueprint');
                    // $log.log($scope.to.createModelBluePrint(null,[{}]));
                    var currentModel = $scope.to.createModelBluePrint(null, [{}])
                    var revisedModel = angular.copy(currentModel);
                    var newsection = revisedModel[0];
                    delete newsection['schemaQuestion']
                    // if (lastSection) {
                    //   newsection = angular.copy(lastSection);
                    // }
                    //   newsection.obs1_a894b1ccn1350n11dfna1f1n0026b9348838 = {
                    //       value: 'a893516a-1350-11df-a1f1-0026b9348838'
                    //   };
                    // $log.log('New Section blueprint');
                    // $log.log($scope.originalModel);
                    repeatsection.push(newsection);
                }
            }
        });
    });
})();
