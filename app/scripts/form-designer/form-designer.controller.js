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
        '$log', '$location', '$scope', '$rootScope',
        'CreateFormService',
        'FormDesignerService', 'FormentryUtilService', 'FormEntry'
    ];

    function FormDesignerCtrl($log, $location, $scope, $rootScope,
        CreateFormService, FormDesignerService, FormentryUtilService, FormEntry) {

        $scope.vm = {};
        //window.vm = $scope.vm;
        $scope.vm.model = {};
        $scope.vm.questionMap = {};
        $scope.vm.hasClickedSubmit = false;
        $scope.vm.errors = [];
        $scope.vm.existingForms = ["adult", "triage", "pedreturn"];
        $scope.vm.existingComponents = ["art","diagnosis","familyinformation","Feeding", "hivstatus", "hospitalization", 
        "immunization","intervalcomplaints","lab-results", "laborders", "labresults", "pcp-prophy", "pcpprop", 
        "pedsphysicalexam", "preclinicreview", "referral", "relationship", "sideeffect", "tb-prophy", 
        "tb-treatment", "tbproph", "tbtreatment", "vitals", "whostaging"];
        $scope.vm.selectedForm = "";

        $scope.renderExistingFormSchema = function() {
            FormentryUtilService.getFormSchema($scope.vm.selectedForm, function(schema) {
                $scope.schema =schema;
                
                if (_.isEmpty(schema.referencedForms)) {
                    $scope.renderForm();
                } else {
                    var referencedFormNames = [];
                    _.each(schema.referencedForms, function(reference) {
                        referencedFormNames.push(reference.formName);
                    });

                    FormentryUtilService.getFormSchemaReferences(referencedFormNames, function(formSchemas) {
                        FormEntry.compileFormSchema($scope.schema, formSchemas);
                        $scope.renderForm();
                    }, function(error) {
                        console.error('Could not load referenced forms', error);
                    });
                }
                // $scope.schema = angular.toJson(schema, true);
                // $scope.renderForm();
            });
        }

        $scope.renderExistingComponentSchema = function() {
            FormentryUtilService.getFormSchema("component_" + $scope.vm.selectedComponent,
                function(schema) {
                    $scope.schema = angular.toJson(schema, true);
                    $scope.renderForm();
                })

        }

        $scope.renderForm = function() {
            var schema = angular.fromJson($scope.schema);
            var payload = angular.fromJson($scope.payload);
            var result = FormDesignerService.renderForm(schema, payload);
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
