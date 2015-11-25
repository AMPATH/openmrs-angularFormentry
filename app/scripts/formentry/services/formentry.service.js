/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
        .factory('FormEntry', FormEntry);

  FormEntry.$inject = ['createFormService', '$log', 'fieldHandlerService'];

  function FormEntry(createFormService, $log, fieldHandlerService) {

    var service = {
          createForm: createForm,
          registerCustomFieldHandler: registerCustomFieldHandler
        };

    return service;

    function registerCustomFieldHandler(_handlerName, _handlerMethod) {
      if (typeof _handlerMethod === 'function') {
        fieldHandlerService
        .registerCustomFieldHandler(_handlerName, _handlerMethod);
      } else {
        $log.info('Handler was not registered!!');
      }
    }

    function createForm(schema, model, callback) {
      createFormService.createForm(schema, model, function(tabs) {
        callback(tabs);
      });
    }

  }
})();
