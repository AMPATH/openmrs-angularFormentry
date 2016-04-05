/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
            .provider('FormentryConfig', function(){
                this.$get = FormentryConfig
            });

    FormentryConfig.$inject = ['$log'];

    function FormentryConfig($log) {

        var configObject = {
            fieldHandlers: {},
            openmrsBaseUrl: '',
            etlBaseUrl: ''
        };

        var service = {
            getConfigObject:getConfigObject,

            //field handler methods
            getFieldHandler: getFieldHandler,
            registerFieldHandler: registerFieldHandler,

            //Openmrs REST url configurations
            setOpenmrsBaseUrl: setOpenmrsBaseUrl,
            getOpenmrsBaseUrl: getOpenmrsBaseUrl,
            
            //Openmrs REST url configurations
            setEtlBaseUrl: setEtlBaseUrl,
            getEtlBaseUrl: getEtlBaseUrl
        };

        return service;

        function getConfigObject() {
            return configObject;
        }

        function getFieldHandler(handlerName) {
            if (handlerName in configObject.fieldHandlers) {
                $log.debug('Fetching ' + handlerName + ' handler');
                return configObject.fieldHandlers[handlerName];
            } else {
                $log.warn('Failed to get the required fieldHandler, ' +
                          'returning defaultFieldHandler');
                return configObject.fieldHandlers['defaultFieldHandler'];
            }
        }

        function registerFieldHandler(handlerName, handlerMethod) {
            configObject.fieldHandlers[handlerName] = handlerMethod;
        }

        function setOpenmrsBaseUrl(value) {
            $log.debug('Setting openmrs url to ' + value);
            configObject.openmrsBaseUrl = value;
        }

        function getOpenmrsBaseUrl() {
          if (typeof configObject.openmrsBaseUrl === 'function') {
            return configObject.openmrsBaseUrl();
          } else {
            return configObject.openmrsBaseUrl;
          }            
        }
        
        function setEtlBaseUrl(value) {
            $log.debug('Setting etl url to ' + value);
            configObject.etlBaseUrl = value;
        }

        function getEtlBaseUrl() {
          if (typeof configObject.etlBaseUrl === 'function') {
            return configObject.etlBaseUrl();
          } else {
            return configObject.etlBaseUrl;
          }            
        }
    }
})();
