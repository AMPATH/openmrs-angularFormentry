/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('FormProcessorService', FormProcessorService);

    FormProcessorService.$inject = [
        'ObsProcessorService',
        'PersonAttributesProcessorService',
        'EncounterProcessorService'
    ];

    function FormProcessorService(ObsProcessorService, PersonAttributesProcessorService,
        EncounterProcessorService) {
        var service = {
            obsFormProccesor: obsFormProccesor,
            encounterFormProcessor: encounterFormProcessor,
            personAttributeFormProccesor: personAttributeFormProccesor,
            addExistingDataSetToEncounterForm: addExistingDataSetToEncounterForm,
            addExistingDataSetToObsForm: addExistingDataSetToObsForm,
            addExistingPersonAttributesToForm:addExistingPersonAttributesToForm
        };

        return service;

        function obsFormProccesor(model) {
            return ObsProcessorService.generateObsPayload(model);
        }

        function personAttributeFormProccesor(model) {
            return PersonAttributesProcessorService.generatePersonAttributesPayload(model);
        }

        function encounterFormProcessor(model) {
            return EncounterProcessorService.generateEncounterPayload(model);
        }

        function addExistingDataSetToObsForm(restObs, model) {
            ObsProcessorService.addExistingObsSetToForm(model, restObs);
        }

        function addExistingDataSetToEncounterForm(restDataset, model) {
            EncounterProcessorService.populateModel(model, restDataset);
        }

        function addExistingPersonAttributesToForm(restDataset, model) {
            return PersonAttributesProcessorService.addExistingPersonAttributesToForm(restDataset,model);
        }
    }
})();
