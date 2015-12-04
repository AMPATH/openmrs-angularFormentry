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

  FormEntry.$inject = ['CreateFormService', '$log', 'FieldHandlerService',
  'FormProcessorService'];

  function FormEntry(createFormService, $log, fieldHandlerService,
  formProcessorService) {

    var service = {
          createForm: createForm,
          registerCustomFieldHandler: registerCustomFieldHandler,
          getFormPayload:getFormPayload,
          updateFormWithExistingObs: updateFormWithExistingObs
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

    function getFormPayload(model, callback) {
      var obsPayload;
      formProcessorService.obsFormProccesor(model, function(payload) {
        obsPayload = payload;
        callback(obsPayload);
      });
    }

    function updateFormWithExistingObs(model, restObs) {
      formProcessorService.addExistingDataSetToObsForm(restObs, model);
    }

  }
})();
