/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
            .provider('FieldHandlerUtil', function(){
                this.$get = FieldHandlerUtil
            });

    FieldHandlerUtil.$inject = ['$log'];

    function FieldHandlerUtil($log) {
        var fieldHandlers = {};
        var service = {
            getFieldHandler: getFieldHandler,
            registerFieldHandler: registerFieldHandler,
        };
        
        return service;
        
        function getFieldHandler(handlerName) {
            if (handlerName in fieldHandlers) {
                $log.debug('Fetching ' + handlerName + ' handler');
                return fieldHandlers[handlerName];
            } else {
                $log.warn('Failed to get the required fieldHandler, ' +
                          'returning defaultFieldHandler');
                return fieldHandlers['defaultFieldHandler'];
            }
        }

        function registerFieldHandler(handlerName, handlerMethod) {
            fieldHandlers[handlerName] = handlerMethod;
        }
    }
})();
