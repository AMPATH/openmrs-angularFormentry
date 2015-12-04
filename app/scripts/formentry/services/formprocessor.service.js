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
    .factory('FormProcessorService', FormProcessorService);

  FormProcessorService.$inject = ['ObsProcessorService', 'PersonAttributesProcessorService'];

  function FormProcessorService(ObsProcessorService, PersonAttributesProcessorService) {
    var service = {
      obsFormProccesor: obsFormProccesor,
      encounterFormProcessor: encounterFormProcessor,
      personAttributeFormProccesor: personAttributeFormProccesor,
      addExistingDataSetToEncounterForm: addExistingDataSetToEncounterForm,
      addExistingDataSetToObsForm: addExistingDataSetToObsForm,

    };

    return service;

    function obsFormProccesor(model, callback) {
      var obsPayload;
      ObsProcessorService.generateObsPayload(model, function(payload) {
        obsPayload = payload;
        callback(obsPayload);
      });
    }

    function personAttributeFormProccesor(model, callback) {
      var personAttributesPayload;
      PersonAttributesProcessorService.generatePersonAttributesPayload(model, function(payload) {
        personAttributesPayload = payload;
        callback(personAttributesPayload);
      });
    }

    function encounterFormProcessor(model) {

    }

    function addExistingDataSetToObsForm(restObs, model) {
      ObsProcessorService.addExistingObsSetToForm(model, restObs);
    }

    function addExistingDataSetToEncounterForm(restDataset, model) {

    }
  }
})();
