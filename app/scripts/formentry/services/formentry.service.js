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
    'FormProcessorService', 'CurrentLoadedFormService', 'moment'
  ];

  function FormEntry(createFormService, $log, fieldHandlerService,
    formProcessorService, CurrentLoadedFormService, moment) {

    var service = {
      createForm: createForm,
      registerCustomFieldHandler: registerCustomFieldHandler,
      getFormPayload: getFormPayload,
      updateFormWithExistingObs: updateFormWithExistingObs,
      getPersonAttributesPayload: getPersonAttributesPayload
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
      createFormService.createForm(schema, model, function(tabs, questionMap) {
        CurrentLoadedFormService.formModel = model;
        CurrentLoadedFormService.questionMap = questionMap;
        callback(tabs, questionMap);
      });
    }

    function getFormPayload(model, callback) {
      var obsPayload;
      formProcessorService.obsFormProccesor(model, function(payload) {
        obsPayload = payload;
        callback(obsPayload);
      });
    }

    function getPersonAttributesPayload(model, callback) {
      var personAttributePayload;
      formProcessorService.personAttributeFormProccesor(model, function(payload) {
        personAttributePayload = payload;
        callback(personAttributePayload);
      });
    }

    function updateFormWithExistingObs(model, restObs) {
      formProcessorService.addExistingDataSetToObsForm(restObs, model);
    }

  }
})();
