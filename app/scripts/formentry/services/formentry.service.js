/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation 
jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('FormEntry', FormEntry);

    FormEntry.$inject = ['CreateFormService', '$log', 'FormentryConfig',
        'FormProcessorService', 'CurrentLoadedFormService', 'moment'
    ];

    function FormEntry(createFormService, $log, FormentryConfig,
        formProcessorService, CurrentLoadedFormService, moment) {

        var service = {
            createForm: createForm,
            registerCustomFieldHandler: registerCustomFieldHandler,
            getFormPayload: getFormPayload,
            updateFormWithExistingObs: updateFormWithExistingObs,
            getPersonAttributesPayload: getPersonAttributesPayload,
            updateExistingPersonAttributeToForm:updateExistingPersonAttributeToForm
        };

        return service;

        function registerCustomFieldHandler(_handlerName, _handlerMethod) {
            if (typeof _handlerMethod === 'function') {
                FormentryConfig
                    .registerFieldHandler(_handlerName, _handlerMethod);
            } else {
                $log.info('Handler was not registered!!');
            }
        }

        function createForm(schema, model) {
            var formObject = createFormService.createForm(schema, model);
            CurrentLoadedFormService.formModel = model;
            CurrentLoadedFormService.questionMap = formObject.questionMap;

            return formObject;
        }

        function getFormPayload(model) {
            return formProcessorService.obsFormProccesor(model);
        }

        function getPersonAttributesPayload(model) {
            return formProcessorService.personAttributeFormProccesor(model);
        }

        function updateFormWithExistingObs(model, restObs) {
            formProcessorService.addExistingDataSetToObsForm(restObs, model);
        }
        
        function updateExistingPersonAttributeToForm(restDataset,model){
              return formProcessorService.addExistingPersonAttributesToForm(restDataset,model);
        }

    }
})();
