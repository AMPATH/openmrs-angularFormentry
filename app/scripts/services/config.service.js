/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
 */
/*
 jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
 */
/* global _ */

(function () {
    'use strict';
    angular.module('angularFormentry')
            .factory('configService', configService);
    configService.$inject = ['$http', '$log', 'fieldHandlerService', 'formlyConfigProvider', '$rootScope'];

    function  configService($http, $log, fieldHandlerService, formlyConfigProvider, $rootScope) {
        var service = {
            addFieldHandler: addFieldHandler,
            addJsonSchema: addJsonSchema,
            addJsonSchemaSource: addJsonSchemaSource,
            getformlyConfig: getformlyConfig
        };

        return service;
        /**
         *
         * @param {String} fieldHandlerName
         * @param {function} handlerFunction
         * @returns {undefined}
         */
        function  addFieldHandler(fieldHandlerName, handlerFunction) {
            fieldHandlerService.registerCustomFieldHandler(fieldHandlerName,
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
        function addJsonSchemaSource(schemaKey, SourceUrl, requestMethod)
        {
            $http({
                method: requestMethod,
                url: SourceUrl
            }).then(function successCallback(response) {
                $rootScope.jsonSchema[schemaKey] = response;
            }, function errorCallback(response) {
                $log.error({message: 'Error fetching schemaSource',
                    response: response});
            });
        }
        function getSchema(schemaKey) {
            if (_.has($rootScope.jsonSchema, schemaKey)) {
                return{schema: $rootScope.jsonSchema[schemaKey]};
            } else {
                return {message: 'No schema key' + schemaKey + 'Found', schema: undefined};
            }

        }


        /**
         *
         * @returns {formlyConfigProvider}.This  the default formly  config
         *  object
         */
        function getformlyConfig() {
            return formlyConfigProvider;
        }

    }
})();
