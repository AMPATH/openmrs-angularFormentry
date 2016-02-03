/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
 jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
 jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/

(function () {
    'use strict';
    angular.module('openmrs.angularFormentry')
            .factory('configService', configService);
            
    configService.$inject = [
        '$http',
        '$log',
        'FormentryConfig',
        'formlyConfig',
        '$rootScope',
        '$q'
    ];

    function  configService($http, $log, FormentryConfig, formlyConfig, $rootScope, $q) {
        $rootScope.jsonSchema = [];
        var service = {
            addFieldHandler: addFieldHandler,
            addJsonSchema: addJsonSchema,
            addJsonSchemaSource: addJsonSchemaSource,
            getformlyConfig: getformlyConfig,
            getSchema: getSchema
        };

        return service;
        /**
         *
         * @param {String} fieldHandlerName
         * @param {function} handlerFunction
         * @returns {undefined}
         */
        function  addFieldHandler(fieldHandlerName, handlerFunction) {
            FormentryConfig.registerFieldHandler(fieldHandlerName,
                    handlerFunction);
        }
        
        /**
         *
         * @param {String} schemaKey ,The key allows one  config  object
         * to have different form schemas.adding another schema  source
         * with the same scheme  should  over ride  the  previous schema
         * @param {JsonString} jsonObject
         * @returns {undefined}
         */
        function addJsonSchema(schemaKey, jsonObject) {
            $rootScope.jsonSchema[schemaKey] = jsonObject;
            $rootScope.$broadcast('schemaAdded', {schemaKey: schemaKey, status: true});
        }
        
        /**
         *
         * @param {String} schemaKey ,The key allows one  config  object
         * to have different form schemas.adding another schema  source
         * with the same scheme  should  over ride  the  previous schema
         * @param {String} SourceUrl
         * @param {String} requestMethod ,The method of the request
         * @returns {undefined}
         */
        function addJsonSchemaSource(schemaKey, SourceUrl, requestMethod) {
            var longRequest = $q.defer();
            $http({
                method: requestMethod,
                url: SourceUrl,
                cache: true
            }).then(function successCallback(response) {
                addJsonSchema(schemaKey, response);
                longRequest.resolve(response);
            }, function errorCallback(response) {
                $rootScope.$broadcast('schemaAdded', {schemaKey: schemaKey, status: false});
                longRequest.reject(response);
            });
            return longRequest.promise;
        }
        
        function getSchema(schemaKey) {
            if (angular.isDefined($rootScope.jsonSchema[schemaKey])) {
                return{schema: $rootScope.jsonSchema[schemaKey]};
            } else {
                return {message: 'missing schema', schema: undefined};
            }
        }

        /**
         *
         * @returns {formlyConfigProvider}.This  the default formly  config
         *  object
         */
        function getformlyConfig() {
            return formlyConfig;
        }
    }
})();
