/* global readJSON */
/*
jshint -W098, -W117, -W003, -W026
*/
(function() {
    'use strict';

    var mockedModule = angular
        .module('mock.formSchemas', []);

    mockedModule.factory('TestFormSchemasService', FormSchemasService);
    FormSchemasService.$inject = [];
    function FormSchemasService() {
        var service = {
            getAdultReturnSchema: getAdultReturnSchema,
            getTriageSchema: getTriageSchema,
            getTriageSchemaWithReferences: getTriageSchemaWithReferences
        };
        return service;
        
        function getAdultReturnSchema() {
             return  readJSON('test/mock/form-schemas/ampath_poc_adult_return_visit_form_v0.01.json');
        }
        
        function getTriageSchema() {
             return  readJSON('test/mock/form-schemas/ampath_poc_triage_encounter_form_v0.01.json');
        }
        
        function getTriageSchemaWithReferences() {
             return  readJSON('test/mock/form-schemas/ampath_poc_triage_encounter_with_references.json');
        }
    }
})();