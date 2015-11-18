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

  FormEntry.$inject = ['createFormService', '$log'];

  function FormEntry(createFormService, $log) {

    var service = {
          createForm: createForm,
          registerCustomFieldHandler: registerCustomFieldHandler,
          getFieldHandler: getFieldHandler
        };

    return service;

    function registerCustomFieldHandler(_handlerName, _handlerMethod) {
      if (typeof _handlerMethod === 'function') {
        fieldHandlers[_handlerName] = _handlerMethod;
      } else {
        $log.info('Handler was not registered!!');
      }
    }

    function getFieldHandler(_handlerName) {
      return fieldHandlers[_handlerName];
    }

    function createForm(schema, model, callback) {
      $log.info('successfully called');
    }

  }
})();
