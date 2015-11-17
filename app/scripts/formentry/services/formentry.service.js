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

  FormEntry.$inject = ['createFormService'];

  function FormEntry(createFormService) {

    var service = {
          createForm: createForm,
          registerCustomFieldHandler: registerCustomFieldHandler,
          getFieldHandler: getFieldHandler
        };

    return service;

    function createForm(schema, model, callback) {
      console.info('this works fine');
    }

    function obsFieldHandler(_field) {
      console.log('blala');
    }

    function encounterFieldHandler(_field) {
      console.log('blala');
    }

    function obsPersonAttributeFieldHandler(_field) {
      console.log('blala');
    }

    function registerCustomFieldHandler(_handlerName, _handlerMethod) {
      if (typeof _handlerMethod === 'function') {
        fieldHandlers[_handlerName] = _handlerMethod;
      } else {
        console.info('Handler was not registered!!');
      }
    }

    function getFieldHandler(_handlerName) {
      return fieldHandlers[_handlerName];
    }

  }
})();
