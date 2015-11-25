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
        .factory('formProcessorService', formProcessorService);

  formProcessorService.$inject = ['ObsProcessorService'];

  function formProcessorService(ObsProcessorService) {
      var service = {
        obsFormProccesor: obsFormProccesor,
        encounterFormProcessor: encounterFormProcessor,
        addExistingDataSetToEncounterForm:addExistingDataSetToEncounterForm,
        addExistingDataSetToObsForm:addExistingDataSetToObsForm
      };

      return service;

      function obsFormProccesor(model, callback) {
        var obsPayload;
        ObsProcessorService.generateObsPayload(model, function(payload) {
          obsPayload = payload;
          callback(obsPayload);
        });
      }

      function encounterFormProcessor(model) {

      }

      function addExistingDataSetToObsForm(restObs, model) {

      }

      function addExistingDataSetToEncounterForm(restDataset, model) {

      }
    }
})();
